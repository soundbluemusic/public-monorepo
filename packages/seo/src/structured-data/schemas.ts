/**
 * @fileoverview JSON-LD Structured Data Schemas
 * @environment build-only
 *
 * Generates Schema.org JSON-LD for SEO.
 * Returns plain objects that can be serialized to JSON.
 */

// ============================================================================
// Types
// ============================================================================

export interface WebsiteSchema {
  name: string;
  url: string;
  description?: string;
  inLanguage?: string | string[];
  potentialAction?: SearchActionSchema;
}

export interface SearchActionSchema {
  target: string;
  queryInput: string;
}

export interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ArticleSchema {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string | OrganizationSchema;
  image?: string;
  inLanguage?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ============================================================================
// JSON-LD Schema Types
// ============================================================================

/** Base JSON-LD schema with context and type */
export interface JsonLdSchema {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

/** WebSite JSON-LD schema */
export interface WebSiteJsonLd extends JsonLdSchema {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  inLanguage?: string | string[];
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

/** Organization JSON-LD schema */
export interface OrganizationJsonLd extends JsonLdSchema {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

/** BreadcrumbList JSON-LD schema */
export interface BreadcrumbListJsonLd extends JsonLdSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

/** Article JSON-LD schema */
export interface ArticleJsonLd extends JsonLdSchema {
  '@type': 'Article';
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: { '@type': 'Person' | 'Organization'; name: string; url?: string };
  image?: string;
  inLanguage?: string;
}

/** FAQPage JSON-LD schema */
export interface FAQPageJsonLd extends JsonLdSchema {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Generate Website schema
 */
export function generateWebsiteSchema(config: WebsiteSchema): WebSiteJsonLd {
  const schema: WebSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url,
  };

  if (config.description) {
    schema.description = config.description;
  }

  if (config.inLanguage) {
    schema.inLanguage = config.inLanguage;
  }

  if (config.potentialAction) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: config.potentialAction.target,
      'query-input': config.potentialAction.queryInput,
    };
  }

  return schema;
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(config: OrganizationSchema): OrganizationJsonLd {
  const schema: OrganizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: config.url,
  };

  if (config.logo) {
    schema.logo = config.logo;
  }

  if (config.sameAs && config.sameAs.length > 0) {
    schema.sameAs = config.sameAs;
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbListJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Article schema
 */
export function generateArticleSchema(config: ArticleSchema): ArticleJsonLd {
  const schema: ArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.headline,
    description: config.description,
    url: config.url,
    datePublished: config.datePublished,
  };

  if (config.dateModified) {
    schema.dateModified = config.dateModified;
  }

  if (config.author) {
    schema.author =
      typeof config.author === 'string'
        ? { '@type': 'Person' as const, name: config.author }
        : { '@type': 'Organization' as const, name: config.author.name, url: config.author.url };
  }

  if (config.image) {
    schema.image = config.image;
  }

  if (config.inLanguage) {
    schema.inLanguage = config.inLanguage;
  }

  return schema;
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(items: FAQItem[]): FAQPageJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer,
      },
    })),
  };
}

/**
 * Serialize schema to JSON-LD script tag content
 */
export function serializeSchema(schema: JsonLdSchema): string {
  return JSON.stringify(schema, null, 0);
}

/**
 * Generate JSON-LD script tag HTML
 */
export function generateJsonLdScript(schema: JsonLdSchema): string {
  return `<script type="application/ld+json">${serializeSchema(schema)}</script>`;
}
