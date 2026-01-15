/**
 * @fileoverview Unit tests for Noop Storage Implementation
 *
 * SSR/빌드 시점에서 사용되는 noop storage를 테스트합니다.
 * 모든 작업이 아무 것도 하지 않고 빈 값을 반환하는지 확인합니다.
 */

import { storage } from '../../../../../packages/platform/src/storage/index.noop';
import type { FavoriteItem, RecentViewItem, SettingsData } from '../../../../../packages/platform/src/storage/types';
import { describe, expect, it } from 'vitest';

describe('Noop Storage Implementation', () => {
  describe('createFavoritesStorage (noop)', () => {
    it('should create a favorites storage instance', () => {
      const favoritesStorage = storage.createFavoritesStorage('test-db');
      expect(favoritesStorage).toBeDefined();
      expect(favoritesStorage.get).toBeInstanceOf(Function);
      expect(favoritesStorage.set).toBeInstanceOf(Function);
      expect(favoritesStorage.delete).toBeInstanceOf(Function);
      expect(favoritesStorage.getAll).toBeInstanceOf(Function);
      expect(favoritesStorage.clear).toBeInstanceOf(Function);
    });

    it('should return undefined for get', async () => {
      const favoritesStorage = storage.createFavoritesStorage('test-db');
      const result = await favoritesStorage.get('any-key');
      expect(result).toBeUndefined();
    });

    it('should do nothing on set', async () => {
      const favoritesStorage = storage.createFavoritesStorage('test-db');
      const item: FavoriteItem = { id: 'test', title: 'Test', addedAt: Date.now() };

      // Should not throw
      await expect(favoritesStorage.set('test', item)).resolves.toBeUndefined();

      // Should still return undefined after set
      const result = await favoritesStorage.get('test');
      expect(result).toBeUndefined();
    });

    it('should do nothing on delete', async () => {
      const favoritesStorage = storage.createFavoritesStorage('test-db');
      // Should not throw
      await expect(favoritesStorage.delete('any-key')).resolves.toBeUndefined();
    });

    it('should return empty array for getAll', async () => {
      const favoritesStorage = storage.createFavoritesStorage('test-db');
      const result = await favoritesStorage.getAll();
      expect(result).toEqual([]);
    });

    it('should do nothing on clear', async () => {
      const favoritesStorage = storage.createFavoritesStorage('test-db');
      // Should not throw
      await expect(favoritesStorage.clear()).resolves.toBeUndefined();
    });
  });

  describe('createRecentViewsStorage (noop)', () => {
    it('should create a recent views storage instance', () => {
      const recentStorage = storage.createRecentViewsStorage('test-db');
      expect(recentStorage).toBeDefined();
    });

    it('should accept maxItems parameter without effect', () => {
      const recentStorage = storage.createRecentViewsStorage('test-db', 100);
      expect(recentStorage).toBeDefined();
    });

    it('should return undefined for get', async () => {
      const recentStorage = storage.createRecentViewsStorage('test-db');
      const result = await recentStorage.get('any-key');
      expect(result).toBeUndefined();
    });

    it('should do nothing on set', async () => {
      const recentStorage = storage.createRecentViewsStorage('test-db');
      const item: RecentViewItem = { id: 'test', title: 'Test', viewedAt: Date.now() };

      await expect(recentStorage.set('test', item)).resolves.toBeUndefined();
    });

    it('should return empty array for getAll', async () => {
      const recentStorage = storage.createRecentViewsStorage('test-db');
      const result = await recentStorage.getAll();
      expect(result).toEqual([]);
    });

    it('should do nothing on delete', async () => {
      const recentStorage = storage.createRecentViewsStorage('test-db');
      await expect(recentStorage.delete('any-key')).resolves.toBeUndefined();
    });

    it('should do nothing on clear', async () => {
      const recentStorage = storage.createRecentViewsStorage('test-db');
      await expect(recentStorage.clear()).resolves.toBeUndefined();
    });
  });

  describe('createSettingsStorage (noop)', () => {
    it('should create a settings storage instance', () => {
      const settingsStorage = storage.createSettingsStorage('test-db');
      expect(settingsStorage).toBeDefined();
    });

    it('should return undefined for get', async () => {
      const settingsStorage = storage.createSettingsStorage('test-db');
      const result = await settingsStorage.get('_');
      expect(result).toBeUndefined();
    });

    it('should do nothing on set', async () => {
      const settingsStorage = storage.createSettingsStorage('test-db');
      const settings: SettingsData = { theme: 'dark', language: 'ko', fontSize: 'medium' };

      await expect(settingsStorage.set('_', settings)).resolves.toBeUndefined();

      // Should still return undefined after set
      const result = await settingsStorage.get('_');
      expect(result).toBeUndefined();
    });

    it('should return empty array for getAll', async () => {
      const settingsStorage = storage.createSettingsStorage('test-db');
      const result = await settingsStorage.getAll();
      expect(result).toEqual([]);
    });

    it('should do nothing on delete', async () => {
      const settingsStorage = storage.createSettingsStorage('test-db');
      await expect(settingsStorage.delete('_')).resolves.toBeUndefined();
    });

    it('should do nothing on clear', async () => {
      const settingsStorage = storage.createSettingsStorage('test-db');
      await expect(settingsStorage.clear()).resolves.toBeUndefined();
    });
  });

  describe('storage factory (noop)', () => {
    it('should have all factory methods', () => {
      expect(storage.createFavoritesStorage).toBeInstanceOf(Function);
      expect(storage.createRecentViewsStorage).toBeInstanceOf(Function);
      expect(storage.createSettingsStorage).toBeInstanceOf(Function);
    });

    it('should work with any dbName parameter', () => {
      // All should work without errors
      expect(storage.createFavoritesStorage('any-db-name')).toBeDefined();
      expect(storage.createRecentViewsStorage('another-db')).toBeDefined();
      expect(storage.createSettingsStorage('yet-another-db')).toBeDefined();
    });
  });

  describe('SSR/Build time safety', () => {
    it('should be safe to use during SSR without IndexedDB', async () => {
      // Noop storage should work even in environments without IndexedDB
      const favoritesStorage = storage.createFavoritesStorage('ssr-test');
      const recentStorage = storage.createRecentViewsStorage('ssr-test');
      const settingsStorage = storage.createSettingsStorage('ssr-test');

      // All operations should complete without errors
      await favoritesStorage.set('test', { id: 'test', title: 'Test', addedAt: Date.now() });
      await recentStorage.set('test', { id: 'test', title: 'Test', viewedAt: Date.now() });
      await settingsStorage.set('_', { theme: 'light', language: 'en', fontSize: 'medium' });

      expect(await favoritesStorage.getAll()).toEqual([]);
      expect(await recentStorage.getAll()).toEqual([]);
      expect(await settingsStorage.getAll()).toEqual([]);
    });
  });
});
