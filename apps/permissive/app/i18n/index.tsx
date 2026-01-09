import type { Language } from '@soundblue/i18n';
import { getLocaleFromPath, stripLocaleFromPath } from '@soundblue/i18n';
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useLocation } from 'react-router';

// Import translation JSON files directly (Vite will bundle these at build time)
import enMessages from '../../project.inlang/messages/en.json';
import koMessages from '../../project.inlang/messages/ko.json';

// Re-export for backward compatibility
export type { Language } from '@soundblue/i18n';

/**
 * i18n 메시지 키 타입 (컴파일 타임 검증)
 */
export type MessageKey = keyof typeof enMessages;

/**
 * 타입 가드: 유효한 메시지 키인지 검증
 */
export function isMessageKey(key: string): key is MessageKey {
  return key in enMessages;
}

// Message dictionaries by locale (타입 안전)
const messages: Record<Language, Record<MessageKey, string>> = {
  en: enMessages,
  ko: koMessages as Record<MessageKey, string>,
};

interface I18nContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  /** 타입 안전한 번역 함수 */
  t: (key: MessageKey) => string;
  /** 동적 키를 위한 번역 함수 (런타임 검증) */
  tDynamic: (key: string) => string;
  isKorean: boolean;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// getLocaleFromPath and stripLocaleFromPath are now imported from @soundblue/shared

export function I18nProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);

  const value = useMemo(() => {
    const setLocale = (lang: Language) => {
      const currentPath = stripLocaleFromPath(location.pathname);
      const newPath = lang === 'en' ? currentPath : `/ko${currentPath === '/' ? '' : currentPath}`;

      // Full page navigation for locale switch
      window.location.href = newPath;
    };

    /** 타입 안전한 번역 함수 (MessageKey만 허용) */
    const t = (key: MessageKey): string => {
      return messages[locale][key];
    };

    /** 동적 키를 위한 번역 함수 (런타임 검증 + fallback) */
    const tDynamic = (key: string): string => {
      if (isMessageKey(key)) {
        return messages[locale][key];
      }
      if (key in messages.en) {
        return messages.en[key as MessageKey];
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
      tDynamic,
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
export const useTDynamic = () => useI18n().tDynamic;
