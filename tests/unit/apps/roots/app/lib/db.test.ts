/**
 * @fileoverview Unit tests for Roots app Dexie database helpers
 */

import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import Dexie from 'dexie';

// Import types and create test versions
interface FavoriteConcept {
  id?: number;
  conceptId: string;
  addedAt: Date;
}

interface StudyRecord {
  id?: number;
  conceptId: string;
  studiedAt: Date;
  duration: number;
  completed: boolean;
  quizScore?: number;
}

interface LearningPath {
  id?: number;
  name: string;
  conceptIds: string[];
  currentIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

interface RecentView {
  id?: number;
  conceptId: string;
  viewedAt: Date;
}

interface UserSettings {
  id: number;
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  showLatex: boolean;
  showDifficulty: boolean;
  updatedAt: Date;
}

// Create test database
class TestRootsDatabase extends Dexie {
  favorites!: Dexie.Table<FavoriteConcept, number>;
  studyRecords!: Dexie.Table<StudyRecord, number>;
  learningPaths!: Dexie.Table<LearningPath, number>;
  recentViews!: Dexie.Table<RecentView, number>;
  settings!: Dexie.Table<UserSettings, number>;

  constructor() {
    super('TestRootsDB');
    this.version(1).stores({
      favorites: '++id, conceptId, addedAt',
      studyRecords: '++id, conceptId, studiedAt',
      learningPaths: '++id, name, createdAt',
      recentViews: '++id, conceptId, viewedAt',
      settings: 'id',
    });
  }
}

let db: TestRootsDatabase;

// Recreate helpers with test db
const createFavorites = (testDb: TestRootsDatabase) => ({
  async add(conceptId: string) {
    if (!conceptId || typeof conceptId !== 'string') {
      throw new Error('conceptId is required');
    }
    if (conceptId.length > 100) {
      throw new Error('conceptId exceeds maximum length of 100');
    }
    if (['__proto__', 'constructor', 'prototype', 'hasOwnProperty', 'toString'].includes(conceptId)) {
      throw new Error('Invalid conceptId');
    }
    const exists = await testDb.favorites.where('conceptId').equals(conceptId).first();
    if (exists) return exists.id;
    return testDb.favorites.add({ conceptId, addedAt: new Date() });
  },

  async remove(conceptId: string) {
    return testDb.favorites.where('conceptId').equals(conceptId).delete();
  },

  async toggle(conceptId: string) {
    const exists = await testDb.favorites.where('conceptId').equals(conceptId).first();
    if (exists?.id) {
      await testDb.favorites.delete(exists.id);
      return false;
    }
    await testDb.favorites.add({ conceptId, addedAt: new Date() });
    return true;
  },

  async isFavorite(conceptId: string) {
    const exists = await testDb.favorites.where('conceptId').equals(conceptId).first();
    return !!exists;
  },

  async getAll() {
    return testDb.favorites.orderBy('addedAt').reverse().toArray();
  },

  async count() {
    return testDb.favorites.count();
  },
});

const createStudyRecords = (testDb: TestRootsDatabase) => ({
  async add(conceptId: string, duration: number, completed: boolean, quizScore?: number) {
    return testDb.studyRecords.add({
      conceptId,
      studiedAt: new Date(),
      duration,
      completed,
      quizScore,
    });
  },

  async getByConcept(conceptId: string) {
    return testDb.studyRecords.where('conceptId').equals(conceptId).toArray();
  },

  async getRecent(limit = 50) {
    return testDb.studyRecords.orderBy('studiedAt').reverse().limit(limit).toArray();
  },

  async getStats(conceptId: string) {
    const records = await testDb.studyRecords.where('conceptId').equals(conceptId).toArray();
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
    const records = await testDb.studyRecords.toArray();
    return records.reduce((sum, r) => sum + r.duration, 0);
  },
});

const createRecentViews = (testDb: TestRootsDatabase) => ({
  async add(conceptId: string) {
    await testDb.recentViews.where('conceptId').equals(conceptId).delete();
    await testDb.recentViews.add({ conceptId, viewedAt: new Date() });

    const count = await testDb.recentViews.count();
    if (count > 100) {
      const oldest = await testDb.recentViews.orderBy('viewedAt').first();
      if (oldest?.id) {
        await testDb.recentViews.delete(oldest.id);
      }
    }
  },

  async getRecent(limit = 20) {
    return testDb.recentViews.orderBy('viewedAt').reverse().limit(limit).toArray();
  },

  async clear() {
    return testDb.recentViews.clear();
  },
});

let favorites: ReturnType<typeof createFavorites>;
let studyRecords: ReturnType<typeof createStudyRecords>;
let recentViews: ReturnType<typeof createRecentViews>;

beforeEach(async () => {
  db = new TestRootsDatabase();
  favorites = createFavorites(db);
  studyRecords = createStudyRecords(db);
  recentViews = createRecentViews(db);

  // Clear all tables
  await db.favorites.clear();
  await db.studyRecords.clear();
  await db.learningPaths.clear();
  await db.recentViews.clear();
  await db.settings.clear();
});

afterEach(async () => {
  await db.delete();
});

describe('Favorites Helper', () => {
  it('should add a favorite', async () => {
    const id = await favorites.add('linear-algebra');
    expect(id).toBeDefined();
    expect(await favorites.count()).toBe(1);
  });

  it('should return existing ID if already favorited', async () => {
    const id1 = await favorites.add('linear-algebra');
    const id2 = await favorites.add('linear-algebra');
    expect(id1).toBe(id2);
    expect(await favorites.count()).toBe(1);
  });

  it('should remove a favorite', async () => {
    await favorites.add('linear-algebra');
    await favorites.remove('linear-algebra');
    expect(await favorites.count()).toBe(0);
  });

  it('should toggle favorite', async () => {
    const added = await favorites.toggle('linear-algebra');
    expect(added).toBe(true);
    expect(await favorites.count()).toBe(1);

    const removed = await favorites.toggle('linear-algebra');
    expect(removed).toBe(false);
    expect(await favorites.count()).toBe(0);
  });

  it('should check if concept is favorite', async () => {
    expect(await favorites.isFavorite('linear-algebra')).toBe(false);
    await favorites.add('linear-algebra');
    expect(await favorites.isFavorite('linear-algebra')).toBe(true);
  });

  it('should get all favorites ordered by addedAt desc', async () => {
    await favorites.add('concept-1');
    await new Promise((resolve) => setTimeout(resolve, 10));
    await favorites.add('concept-2');

    const all = await favorites.getAll();
    expect(all).toHaveLength(2);
    expect(all[0].conceptId).toBe('concept-2'); // most recent first
  });

  it('should throw error for invalid conceptId', async () => {
    await expect(favorites.add('')).rejects.toThrow('conceptId is required');
    await expect(favorites.add('__proto__')).rejects.toThrow('Invalid conceptId');
  });
});

describe('Study Records Helper', () => {
  it('should add a study record', async () => {
    const id = await studyRecords.add('linear-algebra', 300, true, 85);
    expect(id).toBeDefined();

    const records = await studyRecords.getByConcept('linear-algebra');
    expect(records).toHaveLength(1);
    expect(records[0].duration).toBe(300);
    expect(records[0].completed).toBe(true);
    expect(records[0].quizScore).toBe(85);
  });

  it('should get records by concept', async () => {
    await studyRecords.add('concept-1', 300, true);
    await studyRecords.add('concept-2', 200, false);
    await studyRecords.add('concept-1', 400, true);

    const records = await studyRecords.getByConcept('concept-1');
    expect(records).toHaveLength(2);
  });

  it('should get recent records with limit', async () => {
    for (let i = 0; i < 60; i++) {
      await studyRecords.add(`concept-${i}`, 100, true);
    }

    const recent = await studyRecords.getRecent(20);
    expect(recent).toHaveLength(20);
  });

  it('should calculate stats correctly', async () => {
    await studyRecords.add('concept-1', 300, true, 90);
    await studyRecords.add('concept-1', 200, false, 70);
    await studyRecords.add('concept-1', 500, true, 80);

    const stats = await studyRecords.getStats('concept-1');
    expect(stats.total).toBe(3);
    expect(stats.totalDuration).toBe(1000);
    expect(stats.completedCount).toBe(2);
    expect(stats.avgQuizScore).toBe(80); // (90 + 70 + 80) / 3
  });

  it('should handle stats with no quiz scores', async () => {
    await studyRecords.add('concept-1', 300, true);
    await studyRecords.add('concept-1', 200, false);

    const stats = await studyRecords.getStats('concept-1');
    expect(stats.avgQuizScore).toBeNull();
  });

  it('should calculate total study time', async () => {
    await studyRecords.add('concept-1', 300, true);
    await studyRecords.add('concept-2', 200, false);
    await studyRecords.add('concept-3', 500, true);

    const total = await studyRecords.getTotalStudyTime();
    expect(total).toBe(1000);
  });
});

describe('Recent Views Helper', () => {
  it('should add a recent view', async () => {
    await recentViews.add('concept-1');
    const recent = await recentViews.getRecent(10);
    expect(recent).toHaveLength(1);
    expect(recent[0].conceptId).toBe('concept-1');
  });

  it('should update existing view to latest', async () => {
    await recentViews.add('concept-1');
    await new Promise((resolve) => setTimeout(resolve, 10));
    await recentViews.add('concept-2');
    await new Promise((resolve) => setTimeout(resolve, 10));
    await recentViews.add('concept-1'); // update to latest

    const recent = await recentViews.getRecent(10);
    expect(recent).toHaveLength(2);
    expect(recent[0].conceptId).toBe('concept-1'); // most recent
  });

  it('should maintain max 100 items', async () => {
    for (let i = 0; i < 105; i++) {
      await recentViews.add(`concept-${i}`);
    }

    const count = await db.recentViews.count();
    expect(count).toBe(100);
  });

  it('should respect limit parameter', async () => {
    for (let i = 0; i < 30; i++) {
      await recentViews.add(`concept-${i}`);
    }

    const recent = await recentViews.getRecent(10);
    expect(recent).toHaveLength(10);
  });

  it('should clear all recent views', async () => {
    await recentViews.add('concept-1');
    await recentViews.add('concept-2');
    expect(await db.recentViews.count()).toBe(2);

    await recentViews.clear();
    expect(await db.recentViews.count()).toBe(0);
  });
});
