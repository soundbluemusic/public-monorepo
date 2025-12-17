/**
 * @fileoverview IndexedDB Database Layer for Context App
 *
 * This module provides a type-safe database abstraction layer using Dexie.js
 * for persistent client-side storage. It manages three main data entities:
 *
 * - **Favorites**: Bookmarked vocabulary entries for quick access
 * - **Study Records**: Learning history with accuracy tracking
 * - **Settings**: User preferences (theme, language, font size)
 *
 * All database operations are asynchronous and return Promises.
 * Entry IDs are validated to prevent prototype pollution attacks.
 *
 * @module lib/db
 *
 * @example Basic usage
 * ```typescript
 * import { favorites, studyRecords, settings } from '~/lib/db';
 *
 * // Add a favorite
 * await favorites.add('entry-123');
 *
 * // Record a study session
 * await studyRecords.add('entry-123', true);
 *
 * // Get user settings
 * const userSettings = await settings.get();
 * ```
 */

import Dexie, { type EntityTable } from "dexie";
import { validateId } from "@soundblue/shared";

/**
 * Represents a bookmarked vocabulary entry.
 *
 * Favorites allow users to save entries for quick access later.
 * Each favorite is linked to an entry by its ID and timestamped
 * when added.
 *
 * @interface FavoriteEntry
 * @property {number} [id] - Auto-generated primary key (managed by Dexie)
 * @property {string} entryId - Reference to the vocabulary entry ID
 * @property {Date} addedAt - Timestamp when the entry was favorited
 */
export interface FavoriteEntry {
  id?: number;
  entryId: string;
  addedAt: Date;
}

/**
 * Represents a single study session record for a vocabulary entry.
 *
 * Study records track the user's learning progress over time,
 * including whether they answered correctly. This data is used
 * to calculate accuracy statistics and identify areas for improvement.
 *
 * @interface StudyRecord
 * @property {number} [id] - Auto-generated primary key (managed by Dexie)
 * @property {string} entryId - Reference to the studied vocabulary entry ID
 * @property {Date} studiedAt - Timestamp when the study session occurred
 * @property {boolean} correct - Whether the user answered correctly
 */
export interface StudyRecord {
  id?: number;
  entryId: string;
  studiedAt: Date;
  correct: boolean;
}

/**
 * Represents user preferences and application settings.
 *
 * This is a singleton record (always id=1) that stores user preferences.
 * If no settings exist, defaults are returned by the `settings.get()` method.
 *
 * @interface UserSettings
 * @property {number} id - Always 1 (singleton pattern)
 * @property {'light' | 'dark' | 'system'} theme - Color theme preference
 *   - `'light'`: Force light mode
 *   - `'dark'`: Force dark mode
 *   - `'system'`: Follow OS/browser preference
 * @property {'ko' | 'en' | 'ja'} language - UI language preference
 *   - `'ko'`: Korean
 *   - `'en'`: English
 *   - `'ja'`: Japanese
 * @property {'small' | 'medium' | 'large'} fontSize - Text size preference
 * @property {Date} updatedAt - Timestamp of last settings modification
 */
export interface UserSettings {
  id: number;
  theme: "light" | "dark" | "system";
  language: "ko" | "en" | "ja";
  fontSize: "small" | "medium" | "large";
  updatedAt: Date;
}

/**
 * Typed Dexie database class for the Context application.
 *
 * @internal
 * @class ContextDatabase
 * @extends Dexie
 *
 * @description
 * Database schema (version 1):
 * - `favorites`: `++id, entryId, addedAt` (auto-increment id, indexed entryId and addedAt)
 * - `studyRecords`: `++id, entryId, studiedAt` (auto-increment id, indexed entryId and studiedAt)
 * - `settings`: `id` (primary key only, singleton record)
 */
class ContextDatabase extends Dexie {
  favorites!: EntityTable<FavoriteEntry, "id">;
  studyRecords!: EntityTable<StudyRecord, "id">;
  settings!: EntityTable<UserSettings, "id">;

