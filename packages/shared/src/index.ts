/**
 * @soundblue/shared - Shared utilities for Soundblue monorepo
 *
 * @remarks
 * ⛔ **HARDCODING PROHIBITION (하드코딩 절대 금지)**
 *
 * NEVER use magic numbers or hardcoded values. ALWAYS use exported constants.
 *
 * @example
 * ```typescript
 * // ❌ NEVER
 * if (id.length > 100) throw new Error('Too long');
 *
 * // ✅ ALWAYS
 * import { LIMITS } from '@soundblue/shared';
 * if (id.length > LIMITS.ID_LENGTH) throw new Error('Too long');
 * ```
 *
 * @packageDocumentation
 */

// Constants
export { LIMITS, BREAKPOINTS, RESERVED_NAMES, type ReservedName } from './constants';

// Validation utilities
export {
  validateId,
  isReservedName,
  isValidTheme,
  isValidLanguage,
} from './validation';

// Search utilities
export {
  sanitizeSearchQuery,
  filterBySearch,
  createSearchHandler,
} from './search';

// i18n utilities
export {
  type Language,
  type I18nContextType,
  languageNames,
  languageFlags,
  getLocaleFromPath,
  stripLocaleFromPath,
  buildLocalePath,
} from './i18n';

// DB helpers
export {
  type BaseFavorite,
  type BaseSettings,
  type BaseRecentView,
  type FavoritesHelper,
  type SettingsHelper,
  type RecentViewsHelper,
  createFavoritesHelper,
  createSettingsHelper,
  createRecentViewsHelper,
} from './db';

// Data loader utilities are in a separate entry point
// Import from '@soundblue/shared/node' for Node.js-only utilities
// Example: import { loadJsonDirectory } from '@soundblue/shared/node'
