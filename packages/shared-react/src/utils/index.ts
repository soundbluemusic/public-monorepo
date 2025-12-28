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
// Tailwind CSS utility
export { cn } from './cn';
// i18n (React-specific)
export {
  buildLocalePath,
  getLocaleFromPath,
  type I18nContextType,
  type Language,
  languageFlags,
  languageNames,
  stripLocaleFromPath,
} from './i18n';
// Preload hints
export {
  COMMON_PRECONNECTS,
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
} from './preload';
// SEO utilities
export {
  generateHreflangLinks,
  generateSchemaOrg,
  generateSEOMeta,
  type LinkDescriptor,
  type SchemaOrgArticle,
  type SchemaOrgData,
  type SchemaOrgWebSite,
  type SEOMetaOptions,
  sanitizeSEOString,
} from './seo';
