import { validateId } from '@soundblue/core/validation';
import Dexie, { type EntityTable } from 'dexie';

// 즐겨찾기 단어
export interface FavoriteEntry {
  id?: number;
  entryId: string;
  addedAt: Date;
}

// 학습 기록
export interface StudyRecord {
  id?: number;
  entryId: string;
  studiedAt: Date;
  correct: boolean;
}

// 사용자 설정
export interface UserSettings {
  id: number; // 항상 1 (싱글톤)
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  updatedAt: Date;
}

// Typed Dexie database class
class ContextDatabase extends Dexie {
  favorites!: EntityTable<FavoriteEntry, 'id'>;
  studyRecords!: EntityTable<StudyRecord, 'id'>;
  settings!: EntityTable<UserSettings, 'id'>;

  constructor() {
    super('ContextDB');
    this.version(1).stores({
      favorites: '++id, entryId, addedAt',
      studyRecords: '++id, entryId, studiedAt',
      settings: 'id',
    });
  }
}

// Lazy initialization to avoid SSG build errors
let db: ContextDatabase | null = null;
let dbInitAttempted = false;
let dbInitError: Error | null = null;

function getDb(): ContextDatabase | null {
  // CRITICAL: Only initialize in browser environment
  if (typeof window === 'undefined') {
    return null; // SSG build - return null, don't throw
  }

  // Prevent repeated init attempts if already failed
  if (dbInitAttempted && !db) {
    if (dbInitError) {
      console.warn('[DB] Database initialization previously failed:', dbInitError.message);
    }
    return null;
  }

  if (!db) {
    dbInitAttempted = true;
    try {
      // Check if IndexedDB is available
      if (!window.indexedDB) {
        dbInitError = new Error('IndexedDB is not available in this browser');
        console.error('[DB]', dbInitError.message);
        return null;
      }
      db = new ContextDatabase();
      console.log('[DB] Database initialized successfully');
    } catch (error: unknown) {
      dbInitError = error instanceof Error ? error : new Error(String(error));
      console.error('[DB] Failed to initialize database:', dbInitError.message);
      return null;
    }
  }
  return db;
}

export { getDb as db };

// Database unavailable error for runtime operations
class DatabaseUnavailableError extends Error {
  constructor() {
    super('Database is not available');
    this.name = 'DatabaseUnavailableError';
  }
}

// 헬퍼 함수들
export const favorites = {
  async add(entryId: string) {
    validateId(entryId, 'entryId');
    const database = getDb();
    if (!database) throw new DatabaseUnavailableError();
    const exists = await database.favorites.where('entryId').equals(entryId).first();
    if (exists) return exists.id;
    return database.favorites.add({ entryId, addedAt: new Date() });
  },

  async remove(entryId: string) {
    validateId(entryId, 'entryId');
    const database = getDb();
    if (!database) throw new DatabaseUnavailableError();
    return database.favorites.where('entryId').equals(entryId).delete();
  },

  async toggle(entryId: string) {
    validateId(entryId, 'entryId');
    const database = getDb();
    if (!database) throw new DatabaseUnavailableError();
    const exists = await database.favorites.where('entryId').equals(entryId).first();
    if (exists?.id) {
      await database.favorites.delete(exists.id);
      return false;
    }
    await database.favorites.add({ entryId, addedAt: new Date() });
    return true;
  },

  async isFavorite(entryId: string) {
    validateId(entryId, 'entryId');
    const database = getDb();
    if (!database) return false; // Read-only: safe to return false
    const exists = await database.favorites.where('entryId').equals(entryId).first();
    return !!exists;
  },

  async getAll() {
    const database = getDb();
    if (!database) return []; // Read-only: safe to return empty
    return database.favorites.orderBy('addedAt').reverse().toArray();
  },

  async count() {
    const database = getDb();
    if (!database) return 0; // Read-only: safe to return 0
    return database.favorites.count();
  },
};

