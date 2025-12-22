/**
 * @fileoverview Unit tests for DB helper factory functions
 */

import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  createFavoritesHelper,
  createSettingsHelper,
  createRecentViewsHelper,
} from '@soundblue/shared/db/helpers';
import type { BaseFavorite, BaseRecentView, BaseSettings } from '@soundblue/shared/db/types';

// Mock Dexie Table interface
interface MockTable<T> {
  _data: Map<number, T>;
  _nextId: number;
  add: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  count: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
  toArray: ReturnType<typeof vi.fn>;
}

interface TestFavorite extends BaseFavorite {
  entryId: string;
}

interface TestSettings extends BaseSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en';
}

interface TestRecentView extends BaseRecentView {
  conceptId: string;
}

function createMockTable<T extends { id?: number }>(): MockTable<T> {
  const _data = new Map<number, T>();
  let _nextId = 1;

  const table: MockTable<T> = {
    _data,
    _nextId,

    add: vi.fn(async (item: Omit<T, 'id'>) => {
      const id = _nextId++;
      _data.set(id, { ...item, id } as T);
      return id;
    }),

    get: vi.fn(async (id: number) => {
      return _data.get(id);
    }),

    put: vi.fn(async (item: T) => {
      const id = item.id || _nextId++;
      _data.set(id, { ...item, id } as T);
      return id;
    }),

    delete: vi.fn(async (id: number) => {
      return _data.delete(id);
    }),

    where: vi.fn((field: string) => ({
      equals: vi.fn((value: unknown) => ({
        first: vi.fn(async () => {
          for (const item of _data.values()) {
            if ((item as Record<string, unknown>)[field] === value) {
              return item;
            }
          }
          return undefined;
        }),
        delete: vi.fn(async () => {
          let deleted = 0;
          for (const [id, item] of _data.entries()) {
            if ((item as Record<string, unknown>)[field] === value) {
              _data.delete(id);
              deleted++;
            }
          }
          return deleted;
        }),
      })),
    })),

    orderBy: vi.fn((field: string) => ({
      reverse: vi.fn(() => ({
        toArray: vi.fn(async () => {
          return Array.from(_data.values()).sort((a, b) => {
            const aVal = (a as Record<string, unknown>)[field] as Date;
            const bVal = (b as Record<string, unknown>)[field] as Date;
            return bVal.getTime() - aVal.getTime();
          });
        }),
        limit: vi.fn((limit: number) => ({
          toArray: vi.fn(async () => {
            return Array.from(_data.values())
              .sort((a, b) => {
                const aVal = (a as Record<string, unknown>)[field] as Date;
                const bVal = (b as Record<string, unknown>)[field] as Date;
                return bVal.getTime() - aVal.getTime();
              })
              .slice(0, limit);
          }),
        })),
      })),
      first: vi.fn(async () => {
        const sorted = Array.from(_data.values()).sort((a, b) => {
          const aVal = (a as Record<string, unknown>)[field] as Date;
          const bVal = (b as Record<string, unknown>)[field] as Date;
          return aVal.getTime() - bVal.getTime();
        });
        return sorted[0];
      }),
      toArray: vi.fn(async () => {
        return Array.from(_data.values()).sort((a, b) => {
          const aVal = (a as Record<string, unknown>)[field] as Date;
          const bVal = (b as Record<string, unknown>)[field] as Date;
          return aVal.getTime() - bVal.getTime();
        });
      }),
    })),

    count: vi.fn(async () => _data.size),

    clear: vi.fn(async () => {
      _data.clear();
    }),

    toArray: vi.fn(async () => Array.from(_data.values())),
  };

  return table;
}

