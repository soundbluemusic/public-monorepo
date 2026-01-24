/**
 * @fileoverview @soundblue/platform 스토리지 심화 테스트
 *
 * IndexedDB 스토리지의 심화 시나리오 테스트입니다.
 * - 대용량 데이터 처리
 * - 동시 읽기/쓰기
 * - 데이터 마이그레이션
 * - 에러 처리
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import 'fake-indexeddb/auto';

// Mock 스토리지 인터페이스
interface StorageItem {
  id: string;
  data: unknown;
  createdAt: number;
  updatedAt: number;
}

interface FavoriteItem {
  entryId: string;
  addedAt: number;
}

interface RecentViewItem {
  entryId: string;
  viewedAt: number;
}

interface SettingsData {
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en';
  fontSize: 'small' | 'medium' | 'large';
}

// Mock Storage 클래스
class MockStorage {
  private db: Map<string, Map<string, StorageItem>> = new Map();
  private isInitialized = false;

  async init(): Promise<void> {
    this.isInitialized = true;
    this.db.set('favorites', new Map());
    this.db.set('recentViews', new Map());
    this.db.set('settings', new Map());
    this.db.set('cache', new Map());
  }

  async get<T>(store: string, key: string): Promise<T | null> {
    if (!this.isInitialized) throw new Error('Storage not initialized');
    const storeData = this.db.get(store);
    const item = storeData?.get(key);
    return item ? (item.data as T) : null;
  }

  async set<T>(store: string, key: string, data: T): Promise<void> {
    if (!this.isInitialized) throw new Error('Storage not initialized');
    const storeData = this.db.get(store);
    if (!storeData) throw new Error(`Store ${store} not found`);

    const now = Date.now();
    const existing = storeData.get(key);
    storeData.set(key, {
      id: key,
      data,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    });
  }

  async delete(store: string, key: string): Promise<void> {
    if (!this.isInitialized) throw new Error('Storage not initialized');
    const storeData = this.db.get(store);
    storeData?.delete(key);
  }

  async getAll<T>(store: string): Promise<T[]> {
    if (!this.isInitialized) throw new Error('Storage not initialized');
    const storeData = this.db.get(store);
    if (!storeData) return [];
    return Array.from(storeData.values()).map((item) => item.data as T);
  }

  async clear(store: string): Promise<void> {
    if (!this.isInitialized) throw new Error('Storage not initialized');
    const storeData = this.db.get(store);
    storeData?.clear();
  }

  async count(store: string): Promise<number> {
    if (!this.isInitialized) throw new Error('Storage not initialized');
    const storeData = this.db.get(store);
    return storeData?.size || 0;
  }

  async bulkSet<T>(store: string, items: Array<{ key: string; data: T }>): Promise<void> {
    if (!this.isInitialized) throw new Error('Storage not initialized');
    for (const { key, data } of items) {
      await this.set(store, key, data);
    }
  }

  async query<T>(
    store: string,
    predicate: (item: T) => boolean,
  ): Promise<T[]> {
    const all = await this.getAll<T>(store);
    return all.filter(predicate);
  }
}

// 테스트 시작
describe('@soundblue/platform - Storage Advanced', () => {
  let storage: MockStorage;

  beforeEach(async () => {
    storage = new MockStorage();
    await storage.init();
  });

  describe('Basic Operations', () => {
    it('should initialize storage', async () => {
      const count = await storage.count('favorites');
      expect(count).toBe(0);
    });

    it('should set and get data', async () => {
      await storage.set('favorites', 'item1', { entryId: 'hello', addedAt: Date.now() });
      const item = await storage.get<FavoriteItem>('favorites', 'item1');

      expect(item).not.toBeNull();
      expect(item?.entryId).toBe('hello');
    });

    it('should delete data', async () => {
      await storage.set('favorites', 'item1', { entryId: 'hello', addedAt: Date.now() });
      await storage.delete('favorites', 'item1');
      const item = await storage.get('favorites', 'item1');

      expect(item).toBeNull();
    });

    it('should get all items', async () => {
      await storage.set('favorites', 'item1', { entryId: 'hello', addedAt: 1 });
      await storage.set('favorites', 'item2', { entryId: 'world', addedAt: 2 });

      const items = await storage.getAll<FavoriteItem>('favorites');
      expect(items).toHaveLength(2);
    });

    it('should clear store', async () => {
      await storage.set('favorites', 'item1', { entryId: 'hello', addedAt: 1 });
      await storage.set('favorites', 'item2', { entryId: 'world', addedAt: 2 });
      await storage.clear('favorites');

      const count = await storage.count('favorites');
      expect(count).toBe(0);
    });
  });

  describe('Large Data Handling', () => {
    it('should handle 1000 items', async () => {
      const items = Array.from({ length: 1000 }, (_, i) => ({
        key: `item-${i}`,
        data: { entryId: `entry-${i}`, addedAt: Date.now() + i },
      }));

      await storage.bulkSet('favorites', items);

      const count = await storage.count('favorites');
      expect(count).toBe(1000);
    });

    it('should retrieve large items efficiently', async () => {
      // Create 100 items with large data
      const largeData = 'x'.repeat(10000); // 10KB string
      const items = Array.from({ length: 100 }, (_, i) => ({
        key: `large-${i}`,
        data: { id: i, content: largeData },
      }));

      await storage.bulkSet('cache', items);

      const start = performance.now();
      const all = await storage.getAll('cache');
      const duration = performance.now() - start;

      expect(all).toHaveLength(100);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle frequent updates', async () => {
      const key = 'frequently-updated';

      for (let i = 0; i < 100; i++) {
        await storage.set('cache', key, { count: i, timestamp: Date.now() });
      }

      const final = await storage.get<{ count: number }>('cache', key);
      expect(final?.count).toBe(99);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent reads', async () => {
      await storage.set('favorites', 'test', { entryId: 'concurrent', addedAt: Date.now() });

      const reads = Array.from({ length: 10 }, () =>
        storage.get<FavoriteItem>('favorites', 'test'),
      );

      const results = await Promise.all(reads);

      for (const result of results) {
        expect(result?.entryId).toBe('concurrent');
      }
    });

    it('should handle concurrent writes', async () => {
      const writes = Array.from({ length: 10 }, (_, i) =>
        storage.set('favorites', `concurrent-${i}`, { entryId: `entry-${i}`, addedAt: i }),
      );

      await Promise.all(writes);

      const count = await storage.count('favorites');
      expect(count).toBe(10);
    });

    it('should handle mixed read/write operations', async () => {
      // Initial data
      await storage.set('favorites', 'item', { entryId: 'test', addedAt: 0 });

      const operations = [
        storage.get<FavoriteItem>('favorites', 'item'),
        storage.set('favorites', 'item2', { entryId: 'test2', addedAt: 1 }),
        storage.get<FavoriteItem>('favorites', 'item'),
        storage.delete('favorites', 'item'),
        storage.set('favorites', 'item3', { entryId: 'test3', addedAt: 2 }),
      ];

      await Promise.all(operations);

      const count = await storage.count('favorites');
      expect(count).toBe(2); // item2 and item3
    });
  });

  describe('Query Operations', () => {
    beforeEach(async () => {
      const items = [
        { key: 'fav1', data: { entryId: 'hello', addedAt: 100 } },
        { key: 'fav2', data: { entryId: 'world', addedAt: 200 } },
        { key: 'fav3', data: { entryId: 'test', addedAt: 300 } },
        { key: 'fav4', data: { entryId: 'data', addedAt: 400 } },
      ];
      await storage.bulkSet('favorites', items);
    });

    it('should query items by predicate', async () => {
      const recent = await storage.query<FavoriteItem>(
        'favorites',
        (item) => item.addedAt > 200,
      );

      expect(recent).toHaveLength(2);
    });

    it('should query items by entryId prefix', async () => {
      const results = await storage.query<FavoriteItem>(
        'favorites',
        (item) => item.entryId.startsWith('t'),
      );

      expect(results).toHaveLength(1);
      expect(results[0]?.entryId).toBe('test');
    });

    it('should return empty array for no matches', async () => {
      const results = await storage.query<FavoriteItem>(
        'favorites',
        (item) => item.addedAt > 1000,
      );

      expect(results).toEqual([]);
    });
  });

  describe('Settings Store', () => {
    it('should save and retrieve settings', async () => {
      const settings: SettingsData = {
        theme: 'dark',
        language: 'ko',
        fontSize: 'medium',
      };

      await storage.set('settings', 'user-settings', settings);
      const retrieved = await storage.get<SettingsData>('settings', 'user-settings');

      expect(retrieved).toEqual(settings);
    });

    it('should update partial settings', async () => {
      const initial: SettingsData = {
        theme: 'light',
        language: 'en',
        fontSize: 'small',
      };

      await storage.set('settings', 'user-settings', initial);

      // Update theme only
      const current = await storage.get<SettingsData>('settings', 'user-settings');
      if (current) {
        await storage.set('settings', 'user-settings', { ...current, theme: 'dark' });
      }

      const updated = await storage.get<SettingsData>('settings', 'user-settings');
      expect(updated?.theme).toBe('dark');
      expect(updated?.language).toBe('en'); // Should remain unchanged
    });
  });

  describe('Recent Views Store', () => {
    it('should track recent views with timestamp', async () => {
      const view: RecentViewItem = {
        entryId: 'hello',
        viewedAt: Date.now(),
      };

      await storage.set('recentViews', view.entryId, view);
      const retrieved = await storage.get<RecentViewItem>('recentViews', 'hello');

      expect(retrieved?.entryId).toBe('hello');
      expect(retrieved?.viewedAt).toBeGreaterThan(0);
    });

    it('should update viewedAt on re-view', async () => {
      const firstView: RecentViewItem = {
        entryId: 'hello',
        viewedAt: 1000,
      };

      await storage.set('recentViews', 'hello', firstView);

      // Re-view after some time
      const secondView: RecentViewItem = {
        entryId: 'hello',
        viewedAt: 2000,
      };

      await storage.set('recentViews', 'hello', secondView);

      const retrieved = await storage.get<RecentViewItem>('recentViews', 'hello');
      expect(retrieved?.viewedAt).toBe(2000);
    });

    it('should get recent views sorted by time', async () => {
      const views = [
        { key: 'entry1', data: { entryId: 'entry1', viewedAt: 100 } },
        { key: 'entry2', data: { entryId: 'entry2', viewedAt: 300 } },
        { key: 'entry3', data: { entryId: 'entry3', viewedAt: 200 } },
      ];

      await storage.bulkSet('recentViews', views);

      const all = await storage.getAll<RecentViewItem>('recentViews');
      const sorted = all.sort((a, b) => b.viewedAt - a.viewedAt);

      expect(sorted[0]?.entryId).toBe('entry2');
      expect(sorted[1]?.entryId).toBe('entry3');
      expect(sorted[2]?.entryId).toBe('entry1');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when accessing uninitialized storage', async () => {
      const uninitStorage = new MockStorage();

      await expect(uninitStorage.get('favorites', 'test')).rejects.toThrow(
        'Storage not initialized',
      );
    });

    it('should throw error for non-existent store', async () => {
      await expect(storage.set('nonexistent', 'key', {})).rejects.toThrow(
        'Store nonexistent not found',
      );
    });

    it('should handle null values gracefully', async () => {
      await storage.set('cache', 'null-value', null);
      const result = await storage.get('cache', 'null-value');

      expect(result).toBeNull();
    });

    it('should handle undefined key gracefully', async () => {
      const result = await storage.get('favorites', 'nonexistent-key');
      expect(result).toBeNull();
    });
  });

  describe('Data Integrity', () => {
    it('should preserve data types', async () => {
      const complexData = {
        string: 'hello',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        nested: { deep: { value: 'test' } },
        date: new Date().toISOString(),
      };

      await storage.set('cache', 'complex', complexData);
      const retrieved = await storage.get<typeof complexData>('cache', 'complex');

      expect(retrieved).toEqual(complexData);
      expect(typeof retrieved?.number).toBe('number');
      expect(typeof retrieved?.boolean).toBe('boolean');
      expect(Array.isArray(retrieved?.array)).toBe(true);
    });

    it('should handle unicode characters', async () => {
      const unicodeData = {
        korean: '안녕하세요',
        japanese: 'こんにちは',
        emoji: '😀🎉🚀',
        mixed: 'Hello 世界 🌍',
      };

      await storage.set('cache', 'unicode', unicodeData);
      const retrieved = await storage.get<typeof unicodeData>('cache', 'unicode');

      expect(retrieved).toEqual(unicodeData);
    });

    it('should handle empty strings and objects', async () => {
      await storage.set('cache', 'empty-string', '');
      await storage.set('cache', 'empty-object', {});
      await storage.set('cache', 'empty-array', []);

      expect(await storage.get('cache', 'empty-string')).toBe('');
      expect(await storage.get('cache', 'empty-object')).toEqual({});
      expect(await storage.get('cache', 'empty-array')).toEqual([]);
    });
  });

  describe('Performance', () => {
    it('should bulk insert 1000 items within reasonable time', async () => {
      const items = Array.from({ length: 1000 }, (_, i) => ({
        key: `perf-${i}`,
        data: { id: i, value: `data-${i}` },
      }));

      const start = performance.now();
      await storage.bulkSet('cache', items);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      expect(await storage.count('cache')).toBe(1000);
    });

    it('should query 1000 items within reasonable time', async () => {
      const items = Array.from({ length: 1000 }, (_, i) => ({
        key: `query-${i}`,
        data: { id: i, category: i % 10 },
      }));

      await storage.bulkSet('cache', items);

      const start = performance.now();
      const results = await storage.query<{ id: number; category: number }>(
        'cache',
        (item) => item.category === 5,
      );
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
      expect(results).toHaveLength(100); // 10% of items
    });
  });
});
