/**
 * @fileoverview Database helper factory functions for IndexedDB/Dexie
 *
 * This module provides factory functions that create type-safe helper objects
 * for common database patterns: favorites, settings, and recent views.
 *
 * Each factory takes a Dexie table and configuration, returning an object
 * with CRUD methods. All ID parameters are validated to prevent abuse.
 *
 * @remarks
 * - All helpers use Dexie.js for IndexedDB access
 * - ID validation prevents prototype pollution and abuse
 * - Settings use a singleton pattern (id: 1)
 * - Recent views auto-cleanup old entries when maxItems is exceeded
 *
 * @example
 * ```ts
 * // In your app's db/helpers.ts
 * import { createFavoritesHelper, createSettingsHelper } from '@soundblue/shared/db';
 * import { db, defaultSettings } from './db';
 *
 * export const favorites = createFavoritesHelper(db.favorites, 'entryId');
 * export const settings = createSettingsHelper(db.settings, defaultSettings);
 *
 * // Usage in components
 * await favorites.toggle('hello');  // Returns true if now favorited
 * await settings.setTheme('dark');  // Updates theme preference
 * ```
 *
 * @module @soundblue/shared/db/helpers
 */
import type { EntityTable, Table } from 'dexie';
import { validateId } from '../validation';
import type { BaseFavorite, BaseRecentView, BaseSettings } from './types';

/**
 * Internal type for Dexie table operations
 * Bypasses strict EntityTable type checking for dynamic field access
 * @internal
 */
type AnyTable<T> = Table<T, number>;

/**
 * Creates a favorites helper for managing user-saved items
 *
 * The returned helper provides CRUD operations for favorites with:
 * - Automatic ID validation (prevents prototype pollution)
 * - Idempotent add (won't create duplicates)
 * - Toggle support for UI favorite buttons
 * - Sorted retrieval (newest first)
 *
 * @typeParam T - Your favorite entity type (must extend BaseFavorite and have the ID field)
 * @typeParam K - The name of your ID field (e.g., 'entryId', 'conceptId')
 *
 * @param table - Dexie EntityTable for favorites storage
 * @param idFieldName - Name of the field that stores the item ID
 *
 * @returns Object with favorites CRUD methods:
 * - `add(itemId)` - Add to favorites (idempotent)
 * - `remove(itemId)` - Remove from favorites
 * - `toggle(itemId)` - Toggle favorite status
 * - `isFavorite(itemId)` - Check if favorited
 * - `getAll()` - Get all favorites (newest first)
 * - `count()` - Get total count
 *
 * @throws Error if itemId validation fails (empty, too long, reserved name)
 *
 * @example
 * ```ts
 * // Define your entity type
 * interface EntryFavorite extends BaseFavorite {
 *   entryId: string;
 * }
 *
 * // Create the helper
 * const favorites = createFavoritesHelper<EntryFavorite, 'entryId'>(
 *   db.favorites,
 *   'entryId'
 * );
 *
 * // Use in a React component
 * const handleFavoriteClick = async (entryId: string) => {
 *   const isNowFavorited = await favorites.toggle(entryId);
 *   toast(isNowFavorited ? 'Added to favorites' : 'Removed from favorites');
 * };
 *
 * // Display favorites count
 * const count = await favorites.count();  // e.g., 42
 *
 * // List all favorites
 * const allFavorites = await favorites.getAll();
 * // Returns: [{ id: 5, entryId: 'new', addedAt: ... }, { id: 3, entryId: 'old', ... }]
 * ```
 */
