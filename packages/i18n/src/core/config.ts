/**
 * i18n Configuration
 *
 * 지원 언어 및 기본 설정
 */

export const SUPPORTED_LANGUAGES = ['en', 'ko'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';

export function isValidLanguage(lang: string): lang is Language {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);
}

/** 언어 이름 */
export const languageNames: Record<Language, { native: string; english: string }> = {
  ko: { native: '한국어', english: 'Korean' },
  en: { native: 'English', english: 'English' },
};

/** 언어 플래그 (국가 코드) */
export const languageFlags: Record<Language, string> = {
  ko: 'KR',
  en: 'EN',
};

/** 번역 메시지 타입 */
export type Messages = Record<string, string>;

/** 번역 파라미터 타입 */
export type TranslationParams = Record<string, string>;
