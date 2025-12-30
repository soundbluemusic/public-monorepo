/**
 * @fileoverview Meta Tag Utilities
 * @environment build-only
 */
export {
  dynamicMetaFactory,
  type LocalizedMeta,
  type MetaData,
  metaFactory,
} from './factory';
export {
  generateHreflangLinks,
  generateSEOMeta,
  type LinkDescriptor,
  type MetaDescriptor,
  type SEOMetaOptions,
  sanitizeSEOString,
} from './seo';
