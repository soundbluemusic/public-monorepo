/**
 * @fileoverview Unit tests for Browser Storage Implementation
 *
 * IndexedDB 기반 storage 팩토리 함수들을 테스트합니다.
 * fake-indexeddb를 사용하여 실제 IndexedDB API를 시뮬레이션합니다.
 */

import { storage } from '../../../../../packages/platform/src/storage/index.browser';
import type { FavoriteItem, RecentViewItem, SettingsData } from '../../../../../packages/platform/src/storage/types';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Browser Storage Implementation', () => {
  // 각 테스트마다 새로운 DB 이름으로 격리
  const getUniqueDbName = () => `test-db-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  describe('createFavoritesStorage', () => {
    let dbName: string;

    beforeEach(() => {
      dbName = getUniqueDbName();
    });

    it('should create a favorites storage instance', () => {
      const favoritesStorage = storage.createFavoritesStorage(dbName);
      expect(favoritesStorage).toBeDefined();
      expect(favoritesStorage.get).toBeInstanceOf(Function);
      expect(favoritesStorage.set).toBeInstanceOf(Function);
      expect(favoritesStorage.delete).toBeInstanceOf(Function);
      expect(favoritesStorage.getAll).toBeInstanceOf(Function);
      expect(favoritesStorage.clear).toBeInstanceOf(Function);
    });

    it('should store and retrieve a favorite item', async () => {
      const favoritesStorage = storage.createFavoritesStorage(dbName);
      const item: FavoriteItem = {
        id: 'entry-123',
        title: 'Hello World',
        addedAt: Date.now(),
      };

      await favoritesStorage.set('entry-123', item);
      const retrieved = await favoritesStorage.get('entry-123');

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('entry-123');
      expect(retrieved?.title).toBe('Hello World');
    });

    it('should return undefined for non-existent item', async () => {
      const favoritesStorage = storage.createFavoritesStorage(dbName);
      const result = await favoritesStorage.get('non-existent');
      expect(result).toBeUndefined();
    });

    it('should delete a favorite item', async () => {
      const favoritesStorage = storage.createFavoritesStorage(dbName);
      const item: FavoriteItem = {
        id: 'entry-to-delete',
        title: 'Delete Me',
        addedAt: Date.now(),
      };

      await favoritesStorage.set('entry-to-delete', item);
      expect(await favoritesStorage.get('entry-to-delete')).toBeDefined();

      await favoritesStorage.delete('entry-to-delete');
      expect(await favoritesStorage.get('entry-to-delete')).toBeUndefined();
    });

    it('should get all favorites ordered by addedAt descending', async () => {
      const favoritesStorage = storage.createFavoritesStorage(dbName);

      const items: FavoriteItem[] = [
        { id: 'first', title: 'First', addedAt: 1000 },
        { id: 'second', title: 'Second', addedAt: 2000 },
        { id: 'third', title: 'Third', addedAt: 3000 },
      ];

      for (const item of items) {
        await favoritesStorage.set(item.id, item);
      }

      const all = await favoritesStorage.getAll();
      expect(all).toHaveLength(3);
      // Most recent first
      expect(all[0].id).toBe('third');
      expect(all[1].id).toBe('second');
      expect(all[2].id).toBe('first');
    });

    it('should clear all favorites', async () => {
      const favoritesStorage = storage.createFavoritesStorage(dbName);

      await favoritesStorage.set('item1', { id: 'item1', title: 'Item 1', addedAt: Date.now() });
      await favoritesStorage.set('item2', { id: 'item2', title: 'Item 2', addedAt: Date.now() });

      const beforeClear = await favoritesStorage.getAll();
      expect(beforeClear).toHaveLength(2);

      await favoritesStorage.clear();
      const afterClear = await favoritesStorage.getAll();
      expect(afterClear).toHaveLength(0);
    });

    it('should update existing favorite when setting same id', async () => {
      const favoritesStorage = storage.createFavoritesStorage(dbName);

      await favoritesStorage.set('entry-1', { id: 'entry-1', title: 'Original', addedAt: 1000 });
      await favoritesStorage.set('entry-1', { id: 'entry-1', title: 'Updated', addedAt: 2000 });

      const all = await favoritesStorage.getAll();
      expect(all).toHaveLength(1);
      expect(all[0].title).toBe('Updated');
    });
  });

  describe('createRecentViewsStorage', () => {
    let dbName: string;

    beforeEach(() => {
      dbName = getUniqueDbName();
    });

    it('should create a recent views storage instance', () => {
      const recentStorage = storage.createRecentViewsStorage(dbName);
      expect(recentStorage).toBeDefined();
    });

    it('should store and retrieve a recent view item', async () => {
      const recentStorage = storage.createRecentViewsStorage(dbName);
      const item: RecentViewItem = {
        id: 'view-123',
        title: 'Recent Item',
        viewedAt: Date.now(),
      };

      await recentStorage.set('view-123', item);
      const retrieved = await recentStorage.get('view-123');

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('view-123');
    });

    it('should get all recent views ordered by viewedAt descending', async () => {
      const recentStorage = storage.createRecentViewsStorage(dbName);

      const items: RecentViewItem[] = [
        { id: 'old', title: 'Old', viewedAt: 1000 },
        { id: 'medium', title: 'Medium', viewedAt: 2000 },
        { id: 'recent', title: 'Recent', viewedAt: 3000 },
      ];

      for (const item of items) {
        await recentStorage.set(item.id, item);
      }

      const all = await recentStorage.getAll();
      expect(all).toHaveLength(3);
      expect(all[0].id).toBe('recent');
      expect(all[2].id).toBe('old');
    });

    it('should trim old entries when exceeding maxItems', async () => {
      const maxItems = 3;
      const recentStorage = storage.createRecentViewsStorage(dbName, maxItems);

      // Add more items than maxItems
      for (let i = 1; i <= 5; i++) {
        await recentStorage.set(`item-${i}`, {
          id: `item-${i}`,
          title: `Item ${i}`,
          viewedAt: i * 1000,
        });
      }

      const all = await recentStorage.getAll();
      expect(all.length).toBeLessThanOrEqual(maxItems);
    });

    it('should use default maxItems of 50 when not specified', () => {
      const recentStorage = storage.createRecentViewsStorage(dbName);
      // Just verify it doesn't throw
      expect(recentStorage).toBeDefined();
    });
  });

  describe('createSettingsStorage', () => {
    let dbName: string;

    beforeEach(() => {
      dbName = getUniqueDbName();
    });

    it('should create a settings storage instance', () => {
      const settingsStorage = storage.createSettingsStorage(dbName);
      expect(settingsStorage).toBeDefined();
    });

    it('should store and retrieve settings', async () => {
      const settingsStorage = storage.createSettingsStorage(dbName);
      const settings: SettingsData = {
        theme: 'dark',
        language: 'ko',
        fontSize: 'large',
      };

      await settingsStorage.set('_', settings);
      const retrieved = await settingsStorage.get('_');

      expect(retrieved).toBeDefined();
      expect(retrieved?.theme).toBe('dark');
      expect(retrieved?.language).toBe('ko');
      expect(retrieved?.fontSize).toBe('large');
    });

    it('should return undefined when no settings exist', async () => {
      const settingsStorage = storage.createSettingsStorage(dbName);
      const result = await settingsStorage.get('_');
      expect(result).toBeUndefined();
    });

    it('should update existing settings', async () => {
      const settingsStorage = storage.createSettingsStorage(dbName);

      await settingsStorage.set('_', { theme: 'light', language: 'en', fontSize: 'medium' });
      await settingsStorage.set('_', { theme: 'dark', language: 'ko', fontSize: 'large' });

      const all = await settingsStorage.getAll();
      expect(all).toHaveLength(1);
      expect(all[0].theme).toBe('dark');
    });

    it('should delete settings', async () => {
      const settingsStorage = storage.createSettingsStorage(dbName);

      await settingsStorage.set('_', { theme: 'dark', language: 'ko', fontSize: 'medium' });
      expect(await settingsStorage.get('_')).toBeDefined();

      await settingsStorage.delete('_');
      expect(await settingsStorage.get('_')).toBeUndefined();
    });

    it('should clear settings', async () => {
      const settingsStorage = storage.createSettingsStorage(dbName);

      await settingsStorage.set('_', { theme: 'dark', language: 'ko', fontSize: 'medium' });
      await settingsStorage.clear();

      const all = await settingsStorage.getAll();
      expect(all).toHaveLength(0);
    });

    it('should ignore key parameter and always use single settings', async () => {
      const settingsStorage = storage.createSettingsStorage(dbName);

      // 다른 key로 저장해도 동일한 설정 덮어쓰기
      await settingsStorage.set('key1', { theme: 'light', language: 'en', fontSize: 'small' });
      await settingsStorage.set('key2', { theme: 'dark', language: 'ko', fontSize: 'large' });

      const result1 = await settingsStorage.get('key1');
      const result2 = await settingsStorage.get('key2');

      // 둘 다 같은 값을 반환해야 함 (마지막 저장 값)
      expect(result1?.theme).toBe('dark');
      expect(result2?.theme).toBe('dark');
    });
  });

  describe('storage factory', () => {
    it('should have all factory methods', () => {
      expect(storage.createFavoritesStorage).toBeInstanceOf(Function);
      expect(storage.createRecentViewsStorage).toBeInstanceOf(Function);
      expect(storage.createSettingsStorage).toBeInstanceOf(Function);
    });

    it('should create independent storages for different apps', async () => {
      const app1Favorites = storage.createFavoritesStorage('app1');
      const app2Favorites = storage.createFavoritesStorage('app2');

      await app1Favorites.set('item1', { id: 'item1', title: 'App1 Item', addedAt: Date.now() });

      const app1Items = await app1Favorites.getAll();
      const app2Items = await app2Favorites.getAll();

      expect(app1Items).toHaveLength(1);
      expect(app2Items).toHaveLength(0);
    });
  });
});
