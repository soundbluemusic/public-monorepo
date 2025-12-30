/**
 * @fileoverview Noop Storage Implementation
 * @environment build-only
 *
 * No-operation storage for SSR and build time.
 * All operations return empty/undefined values.
 */

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
 * Noop storage adapter - all operations are no-ops
 */
function createNoopStorage<T>(): StorageAdapter<T> {
  return {
    async get(_key: string) {
      return undefined;
    },
    async set(_key: string, _value: T) {
      // noop
    },
    async delete(_key: string) {
      // noop
    },
    async getAll() {
      return [];
    },
    async clear() {
      // noop
    },
  };
}

/**
 * Noop storage factory for SSR/build
 */
export const storage: StorageFactory = {
  createFavoritesStorage(_dbName: string): StorageAdapter<FavoriteItem> {
    return createNoopStorage<FavoriteItem>();
  },
  createRecentViewsStorage(_dbName: string, _maxItems?: number): StorageAdapter<RecentViewItem> {
    return createNoopStorage<RecentViewItem>();
  },
  createSettingsStorage(_dbName: string): StorageAdapter<SettingsData> {
    return createNoopStorage<SettingsData>();
  },
};

export default storage;
