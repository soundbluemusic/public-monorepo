/**
 * i18n utilities for URL-based locale routing
 */

export type Language = 'ko' | 'en';

export interface I18nContextType<T extends Record<string, string>> {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: <K extends keyof T>(key: K) => string;
  isKorean: boolean;
  isEnglish: boolean;
  localePath: (path: string) => string;
}

export const languageNames: Record<Language, { native: string; english: string }> = {
  ko: { native: '한국어', english: 'Korean' },
  en: { native: 'English', english: 'English' },
};

export const languageFlags: Record<Language, string> = {
  ko: 'KR',
  en: 'EN',
};

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
