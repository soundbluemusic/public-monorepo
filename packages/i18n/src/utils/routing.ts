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

/**
 * RouteConfig 타입 정의 (React Router v7)
 * @see https://reactrouter.com/start/framework/routing
 */
interface RouteConfigEntry {
  path?: string;
  index?: boolean;
  file?: string;
  children?: RouteConfigEntry[];
}

/**
 * routes.ts에서 정적 라우트를 자동 추출하여 prerender 경로 생성
 *
 * 동적 라우트(`:param` 포함)는 제외하고 정적 라우트만 추출합니다.
 * 단, `(:locale)?` 패턴은 선택적 로케일로 인식하여 영어/한국어 경로 쌍으로 확장합니다.
 * 동적 라우트는 별도로 데이터 기반 generateI18nRoutes()로 생성해야 합니다.
 *
 * @param routes - routes.ts에서 export한 RouteConfig 배열
 * @returns 정적 prerender 경로 배열 (영어 + 한국어)
 *
 * @example
 * ```ts
 * // routes.ts
 * export default [
 *   index('routes/_index.tsx'),
 *   route('browse', 'routes/browse.tsx'),
 *   route('(:locale)?/about', 'routes/($locale).about.tsx'), // 정적 → 확장
 *   route('entry/:entryId', 'routes/entry.$entryId.tsx'), // 동적 → 제외
 * ];
 *
 * // react-router.config.ts
 * import routes from './app/routes';
 * const staticRoutes = extractStaticRoutes(routes);
 * // → ['/', '/ko', '/browse', '/ko/browse', '/about', '/ko/about']
 * ```
 */
export function extractStaticRoutes(routes: RouteConfigEntry[], parentPath = ''): string[] {
  const result: string[] = [];

  for (const route of routes) {
    // catch-all 라우트 (*) 제외
    if (route.path === '*') continue;

    // 현재 라우트 경로 계산
    let currentPath: string;
    if (route.index) {
      currentPath = parentPath || '/';
    } else if (route.path) {
      currentPath = parentPath ? `${parentPath}/${route.path}` : `/${route.path}`;
    } else {
      currentPath = parentPath;
    }

    // (:locale)? 선택적 로케일 패턴 처리
    // 예: /(:locale)?/about → /about, /ko/about
    const optionalLocalePattern = /\/?\(:locale\)\?/g;
    if (optionalLocalePattern.test(currentPath)) {
      // 로케일 패턴 제거 후 남은 경로 확인
      const pathWithoutLocale = currentPath.replace(optionalLocalePattern, '');
      const cleanPath = pathWithoutLocale || '/';

      // 남은 경로에 다른 동적 세그먼트가 있으면 제외
      if (cleanPath.includes(':')) continue;

      // 영어 경로 + 한국어 경로 추가
      result.push(cleanPath);
      const koPath = cleanPath === '/' ? '/ko' : `/ko${cleanPath}`;
      result.push(koPath);
      continue;
    }

    // 동적 라우트 (`:param` 포함) 제외
    if (currentPath.includes(':')) continue;

    // 정적 라우트 추가 (영어 경로)
    // /ko로 시작하는 라우트는 이미 한국어 라우트이므로 그대로 추가
    if (currentPath.startsWith('/ko')) {
      result.push(currentPath);
    } else {
      // 영어 라우트 + 한국어 라우트 쌍 추가
      result.push(currentPath);
      const koPath = currentPath === '/' ? '/ko' : `/ko${currentPath}`;
      // 중복 방지: /ko 라우트가 routes.ts에 이미 정의되어 있으면 추가 안함
      if (!routes.some((r) => r.path === `ko${currentPath === '/' ? '' : currentPath}`)) {
        result.push(koPath);
      }
    }

    // 중첩 라우트 재귀 처리
    if (route.children) {
      result.push(...extractStaticRoutes(route.children, currentPath));
    }
  }

  return [...new Set(result)]; // 중복 제거
}
