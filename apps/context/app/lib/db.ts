import Dexie, { type EntityTable } from 'dexie';

const MAX_ID_LENGTH = 100;
const RESERVED_NAMES = ['__proto__', 'constructor', 'prototype', 'hasOwnProperty', 'toString'];

/**
 * Validates an ID string to prevent abuse and prototype pollution
 */
function validateId(id: string, fieldName: string): void {
  if (!id || typeof id !== 'string') {
    throw new Error(`${fieldName} is required`);
  }
  if (id.length > MAX_ID_LENGTH) {
    throw new Error(`${fieldName} exceeds maximum length of ${MAX_ID_LENGTH}`);
  }
  if (RESERVED_NAMES.includes(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
}

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
let db: ContextDatabase;

function getDb(): ContextDatabase {
  if (typeof window === 'undefined') {
    // SSG build environment - return a mock
    throw new Error('Database is only available in browser');
  }
  if (!db) {
    db = new ContextDatabase();
  }
  return db;
}

export { getDb as db };

// 헬퍼 함수들
export const favorites = {
  async add(entryId: string) {
    validateId(entryId, 'entryId');
    const database = getDb();
    const exists = await database.favorites.where('entryId').equals(entryId).first();
    if (exists) return exists.id;
    return database.favorites.add({ entryId, addedAt: new Date() });
  },

  async remove(entryId: string) {
    validateId(entryId, 'entryId');
    const database = getDb();
    return database.favorites.where('entryId').equals(entryId).delete();
  },

  async toggle(entryId: string) {
    validateId(entryId, 'entryId');
    const database = getDb();
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
    const exists = await database.favorites.where('entryId').equals(entryId).first();
    return !!exists;
  },

  async getAll() {
    const database = getDb();
    return database.favorites.orderBy('addedAt').reverse().toArray();
  },

  async count() {
    const database = getDb();
    return database.favorites.count();
  },
};

export const studyRecords = {
  async add(entryId: string, correct: boolean) {
    validateId(entryId, 'entryId');
    const database = getDb();
    return database.studyRecords.add({
      entryId,
      studiedAt: new Date(),
      correct,
    });
  },

  async getByEntry(entryId: string) {
    validateId(entryId, 'entryId');
    const database = getDb();
    return database.studyRecords.where('entryId').equals(entryId).toArray();
  },

  async getRecent(limit = 50) {
    const database = getDb();
    return database.studyRecords.orderBy('studiedAt').reverse().limit(limit).toArray();
  },

  async getStats(entryId: string) {
    validateId(entryId, 'entryId');
    const database = getDb();
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
    const record = await database.studyRecords.where('entryId').equals(entryId).first();
    return !!record;
  },

  /**
   * Mark a word as studied (for simple progress tracking)
   */
  async markAsStudied(entryId: string) {
    validateId(entryId, 'entryId');
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
    const records = await database.studyRecords.toArray();
    const uniqueIds = new Set(records.map((r) => r.entryId));
    return Array.from(uniqueIds);
  },

  /**
   * Get category progress (studied count, total count)
   */
  async getCategoryProgress(categoryId: string, totalEntries: number) {
    const allStudied = await this.getStudiedEntryIds();
    const studiedInCategory = allStudied.filter((id) => id.startsWith(`${categoryId}-`));
    return {
      studied: studiedInCategory.length,
      total: totalEntries,
      percentage: totalEntries > 0 ? (studiedInCategory.length / totalEntries) * 100 : 0,
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
    const s = await database.settings.get(1);
    return (
      s || {
        id: 1,
        theme: 'system',
        language: 'ko',
        fontSize: 'medium',
        updatedAt: new Date(),
      }
    );
  },

  async update(updates: Partial<Omit<UserSettings, 'id'>>) {
    const database = getDb();
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
