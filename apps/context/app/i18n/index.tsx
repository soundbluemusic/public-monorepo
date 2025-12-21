import { type ReactNode, createContext, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
// @ts-expect-error - Generated Paraglide messages don't have type declarations
import * as m from '~/paraglide/messages.js';

export type Language = 'ko' | 'en';

export interface UILabels {
  search: string;
  searchPlaceholder: string;
  home: string;
  browse: string;
  about: string;
  noResults: string;
  loading: string;
  korean: string;
  romanization: string;
  translation: string;
  explanation: string;
  examples: string;
  relatedWords: string;
  variations: string;
  formal: string;
  casual: string;
  short: string;
  partOfSpeech: string;
  difficulty: string;
  category: string;
  tags: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  noun: string;
  verb: string;
  adjective: string;
  adverb: string;
  particle: string;
  interjection: string;
  conjunction: string;
  pronoun: string;
  determiner: string;
  expression: string;
  copyToClipboard: string;
  copied: string;
  listenPronunciation: string;
  backToList: string;
  viewAll: string;
  heroTitle: string;
  heroSubtitle: string;
  featuredWords: string;
  browseByCategory: string;
  aboutTitle: string;
  aboutDescription: string;
  menu: string;
  more: string;
  sitemap: string;
  sitemapDescription: string;
  allCategories: string;
  allPages: string;
  searchEngineIndex: string;

  // Meta tags
  metaHomeTitle: string;
  metaHomeDescription: string;
  metaBrowseTitle: string;
  metaBrowseDescription: string;
  metaAboutTitle: string;
  metaAboutDescription: string;
  metaTermsTitle: string;
  metaPrivacyTitle: string;
  metaLicenseTitle: string;
  metaBuiltWithTitle: string;
  metaSitemapTitle: string;
  meta404Title: string;

  // Page content
  browseDescription: string;
  aboutContent: string;
  aboutContentExtra: string;
  entryNotFound: string;
  categoryNotFound: string;
  noCategoryWords: string;
  pageNotFound: string;
  pageNotFoundDescription: string;
  goHome: string;
  termsTitle: string;
  termsContent: string;
  privacyTitle: string;
  privacyContent: string;
  licenseTitle: string;
  licenseContent: string;
  builtWithTitle: string;
  builtWithDescription: string;
  wordCount: string;

  // Footer & UI
  footerCredits: string;
  footerGitHub: string;
  footerBuiltWith: string;
  privacy: string;
  terms: string;
  license: string;
}

interface I18nContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: (key: string) => string;
  isKorean: boolean;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getLocaleFromPath(pathname: string): Language {
  if (pathname.startsWith('/ko/') || pathname === '/ko') return 'ko';
  return 'en';
}

function stripLocaleFromPath(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3) || '/';
  if (pathname === '/ko') return '/';
  return pathname;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive locale directly from pathname (no memo to avoid caching issues)
  const locale = getLocaleFromPath(location.pathname);

  const value = useMemo(() => {
    const setLocale = (lang: Language) => {
      const currentPath = stripLocaleFromPath(location.pathname);
      const newPath =
        lang === 'en' ? currentPath : `/${lang}${currentPath === '/' ? '' : currentPath}`;

      // Navigate to new path with replace to avoid history clutter
      navigate(newPath, { replace: false });
    };

    const t = (key: string): string => {
      // Map message keys to Paraglide message functions
      const messageFunc = (
        m as Record<string, (inputs?: unknown, options?: { locale?: string }) => string>
      )[key];
      if (typeof messageFunc === 'function') {
        return messageFunc({}, { locale });
      }
      // Fallback to key if message function not found
      return key;
    };

    const localePath = (path: string): string => {
      return locale === 'en' ? path : `/${locale}${path === '/' ? '' : path}`;
    };

    return {
      locale,
      setLocale,
      t,
      isKorean: locale === 'ko',
      localePath,
    };
  }, [locale, location.pathname, navigate]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export const useLocale = () => useI18n().locale;
export const useT = () => useI18n().t;
