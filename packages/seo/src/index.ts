/**
 * @fileoverview SEO Package - Build-time SEO utilities
 * @environment build-only
 *
 * 100% build-only package for SEO-related functionality:
 * - Meta tag generation for React Router v7
 * - Sitemap generation with hreflang
 * - Robots.txt generation
 * - JSON-LD structured data
 *
 * This package uses Node.js fs and should never be imported in client code.
 */

// Meta tag utilities
export {
  dynamicMetaFactory,
  generateHreflangLinks,
  generateSEOMeta,
  type LinkDescriptor,
  type LocalizedMeta,
  type MetaData,
  type MetaDescriptor,
  metaFactory,
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
  generateUrlEntry,
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
