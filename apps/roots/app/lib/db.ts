import { validateId } from '@soundblue/core/validation';
import Dexie, { type EntityTable } from 'dexie';

// 즐겨찾기 개념
export interface FavoriteConcept {
  id?: number;
  conceptId: string;
  addedAt: Date;
}

// 학습 기록
export interface StudyRecord {
  id?: number;
  conceptId: string;
  studiedAt: Date;
  duration: number; // 학습 시간 (초)
  completed: boolean; // 문서 끝까지 봤는지
  quizScore?: number; // 퀴즈 점수 (0-100)
}

// 학습 경로
export interface LearningPath {
  id?: number;
  name: string;
  conceptIds: string[];
  currentIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

// 최근 본 문서
export interface RecentView {
  id?: number;
  conceptId: string;
  viewedAt: Date;
}

// 사용자 설정
export interface UserSettings {
  id: number; // 항상 1 (싱글톤)
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  showLatex: boolean;
  showDifficulty: boolean;
  updatedAt: Date;
}

class RootsDatabase extends Dexie {
  favorites!: EntityTable<FavoriteConcept, 'id'>;
  studyRecords!: EntityTable<StudyRecord, 'id'>;
  learningPaths!: EntityTable<LearningPath, 'id'>;
  recentViews!: EntityTable<RecentView, 'id'>;
  settings!: EntityTable<UserSettings, 'id'>;