export function createFavoritesHelper<T extends BaseFavorite & Record<K, string>, K extends string>(
  table: EntityTable<T, 'id'>,
  idFieldName: K,
) {
  const t = table as unknown as AnyTable<T>;
  return {
    /**
     * Add an item to favorites (idempotent)
     *
     * If the item is already favorited, returns the existing record ID.
     * If not, creates a new favorite with the current timestamp.
     *
     * @param itemId - The ID of the item to favorite
     * @returns The record ID (existing or newly created)
     * @throws Error if itemId is invalid (empty, >100 chars, or reserved name)
     *
     * @example
     * ```ts
     * const id = await favorites.add('my-entry');
     * // First call: creates record, returns e.g. 1
     * // Second call: returns same ID (idempotent)
     * ```
     */
    async add(itemId: string) {
      validateId(itemId, idFieldName);
      const exists = await t.where(idFieldName).equals(itemId).first();
      if (exists) return exists.id;
      return t.add({ [idFieldName]: itemId, addedAt: new Date() } as unknown as T);
    },

    /**
     * Remove an item from favorites
     *
     * @param itemId - The ID of the item to unfavorite
     * @returns Number of deleted records (0 if not found, 1 if removed)
     * @throws Error if itemId is invalid
     *
     * @example
     * ```ts
     * const deleted = await favorites.remove('my-entry');
     * // deleted === 1 if it was favorited
     * // deleted === 0 if it wasn't favorited
     * ```
     */
    async remove(itemId: string) {
      validateId(itemId, idFieldName);
      return t.where(idFieldName).equals(itemId).delete();
    },

    /**
     * Toggle favorite status (add if not favorited, remove if favorited)
     *
     * Ideal for favorite button click handlers - returns the new state.
     *
     * @param itemId - The ID of the item to toggle
     * @returns `true` if item is now favorited, `false` if it was removed
     * @throws Error if itemId is invalid
     *
     * @example
     * ```ts
     * // In a click handler
     * const isFavorited = await favorites.toggle('my-entry');
     * setFavoriteIcon(isFavorited ? 'filled' : 'outline');
     * ```
     */
    async toggle(itemId: string) {
      validateId(itemId, idFieldName);
      const exists = await t.where(idFieldName).equals(itemId).first();
      if (exists?.id) {
        await t.delete(exists.id);
        return false;
      }
      await t.add({ [idFieldName]: itemId, addedAt: new Date() } as unknown as T);
      return true;
    },

    /**
     * Check if an item is favorited
     *
     * @param itemId - The ID of the item to check
     * @returns `true` if favorited, `false` otherwise
     * @throws Error if itemId is invalid
     *
     * @example
     * ```ts
     * // Check on component mount
     * const [isFav, setIsFav] = useState(false);
     * useEffect(() => {
     *   favorites.isFavorite(entryId).then(setIsFav);
     * }, [entryId]);
     * ```
     */
    async isFavorite(itemId: string) {
      validateId(itemId, idFieldName);
      const exists = await t.where(idFieldName).equals(itemId).first();
      return !!exists;
    },

    /**
     * Get all favorites sorted by addedAt (newest first)
     *
     * @returns Array of favorite records with full entity data
     *
     * @example
     * ```ts
     * const favorites = await favorites.getAll();
     * // Returns: [
     * //   { id: 5, entryId: 'newest', addedAt: Date('2024-01-15') },
     * //   { id: 3, entryId: 'older', addedAt: Date('2024-01-10') },
     * //   ...
     * // ]
     * ```
     */
    async getAll() {
      return t.orderBy('addedAt').reverse().toArray();
    },

    /**
     * Get the total number of favorites
     *
     * @returns Count of favorited items
     *
     * @example
     * ```ts
     * const count = await favorites.count();
     * console.log(`You have ${count} favorites`);
     * ```
     */
    async count() {
      return t.count();
    },
  };
}

