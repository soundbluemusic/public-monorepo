/**
 * I18n Provider
 *
 * React Context 기반 다국어 지원
 */
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import type { Language, Messages, TranslationParams } from '../core/config';
import { buildLocalePath, getLanguageFromParams } from '../utils/routing';

interface I18nContextValue {
  lang: Language;
  isKorean: boolean;
  t: (key: string, params?: TranslationParams) => string;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

interface I18nProviderProps {
  lang: Language;
  messages: Messages;
  children: ReactNode;
}

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
