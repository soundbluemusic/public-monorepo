/**
 * @fileoverview i18n 공통 타입 정의
 */

/**
 * 지원 언어 타입
 */
export type Language = 'ko' | 'en';

/**
 * i18n 컨텍스트 타입
 */
export interface I18nContextType<T extends Record<string, string>> {
  /** 현재 로케일 반환 함수 */
  locale: () => Language;
  /** 로케일 변경 (URL 네비게이션 발생) */
  setLocale: (lang: Language) => void;
  /** 타입 안전한 번역 함수 */
  t: <K extends keyof T>(key: K) => string;
  /** 현재 한국어인지 여부 */
  isKorean: () => boolean;
  /** 현재 영어인지 여부 */
  isEnglish: () => boolean;
  /** 현재 로케일에 맞는 경로 생성 */
  localePath: (path: string) => string;
}

/**
 * 언어별 표시 이름
 */
export const languageNames: Record<Language, { native: string; english: string }> = {
  ko: { native: '한국어', english: 'Korean' },
  en: { native: 'English', english: 'English' },
};

/**
 * 언어별 국가 코드
 */
export const languageFlags: Record<Language, string> = {
  ko: 'KR',
  en: 'EN',
};
