import type { Language } from '@soundblue/i18n';
import { getLocaleFromPath, stripLocaleFromPath } from '@soundblue/i18n';
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useLocation } from 'react-router';

// Import translation JSON files directly (Vite will bundle these at build time)
import enMessages from '../../project.inlang/messages/en.json';
import koMessages from '../../project.inlang/messages/ko.json';

/** 번역 키 타입 (compile-time 검증) */
export type MessageKey = keyof typeof enMessages;

/** 타입 가드: MessageKey 검증 */
export function isMessageKey(key: string): key is MessageKey {
  return key in enMessages;
}

// 정규식 캐시: 매번 new RegExp 생성 방지
const paramRegexCache = new Map<string, RegExp>();
function getParamRegex(key: string): RegExp {
  let regex = paramRegexCache.get(key);
  if (!regex) {
    regex = new RegExp(`\\{${key}\\}`, 'g');
    paramRegexCache.set(key, regex);
  }
  return regex;
}

// Re-export for backward compatibility
export type { Language } from '@soundblue/i18n';

// Message dictionaries by locale
const messages: Record<Language, Record<MessageKey, string>> = {
  en: enMessages,
  ko: koMessages as Record<MessageKey, string>,
};

interface I18nContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  /** 타입 안전한 번역 함수 (컴파일 타임 검증) */
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
  /** 런타임 문자열 키용 번역 함수 */
  tDynamic: (key: string, params?: Record<string, string | number>) => string;
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

    // 타입 안전한 번역 함수
    const t = (key: MessageKey, params?: Record<string, string | number>): string => {
      const dict = messages[locale];
      let translation = dict[key];
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          translation = translation.replace(getParamRegex(k), String(v));
        }
      }
      return translation;
    };

    // 런타임 문자열 키용 번역 함수
    const tDynamic = (key: string, params?: Record<string, string | number>): string => {
      if (!isMessageKey(key)) return key;
      return t(key, params);
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
