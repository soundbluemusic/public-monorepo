/**
 * @fileoverview i18n Provider Factory
 * @environment client-only
 *
 * 앱별 메시지를 주입받아 I18nProvider와 훅들을 생성하는 Factory 함수.
 * DRY 원칙: 3개 앱의 중복 i18n 코드를 단일 Factory로 통합.
 *
 * @example
 * ```tsx
 * // apps/context/app/i18n/index.tsx
 * import { createI18nProvider } from '@soundblue/i18n/react';
 * import enMessages from '../../project.inlang/messages/en.json';
 * import koMessages from '../../project.inlang/messages/ko.json';
 *
 * export type MessageKey = keyof typeof enMessages;
 *
 * export const { I18nProvider, useI18n, useLocale, useT, useTDynamic } =
 *   createI18nProvider<MessageKey>({
 *     en: enMessages,
 *     ko: koMessages as Record<MessageKey, string>,
 *   });
 * ```
 */
import { useRouterState } from '@tanstack/react-router';
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import type { Language } from '../core/config';
import { getLocaleFromPath, stripLocaleFromPath } from '../utils/routing';

/**
 * 번역 파라미터 정규식 캐시 (성능 최적화)
 * 동일 키에 대해 정규식을 재사용하여 GC 부하 감소
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
 * I18n Context 타입 (Generic MessageKey 지원)
 */
export interface I18nContextType<K extends string> {
  locale: Language;
  setLocale: (lang: Language) => void;
  /**
   * 타입 안전한 번역 함수
   * @param key - MessageKey 타입의 번역 키
   * @param params - {key} 형식의 플레이스홀더를 대체할 값
   */
  t: (key: K, params?: Record<string, string | number>) => string;
  /**
   * 동적 키를 위한 번역 함수 (런타임 검증 + fallback)
   * @param key - 문자열 키 (런타임에 검증됨)
   * @param params - {key} 형식의 플레이스홀더를 대체할 값
   */
  tDynamic: (key: string, params?: Record<string, string | number>) => string;
  isKorean: boolean;
  localePath: (path: string) => string;
}

/**
 * Factory 옵션
 */
export interface CreateI18nProviderOptions {
  /**
   * tDynamic에서 키가 현재 locale에 없을 때 영어로 fallback 할지 여부
   * @default true
   */
  enableEnglishFallback?: boolean;
}

/**
 * i18n Provider Factory
 *
 * 앱별 메시지를 주입받아 I18nProvider와 훅들을 생성합니다.
 *
 * @typeParam K - 메시지 키 타입 (앱별 MessageKey)
 * @param messages - 언어별 메시지 객체 { en: {...}, ko: {...} }
 * @param options - Factory 옵션
 * @returns I18nProvider 컴포넌트와 훅들
 */
export function createI18nProvider<K extends string>(
  messages: Record<Language, Record<K, string>>,
  options: CreateI18nProviderOptions = {},
) {
  const { enableEnglishFallback = true } = options;

  // 메시지 키 Set (런타임 검증용)
  const messageKeys = new Set(Object.keys(messages.en));

  // 타입 가드
  function isMessageKey(key: string): key is K {
    return messageKeys.has(key);
  }

  // Context 생성
  const I18nContext = createContext<I18nContextType<K> | null>(null);

  // Provider 컴포넌트
  function I18nProvider({ children }: { children: ReactNode }) {
    const routerState = useRouterState();
    const pathname = routerState.location.pathname;
    const locale = getLocaleFromPath(pathname);

    const value = useMemo(() => {
      const setLocale = (lang: Language) => {
        const currentPath = stripLocaleFromPath(pathname);
        const newPath =
          lang === 'en' ? currentPath : `/ko${currentPath === '/' ? '' : currentPath}`;
        window.location.href = newPath;
      };

      const t = (key: K, params?: Record<string, string | number>): string => {
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
        } else if (enableEnglishFallback && key in messages.en) {
          translation = messages.en[key as K];
        } else {
          return key;
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

  // 훅들
  function useI18n(): I18nContextType<K> {
    const context = useContext(I18nContext);
    if (!context) {
      throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
  }

  const useLocale = () => useI18n().locale;
  const useT = () => useI18n().t;
  const useTDynamic = () => useI18n().tDynamic;

  return {
    I18nProvider,
    useI18n,
    useLocale,
    useT,
    useTDynamic,
    isMessageKey,
  };
}