/**
 * Creates a settings helper for managing application preferences
 *
 * Settings are stored as a singleton record (id: 1) in IndexedDB.
 * The helper provides get/update operations with automatic defaults.
 *
 * @remarks
 * - Uses singleton pattern: only one settings record exists (id: 1)
 * - Returns defaults if no settings have been saved yet
 * - Automatically updates the `updatedAt` timestamp on every change
 * - Thread-safe: uses put() to atomically update the record
 *
 * @typeParam T - Your settings type extending BaseSettings
 *
 * @param table - Dexie EntityTable for settings storage
 * @param defaultSettings - Default values for all settings (used when none exist)
 *
 * @returns Object with settings CRUD methods:
 * - `get()` - Get current settings (with defaults)
 * - `update(partial)` - Update one or more settings
 * - `setTheme(theme)` - Set theme preference
 * - `setLanguage(lang)` - Set language preference
 *
 * @example
 * ```ts
 * // Define your settings type
 * interface AppSettings extends BaseSettings {
 *   showHints: boolean;
 *   autoPlayAudio: boolean;
 * }
 *
 * // Define defaults (id must be 1)
 * const defaultSettings: AppSettings = {
 *   id: 1,
 *   theme: 'system',
 *   language: 'ko',
 *   fontSize: 'medium',
 *   updatedAt: new Date(),
 *   showHints: true,
 *   autoPlayAudio: false,
 * };
 *
 * // Create the helper
 * const settings = createSettingsHelper(db.settings, defaultSettings);
 *
 * // Get current settings (returns defaults if none saved)
 * const current = await settings.get();
 *
 * // Update multiple settings at once
 * await settings.update({ theme: 'dark', showHints: false });
 *
 * // Use convenience methods
 * await settings.setTheme('system');
 * await settings.setLanguage('en');
 * ```
 */
export function createSettingsHelper<T extends BaseSettings>(
  table: EntityTable<T, 'id'>,
  defaultSettings: T,
) {
  const t = table as unknown as AnyTable<T>;
  const helper = {
    /**
     * Get current settings, falling back to defaults if none exist
     *
     * @returns Current settings merged with defaults (never undefined)
     *
     * @example
     * ```ts
     * const { theme, language, showHints } = await settings.get();
     * applyTheme(theme);
     * ```
     */
    async get(): Promise<T> {
      const s = await t.get(1);
      return s || { ...defaultSettings, updatedAt: new Date() };
    },

    /**
     * Update one or more settings
     *
     * Merges the updates with current settings and saves.
     * The `id` is always forced to 1 (singleton pattern).
     * The `updatedAt` is automatically set to current time.
     *
     * @param updates - Partial settings to merge (id is ignored)
     * @returns The record ID (always 1)
     *
     * @example
     * ```ts
     * // Update multiple settings
     * await settings.update({
     *   theme: 'dark',
     *   fontSize: 'large',
     *   showHints: false,
     * });
     * ```
     */
    async update(updates: Partial<Omit<T, 'id'>>) {
      const current = await helper.get();
      return t.put({
        ...current,
        ...updates,
        id: 1,
        updatedAt: new Date(),
      } as T);
    },

    /**
     * Set the theme preference
     *
     * @param theme - 'light', 'dark', or 'system'
     * @returns The record ID (always 1)
     *
     * @example
     * ```ts
     * // In a theme toggle handler
     * await settings.setTheme(isDark ? 'dark' : 'light');
     * ```
     */
    async setTheme(theme: T['theme']) {
      return helper.update({ theme } as Partial<Omit<T, 'id'>>);
    },

    /**
     * Set the language preference
     *
     * @param language - 'ko' or 'en'
     * @returns The record ID (always 1)
     *
     * @example
     * ```ts
     * // In a language selector
     * await settings.setLanguage('en');
     * window.location.href = '/';  // Reload to apply
     * ```
     */
    async setLanguage(language: T['language']) {
      return helper.update({ language } as Partial<Omit<T, 'id'>>);
    },
  };

  return helper;
}

