/**
 * @fileoverview Utils exports
 * @environment universal
 */

// Re-export from seo/meta
export {
  generateHreflangLinks,
  generateSEOMeta,
  type LinkDescriptor,
  type SEOMetaOptions,
  sanitizeSEOString,
} from '@soundblue/seo/meta';

// Re-export from seo/structured-data
export {
  type ArticleSchema,
  generateArticleSchema,
  generateWebsiteSchema,
  type WebsiteSchema,
} from '@soundblue/seo/structured-data';

// Re-export from @soundblue/shared (single source of truth)
export {
  BREAKPOINTS,
  createSearchHandler,
  filterBySearch,
  isReservedName,
  isValidLanguage,
  isValidTheme,
  // Constants
  LIMITS,
  RESERVED_NAMES,
  type ReservedName,
  // Search
  sanitizeSearchQuery,
  // Validation
  validateId,
} from '@soundblue/shared';

// Re-export from ui
export {
  COMMON_PRECONNECTS,
  cn,
  createNavigationPreloads,
  dnsPrefetch,
  modulePreload,
  type PreloadLinkDescriptor,
  preconnect,
  prefetchLink,
  preloadFont,
  preloadImage,
  preloadLink,
  preloadScript,
  preloadStyle,
} from '@soundblue/ui/utils';

// Local exports (i18n - React-specific)
export {
  buildLocalePath,
  getLocaleFromPath,
  type I18nContextType,
  type Language,
  languageFlags,
  languageNames,
  stripLocaleFromPath,
} from './i18n';
