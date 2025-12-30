/**
 * @fileoverview SEO helper functions
 * @environment build-only
 *
 * Supports Open Graph, Twitter Cards, canonical URLs, hreflang, and Schema.org JSON-LD
 */

export type MetaDescriptor =
  | { charset: string }
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { 'http-equiv': string; content: string };

export type LinkDescriptor = {
  rel: string;
  href: string;
  hreflang?: string;
};

export interface SEOMetaOptions {
  title: string;
  description: string;
  url: string;
  locale: string;
  image: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  twitterSite?: string;
  imageAlt?: string;
}

/**
 * Generates comprehensive SEO meta tags
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
  if (description.length < 50 || description.length > 160) {
    console.warn(
      `SEO Warning: Description length is ${description.length}. Recommended: 50-160 characters.`,
    );
  }

  if (title.length < 30 || title.length > 60) {
    console.warn(`SEO Warning: Title length is ${title.length}. Recommended: 30-60 characters.`);
  }

  return [
    { title },
    { name: 'description', content: description },
    ...(author ? [{ name: 'author', content: author }] : []),
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:locale', content: locale },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    ...(imageAlt ? [{ property: 'og:image:alt', content: imageAlt }] : []),
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
 */
export function generateHreflangLinks(
  pathname: string,
  baseUrl: string,
  locales: string[],
  defaultLocale = 'ko',
): LinkDescriptor[] {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  const currentLocale = cleanPath.startsWith('/ko')
    ? 'ko'
    : cleanPath.startsWith('/en')
      ? 'en'
      : defaultLocale;
  const pathWithoutLocale = cleanPath.replace(/^\/(ko|en)/, '') || '/';

  return [
    {
      rel: 'canonical',
      href: `${cleanBaseUrl}/${currentLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
    },
    ...locales.map((locale) => ({
      rel: 'alternate',
      hreflang: locale,
      href: `${cleanBaseUrl}/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
    })),
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${cleanBaseUrl}/${defaultLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
    },
  ];
}

/** Validates and sanitizes SEO strings */
export function sanitizeSEOString(str: string, maxLength = 160): string {
  return str.trim().slice(0, maxLength);
}