  constructor() {
    super("ContextDB");
    this.version(1).stores({
      favorites: "++id, entryId, addedAt",
      studyRecords: "++id, entryId, studiedAt",
      settings: "id",
    });
  }
}

/**
 * The singleton database instance.
 *
 * @description
 * Direct database access is available for advanced use cases,
 * but the helper objects (`favorites`, `studyRecords`, `settings`)
 * are recommended for most operations.
 *
 * @example Direct table access
 * ```typescript
 * import { db } from '~/lib/db';
 *
 * // Advanced query using Dexie API directly
 * const recentFavorites = await db.favorites
 *   .where('addedAt')
 *   .above(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
 *   .toArray();
 * ```
 */
const db = new ContextDatabase();

export { db };

/**
 * Favorites management API.
 *
 * Provides methods for managing bookmarked vocabulary entries.
 * All methods validate entry IDs to prevent prototype pollution attacks.
 *
 * @namespace favorites
 *
 * @example Managing favorites
 * ```typescript
 * import { favorites } from '~/lib/db';
 *
 * // Add to favorites
 * const id = await favorites.add('entry-123');
 *
 * // Check if favorited
 * const isFav = await favorites.isFavorite('entry-123'); // true
 *
 * // Toggle favorite status
 * const newStatus = await favorites.toggle('entry-123'); // false (removed)
 *
 * // Get all favorites (most recent first)
 * const allFavorites = await favorites.getAll();
 *
 * // Get count
 * const count = await favorites.count();
 * ```
 */
export const favorites = {
  /**
   * Adds an entry to favorites.
   *
   * If the entry is already a favorite, returns the existing record's ID
   * without creating a duplicate.
   *
   * @param {string} entryId - The vocabulary entry ID to favorite
   * @returns {Promise<number | undefined>} The favorite record's primary key
   * @throws {Error} If entryId is empty, not a string, exceeds 100 characters,
   *   or is a reserved JavaScript property name
   *
   * @example
   * ```typescript
   * const favoriteId = await favorites.add('greeting-hello');
   * console.log(`Added with ID: ${favoriteId}`);
   *
   * // Adding again returns the same ID (no duplicate)
   * const sameId = await favorites.add('greeting-hello');
   * console.log(favoriteId === sameId); // true
   * ```
   */
  async add(entryId: string) {
    validateId(entryId, "entryId");
    const exists = await db.favorites.where("entryId").equals(entryId).first();
    if (exists) return exists.id;
    return db.favorites.add({ entryId, addedAt: new Date() });
  },

  /**
   * Removes an entry from favorites.
   *
   * @param {string} entryId - The vocabulary entry ID to remove
   * @returns {Promise<number>} The number of records deleted (0 or 1)
   * @throws {Error} If entryId is empty, not a string, exceeds 100 characters,
   *   or is a reserved JavaScript property name
   *
   * @example
   * ```typescript
   * const deletedCount = await favorites.remove('greeting-hello');
   * console.log(`Removed ${deletedCount} favorite(s)`);
   * ```
   */
  async remove(entryId: string) {
    validateId(entryId, "entryId");
    return db.favorites.where("entryId").equals(entryId).delete();
  },

  /**
   * Toggles the favorite status of an entry.
   *
   * If the entry is currently a favorite, removes it and returns `false`.
   * If not a favorite, adds it and returns `true`.
   *
   * @param {string} entryId - The vocabulary entry ID to toggle
   * @returns {Promise<boolean>} `true` if now favorited, `false` if removed
   * @throws {Error} If entryId is empty, not a string, exceeds 100 characters,
   *   or is a reserved JavaScript property name
   *
   * @example
   * ```typescript
   * // First toggle: adds to favorites
   * const isNowFavorite = await favorites.toggle('greeting-hello');
   * console.log(isNowFavorite); // true
   *
   * // Second toggle: removes from favorites
   * const stillFavorite = await favorites.toggle('greeting-hello');
   * console.log(stillFavorite); // false
   * ```
   */
  async toggle(entryId: string) {
    validateId(entryId, "entryId");
    const exists = await db.favorites.where("entryId").equals(entryId).first();
    if (exists) {
      await db.favorites.delete(exists.id!);
      return false;
    }
    await db.favorites.add({ entryId, addedAt: new Date() });
    return true;
  },

  /**
   * Checks if an entry is currently favorited.
   *
   * @param {string} entryId - The vocabulary entry ID to check
   * @returns {Promise<boolean>} `true` if favorited, `false` otherwise
   * @throws {Error} If entryId is empty, not a string, exceeds 100 characters,
   *   or is a reserved JavaScript property name
   *
   * @example
   * ```typescript
   * const isFavorite = await favorites.isFavorite('greeting-hello');
   * if (isFavorite) {
   *   console.log('This entry is bookmarked!');
   * }
   * ```
   */
  async isFavorite(entryId: string) {
    validateId(entryId, "entryId");
    const exists = await db.favorites.where("entryId").equals(entryId).first();
    return !!exists;
  },

  /**
   * Retrieves all favorite entries.
   *
   * Results are sorted by `addedAt` in descending order (most recent first).
   *
   * @returns {Promise<FavoriteEntry[]>} Array of all favorite entries
   *
   * @example
   * ```typescript
   * const allFavorites = await favorites.getAll();
   * console.log(`You have ${allFavorites.length} favorites`);
   *
   * // Display favorites with their entry details
   * for (const fav of allFavorites) {
   *   const entry = getEntryById(fav.entryId);
   *   console.log(`${entry?.term} - added ${fav.addedAt.toLocaleDateString()}`);
   * }
   * ```
   */
  async getAll() {
    return db.favorites.orderBy("addedAt").reverse().toArray();
  },

  /**
   * Returns the total number of favorite entries.
   *
   * @returns {Promise<number>} The count of favorites
   *
   * @example
   * ```typescript
   * const totalFavorites = await favorites.count();
   * console.log(`Total favorites: ${totalFavorites}`);
   * ```
   */
  async count() {
    return db.favorites.count();
  },
};

