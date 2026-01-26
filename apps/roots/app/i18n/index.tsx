/**
 * @fileoverview Roots App i18n (TanStack Router 버전)
 *
 * TanStack Start의 useRouterState()를 사용하는 로컬 Provider.
 * 앱별 메시지 파일을 사용하므로 공유 패키지와 분리.
 */

import type { Language } from '@soundblue/i18n';
import { getLocaleFromPath, stripLocaleFromPath } from '@soundblue/i18n';
import { useRouterState } from '@tanstack/react-router';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

import enMessages from '../../project.inlang/messages/en.json';
import koMessages from '../../project.inlang/messages/ko.json';

// Re-export for backward compatibility
export type { Language } from '@soundblue/i18n';

/**
 * 번역 키 타입 (compile-time 검증)
 */
export type MessageKey = keyof typeof enMessages;

const messages: Record<Language, Record<MessageKey, string>> = {
  en: enMessages,
  ko: koMessages as Record<MessageKey, string>,
};

/**
 * 번역 파라미터 정규식 캐시 (성능 최적화)
 */
const paramRegexCache = new Map<string, RegExp>();
function getParamRegex(key: string): RegExp {
  let regex = paramRegexCache.get(key);
  if (!regex) {
    regex = new RegExp(`\\{${key}\\}`, 'g');
    paramRegexCache.set(key, regex);
  }
  return regex;
}

/**
 * I18n Context 타입
 */
export interface I18nContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
  tDynamic: (key: string, params?: Record<string, string | number>) => string;
  isKorean: boolean;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// 메시지 키 Set (런타임 검증용)
const messageKeys = new Set(Object.keys(enMessages));

function isMessageKey(key: string): key is MessageKey {
  return messageKeys.has(key);
}

/**
 * I18n Provider (TanStack Router 버전)
 *
 * useRouterState()를 사용하여 현재 경로에서 locale을 추출합니다.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const locale = getLocaleFromPath(pathname);

  const value = useMemo(() => {
    const setLocale = (lang: Language) => {
      const currentPath = stripLocaleFromPath(pathname);
      const newPath = lang === 'en' ? currentPath : `/ko${currentPath === '/' ? '' : currentPath}`;
      window.location.href = newPath;
    };

    const t = (key: MessageKey, params?: Record<string, string | number>): string => {
      let translation = messages[locale][key];
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          translation = translation.replace(getParamRegex(k), String(v));
        }
      }
      return translation;
    };

    const tDynamic = (key: string, params?: Record<string, string | number>): string => {
      let translation: string;

      if (isMessageKey(key)) {
        translation = messages[locale][key];
      } else {
        return key; // Roots는 영어 fallback 없이 key 반환
      }

      if (params) {
        for (const [k, v] of Object.entries(params)) {
          translation = translation.replace(getParamRegex(k), String(v));
        }
      }
      return translation;
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
  }, [locale, pathname]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * i18n 훅
 */
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export const useLocale = () => useI18n().locale;
export const useT = () => useI18n().t;
export const useTDynamic = () => useI18n().tDynamic;
export { isMessageKey };
