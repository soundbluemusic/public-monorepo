import type { Language } from '@soundblue/shared';
import { getLocaleFromPath, stripLocaleFromPath } from '@soundblue/shared';
import { type ReactNode, createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import * as m from '~/paraglide/messages.js';
import {
  getLocale as paraglideGetLocale,
  setLocale as paraglideSetLocale,
} from '~/paraglide/runtime.js';

// Re-export for backward compatibility
export type { Language } from '@soundblue/shared';

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
  master: string;
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

/** Paraglide message function type */
type MessageFunction = (inputs?: Record<string, string | number>) => string;

interface I18nContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: (key: string) => string;
  isKorean: boolean;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// getLocaleFromPath and stripLocaleFromPath are now imported from @soundblue/shared

export function I18nProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);

  // Sync Paraglide locale with URL pathname (only in useEffect to avoid hydration mismatch)
  useEffect(() => {
    const currentParaglideLocale = paraglideGetLocale();
    if (currentParaglideLocale !== locale) {
      paraglideSetLocale(locale, { reload: false });
    }
  }, [locale]);

  const value = useMemo(() => {
    const setLocale = (lang: Language) => {
      const currentPath = stripLocaleFromPath(location.pathname);
      const newPath = lang === 'en' ? currentPath : `/ko${currentPath === '/' ? '' : currentPath}`;

      // Full page navigation to ensure Paraglide reinitializes with correct locale
      window.location.href = newPath;
    };

    const t = (key: string): string => {
      // Call Paraglide message functions directly (they use internal locale state)
      const messageFunc = (m as Record<string, MessageFunction>)[key];
      if (typeof messageFunc === 'function') {
        return messageFunc();
      }
      return key;
    };

    const localePath = (path: string): string => {
      return locale === 'en' ? path : `/ko${path === '/' ? '' : path}`;
    };

    return {
      locale,
      setLocale,
      t,
      isKorean: locale === 'ko',
      localePath,
    };
  }, [locale, location.pathname]);

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
