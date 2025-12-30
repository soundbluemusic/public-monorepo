/**
 * @fileoverview Database entity types for IndexedDB/Dexie persistence
 *
 * This module defines base interfaces for common database patterns:
 * - Favorites: User-saved items with timestamps
 * - Settings: Singleton configuration (theme, language, etc.)
 * - Recent Views: History tracking with automatic cleanup
 *
 * All types are designed for use with Dexie.js and the helper factories
 * in `./helpers.ts`. Apps extend these base interfaces with their own fields.
 *
 * @example
 * ```ts
 * // In your app's db/types.ts
 * import type { BaseFavorite, BaseSettings } from '@soundblue/platform/db';
 *
 * export interface EntryFavorite extends BaseFavorite {
 *   entryId: string;  // Your app-specific ID field
 * }
 *
 * export interface AppSettings extends BaseSettings {
 *   showHints: boolean;  // Your app-specific settings
 * }
 * ```
 *
 * @module @soundblue/platform/db/types
 */

// =============================================================================
// Base Entity Interfaces
// =============================================================================

/**
 * Base interface for favorite/bookmark entities
 *
 * Favorites represent user-saved items that persist across sessions.
 * Each favorite stores a reference ID to the actual content and a timestamp.
 *
 * @remarks
 * - `id` is optional because Dexie auto-generates it on insert (auto-increment)
 * - Extend this interface with your app-specific ID field (e.g., `entryId`, `conceptId`)
 * - The ID field name is passed to `createFavoritesHelper()` for type-safe queries
 */
export interface BaseFavorite {
  /**
   * Auto-generated primary key (auto-increment)
   * Optional on insert, always present after retrieval
   */
  id?: number;

  /**
   * Timestamp when the item was added to favorites
   * Used for sorting (newest first by default)
   */
  addedAt: Date;
}

/**
 * Base interface for application settings (singleton pattern)
 *
 * Settings are stored as a single row with `id: 1` (singleton pattern).
 * This ensures only one settings record exists per user/browser.
 */
export interface BaseSettings {
  /**
   * Primary key - always 1 (singleton pattern)
   * This ensures only one settings record exists
   */
  id: number;

  /**
   * Color theme preference
   * - 'light': Force light mode
   * - 'dark': Force dark mode
   * - 'system': Follow OS preference (prefers-color-scheme)
   */
  theme: 'light' | 'dark' | 'system';

  /**
   * UI language preference
   * Used for i18n routing (e.g., '/ko/page' vs '/page')
   */
  language: 'ko' | 'en';

  /**
   * Font size preference for accessibility
   * Applied via CSS custom properties or Tailwind classes
   */
  fontSize: 'small' | 'medium' | 'large';

  /**
   * Timestamp of last settings update
   * Automatically set by the settings helper
   */
  updatedAt: Date;
}

/**
 * Base interface for recent view/history entities
 *
 * Tracks recently viewed items for quick access. The helper automatically
 * manages deduplication and limits the total number of entries.
 */
export interface BaseRecentView {
  /**
   * Auto-generated primary key (auto-increment)
   * Optional on insert, always present after retrieval
   */
  id?: number;

  /**
   * Timestamp when the item was last viewed
   * Updated each time the same item is viewed again
   */
  viewedAt: Date;
}

// =============================================================================
// Helper Interface Types
// =============================================================================

/**
 * Type interface for the favorites helper object
 */
export interface FavoritesHelper<T extends BaseFavorite, _K extends keyof T> {
  add: (itemId: string) => Promise<number | undefined>;
  remove: (itemId: string) => Promise<number>;
  toggle: (itemId: string) => Promise<boolean>;
  isFavorite: (itemId: string) => Promise<boolean>;
  getAll: () => Promise<T[]>;
  count: () => Promise<number>;
}

/**
 * Type interface for the settings helper object
 */
export interface SettingsHelper<T extends BaseSettings> {
  get: () => Promise<T>;
  update: (updates: Partial<Omit<T, 'id'>>) => Promise<number>;
  setTheme: (theme: T['theme']) => Promise<number>;
  setLanguage: (language: T['language']) => Promise<number>;
  setFontSize: (fontSize: T['fontSize']) => Promise<number>;
}

/**
 * Type interface for the recent views helper object
 */
export interface RecentViewsHelper<T extends BaseRecentView> {
  add: (itemId: string) => Promise<number | undefined>;
  getRecent: (limit?: number) => Promise<T[]>;
  clear: () => Promise<void>;
}
