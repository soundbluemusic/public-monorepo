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
 * import type { BaseFavorite, BaseSettings } from '@soundblue/shared/db';
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
 * @module @soundblue/shared/db/types
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
 *
 * @example
 * ```ts
 * // Define your app's favorite type
 * interface EntryFavorite extends BaseFavorite {
 *   entryId: string;  // References an entry in your content
 * }
 *
 * // Use with Dexie
 * class AppDB extends Dexie {
 *   favorites!: EntityTable<EntryFavorite, 'id'>;
 *   constructor() {
 *     super('myapp');
 *     this.version(1).stores({
 *       favorites: '++id, entryId, addedAt'  // ++id = auto-increment
 *     });
 *   }
 * }
 * ```
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
 *
 * @remarks
 * - `id` is always `1` - this enforces the singleton pattern
 * - Use `createSettingsHelper()` to get/update settings safely
 * - Extend with app-specific settings (e.g., `showHints`, `autoPlay`)
 * - Default values are provided when no settings exist yet
 *
 * @example
 * ```ts
 * // Define your app's settings type
 * interface AppSettings extends BaseSettings {
 *   showHints: boolean;
 *   autoPlayAudio: boolean;
 * }
 *
 * // Provide defaults
 * const defaultSettings: AppSettings = {
 *   id: 1,  // Always 1 for singleton
 *   theme: 'system',
 *   language: 'ko',
 *   fontSize: 'medium',
 *   updatedAt: new Date(),
 *   showHints: true,
 *   autoPlayAudio: false,
 * };
 * ```
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
 *
 * @remarks
 * - `id` is optional because Dexie auto-generates it (auto-increment)
 * - Viewing an item again moves it to the top (deduplication)
 * - Old entries are automatically removed when `maxItems` is exceeded
 * - Extend with your app-specific ID field (e.g., `conceptId`, `pageId`)
 *
 * @example
 * ```ts
 * // Define your app's recent view type
 * interface ConceptRecentView extends BaseRecentView {
 *   conceptId: string;  // References a math concept
 * }
 *
 * // Use with helper (max 100 items by default)
 * const recentViews = createRecentViewsHelper(db.recentViews, 'conceptId', 100);
 * await recentViews.add('algebra');  // Adds or moves to top
 * ```
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
 *
 * Returned by `createFavoritesHelper()`. Provides CRUD operations
 * for managing user favorites with automatic validation.
 *
 * @typeParam T - Your favorite entity type extending BaseFavorite
 * @typeParam _K - The ID field name (e.g., 'entryId')
 *
 * @example
 * ```ts
 * const favorites: FavoritesHelper<EntryFavorite, 'entryId'> =
 *   createFavoritesHelper(db.favorites, 'entryId');
 *
 * // Add to favorites (idempotent - returns existing ID if already favorited)
 * const id = await favorites.add('my-entry');
 *
 * // Toggle favorite status (returns new state: true=added, false=removed)
 * const isFavorited = await favorites.toggle('my-entry');
 *
 * // Check if favorited
 * if (await favorites.isFavorite('my-entry')) { ... }
 *
 * // Get all favorites (newest first)
 * const allFavorites = await favorites.getAll();
 * ```
 */
export interface FavoritesHelper<T extends BaseFavorite, _K extends keyof T> {
  /**
   * Add an item to favorites (idempotent)
   * @param itemId - The ID of the item to favorite
   * @returns The record ID (existing if already favorited, new if added)
   * @throws Error if itemId is invalid (empty, too long, or reserved name)
   */
  add: (itemId: string) => Promise<number | undefined>;

  /**
   * Remove an item from favorites
   * @param itemId - The ID of the item to unfavorite
   * @returns Number of deleted records (0 or 1)
   * @throws Error if itemId is invalid
   */
  remove: (itemId: string) => Promise<number>;

