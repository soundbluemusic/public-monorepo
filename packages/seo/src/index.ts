/**
 * @fileoverview SEO Package - Build-time SEO utilities
 * @environment build-only
 *
 * 100% build-only package for SEO-related functionality:
 * - TanStack Start head 팩토리
 * - Sitemap generation with hreflang
 * - Robots.txt generation
 * - JSON-LD structured data
 *
 * This package uses Node.js fs and should never be imported in client code.
 */

// Meta tag utilities (TanStack Start head 팩토리)
export {
  dynamicHeadFactory,
  dynamicHeadFactoryEn,
  dynamicHeadFactoryKo,
  generateHreflangLinks,
  generateSEOMeta,
  type HeadConfig,
  type HeadLink,
  type HeadMeta,
  headFactory,
  headFactoryEn,
  headFactoryKo,
  type LinkDescriptor,
  type LocalizedMeta,
  type MetaData,
  type MetaDescriptor,
  type SEOMetaOptions,
  sanitizeSEOString,
} from './meta';
// Robots.txt generation
export {
  generatePrivateRobots,
  generatePublicRobots,
  generateRobotsContent,
  generateRobotsTxt,
  type RobotsConfig,
  type RobotsRule,
} from './robots';
// Sitemap generation
export {
  createDynamicUrls,
  generateSitemap,
  generateSitemapIndex,
  generateSitemaps,
  generateUrlEntries,
  generateXslStylesheet,
  getLocalizedUrl,
  type SitemapConfig,
  type SitemapEntry,
  type StaticPage,
} from './sitemap';

// Structured data (JSON-LD)
export {
  type ArticleSchema,
  type BreadcrumbItem,
  type DefinedTermSchema,
  type FAQItem,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateDefinedTermSchema,
  generateFAQSchema,
  generateJsonLdScript,
  generateOrganizationSchema,
  generateSoftwareApplicationSchema,
  generateTechArticleSchema,
  generateWebsiteSchema,
  type OrganizationSchema,
  type SearchActionSchema,
  type SoftwareApplicationSchema,
  serializeSchema,
  type TechArticleSchema,
  type WebsiteSchema,
} from './structured-data';