/**
 * Creates a recent views helper for tracking browsing history
 *
 * Tracks recently viewed items with automatic deduplication and cleanup.
 * When an item is viewed again, it moves to the top of the list.
 * When `maxItems` is exceeded, the oldest entry is automatically removed.
 *
 * @remarks
 * - Deduplication: viewing the same item updates its timestamp (moves to top)
 * - Auto-cleanup: oldest items removed when exceeding maxItems
 * - Sorted by viewedAt descending (most recent first)
 * - Ideal for "Recently Viewed" sections in UI
 *
 * @typeParam T - Your recent view entity type (must extend BaseRecentView and have the ID field)
 * @typeParam K - The name of your ID field (e.g., 'conceptId', 'pageId')
 *
 * @param table - Dexie EntityTable for recent views storage
 * @param idFieldName - Name of the field that stores the item ID
 * @param maxItems - Maximum number of items to keep (default: 100)
 *
 * @returns Object with recent views methods:
 * - `add(itemId)` - Record a view (deduplicates, auto-cleans)
 * - `getRecent(limit)` - Get recent items (default: 20)
 * - `clear()` - Clear all history
 *
 * @throws Error if itemId validation fails (empty, too long, reserved name)
 *
 * @example
 * ```ts
 * // Define your entity type
 * interface ConceptRecentView extends BaseRecentView {
 *   conceptId: string;
 * }
 *
 * // Create the helper (keep last 50 items)
 * const recentViews = createRecentViewsHelper<ConceptRecentView, 'conceptId'>(
 *   db.recentViews,
 *   'conceptId',
 *   50
 * );
 *
 * // Record a view when user opens a concept
 * useEffect(() => {
 *   recentViews.add(conceptId);
 * }, [conceptId]);
 *
 * // Display recent items in sidebar
 * const recent = await recentViews.getRecent(10);
 * // Returns: [{ id: 5, conceptId: 'algebra', viewedAt: ... }, ...]
 *
 * // Clear history (e.g., in settings)
 * await recentViews.clear();
 * ```
 */
export function createRecentViewsHelper<
  T extends BaseRecentView & Record<K, string>,
  K extends string,
>(table: EntityTable<T, 'id'>, idFieldName: K, maxItems = 100) {
  const t = table as unknown as AnyTable<T>;
  return {
    /**
     * Record a view (adds new or updates existing to current time)
     *
     * Handles deduplication automatically: if the item was already viewed,
     * it's removed and re-added with the current timestamp (moves to top).
     * If the total count exceeds `maxItems`, the oldest entry is removed.
     *
     * @param itemId - The ID of the viewed item
     * @returns The new record ID
     * @throws Error if itemId is invalid (empty, >100 chars, or reserved name)
     *
     * @example
     * ```ts
     * // Call when user views a concept
     * await recentViews.add('algebra');
     *
     * // Viewing again moves it to top
     * await recentViews.add('calculus');
     * await recentViews.add('algebra');  // Now algebra is most recent
     * ```
     */
    async add(itemId: string) {
      validateId(itemId, idFieldName);
      // Remove existing entry if present (deduplication)
      await t.where(idFieldName).equals(itemId).delete();
      const id = await t.add({
        [idFieldName]: itemId,
        viewedAt: new Date(),
      } as unknown as T);

      // Remove oldest if exceeding maxItems
      const count = await t.count();
      if (count > maxItems) {
        const oldest = await t.orderBy('viewedAt').first();
        if (oldest?.id !== undefined) {
          await t.delete(oldest.id);
        }
      }

      return id;
    },

    /**
     * Get recently viewed items sorted by viewedAt (newest first)
     *
     * @param limit - Maximum number of items to return (default: 20)
     * @returns Array of recent view records with full entity data
     *
     * @example
     * ```ts
     * // Get last 5 viewed items for a compact list
     * const recent = await recentViews.getRecent(5);
     *
     * // Get more for a full history page
     * const fullHistory = await recentViews.getRecent(50);
     * ```
     */
    async getRecent(limit = 20) {
      return t.orderBy('viewedAt').reverse().limit(limit).toArray();
    },

    /**
     * Clear all recent view history
     *
     * Use this for a "Clear History" feature in settings.
     *
     * @returns void
     *
     * @example
     * ```ts
     * // In a settings page
     * const handleClearHistory = async () => {
     *   await recentViews.clear();
     *   toast('History cleared');
     * };
     * ```
     */
    async clear() {
      return t.clear();
    },
  };
}