/**
 * Study records management API.
 *
 * Provides methods for tracking learning progress and calculating
 * study statistics. Each record represents a single study attempt
 * for a vocabulary entry.
 *
 * @namespace studyRecords
 *
 * @example Tracking study progress
 * ```typescript
 * import { studyRecords } from '~/lib/db';
 *
 * // Record a correct answer
 * await studyRecords.add('entry-123', true);
 *
 * // Record an incorrect answer
 * await studyRecords.add('entry-123', false);
 *
 * // Get statistics for an entry
 * const stats = await studyRecords.getStats('entry-123');
 * console.log(`Accuracy: ${stats.accuracy.toFixed(1)}%`);
 *
 * // Get recent study history
 * const recent = await studyRecords.getRecent(10);
 * ```
 */
export const studyRecords = {
  /**
   * Records a study attempt for a vocabulary entry.
   *
   * @param {string} entryId - The vocabulary entry ID that was studied
   * @param {boolean} correct - Whether the user answered correctly
   * @returns {Promise<number>} The new record's primary key
   * @throws {Error} If entryId is empty, not a string, exceeds 100 characters,
   *   or is a reserved JavaScript property name
   *
   * @example
   * ```typescript
   * // User answered correctly
   * await studyRecords.add('greeting-hello', true);
   *
   * // User answered incorrectly
   * await studyRecords.add('greeting-hello', false);
   * ```
   */
  async add(entryId: string, correct: boolean) {
    validateId(entryId, "entryId");
    return db.studyRecords.add({
      entryId,
      studiedAt: new Date(),
      correct,
    });
  },

  /**
   * Retrieves all study records for a specific entry.
   *
   * Returns records in database order (insertion order).
   * Use this for detailed analysis of study history for a single entry.
   *
   * @param {string} entryId - The vocabulary entry ID to query
   * @returns {Promise<StudyRecord[]>} Array of study records for the entry
   * @throws {Error} If entryId is empty, not a string, exceeds 100 characters,
   *   or is a reserved JavaScript property name
   *
   * @example
   * ```typescript
   * const records = await studyRecords.getByEntry('greeting-hello');
   * console.log(`Studied ${records.length} times`);
   *
   * // Show study timeline
   * for (const record of records) {
   *   const status = record.correct ? 'Correct' : 'Incorrect';
   *   console.log(`${record.studiedAt.toLocaleString()}: ${status}`);
   * }
   * ```
   */
  async getByEntry(entryId: string) {
    validateId(entryId, "entryId");
    return db.studyRecords.where("entryId").equals(entryId).toArray();
  },

  /**
   * Retrieves the most recent study records across all entries.
   *
   * Results are sorted by `studiedAt` in descending order (most recent first).
   *
   * @param {number} [limit=50] - Maximum number of records to return
   * @returns {Promise<StudyRecord[]>} Array of recent study records
   *
   * @example
   * ```typescript
   * // Get last 10 study sessions
   * const recent = await studyRecords.getRecent(10);
   *
   * // Display recent activity
   * for (const record of recent) {
   *   const entry = getEntryById(record.entryId);
   *   const status = record.correct ? 'Correct' : 'Wrong';
   *   console.log(`${entry?.term}: ${status}`);
   * }
   * ```
   */
  async getRecent(limit = 50) {
    return db.studyRecords.orderBy("studiedAt").reverse().limit(limit).toArray();
  },

  /**
   * Calculates study statistics for a specific entry.
   *
   * @param {string} entryId - The vocabulary entry ID to get stats for
   * @returns {Promise<{total: number, correct: number, accuracy: number}>}
   *   An object containing:
   *   - `total`: Total number of study attempts
   *   - `correct`: Number of correct answers
   *   - `accuracy`: Percentage of correct answers (0-100), or 0 if no attempts
   * @throws {Error} If entryId is empty, not a string, exceeds 100 characters,
   *   or is a reserved JavaScript property name
   *
   * @example
   * ```typescript
   * const stats = await studyRecords.getStats('greeting-hello');
   *
   * if (stats.total > 0) {
   *   console.log(`Studied ${stats.total} times`);
   *   console.log(`Got ${stats.correct} correct`);
   *   console.log(`Accuracy: ${stats.accuracy.toFixed(1)}%`);
   * } else {
   *   console.log('Not studied yet');
   * }
   *
   * // Use accuracy for progress indicators
   * if (stats.accuracy >= 80) {
   *   console.log('Mastered!');
   * } else if (stats.accuracy >= 50) {
   *   console.log('Learning...');
   * } else {
   *   console.log('Needs more practice');
   * }
   * ```
   */
  async getStats(entryId: string) {
    validateId(entryId, "entryId");
    const records = await db.studyRecords
      .where("entryId")
      .equals(entryId)
      .toArray();
    const total = records.length;
    const correct = records.filter((r) => r.correct).length;
    return {
      total,
      correct,
      accuracy: total > 0 ? (correct / total) * 100 : 0,
    };
  },
};

