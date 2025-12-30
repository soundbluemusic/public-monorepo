/**
 * @fileoverview Platform Package - Environment-specific implementations
 *
 * This package provides platform-specific implementations with dual exports:
 * - Browser: Full implementation using IndexedDB
 * - Build/SSR: Noop implementation that returns empty values
 *
 * The bundler automatically selects the correct implementation based on the
 * "browser" condition in package.json exports.
 *
 * @example
 * ```typescript
 * import { storage } from '@soundblue/platform/storage';
 *
 * const favorites = storage.createFavoritesStorage('my-app');
 * await favorites.set('item-1', { id: 'item-1', addedAt: Date.now() });
 * ```
 */

// Re-export types (these work in both environments)
export type {
  FavoriteItem,
  RecentViewItem,
  SettingsData,
  StorageAdapter,
  StorageFactory,
} from './storage/types';
