/**
 * i18n Routing Utilities
 *
 * URL 기반 로케일 라우팅
 */
import { DEFAULT_LANGUAGE, type Language } from '../core/config';

/**
 * URL 경로에서 로케일 추출
 */
export function getLocaleFromPath(pathname: string): Language {
  if (pathname.startsWith('/ko/') || pathname === '/ko') return 'ko';
  return DEFAULT_LANGUAGE;
}

/** @deprecated Use getLocaleFromPath instead */
export const getLanguageFromPath = getLocaleFromPath;

/**
 * 한국어 경로인지 확인
 */
export function isKoreanPath(pathname: string): boolean {
  return pathname.startsWith('/ko/') || pathname === '/ko';
}

/**
 * URL 경로에서 로케일 프리픽스 제거
 */
export function stripLocaleFromPath(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3) || '/';
  if (pathname === '/ko') return '/';
  return pathname;
}

/** @deprecated Use stripLocaleFromPath instead */
export const stripLocalePrefix = stripLocaleFromPath;

/**
 * 로케일에 맞는 경로 생성
 */
export function buildLocalePath(path: string, locale: Language): string {
  if (locale === DEFAULT_LANGUAGE) {
    return path;
  }
  return `/ko${path === '/' ? '' : path}`;
}

/**
 * 아이템 배열에서 i18n prerender 라우트 생성
 */
export function generateI18nRoutes<T>(items: readonly T[], getPath: (item: T) => string): string[] {
  return items.flatMap((item) => {
    const path = getPath(item);
    return [path, `/ko${path}`];
  });
}

/**
 * ($lang) 선택적 세그먼트를 지원하는 라우트 생성
 */
export function generateLocalizedPaths(basePaths: string[]): string[] {
  return basePaths.flatMap((path) => {
    const enPath = path.startsWith('/') ? path : `/${path}`;
    const koPath = enPath === '/' ? '/ko' : `/ko${enPath}`;
    return [enPath, koPath];
  });
}

/**
 * React Router params에서 언어 추출
 * ($lang) 선택적 세그먼트 패턴 지원
 */
export function getLanguageFromParams(params: { lang?: string }): Language {
  return params.lang === 'ko' ? 'ko' : DEFAULT_LANGUAGE;
}