/**
 * User settings management API.
 *
 * Provides methods for reading and updating user preferences.
 * Settings use a singleton pattern (single record with id=1).
 * If no settings exist, default values are returned.
 *
 * @namespace settings
 *
 * @example Managing user preferences
 * ```typescript
 * import { settings } from '~/lib/db';
 *
 * // Get current settings (with defaults if not set)
 * const userSettings = await settings.get();
 * console.log(`Theme: ${userSettings.theme}`);
 * console.log(`Language: ${userSettings.language}`);
 *
 * // Update multiple settings at once
 * await settings.update({ theme: 'dark', fontSize: 'large' });
 *
 * // Use convenience methods for single updates
 * await settings.setTheme('light');
 * await settings.setLanguage('en');
 * await settings.setFontSize('medium');
 * ```
 */
export const settings = {
  /**
   * Retrieves current user settings.
   *
   * If no settings have been saved, returns default values:
   * - `theme`: `'system'`
   * - `language`: `'ko'`
   * - `fontSize`: `'medium'`
   *
   * @returns {Promise<UserSettings>} The current settings object
   *
   * @example
   * ```typescript
   * const settings = await settings.get();
   *
   * // Apply theme
   * if (settings.theme === 'dark') {
   *   document.documentElement.classList.add('dark');
   * } else if (settings.theme === 'system') {
   *   // Check OS preference
   *   if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
   *     document.documentElement.classList.add('dark');
   *   }
   * }
   * ```
   */
  async get(): Promise<UserSettings> {
    const s = await db.settings.get(1);
    return (
      s || {
        id: 1,
        theme: "system",
        language: "ko",
        fontSize: "medium",
        updatedAt: new Date(),
      }
    );
  },

  /**
   * Updates user settings with partial data.
   *
   * Merges the provided updates with current settings and automatically
   * updates the `updatedAt` timestamp.
   *
   * @param {Partial<Omit<UserSettings, 'id'>>} updates - Settings to update
   * @returns {Promise<number>} The settings record's primary key (always 1)
   *
   * @example
   * ```typescript
   * // Update single setting
   * await settings.update({ theme: 'dark' });
   *
   * // Update multiple settings
   * await settings.update({
   *   theme: 'light',
   *   language: 'en',
   *   fontSize: 'large'
   * });
   * ```
   */
  async update(updates: Partial<Omit<UserSettings, "id">>) {
    const current = await this.get();
    return db.settings.put({
      ...current,
      ...updates,
      id: 1,
      updatedAt: new Date(),
    });
  },

  /**
   * Sets the color theme preference.
   *
   * Convenience method for updating only the theme setting.
   *
   * @param {'light' | 'dark' | 'system'} theme - The theme to set
   *   - `'light'`: Force light mode
   *   - `'dark'`: Force dark mode
   *   - `'system'`: Follow OS/browser preference
   * @returns {Promise<number>} The settings record's primary key (always 1)
   *
   * @example
   * ```typescript
   * // Set to dark mode
   * await settings.setTheme('dark');
   *
   * // Follow system preference
   * await settings.setTheme('system');
   * ```
   */
  async setTheme(theme: UserSettings["theme"]) {
    return this.update({ theme });
  },

  /**
   * Sets the UI language preference.
   *
   * Convenience method for updating only the language setting.
   * Note: This affects UI language, not the vocabulary content language.
   *
   * @param {'ko' | 'en' | 'ja'} language - The language to set
   *   - `'ko'`: Korean
   *   - `'en'`: English
   *   - `'ja'`: Japanese
   * @returns {Promise<number>} The settings record's primary key (always 1)
   *
   * @example
   * ```typescript
   * // Switch to English UI
   * await settings.setLanguage('en');
   *
   * // Switch to Japanese UI
   * await settings.setLanguage('ja');
   * ```
   */
  async setLanguage(language: UserSettings["language"]) {
    return this.update({ language });
  },

  /**
   * Sets the text size preference.
   *
   * Convenience method for updating only the font size setting.
   *
   * @param {'small' | 'medium' | 'large'} fontSize - The font size to set
   * @returns {Promise<number>} The settings record's primary key (always 1)
   *
   * @example
   * ```typescript
   * // Increase text size for accessibility
   * await settings.setFontSize('large');
   *
   * // Reset to default
   * await settings.setFontSize('medium');
   * ```
   */
  async setFontSize(fontSize: UserSettings["fontSize"]) {
    return this.update({ fontSize });
  },
};
