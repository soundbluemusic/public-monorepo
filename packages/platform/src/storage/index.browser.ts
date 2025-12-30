/**
 * @fileoverview Browser Storage Implementation
 * @environment client-only
 *
 * IndexedDB-based storage using Dexie.
 * This file is only bundled for browser environments.
 */

import Dexie, { type EntityTable } from 'dexie';
import type {
  FavoriteItem,
  RecentViewItem,
  SettingsData,
  StorageAdapter,
  StorageFactory,
} from './types';

// Re-export types
export type { FavoriteItem, RecentViewItem, SettingsData, StorageAdapter } from './types';

/**
 * Dexie database for favorites
 */
class FavoritesDB extends Dexie {
  favorites!: EntityTable<FavoriteItem, 'id'>;

  constructor(dbName: string) {
    super(`${dbName}-favorites`);
    this.version(1).stores({
      favorites: 'id, addedAt',
    });
  }
}

/**
 * Dexie database for recent views
 */
class RecentViewsDB extends Dexie {
  recentViews!: EntityTable<RecentViewItem, 'id'>;

  constructor(dbName: string) {
    super(`${dbName}-recent`);
    this.version(1).stores({
      recentViews: 'id, viewedAt',
    });
  }
}

/**
 * Dexie database for settings
 */
class SettingsDB extends Dexie {
  settings!: EntityTable<SettingsData & { id: string }, 'id'>;

  constructor(dbName: string) {
    super(`${dbName}-settings`);
    this.version(1).stores({
      settings: 'id',
    });
  }
}

/**
 * Browser favorites storage using IndexedDB
 */
function createBrowserFavoritesStorage(dbName: string): StorageAdapter<FavoriteItem> {
  const db = new FavoritesDB(dbName);

  return {
    async get(id: string) {
      return db.favorites.get(id);
    },
    async set(id: string, value: FavoriteItem) {
      await db.favorites.put({ ...value, id });
    },
    async delete(id: string) {
      await db.favorites.delete(id);
    },
    async getAll() {
      return db.favorites.orderBy('addedAt').reverse().toArray();
    },
    async clear() {
      await db.favorites.clear();
    },
  };
}

/**
 * Browser recent views storage using IndexedDB
 */
function createBrowserRecentViewsStorage(
  dbName: string,
  maxItems = 50,
): StorageAdapter<RecentViewItem> {
  const db = new RecentViewsDB(dbName);

  return {
    async get(id: string) {
      return db.recentViews.get(id);
    },
    async set(id: string, value: RecentViewItem) {
      await db.recentViews.put({ ...value, id });
      // Trim old entries
      const count = await db.recentViews.count();
      if (count > maxItems) {
        const oldest = await db.recentViews
          .orderBy('viewedAt')
          .limit(count - maxItems)
          .toArray();
        const idsToDelete = oldest.map((item) => item.id);
        await db.recentViews.bulkDelete(idsToDelete);
      }
    },
    async delete(id: string) {
      await db.recentViews.delete(id);
    },
    async getAll() {
      return db.recentViews.orderBy('viewedAt').reverse().toArray();
    },
    async clear() {
      await db.recentViews.clear();
    },
  };
}

/**
 * Browser settings storage using IndexedDB
 */
function createBrowserSettingsStorage(dbName: string): StorageAdapter<SettingsData> {
  const db = new SettingsDB(dbName);
  const SETTINGS_KEY = 'app-settings';

  return {
    async get(_key: string) {
      const result = await db.settings.get(SETTINGS_KEY);
      if (result) {
        const { id: _id, ...settings } = result;
        return settings as SettingsData;
      }
      return undefined;
    },
    async set(_key: string, value: SettingsData) {
      await db.settings.put({ ...value, id: SETTINGS_KEY });
    },
    async delete(_key: string) {
      await db.settings.delete(SETTINGS_KEY);
    },
    async getAll() {
      const result = await db.settings.get(SETTINGS_KEY);
      if (result) {
        const { id: _id, ...settings } = result;
        return [settings as SettingsData];
      }
      return [];
    },
    async clear() {
      await db.settings.clear();
    },
  };
}

/**
 * Browser storage factory
 */
export const storage: StorageFactory = {
  createFavoritesStorage: createBrowserFavoritesStorage,
  createRecentViewsStorage: createBrowserRecentViewsStorage,
  createSettingsStorage: createBrowserSettingsStorage,
};

export default storage;
