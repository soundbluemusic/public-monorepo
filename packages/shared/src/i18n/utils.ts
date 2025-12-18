/**
 * @fileoverview i18n 유틸리티 함수
 *
 * URL 기반 로케일 라우팅을 위한 공통 유틸리티입니다.
 *
 * @example
 * ```ts
 * import { getLocaleFromPath, stripLocaleFromPath } from '@soundblue/shared/i18n';
 *
 * getLocaleFromPath('/ko/browse')  // 'ko'
 * getLocaleFromPath('/browse')     // 'en'
 *
 * stripLocaleFromPath('/ko/browse')  // '/browse'
 * stripLocaleFromPath('/ko')         // '/'
 * ```
 */
import type { Language } from './types';

/**
 * URL 경로에서 로케일 추출
 *
 * @param pathname - URL 경로 (예: '/ko/browse', '/word/hello')
 * @returns 추출된 로케일 ('ko' | 'en')
 *
 * @example
 * getLocaleFromPath('/ko/browse')  // 'ko'
 * getLocaleFromPath('/browse')     // 'en'
 */
export function getLocaleFromPath(pathname: string): Language {
  if (pathname.startsWith('/ko/') || pathname === '/ko') return 'ko';
  return 'en'; // Default is English (no prefix)
}

/**
 * URL 경로에서 로케일 프리픽스 제거
 *
 * @param pathname - 로케일이 포함된 URL 경로
 * @returns 로케일이 제거된 순수 경로
 *
 * @example
 * stripLocaleFromPath('/ko/browse')  // '/browse'
 * stripLocaleFromPath('/ko')         // '/'
 * stripLocaleFromPath('/browse')     // '/browse'
 */
export function stripLocaleFromPath(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3) || '/';
  if (pathname === '/ko') return '/';
  return pathname;
}

/**
 * 로케일에 맞는 경로 생성
 *
 * @param path - 원본 경로
 * @param locale - 현재 로케일
 * @returns 로케일이 포함된 경로
 *
 * @example
 * buildLocalePath('/browse', 'ko')  // '/ko/browse'
 * buildLocalePath('/browse', 'en')  // '/browse'
 * buildLocalePath('/', 'ko')        // '/ko'
 */
export function buildLocalePath(path: string, locale: Language): string {
  if (locale === 'en') {
    return path;
  }
  return `/ko${path === '/' ? '' : path}`;
}