describe('createFavoritesHelper', () => {
  let table: MockTable<TestFavorite>;
  let favorites: ReturnType<typeof createFavoritesHelper<TestFavorite, 'entryId'>>;

  beforeEach(() => {
    table = createMockTable<TestFavorite>();
    favorites = createFavoritesHelper(table as never, 'entryId');
  });

  describe('add()', () => {
    it('should add a new favorite', async () => {
      const id = await favorites.add('entry-1');
      expect(id).toBe(1);
      expect(table._data.size).toBe(1);
      expect(table._data.get(1)?.entryId).toBe('entry-1');
    });

    it('should return existing ID if already favorited', async () => {
      const id1 = await favorites.add('entry-1');
      const id2 = await favorites.add('entry-1');
      expect(id1).toBe(id2);
      expect(table._data.size).toBe(1);
    });

    it('should throw error for invalid ID', async () => {
      await expect(favorites.add('')).rejects.toThrow();
    });

    it('should throw error for __proto__', async () => {
      await expect(favorites.add('__proto__')).rejects.toThrow();
    });

    it('should set addedAt timestamp', async () => {
      const before = new Date();
      await favorites.add('entry-1');
      const after = new Date();

      const item = table._data.get(1);
      expect(item?.addedAt).toBeInstanceOf(Date);
      expect(item?.addedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(item?.addedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('remove()', () => {
    it('should remove a favorite', async () => {
      await favorites.add('entry-1');
      expect(table._data.size).toBe(1);

      await favorites.remove('entry-1');
      expect(table._data.size).toBe(0);
    });

    it('should do nothing if item does not exist', async () => {
      const result = await favorites.remove('non-existent');
      expect(result).toBe(0);
    });

    it('should throw error for invalid ID', async () => {
      await expect(favorites.remove('')).rejects.toThrow();
    });
  });

  describe('toggle()', () => {
    it('should add if not exists', async () => {
      const result = await favorites.toggle('entry-1');
      expect(result).toBe(true);
      expect(table._data.size).toBe(1);
    });

    it('should remove if exists', async () => {
      await favorites.add('entry-1');
      const result = await favorites.toggle('entry-1');
      expect(result).toBe(false);
      expect(table._data.size).toBe(0);
    });

    it('should toggle multiple times', async () => {
      expect(await favorites.toggle('entry-1')).toBe(true); // add
      expect(await favorites.toggle('entry-1')).toBe(false); // remove
      expect(await favorites.toggle('entry-1')).toBe(true); // add again
      expect(table._data.size).toBe(1);
    });

    it('should throw error for invalid ID', async () => {
      await expect(favorites.toggle('')).rejects.toThrow();
    });
  });

  describe('isFavorite()', () => {
    it('should return true if favorited', async () => {
      await favorites.add('entry-1');
      expect(await favorites.isFavorite('entry-1')).toBe(true);
    });

    it('should return false if not favorited', async () => {
      expect(await favorites.isFavorite('entry-1')).toBe(false);
    });

    it('should throw error for invalid ID', async () => {
      await expect(favorites.isFavorite('')).rejects.toThrow();
    });
  });

  describe('getAll()', () => {
    it('should return all favorites ordered by addedAt descending', async () => {
      await favorites.add('entry-1');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await favorites.add('entry-2');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await favorites.add('entry-3');

      const all = await favorites.getAll();
      expect(all).toHaveLength(3);
      expect(all[0].entryId).toBe('entry-3'); // most recent first
      expect(all[1].entryId).toBe('entry-2');
      expect(all[2].entryId).toBe('entry-1');
    });

    it('should return empty array if no favorites', async () => {
      const all = await favorites.getAll();
      expect(all).toEqual([]);
    });
  });

  describe('count()', () => {
    it('should return count of favorites', async () => {
      expect(await favorites.count()).toBe(0);
      await favorites.add('entry-1');
      expect(await favorites.count()).toBe(1);
      await favorites.add('entry-2');
      expect(await favorites.count()).toBe(2);
    });
  });
});

describe('createSettingsHelper', () => {
  let table: MockTable<TestSettings>;
  let settings: ReturnType<typeof createSettingsHelper<TestSettings>>;

  const defaultSettings: TestSettings = {
    id: 1,
    theme: 'system',
    language: 'ko',
    updatedAt: new Date(),
  };

  beforeEach(() => {
    table = createMockTable<TestSettings>();
    settings = createSettingsHelper(table as never, defaultSettings);
  });

  describe('get()', () => {
    it('should return existing settings', async () => {
      const existingSettings: TestSettings = {
        id: 1,
        theme: 'dark',
        language: 'en',
        updatedAt: new Date(),
      };
      table._data.set(1, existingSettings);

      const result = await settings.get();
      expect(result.theme).toBe('dark');
      expect(result.language).toBe('en');
    });

    it('should return default settings if none exist', async () => {
      const result = await settings.get();
      expect(result.theme).toBe('system');
      expect(result.language).toBe('ko');
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('update()', () => {
    it('should update settings', async () => {
      await settings.update({ theme: 'dark' });
      const result = await settings.get();
      expect(result.theme).toBe('dark');
      expect(result.language).toBe('ko'); // preserved
    });

    it('should set updatedAt timestamp', async () => {
      const before = new Date();
      await settings.update({ theme: 'dark' });
      const after = new Date();

      const result = await settings.get();
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should merge multiple updates', async () => {
      await settings.update({ theme: 'dark' });
      await settings.update({ language: 'en' });

      const result = await settings.get();
      expect(result.theme).toBe('dark');
      expect(result.language).toBe('en');
    });

    it('should always have id: 1', async () => {
      await settings.update({ theme: 'dark' });
      const result = await settings.get();
      expect(result.id).toBe(1);
    });
  });

  describe('setTheme()', () => {
    it('should update theme', async () => {
      await settings.setTheme('light');
      const result = await settings.get();
      expect(result.theme).toBe('light');
    });

    it('should preserve other settings', async () => {
      await settings.update({ language: 'en' });
      await settings.setTheme('dark');

      const result = await settings.get();
      expect(result.theme).toBe('dark');
      expect(result.language).toBe('en');
    });
  });

  describe('setLanguage()', () => {
    it('should update language', async () => {
      await settings.setLanguage('en');
      const result = await settings.get();
      expect(result.language).toBe('en');
    });

    it('should preserve other settings', async () => {
      await settings.update({ theme: 'light' });
      await settings.setLanguage('en');

      const result = await settings.get();
      expect(result.theme).toBe('light');
      expect(result.language).toBe('en');
    });
  });
});

describe('createRecentViewsHelper', () => {
  let table: MockTable<TestRecentView>;
  let recentViews: ReturnType<typeof createRecentViewsHelper<TestRecentView, 'conceptId'>>;

  beforeEach(() => {
    table = createMockTable<TestRecentView>();
    recentViews = createRecentViewsHelper(table as never, 'conceptId', 5);
  });

  describe('add()', () => {
    it('should add a new recent view', async () => {
      const id = await recentViews.add('concept-1');
      expect(id).toBe(1);
      expect(table._data.size).toBe(1);
      expect(table._data.get(1)?.conceptId).toBe('concept-1');
    });

    it('should update existing view to latest', async () => {
      await recentViews.add('concept-1');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await recentViews.add('concept-2');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await recentViews.add('concept-1'); // update concept-1 to latest

      const recent = await recentViews.getRecent(10);
      expect(recent).toHaveLength(2);
      expect(recent[0].conceptId).toBe('concept-1'); // most recent
    });

    it('should delete oldest when exceeding maxItems', async () => {
      await recentViews.add('concept-1');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await recentViews.add('concept-2');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await recentViews.add('concept-3');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await recentViews.add('concept-4');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await recentViews.add('concept-5');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await recentViews.add('concept-6'); // exceeds maxItems (5)

      const count = await table.count();
      expect(count).toBe(5); // should only keep 5
    });

    it('should set viewedAt timestamp', async () => {
      const before = new Date();
      await recentViews.add('concept-1');
      const after = new Date();

      const item = table._data.get(1);
      expect(item?.viewedAt).toBeInstanceOf(Date);
      expect(item?.viewedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(item?.viewedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should throw error for invalid ID', async () => {
      await expect(recentViews.add('')).rejects.toThrow();
    });
  });

  describe('getRecent()', () => {
    it('should return recent views ordered by viewedAt descending', async () => {
      await recentViews.add('concept-1');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await recentViews.add('concept-2');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await recentViews.add('concept-3');

      const recent = await recentViews.getRecent(10);
      expect(recent).toHaveLength(3);
      expect(recent[0].conceptId).toBe('concept-3'); // most recent first
      expect(recent[1].conceptId).toBe('concept-2');
      expect(recent[2].conceptId).toBe('concept-1');
    });

    it('should respect limit parameter', async () => {
      await recentViews.add('concept-1');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await recentViews.add('concept-2');
      await new Promise((resolve) => setTimeout(resolve, 10));
      await recentViews.add('concept-3');

      const recent = await recentViews.getRecent(2);
      expect(recent).toHaveLength(2);
      expect(recent[0].conceptId).toBe('concept-3');
      expect(recent[1].conceptId).toBe('concept-2');
    });

    it('should default to 20 limit', async () => {
      for (let i = 1; i <= 5; i++) {
        await recentViews.add(`concept-${i}`);
        await new Promise((resolve) => setTimeout(resolve, 5));
      }

      const recent = await recentViews.getRecent();
      expect(recent.length).toBeLessThanOrEqual(20);
    });

    it('should return empty array if no recent views', async () => {
      const recent = await recentViews.getRecent();
      expect(recent).toEqual([]);
    });
  });

  describe('clear()', () => {
    it('should clear all recent views', async () => {
      await recentViews.add('concept-1');
      await recentViews.add('concept-2');
      expect(table._data.size).toBe(2);

      await recentViews.clear();
      expect(table._data.size).toBe(0);
    });

    it('should work on empty table', async () => {
      await recentViews.clear();
      expect(table._data.size).toBe(0);
    });
  });

  describe('maxItems enforcement', () => {
    it('should maintain maxItems limit across multiple adds', async () => {
      for (let i = 1; i <= 10; i++) {
        await recentViews.add(`concept-${i}`);
        await new Promise((resolve) => setTimeout(resolve, 5));
      }

      const count = await table.count();
      expect(count).toBe(5); // maxItems = 5
    });

    it('should keep most recent items when exceeding limit', async () => {
      for (let i = 1; i <= 10; i++) {
        await recentViews.add(`concept-${i}`);
        await new Promise((resolve) => setTimeout(resolve, 5));
      }

      const recent = await recentViews.getRecent(10);
      expect(recent).toHaveLength(5);
      expect(recent[0].conceptId).toBe('concept-10');
      expect(recent[4].conceptId).toBe('concept-6');
    });
  });
});
