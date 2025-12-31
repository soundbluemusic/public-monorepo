/**
 * @fileoverview Storage Types
 * @environment universal
 *
 * Platform-agnostic storage interface.
 * Implementations exist for browser (IndexedDB) and noop (SSR/build).
 */

/**
 * Generic storage interface for favorites, recent views, and settings
 */
export interface StorageAdapter<T> {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  getAll(): Promise<T[]>;
  clear(): Promise<void>;
}

/**
 * Favorite item structure
 */
export interface FavoriteItem {
  id: string;
  addedAt: number;
}

/**
 * Recent view item structure
 */
export interface RecentViewItem {
  id: string;
  viewedAt: number;
}

/**
 * Base settings structure - extend this for app-specific settings
 */
export interface SettingsData {
  theme: 'light' | 'dark' | 'system';
  language?: 'en' | 'ko';
  fontSize?: 'small' | 'medium' | 'large';
}

/**
 * Storage factory interface
 */
export interface StorageFactory {
  createFavoritesStorage(dbName: string): StorageAdapter<FavoriteItem>;
  createRecentViewsStorage(dbName: string, maxItems?: number): StorageAdapter<RecentViewItem>;
  createSettingsStorage(dbName: string): StorageAdapter<SettingsData>;
}
