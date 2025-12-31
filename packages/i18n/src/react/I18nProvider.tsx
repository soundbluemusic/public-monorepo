/**
 * @fileoverview I18n Provider
 * @environment client-only
 *
 * React Context 기반 다국어(i18n) 지원 시스템.
 * 번역 함수, 언어 감지, 로케일 경로 생성을 제공합니다.
 *
 * @example
 * ```tsx
 * // App.tsx
 * import { I18nProvider, useI18n } from '@soundblue/i18n/react';
 * import { messages } from './messages';
 *
 * function App({ lang }) {
 *   return (
 *     <I18nProvider lang={lang} messages={messages[lang]}>
 *       <Header />
 *       <Content />
 *     </I18nProvider>
 *   );
 * }
 *
 * // Header.tsx
 * function Header() {
 *   const { t, isKorean, localePath } = useI18n();
 *   return (
 *     <nav>
 *       <a href={localePath('/about')}>{t('nav.about')}</a>
 *       {isKorean && <span>🇰🇷</span>}
 *     </nav>
 *   );
 * }
 * ```
 */
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import type { Language, Messages, TranslationParams } from '../core/config';
import { buildLocalePath, getLanguageFromParams } from '../utils/routing';

/**
 * I18n Context 값 타입
 *
 * useI18n 훅이 반환하는 값의 타입입니다.
 */
export interface I18nContextValue {
  /** 현재 언어 코드 ('en' | 'ko') */
  lang: Language;
  /** 현재 언어가 한국어인지 여부 */
  isKorean: boolean;
  /**
   * 번역 함수
   *
   * @param key - 번역 키 (예: 'nav.home', 'error.notFound')
   * @param params - 치환 파라미터 (예: { count: 5 })
   * @returns 번역된 문자열 (키가 없으면 키 자체 반환)
   */
  t: (key: string, params?: TranslationParams) => string;
  /**
   * 로케일 경로 생성 함수
   *
   * @param path - 기본 경로 (예: '/about')
   * @returns 로케일이 포함된 경로 (예: '/ko/about')
   */
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * I18n 컨텍스트 훅
 *
 * 번역 함수와 언어 정보에 접근합니다.
 * I18nProvider 내부에서만 사용 가능합니다.
 *
 * @returns I18n 컨텍스트 값 (lang, isKorean, t, localePath)
 * @throws I18nProvider 외부에서 호출 시 에러
 *
 * @example
 * ```tsx
 * function WelcomeMessage() {
 *   const { t, lang } = useI18n();
 *
 *   return (
 *     <h1>
 *       {t('welcome.title')} {/* "Welcome" or "환영합니다" *}
 *       <span>({lang})</span>
 *     </h1>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 파라미터 치환
 * function ItemCount({ count }: { count: number }) {
 *   const { t } = useI18n();
 *   // messages: { 'items.count': '{count}개의 아이템' }
 *   return <span>{t('items.count', { count: String(count) })}</span>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 로케일 경로 생성
 * function Navigation() {
 *   const { localePath, isKorean } = useI18n();
 *
 *   return (
 *     <nav>
 *       <a href={localePath('/')}>Home</a>
 *       <a href={localePath('/about')}>About</a>
 *       {isKorean && <span>한국어 버전</span>}
 *     </nav>
 *   );
 * }
 * ```
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

/**
 * I18nProvider 속성
 */
export interface I18nProviderProps {
  /** 현재 언어 코드 */
  lang: Language;
  /** 번역 메시지 객체 */
  messages: Messages;
  /** 자식 컴포넌트 */
  children: ReactNode;
}

/**
 * I18n Provider 컴포넌트
 *
 * 앱 전체에 다국어 지원을 제공하는 Context Provider입니다.
 * 번역 함수, 언어 감지, 로케일 경로 생성 기능을 자식 컴포넌트에 제공합니다.
 *
 * @param props - Provider 속성
 * @param props.lang - 현재 언어 코드 ('en' | 'ko')
 * @param props.messages - 현재 언어의 번역 메시지 객체
 * @param props.children - 자식 컴포넌트
 *
 * @example
 * ```tsx
 * // root.tsx
 * import { I18nProvider } from '@soundblue/i18n/react';
 * import { getLanguageFromParams } from '@soundblue/i18n';
 * import { messages } from './i18n/messages';
 *
 * export default function Root() {
 *   const { lang } = useParams();
 *   const language = getLanguageFromParams(lang);
 *
 *   return (
 *     <I18nProvider lang={language} messages={messages[language]}>
 *       <html lang={language}>
 *         <body>
 *           <Outlet />
 *         </body>
 *       </html>
 *     </I18nProvider>
 *   );
 * }
 * ```
 */
export function I18nProvider({ lang, messages, children }: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      isKorean: lang === 'ko',
      t: (key: string, params?: TranslationParams) => {
        let text = messages[key] || key;
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, v);
          });
        }
        return text;
      },
      localePath: (path: string) => buildLocalePath(path, lang),
    }),
    [lang, messages],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// Re-export from routing for convenience
export { getLanguageFromParams };
