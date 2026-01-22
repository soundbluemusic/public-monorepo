/**
 * @fileoverview Meta Tag Utilities
 * @environment build-only
 */

// React Router v7 meta 팩토리 (기존)
export {
  dynamicMetaFactory,
  type LocalizedMeta,
  type MetaData,
  metaFactory,
} from './factory';

// TanStack Start head 팩토리 (신규)
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