export const studyRecords = {
  async add(entryId: string, correct: boolean) {
    validateId(entryId, 'entryId');
    const database = getDb();
    if (!database) throw new DatabaseUnavailableError();
    return database.studyRecords.add({
      entryId,
      studiedAt: new Date(),
      correct,
    });
  },

  async getByEntry(entryId: string) {
    validateId(entryId, 'entryId');
    const database = getDb();
    if (!database) return []; // Read-only: safe to return empty
    return database.studyRecords.where('entryId').equals(entryId).toArray();
  },

  async getRecent(limit = 50) {
    const database = getDb();
    if (!database) return []; // Read-only: safe to return empty
    return database.studyRecords.orderBy('studiedAt').reverse().limit(limit).toArray();
  },

  async getStats(entryId: string) {
    validateId(entryId, 'entryId');
    const database = getDb();
    if (!database) return { total: 0, correct: 0, accuracy: 0 }; // Read-only: safe to return defaults
    const records = await database.studyRecords.where('entryId').equals(entryId).toArray();
    const total = records.length;
    const correct = records.filter((r) => r.correct).length;
    return {
      total,
      correct,
      accuracy: total > 0 ? (correct / total) * 100 : 0,
    };
  },

  /**
   * Check if a word has been studied at least once
   */
  async isStudied(entryId: string): Promise<boolean> {
    validateId(entryId, 'entryId');
    const database = getDb();
    if (!database) return false; // Read-only: safe to return false
    const record = await database.studyRecords.where('entryId').equals(entryId).first();
    return !!record;
  },

  /**
   * Mark a word as studied (for simple progress tracking)
   */
  async markAsStudied(entryId: string) {
    validateId(entryId, 'entryId');
    const database = getDb();
    if (!database) throw new DatabaseUnavailableError();
    const exists = await this.isStudied(entryId);
    if (!exists) {
      return this.add(entryId, true);
    }
    return null;
  },

  /**
   * Get all studied entry IDs
   */
  async getStudiedEntryIds(): Promise<string[]> {
    const database = getDb();
    if (!database) return []; // Read-only: safe to return empty
    const records = await database.studyRecords.toArray();
    const uniqueIds = new Set(records.map((r) => r.entryId));
    return [...uniqueIds];
  },

  /**
   * Get category progress (studied count, total count)
   * @deprecated Use useStudyData hook instead for accurate category progress.
   * This function cannot accurately determine category without entry data.
   */
  async getCategoryProgress(_categoryId: string, totalEntries: number) {
    // NOTE: This function is deprecated because we cannot determine
    // entry's category from just the entryId (entry IDs don't contain categoryId).
    // Use useStudyData hook which loads entries data for accurate calculation.
    return {
      studied: 0,
      total: totalEntries,
      percentage: 0,
    };
  },

  /**
   * Get overall progress across all categories
   */
  async getOverallProgress(totalEntries: number) {
    const studiedIds = await this.getStudiedEntryIds();
    return {
      studied: studiedIds.length,
      total: totalEntries,
      percentage: totalEntries > 0 ? (studiedIds.length / totalEntries) * 100 : 0,
    };
  },
};

export const settings = {
  async get(): Promise<UserSettings> {
    const database = getDb();
    const defaultSettings = {
      id: 1,
      theme: 'system' as const,
      language: 'ko' as const,
      fontSize: 'medium' as const,
      updatedAt: new Date(),
    };
    if (!database) return defaultSettings; // Read-only: safe to return defaults
    const s = await database.settings.get(1);
    return s || defaultSettings;
  },

  async update(updates: Partial<Omit<UserSettings, 'id'>>) {
    const database = getDb();
    if (!database) throw new DatabaseUnavailableError();
    const current = await this.get();
    return database.settings.put({
      ...current,
      ...updates,
      id: 1,
      updatedAt: new Date(),
    });
  },

  async setTheme(theme: UserSettings['theme']) {
    return this.update({ theme });
  },

  async setLanguage(language: UserSettings['language']) {
    return this.update({ language });
  },

  async setFontSize(fontSize: UserSettings['fontSize']) {
    return this.update({ fontSize });
  },
};
