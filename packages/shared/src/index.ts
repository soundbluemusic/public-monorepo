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
