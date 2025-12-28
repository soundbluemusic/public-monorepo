/**
 * Preload Hints Utilities for React Router v7
 *
 * Use these utilities with the `links` export in route modules to preload/prefetch resources.
 *
 * @example
 * ```tsx
 * // In a route module
 * import { prefetchLink, preloadImage, preconnect } from '@soundblue/shared-react';
 *
 * export const links = () => [
 *   prefetchLink('/api/popular-entries'),
 *   preloadImage('/images/hero.webp'),
 *   preconnect('https://fonts.googleapis.com'),
 * ];
 * ```
 */

export interface PreloadLinkDescriptor {
  rel: string;
  href: string;
  as?: string;
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Create a prefetch link for a resource that may be needed for navigation
 */
export function prefetchLink(href: string): PreloadLinkDescriptor {
  return {
    rel: 'prefetch',
    href,
  };
}

/**
 * Create a preload link for a critical resource
 */
export function preloadLink(
  href: string,
  as: 'script' | 'style' | 'image' | 'font' | 'fetch',
  options?: { type?: string; crossOrigin?: PreloadLinkDescriptor['crossOrigin'] },
): PreloadLinkDescriptor {
  return {
    rel: 'preload',
    href,
    as,
    ...options,
  };
}

/**
 * Preload an image resource
 */
export function preloadImage(
  href: string,
  options?: { fetchPriority?: PreloadLinkDescriptor['fetchPriority'] },
): PreloadLinkDescriptor {
  return {
    rel: 'preload',
    href,
    as: 'image',
    ...options,
  };
}

/**
 * Preload a font resource
 */
export function preloadFont(href: string, type = 'font/woff2'): PreloadLinkDescriptor {
  return {
    rel: 'preload',
    href,
    as: 'font',
    type,
    crossOrigin: 'anonymous',
  };
}

/**
 * Preload a stylesheet
 */
export function preloadStyle(href: string): PreloadLinkDescriptor {
  return {
    rel: 'preload',
    href,
    as: 'style',
  };
}

/**
 * Preload a script
 */
export function preloadScript(href: string): PreloadLinkDescriptor {
  return {
    rel: 'preload',
    href,
    as: 'script',
  };
}

/**
 * Preconnect to an origin to speed up future requests
 */
export function preconnect(
  href: string,
  options?: { crossOrigin?: PreloadLinkDescriptor['crossOrigin'] },
): PreloadLinkDescriptor {
  return {
    rel: 'preconnect',
    href,
    ...options,
  };
}

/**
 * DNS prefetch for an origin
 */
export function dnsPrefetch(href: string): PreloadLinkDescriptor {
  return {
    rel: 'dns-prefetch',
    href,
  };
}

/**
 * Modulepreload for ES modules
 */
export function modulePreload(href: string): PreloadLinkDescriptor {
  return {
    rel: 'modulepreload',
    href,
  };
}

/**
 * Generate common preconnect links for popular services
 */
export const COMMON_PRECONNECTS = {
  googleFonts: () => [
    preconnect('https://fonts.googleapis.com'),
    preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' }),
  ],
  cloudflare: () => [preconnect('https://cdnjs.cloudflare.com', { crossOrigin: 'anonymous' })],
  jsdelivr: () => [preconnect('https://cdn.jsdelivr.net', { crossOrigin: 'anonymous' })],
} as const;

/**
 * Create links for preloading next page resources
 *
 * @example
 * ```tsx
 * export const links = () => [
 *   ...createNavigationPreloads(['/entry/hello', '/entry/world']),
 * ];
 * ```
 */
export function createNavigationPreloads(paths: string[]): PreloadLinkDescriptor[] {
  return paths.map((path) => prefetchLink(path));
}