  /**
   * Toggle favorite status (add if not favorited, remove if favorited)
   * @param itemId - The ID of the item to toggle
   * @returns `true` if item is now favorited, `false` if removed
   * @throws Error if itemId is invalid
   */
  toggle: (itemId: string) => Promise<boolean>;

  /**
   * Check if an item is favorited
   * @param itemId - The ID of the item to check
   * @returns `true` if favorited, `false` otherwise
   * @throws Error if itemId is invalid
   */
  isFavorite: (itemId: string) => Promise<boolean>;

  /**
   * Get all favorites sorted by addedAt (newest first)
   * @returns Array of favorite records with full entity data
   */
  getAll: () => Promise<T[]>;

  /**
   * Get the total number of favorites
   * @returns Count of favorited items
   */
  count: () => Promise<number>;
}

/**
 * Type interface for the settings helper object
 *
 * Returned by `createSettingsHelper()`. Provides get/update operations
 * for the singleton settings record with automatic defaults.
 *
 * @typeParam T - Your settings type extending BaseSettings
 *
 * @example
 * ```ts
 * const settings: SettingsHelper<AppSettings> =
 *   createSettingsHelper(db.settings, defaultSettings);
 *
 * // Get current settings (returns defaults if none exist)
 * const current = await settings.get();
 *
 * // Update multiple settings at once
 * await settings.update({ theme: 'dark', showHints: false });
 *
 * // Convenience methods for common settings
 * await settings.setTheme('system');
 * await settings.setLanguage('en');
 * ```
 */
export interface SettingsHelper<T extends BaseSettings> {
  /**
   * Get current settings
   * @returns Current settings merged with defaults (never undefined)
   */
  get: () => Promise<T>;

  /**
   * Update one or more settings
   * @param updates - Partial settings to merge (id is ignored)
   * @returns The record ID (always 1)
   */
  update: (updates: Partial<Omit<T, 'id'>>) => Promise<number>;

  /**
   * Set the theme preference
   * @param theme - 'light', 'dark', or 'system'
   * @returns The record ID (always 1)
   */
  setTheme: (theme: T['theme']) => Promise<number>;

  /**
   * Set the language preference
   * @param language - 'ko' or 'en'
   * @returns The record ID (always 1)
   */
  setLanguage: (language: T['language']) => Promise<number>;

  /**
   * Set the font size preference
   * @param fontSize - 'small', 'medium', or 'large'
   * @returns The record ID (always 1)
   */
  setFontSize: (fontSize: T['fontSize']) => Promise<number>;
}

/**
 * Type interface for the recent views helper object
 *
 * Returned by `createRecentViewsHelper()`. Provides operations for
 * tracking recently viewed items with automatic deduplication and cleanup.
 *
 * @typeParam T - Your recent view entity type extending BaseRecentView
 *
 * @example
 * ```ts
 * const recentViews: RecentViewsHelper<ConceptRecentView> =
 *   createRecentViewsHelper(db.recentViews, 'conceptId', 100);
 *
 * // Record a view (moves to top if already viewed)
 * await recentViews.add('algebra');
 *
 * // Get recent items (default: 20, sorted by viewedAt desc)
 * const recent = await recentViews.getRecent(10);
 *
 * // Clear all history
 * await recentViews.clear();
 * ```
 */
export interface RecentViewsHelper<T extends BaseRecentView> {
  /**
   * Record a view (adds new or updates existing to current time)
   *
   * If the item was already viewed, it's moved to the top.
   * If maxItems is exceeded, the oldest entry is removed.
   *
   * @param itemId - The ID of the viewed item
   * @returns The record ID
   * @throws Error if itemId is invalid
   */
  add: (itemId: string) => Promise<number | undefined>;

  /**
   * Get recently viewed items sorted by viewedAt (newest first)
   * @param limit - Maximum number of items to return (default: 20)
   * @returns Array of recent view records
   */
  getRecent: (limit?: number) => Promise<T[]>;

  /**
   * Clear all recent view history
   * @returns void
   */
  clear: () => Promise<void>;
}
