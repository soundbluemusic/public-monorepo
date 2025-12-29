/**
 * @soundblue/shared - Shared utilities for Soundblue monorepo
 *
 * @deprecated This package is being migrated to modular packages.
 * Please import from the following packages instead:
 * - @soundblue/core - Utils, validation, types
 * - @soundblue/i18n - i18n utilities
 * - @soundblue/search - Search utilities
 * - @soundblue/data - Data schemas and loaders
 *
 * @packageDocumentation
 */

// ============================================================
// Re-exports from @soundblue/core
// ============================================================
export {
  BREAKPOINTS,
  isNonEmptyString,
  isReservedName,
  isValidLanguage,
  isValidTheme,
  LIMITS,
  RESERVED_NAMES,
  type ReservedName,
  validateId,
} from '@soundblue/core/validation';

// ============================================================
// Re-exports from @soundblue/i18n
// ============================================================
export {
  buildLocalePath,
  DEFAULT_LANGUAGE,
  dynamicMetaFactory,
  generateI18nRoutes,
  generateLocalizedPaths,
  getLanguageFromParams,
  getLanguageFromPath,
  getLocaleFromPath,
  isKoreanPath,
  type Language,
  type LocalizedMeta,
  languageFlags,
  languageNames,
  type Messages,
  type MetaData,
  metaFactory,
  SUPPORTED_LANGUAGES,
  stripLocaleFromPath,
  stripLocalePrefix,
  type TranslationParams,
} from '@soundblue/i18n';

// ============================================================
// Re-exports from @soundblue/search
// ============================================================
export {
  createSearchHandler,
  filterBySearch,
  highlightMatch,
  type SearchableItem,
  type SearchConfig,
  SearchEngine,
  type SearchResult,
  sanitizeSearchQuery,
} from '@soundblue/search';

// ============================================================
// Local exports (not yet migrated)
// ============================================================

// Dark mode utilities for SSG apps
export {
  DARK_MODE_DUAL_ICONS_CSS,
  DARK_MODE_ICONS_CSS,
  DARK_MODE_INIT_SCRIPT,
  DARK_MODE_TOGGLE_SCRIPT,
  DARK_MODE_TOGGLE_SCRIPT_CSS,
  DARK_MODE_TOGGLE_SCRIPT_DUAL,
  MOON_ICON_SVG,
  SUN_ICON_SVG,
} from './dark-mode';

// DB helpers
export {
  type BaseFavorite,
  type BaseRecentView,
  type BaseSettings,
  createFavoritesHelper,
  createRecentViewsHelper,
  createSettingsHelper,
  type FavoritesHelper,
  type RecentViewsHelper,
  type SettingsHelper,
} from './db';

// Legacy i18n (for backward compatibility with extractStaticRoutes)
export { extractStaticRoutes, type I18nContextType } from './i18n';
