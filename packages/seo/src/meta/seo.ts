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
 *
 * URL 구조:
 * - 영어 (기본): /entry/xxx (prefix 없음)
 * - 한국어: /ko/entry/xxx
 *
 * @param pathname - 현재 페이지 경로 (예: /entry/hello 또는 /ko/entry/hello)
 * @param baseUrl - 사이트 기본 URL (예: https://context.soundbluemusic.com)
 * @returns canonical + hreflang link 태그 배열
 */
export function generateHreflangLinks(pathname: string, baseUrl: string): LinkDescriptor[] {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  // 현재 로케일 감지: /ko로 시작하면 한국어, 아니면 영어
  const isKorean = cleanPath.startsWith('/ko');

  // 로케일 prefix 제거하여 순수 경로 추출
  const pathWithoutLocale = isKorean ? cleanPath.replace(/^\/ko/, '') || '/' : cleanPath;

  // 각 언어별 URL 생성
  // 영어: prefix 없음 (기본 언어)
  // 한국어: /ko prefix
  const enUrl = pathWithoutLocale === '/' ? cleanBaseUrl : `${cleanBaseUrl}${pathWithoutLocale}`;
  const koUrl =
    pathWithoutLocale === '/' ? `${cleanBaseUrl}/ko` : `${cleanBaseUrl}/ko${pathWithoutLocale}`;

  // 현재 페이지의 canonical URL
  const canonicalUrl = isKorean ? koUrl : enUrl;

  return [
    // Canonical: 현재 페이지 자기 자신
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
    // hreflang: 영어 버전
    {
      rel: 'alternate',
      hreflang: 'en',
      href: enUrl,
    },
    // hreflang: 한국어 버전
    {
      rel: 'alternate',
      hreflang: 'ko',
      href: koUrl,
    },
    // x-default: 기본 언어 (영어)
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: enUrl,
    },
  ];
}

/** Validates and sanitizes SEO strings */
export function sanitizeSEOString(str: string, maxLength = 160): string {
  return str.trim().slice(0, maxLength);
}
