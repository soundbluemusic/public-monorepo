/**
 * @fileoverview RootShell Utilities
 * @environment universal
 *
 * Utility functions for creating root shell components.
 */

import type { NavigationItem, RootShellConfig, ThemeColors } from './types';

/**
 * Generate critical CSS for FOUC prevention
 *
 * @example
 * ```tsx
 * const css = createCriticalCss({
 *   light: { bgPrimary: '#faf9fc', ... },
 *   dark: { bgPrimary: '#14121c', ... },
 * });
 * <style dangerouslySetInnerHTML={{ __html: css }} />
 * ```
 */
export function createCriticalCss(colors: ThemeColors): string {
  return `
:root {
  --bg-primary: ${colors.light.bgPrimary};
  --bg-secondary: ${colors.light.bgSecondary};
  --bg-tertiary: ${colors.light.bgTertiary};
  --bg-elevated: ${colors.light.bgElevated};
  --text-primary: ${colors.light.textPrimary};
  --text-secondary: ${colors.light.textSecondary};
}
.dark {
  --bg-primary: ${colors.dark.bgPrimary};
  --bg-secondary: ${colors.dark.bgSecondary};
  --bg-tertiary: ${colors.dark.bgTertiary};
  --bg-elevated: ${colors.dark.bgElevated};
  --text-primary: ${colors.dark.textPrimary};
  --text-secondary: ${colors.dark.textSecondary};
}
html, body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
`;
}

/**
 * Create WebSite structured data schema
 */
function createWebSiteSchema(config: RootShellConfig): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.appName,
    url: config.baseUrl,
    description: config.description,
    inLanguage: config.languages,
  };

  if (config.searchUrlTemplate) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: config.searchUrlTemplate.replace('{search_term}', '{search_term_string}'),
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

/**
 * Create Organization structured data schema
 */
function createOrganizationSchema(baseUrl: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SoundBlue Music',
    url: 'https://soundbluemusic.com',
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://www.youtube.com/@SoundBlueMusic',
      'https://x.com/SoundBlueMusic',
      'https://www.instagram.com/soundbluemusic/',
      'https://www.threads.com/@soundbluemusic',
    ],
  };
}

/**
 * Create ItemList (SiteNavigationElement) structured data schema
 */
function createNavigationSchema(baseUrl: string, items: NavigationItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Main Navigation',
    url: baseUrl,
    itemListElement: items.map((item, index) => ({
      '@type': 'SiteNavigationElement',
      position: index + 1,
      name: item.name,
      url: `${baseUrl}${item.path}`,
    })),
  };
}

/**
 * Generate JSON-LD structured data for SEO
 *
 * @example
 * ```tsx
 * const jsonLd = createStructuredData(config);
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
 * ```
 */
export function createStructuredData(config: RootShellConfig): string {
  const schemas = [
    createWebSiteSchema(config),
    createOrganizationSchema(config.baseUrl),
    createNavigationSchema(config.baseUrl, config.navigationItems),
  ];

  return JSON.stringify(schemas);
}

/**
 * Generate head meta tags from config
 *
 * @example
 * ```ts
 * head: () => ({
 *   meta: createHeadMeta(config),
 *   links: createHeadLinks(config),
 * }),
 * ```
 */
export function createHeadMeta(config: RootShellConfig): Array<Record<string, string>> {
  const meta: Array<Record<string, string>> = [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'color-scheme', content: 'light dark' },
    { name: 'theme-color', content: config.themeColor },
  ];

  // Open Graph 기본 태그 (페이지별 og:title/description은 head-factory에서 생성)
  meta.push({ property: 'og:type', content: 'website' });
  meta.push({ property: 'og:site_name', content: config.appName });
  if (config.ogImage) {
    meta.push({ property: 'og:image', content: config.ogImage });
    meta.push({ name: 'twitter:image', content: config.ogImage });
    meta.push({ name: 'twitter:card', content: 'summary_large_image' });
  } else {
    meta.push({ name: 'twitter:card', content: 'summary' });
  }
  if (config.twitterSite) {
    meta.push({ name: 'twitter:site', content: config.twitterSite });
  }

  if (config.siteVerification?.naver) {
    meta.push({ name: 'naver-site-verification', content: config.siteVerification.naver });
  }
  if (config.siteVerification?.google) {
    meta.push({ name: 'google-site-verification', content: config.siteVerification.google });
  }
  if (config.siteVerification?.bing) {
    meta.push({ name: 'msvalidate.01', content: config.siteVerification.bing });
  }

  return meta;
}

/**
 * Common head links
 */
export function createHeadLinks(
  faviconPath = '/favicon.ico',
  manifestPath = '/manifest.json',
): Array<Record<string, string>> {
  return [
    { rel: 'icon', href: faviconPath },
    { rel: 'manifest', href: manifestPath },
  ];
}

/**
 * Detect language from pathname
 *
 * @example
 * ```ts
 * const lang = detectLanguage('/ko/entry/hello'); // 'ko'
 * const lang = detectLanguage('/entry/hello'); // 'en'
 * ```
 */
export function detectLanguage(pathname: string, defaultLang = 'en'): string {
  if (pathname.startsWith('/ko')) return 'ko';
  if (pathname.startsWith('/ja')) return 'ja';
  return defaultLang;
}
