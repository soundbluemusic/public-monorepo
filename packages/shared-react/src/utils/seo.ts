/**
 * @fileoverview SEO helper functions for generating meta tags and structured data
 * Supports Open Graph, Twitter Cards, canonical URLs, hreflang, and Schema.org JSON-LD
 */

import type { MetaDescriptor } from 'react-router';

/**
 * Options for generating SEO meta tags
 */
export interface SEOMetaOptions {
  /** Page title (30-60 characters recommended) */
  title: string;
  /** Page description (50-160 characters recommended) */
  description: string;
  /** Full URL of the page */
  url: string;
  /** Locale (e.g., 'ko_KR', 'en_US') */
  locale: string;
  /** Full URL to Open Graph image (1200x630px recommended) */
  image: string;
  /** Open Graph type (default: 'website') */
  type?: 'website' | 'article' | 'profile';
  /** Author name (optional) */
  author?: string;
  /** Twitter handle (optional, e.g., '@soundbluemusic') */
  twitterSite?: string;
  /** Image alt text (optional) */
  imageAlt?: string;
}

/**
 * Link descriptor for hreflang and canonical
 */
export interface LinkDescriptor {
  rel: string;
  hreflang?: string;
  href: string;
}

/**
 * Schema.org data types
 */
export interface SchemaOrgWebSite {
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  inLanguage?: string | string[];
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface SchemaOrgArticle {
  '@type': 'Article';
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': 'Person';
    name: string;
  };
  image?: string;
}

export type SchemaOrgData = SchemaOrgWebSite | SchemaOrgArticle;

/**
 * Generates comprehensive SEO meta tags (Open Graph, Twitter Card, basic meta)
 * @param options - SEO meta options
 * @returns Array of meta descriptors for React Router
 * @example
 * ```ts
 * export const meta: MetaFunction = () => {
 *   return generateSEOMeta({
 *     title: 'Roots - Math Documentation',
 *     description: 'Learn math concepts easily - From Pythagorean theorem to calculus',
 *     url: 'https://roots.soundbluemusic.com/ko',
 *     locale: 'ko_KR',
 *     image: 'https://roots.soundbluemusic.com/og-image.png',
 *   });
 * };
 * ```
 */
export function generateSEOMeta({
  title,
  description,
  url,
  locale,
  image,
  type = 'website',
  author,
  twitterSite,
  imageAlt,
}: SEOMetaOptions): MetaDescriptor[] {
  // Validate description length
  if (description.length < 50 || description.length > 160) {
    console.warn(
      `SEO Warning: Description length is ${description.length}. Recommended: 50-160 characters.`
    );
  }

  // Validate title length
  if (title.length < 30 || title.length > 60) {
    console.warn(`SEO Warning: Title length is ${title.length}. Recommended: 30-60 characters.`);
  }

  return [
    // Basic meta tags
    { title },
    { name: 'description', content: description },
    ...(author ? [{ name: 'author', content: author }] : []),

    // Open Graph
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:locale', content: locale },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    ...(imageAlt ? [{ property: 'og:image:alt', content: imageAlt }] : []),

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    ...(imageAlt ? [{ name: 'twitter:image:alt', content: imageAlt }] : []),
    ...(twitterSite ? [{ name: 'twitter:site', content: twitterSite }] : []),
  ];
}

/**
 * Generates hreflang link tags and canonical URL
 * @param pathname - Current path without locale prefix (e.g., '/about')
 * @param baseUrl - Base URL of the site (e.g., 'https://roots.soundbluemusic.com')
 * @param locales - Array of supported locales (e.g., ['ko', 'en'])
 * @param defaultLocale - Default locale for x-default (default: 'ko')
 * @returns Array of link descriptors for React Router
 * @example
 * ```ts
 * export const links: LinksFunction = () => {
 *   return generateHreflangLinks(
 *     '/about',
 *     'https://roots.soundbluemusic.com',
 *     ['ko', 'en']
 *   );
 * };
 * ```
 */
export function generateHreflangLinks(
  pathname: string,
  baseUrl: string,
  locales: string[],
  defaultLocale = 'ko'
): LinkDescriptor[] {
  // Remove trailing slash
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  // Canonical URL (current page)
  const currentLocale = cleanPath.startsWith('/ko') ? 'ko' : cleanPath.startsWith('/en') ? 'en' : defaultLocale;
  const pathWithoutLocale = cleanPath.replace(/^\/(ko|en)/, '') || '/';

  return [
    // Canonical URL
    {
      rel: 'canonical',
      href: `${cleanBaseUrl}/${currentLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
    },

    // Hreflang for each locale
    ...locales.map((locale) => ({
      rel: 'alternate',
      hreflang: locale,
      href: `${cleanBaseUrl}/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
    })),

    // x-default (fallback)
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${cleanBaseUrl}/${defaultLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
    },
  ];
}

/**
 * Generates Schema.org JSON-LD structured data
 * @param data - Schema.org data object
 * @returns JSON-LD string ready for script tag
 * @example
 * ```tsx
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{
 *     __html: generateSchemaOrg({
 *       '@type': 'WebSite',
 *       name: 'Roots - Math Documentation',
 *       url: 'https://roots.soundbluemusic.com',
 *       description: 'Learn math concepts easily',
 *       inLanguage: ['ko', 'en'],
 *     }),
 *   }}
 * />
 * ```
 */
export function generateSchemaOrg(data: SchemaOrgData): string {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      ...data,
    },
    null,
    0 // Minified
  );
}

/**
 * Validates and sanitizes SEO strings
 * @param str - Input string
 * @param maxLength - Maximum length (default: 160)
 * @returns Sanitized string
 */
export function sanitizeSEOString(str: string, maxLength = 160): string {
  return str.trim().slice(0, maxLength);
}
