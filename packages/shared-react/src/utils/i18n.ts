/**
 * i18n utilities for URL-based locale routing
 *
 * Re-exports from @soundblue/shared for convenience
 */

// Re-export types and constants from shared package (Single Source of Truth)
export type { Language, I18nContextType } from '@soundblue/shared';
export { languageNames, languageFlags } from '@soundblue/shared';

// Import Language for use in functions below
import type { Language } from '@soundblue/shared';

/**
 * Extract locale from URL path
 */
export function getLocaleFromPath(pathname: string): Language {
  if (pathname.startsWith('/ko/') || pathname === '/ko') return 'ko';
  return 'en';
}

/**
 * Remove locale prefix from URL path
 */
export function stripLocaleFromPath(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3) || '/';
  if (pathname === '/ko') return '/';
  return pathname;
}

/**
 * Build locale-prefixed path
 */
export function buildLocalePath(path: string, locale: Language): string {
  if (locale === 'en') {
    return path;
  }
  return `/ko${path === '/' ? '' : path}`;
}
