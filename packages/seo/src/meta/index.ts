/**
 * @fileoverview Meta Tag Utilities
 * @environment build-only
 */

// TanStack Start head 팩토리
export {
  dynamicHeadFactory,
  dynamicHeadFactoryEn,
  dynamicHeadFactoryKo,
  type HeadConfig,
  type HeadLink,
  type HeadMeta,
  headFactory,
  headFactoryEn,
  headFactoryKo,
  type LocalizedMeta,
  type MetaData,
} from './head-factory';

// SEO 유틸리티
export {
  generateHreflangLinks,
  generateSEOMeta,
  type LinkDescriptor,
  type MetaDescriptor,
  type SEOMetaOptions,
  sanitizeSEOString,
} from './seo';