  constructor() {
    super('RootsDB');
    this.version(1).stores({
      favorites: '++id, conceptId, addedAt',
      studyRecords: '++id, conceptId, studiedAt',
      learningPaths: '++id, name, createdAt',
      recentViews: '++id, conceptId, viewedAt',
      settings: 'id',
    });
  }
}

// Lazy initialization to avoid server-side errors
let db: RootsDatabase | null = null;

function getDb(): RootsDatabase | null {
  // CRITICAL: Only initialize in browser environment
  if (typeof window === 'undefined') {
    return null; // server-side - return null, don't throw
  }
  if (!db) {
    try {
      db = new RootsDatabase();
    } catch (error: unknown) {
      console.error('Failed to initialize database:', error);
      return null;
    }
  }
  return db;
}

export { getDb as db };

// 즐겨찾기 헬퍼
export const favorites = {
  async add(conceptId: string) {
    validateId(conceptId, 'conceptId');
    const database = getDb();
    if (!database) return null; // server environment
    const exists = await database.favorites.where('conceptId').equals(conceptId).first();
    if (exists) return exists.id;
    return database.favorites.add({ conceptId, addedAt: new Date() });
  },

  async remove(conceptId: string) {
    validateId(conceptId, 'conceptId');
    const database = getDb();
    if (!database) return 0; // server environment
    return database.favorites.where('conceptId').equals(conceptId).delete();
  },

  async toggle(conceptId: string) {
    validateId(conceptId, 'conceptId');
    const database = getDb();
    if (!database) return false; // server environment
    const exists = await database.favorites.where('conceptId').equals(conceptId).first();
    if (exists?.id) {
      await database.favorites.delete(exists.id);
      return false;
    }
    await database.favorites.add({ conceptId, addedAt: new Date() });
    return true;
  },

  async isFavorite(conceptId: string) {
    validateId(conceptId, 'conceptId');
    const database = getDb();
    if (!database) return false; // server environment
    const exists = await database.favorites.where('conceptId').equals(conceptId).first();
    return !!exists;
  },

  async getAll() {
    const database = getDb();
    if (!database) return []; // server environment
    return database.favorites.orderBy('addedAt').reverse().toArray();
  },

  async count() {
    const database = getDb();
    if (!database) return 0; // server environment
    return database.favorites.count();
  },
};

// 학습 기록 헬퍼
export const studyRecords = {
  async add(conceptId: string, duration: number, completed: boolean, quizScore?: number) {
    validateId(conceptId, 'conceptId');
    const database = getDb();
    if (!database) return null; // server environment
    return database.studyRecords.add({
      conceptId,
      studiedAt: new Date(),
      duration,
      completed,
      quizScore,
    });
  },

  async getByConcept(conceptId: string) {
    validateId(conceptId, 'conceptId');
    const database = getDb();
    if (!database) return []; // server environment
    return database.studyRecords.where('conceptId').equals(conceptId).toArray();
  },

  async getRecent(limit = 50) {
    const database = getDb();
    if (!database) return []; // server environment
    return database.studyRecords.orderBy('studiedAt').reverse().limit(limit).toArray();
  },

  async getStats(conceptId: string) {
    validateId(conceptId, 'conceptId');
    const database = getDb();
    if (!database) return { total: 0, totalDuration: 0, completedCount: 0, avgQuizScore: null }; // server environment
    const records = await database.studyRecords.where('conceptId').equals(conceptId).toArray();
    const total = records.length;
    const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
    const completedCount = records.filter((r) => r.completed).length;
    const quizScores = records
      .filter((r): r is StudyRecord & { quizScore: number } => r.quizScore !== undefined)
      .map((r) => r.quizScore);
    const avgQuizScore =
      quizScores.length > 0 ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length : null;

    return {
      total,
      totalDuration,
      completedCount,
      avgQuizScore,
    };
  },

  async getTotalStudyTime() {
    const database = getDb();
    if (!database) return 0; // server environment
    const records = await database.studyRecords.toArray();
    return records.reduce((sum, r) => sum + r.duration, 0);
  },
};

// 학습 경로 헬퍼
export const learningPaths = {
  async create(name: string, conceptIds: string[]) {
    for (const id of conceptIds) {
      validateId(id, 'conceptId');
    }
    const database = getDb();
    if (!database) return null; // server environment
    return database.learningPaths.add({
      name,
      conceptIds,
      currentIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async get(id: number) {
    const database = getDb();
    if (!database) return undefined; // server environment
    return database.learningPaths.get(id);
  },

  async getAll() {
    const database = getDb();
    if (!database) return []; // server environment
    return database.learningPaths.orderBy('updatedAt').reverse().toArray();
  },

  async updateProgress(id: number, currentIndex: number) {
    const database = getDb();
    if (!database) return 0; // server environment
    return database.learningPaths.update(id, {
      currentIndex,
      updatedAt: new Date(),
    });
  },

  async delete(id: number) {
    const database = getDb();
    if (!database) return; // server environment
    return database.learningPaths.delete(id);
  },
};

// 최근 본 문서 헬퍼
export const recentViews = {
  async add(conceptId: string) {
    validateId(conceptId, 'conceptId');
    const database = getDb();
    if (!database) return; // server environment
    // 기존 기록 삭제 후 새로 추가 (맨 위로)
    await database.recentViews.where('conceptId').equals(conceptId).delete();
    await database.recentViews.add({ conceptId, viewedAt: new Date() });

    // 최대 100개만 유지
    const count = await database.recentViews.count();
    if (count > 100) {
      const oldest = await database.recentViews.orderBy('viewedAt').first();
      if (oldest?.id) {
        await database.recentViews.delete(oldest.id);
      }
    }
  },

  async getRecent(limit = 20) {
    const database = getDb();
    if (!database) return []; // server environment
    return database.recentViews.orderBy('viewedAt').reverse().limit(limit).toArray();
  },

  async clear() {
    const database = getDb();
    if (!database) return; // server environment
    return database.recentViews.clear();
  },
};

// 설정 헬퍼
export const settings = {
  async get(): Promise<UserSettings> {
    const defaultSettings: UserSettings = {
      id: 1,
      theme: 'system',
      language: 'ko',
      fontSize: 'medium',
      showLatex: true,
      showDifficulty: true,
      updatedAt: new Date(),
    };
    const database = getDb();
    if (!database) return defaultSettings; // server environment
    const s = await database.settings.get(1);
    return s || defaultSettings;
  },

  async update(updates: Partial<Omit<UserSettings, 'id'>>) {
    const database = getDb();
    if (!database) return 1; // server environment
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

  async setShowLatex(showLatex: boolean) {
    return this.update({ showLatex });
  },

  async setShowDifficulty(showDifficulty: boolean) {
    return this.update({ showDifficulty });
  },
};
