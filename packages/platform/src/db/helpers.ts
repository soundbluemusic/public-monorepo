/**
 * @fileoverview Database helper factory functions for IndexedDB/Dexie
 *
 * This module provides factory functions that create type-safe helper objects
 * for common database patterns: favorites, settings, and recent views.
 *
 * ## Type Assertion Notes
 *
 * This module uses `as unknown as T` assertions in several places. These are
 * necessary due to TypeScript limitations:
 *
 * 1. **EntityTable vs Table casting**: Dexie's EntityTable and Table types
 *    have different signatures. We cast to Table<T, number> for consistent API.
 *
 * 2. **Computed property keys**: TypeScript cannot verify that an object
 *    constructed with `{ [dynamicKey]: value }` satisfies a generic type `T`
 *    that includes `Record<K, string>`, even though the constraint guarantees it.
 *
 * 3. **Auto-generated fields**: Dexie auto-generates `id` on insert, so we
 *    construct objects without `id`. TypeScript can't know Dexie will add it.
 *
 * These assertions are safe because:
 * - The generic constraints guarantee the required fields exist
 * - Runtime validation (validateId) ensures data integrity
 * - Dexie handles auto-increment IDs transparently
 *
 * @module @soundblue/platform/db/helpers
 */
import { validateId } from '@soundblue/core/validation';
import type { EntityTable, Table } from 'dexie';
import type { BaseFavorite, BaseRecentView, BaseSettings } from './types';

/**
 * Internal type for Dexie table operations.
 *
 * Dexie's EntityTable uses branded 'id' for primary key, while Table uses
 * the actual key type. We use Table<T, number> for consistent auto-increment handling.
 *
 * @internal
 */
type AnyTable<T> = Table<T, number>;

/**
 * Creates a favorites helper for managing user-saved items
 *
 * @typeParam T - Your favorite entity type (must extend BaseFavorite and have the ID field)
 * @typeParam K - The name of your ID field (e.g., 'entryId', 'conceptId')
 *
 * @param table - Dexie EntityTable for favorites storage
 * @param idFieldName - Name of the field that stores the item ID
 *
 * @returns Object with favorites CRUD methods
 */
export function createFavoritesHelper<T extends BaseFavorite & Record<K, string>, K extends string>(
  table: EntityTable<T, 'id'>,
  idFieldName: K,
) {
  const t = table as unknown as AnyTable<T>;
  return {
    async add(itemId: string) {
      validateId(itemId, idFieldName);
      const exists = await t.where(idFieldName).equals(itemId).first();
      if (exists) return exists.id;
      return t.add({ [idFieldName]: itemId, addedAt: new Date() } as unknown as T);
    },

    async remove(itemId: string) {
      validateId(itemId, idFieldName);
      return t.where(idFieldName).equals(itemId).delete();
    },

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

    async isFavorite(itemId: string) {
      validateId(itemId, idFieldName);
      const exists = await t.where(idFieldName).equals(itemId).first();
      return !!exists;
    },

    async getAll() {
      return t.orderBy('addedAt').reverse().toArray();
    },

    async count() {
      return t.count();
    },
  };
}

/**
 * Creates a settings helper for managing application preferences
 *
 * Settings are stored as a singleton record (id: 1) in IndexedDB.
 *
 * @typeParam T - Your settings type extending BaseSettings
 * @param table - Dexie EntityTable for settings storage
 * @param defaultSettings - Default values for all settings
 *
 * @returns Object with settings CRUD methods
 */
export function createSettingsHelper<T extends BaseSettings>(
  table: EntityTable<T, 'id'>,
  defaultSettings: T,
) {
  const t = table as unknown as AnyTable<T>;
  const helper = {
    async get(): Promise<T> {
      const s = await t.get(1);
      return s || { ...defaultSettings, updatedAt: new Date() };
    },

    async update(updates: Partial<Omit<T, 'id'>>) {
      const current = await helper.get();
      return t.put({
        ...current,
        ...updates,
        id: 1,
        updatedAt: new Date(),
      } as T);
    },

    async setTheme(theme: T['theme']) {
      return helper.update({ theme } as Partial<Omit<T, 'id'>>);
    },

    async setLanguage(language: T['language']) {
      return helper.update({ language } as Partial<Omit<T, 'id'>>);
    },
  };

  return helper;
}

/**
 * Creates a recent views helper for tracking browsing history
 *
 * @typeParam T - Your recent view entity type
 * @typeParam K - The name of your ID field
 * @param table - Dexie EntityTable for recent views storage
 * @param idFieldName - Name of the field that stores the item ID
 * @param maxItems - Maximum number of items to keep (default: 100)
 *
 * @returns Object with recent views methods
 */
export function createRecentViewsHelper<
  T extends BaseRecentView & Record<K, string>,
  K extends string,
>(table: EntityTable<T, 'id'>, idFieldName: K, maxItems = 100) {
  const t = table as unknown as AnyTable<T>;
  return {
    async add(itemId: string) {
      validateId(itemId, idFieldName);
      await t.where(idFieldName).equals(itemId).delete();
      const id = await t.add({
        [idFieldName]: itemId,
        viewedAt: new Date(),
      } as unknown as T);

      const count = await t.count();
      if (count > maxItems) {
        const oldest = await t.orderBy('viewedAt').first();
        if (oldest?.id !== undefined) {
          await t.delete(oldest.id);
        }
      }

      return id;
    },

    async getRecent(limit = 20) {
      return t.orderBy('viewedAt').reverse().limit(limit).toArray();
    },

    async clear() {
      return t.clear();
    },
  };
}
