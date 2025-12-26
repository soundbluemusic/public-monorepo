// Re-export from @soundblue/shared (single source of truth)
export {
  // Constants
  LIMITS,
  BREAKPOINTS,
  RESERVED_NAMES,
  type ReservedName,
  // Validation
  validateId,
  isReservedName,
  isValidTheme,
  isValidLanguage,
  // Search
  sanitizeSearchQuery,
  filterBySearch,
  createSearchHandler,
} from '@soundblue/shared';

// i18n (React-specific)
export {
  type Language,
  type I18nContextType,
  languageNames,
  languageFlags,
  getLocaleFromPath,
  stripLocaleFromPath,
  buildLocalePath,
} from './i18n';

// SEO utilities
export {
  generateSEOMeta,
  generateHreflangLinks,
  generateSchemaOrg,
  sanitizeSEOString,
  type SEOMetaOptions,
  type LinkDescriptor,
  type SchemaOrgData,
  type SchemaOrgWebSite,
  type SchemaOrgArticle,
} from './seo';

// Tailwind CSS utility
export { cn } from './cn';
