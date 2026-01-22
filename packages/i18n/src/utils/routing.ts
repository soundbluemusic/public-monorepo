/**
 * i18n Routing Utilities
 *
 * URL 기반 로케일 라우팅을 위한 유틸리티 함수 모음입니다.
 *
 * ## 핵심 개념
 *
 * 이 프로젝트는 URL prefix 기반 로케일 라우팅을 사용합니다:
 * - 영어 (기본): `/entry/hello`, `/concept/addition`
 * - 한국어: `/ko/entry/hello`, `/ko/concept/addition`
 *
 * ## 중요한 주의사항
 *
 * ⚠️ **`params.locale` 사용 금지**
 *
 * routes.ts에서 `route('ko/entry/:entryId', ...)`로 정의하면
 * `ko`는 **파라미터가 아닌 고정 문자열**이므로 `params.locale`은 항상 `undefined`입니다.
 *
 * 대신 `getLocaleFromPath()`를 사용하세요:
 * - SSR loader: `getLocaleFromPath(new URL(request.url).pathname)`
 * - clientLoader: `getLocaleFromPath(window.location.pathname)`
 *
 * @module @soundblue/i18n/utils/routing
 * @see {@link https://reactrouter.com/start/framework/routing} React Router v7 Routing
 */
import { DEFAULT_LANGUAGE, type Language } from '../core/config';

/**
 * URL 경로에서 로케일(언어)을 추출합니다.
 *
 * URL pathname을 분석하여 해당 페이지의 언어를 결정합니다.
 * `/ko/` 또는 `/ko`로 시작하면 한국어, 그 외는 기본 언어(영어)를 반환합니다.
 *
 * @param pathname - URL pathname (예: `/ko/entry/hello`, `/entry/hello`)
 * @returns 감지된 로케일 (`'ko'` 또는 `'en'`)
 *
 * @example SSR loader에서 사용
 * ```typescript
 * // apps/context/app/routes/($locale).entry.$entryId.tsx
 * export async function loader({ params, request, context }) {
 *   const url = new URL(request.url);
 *   const locale = getLocaleFromPath(url.pathname);
 *   // locale: 'ko' (for /ko/entry/hello)
 *   // locale: 'en' (for /entry/hello)
 *
 *   const entry = await getEntryByIdFromD1(db, params.entryId, locale);
 *   return { entry };
 * }
 * ```
 *
 * @example clientLoader에서 사용
 * ```typescript
 * export async function clientLoader({ params, serverLoader }) {
 *   const locale = getLocaleFromPath(window.location.pathname);
 *   const entry = await getEntryByIdFromOffline(params.entryId, locale);
 *   return { entry };
 * }
 * ```
 *
 * @example 다양한 입력 예시
 * ```typescript
 * getLocaleFromPath('/ko/entry/hello')     // → 'ko'
 * getLocaleFromPath('/ko/concept/addition') // → 'ko'
 * getLocaleFromPath('/ko')                  // → 'ko'
 * getLocaleFromPath('/entry/hello')         // → 'en'
 * getLocaleFromPath('/concept/addition')    // → 'en'
 * getLocaleFromPath('/')                    // → 'en'
 * getLocaleFromPath('/korean-food')         // → 'en' (ko로 시작하지만 /ko/ 패턴 아님)
 * ```
 *
 * @see {@link isKoreanPath} 한국어 경로 확인만 필요한 경우
 * @see {@link stripLocaleFromPath} 로케일 prefix 제거
 */
export function getLocaleFromPath(pathname: string): Language {
  if (pathname.startsWith('/ko/') || pathname === '/ko') return 'ko';
  return DEFAULT_LANGUAGE;
}

/**
 * @deprecated `getLocaleFromPath`를 사용하세요. 동일한 기능이며 이름이 더 명확합니다.
 * @see {@link getLocaleFromPath}
 */
export const getLanguageFromPath = getLocaleFromPath;

/**
 * 주어진 URL 경로가 한국어 경로인지 확인합니다.
 *
 * 단순히 boolean 값만 필요할 때 `getLocaleFromPath() === 'ko'` 대신 사용합니다.
 * 내부적으로 `/ko/` prefix 또는 정확히 `/ko`인지 확인합니다.
 *
 * @param pathname - URL pathname (예: `/ko/entry/hello`)
 * @returns 한국어 경로이면 `true`, 아니면 `false`
 *
 * @example 조건부 렌더링
 * ```typescript
 * if (isKoreanPath(location.pathname)) {
 *   return <KoreanContent />;
 * }
 * return <EnglishContent />;
 * ```
 *
 * @example 다양한 입력 예시
 * ```typescript
 * isKoreanPath('/ko/entry/hello')  // → true
 * isKoreanPath('/ko')              // → true
 * isKoreanPath('/entry/hello')     // → false
 * isKoreanPath('/korean-food')     // → false (ko로 시작하지만 /ko/ 패턴 아님)
 * ```
 *
 * @see {@link getLocaleFromPath} 로케일 값이 필요한 경우
 */
export function isKoreanPath(pathname: string): boolean {
  return pathname.startsWith('/ko/') || pathname === '/ko';
}

/**
 * URL 경로에서 로케일 prefix (`/ko`)를 제거합니다.
 *
 * 로케일에 관계없이 동일한 경로를 비교하거나,
 * 네비게이션 활성 상태를 판단할 때 유용합니다.
 *
 * @param pathname - URL pathname (예: `/ko/entry/hello`)
 * @returns 로케일 prefix가 제거된 경로 (항상 `/`로 시작)
 *
 * @example 네비게이션 활성 상태 판단
 * ```typescript
 * // apps/context/app/hooks/useIsActiveRoute.ts
 * const currentPath = stripLocaleFromPath(location.pathname);
 * const targetPath = stripLocaleFromPath(to);
 * const isActive = currentPath === targetPath;
 * ```
 *
 * @example 사이드바 메뉴 하이라이트
 * ```typescript
 * // apps/roots/app/components/layout/Sidebar.tsx
 * const stripLocale = stripLocaleFromPath;
 * const isActive = stripLocale(pathname) === stripLocale(item.href);
 * ```
 *
 * @example 다양한 입력 예시
 * ```typescript
 * stripLocaleFromPath('/ko/entry/hello')  // → '/entry/hello'
 * stripLocaleFromPath('/ko/concept/add')  // → '/concept/add'
 * stripLocaleFromPath('/ko')              // → '/'
 * stripLocaleFromPath('/entry/hello')     // → '/entry/hello' (변경 없음)
 * stripLocaleFromPath('/')                // → '/' (변경 없음)
 * ```
 *
 * @see {@link buildLocalePath} 반대 작업 - 로케일 prefix 추가
 * @see {@link getLocaleFromPath} 로케일 값 추출
 */
export function stripLocaleFromPath(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3) || '/';
  if (pathname === '/ko') return '/';
  return pathname;
}

/**
 * @deprecated `stripLocaleFromPath`를 사용하세요. 동일한 기능이며 이름이 더 명확합니다.
 * @see {@link stripLocaleFromPath}
 */
export const stripLocalePrefix = stripLocaleFromPath;

/**
 * 주어진 로케일에 맞는 URL 경로를 생성합니다.
 *
 * 기본 언어(영어)인 경우 경로를 그대로 반환하고,
 * 한국어인 경우 `/ko` prefix를 추가합니다.
 *
 * @param path - 기본 경로 (예: `/entry/hello`, `/`)
 * @param locale - 대상 로케일 (`'ko'` 또는 `'en'`)
 * @returns 로케일이 적용된 경로
 *
 * @example 언어 전환 링크 생성
 * ```typescript
 * // LanguageToggle 컴포넌트에서
 * const currentPath = stripLocaleFromPath(location.pathname);
 * const koreanPath = buildLocalePath(currentPath, 'ko');
 * const englishPath = buildLocalePath(currentPath, 'en');
 *
 * return (
 *   <a href={isKorean ? englishPath : koreanPath}>
 *     {isKorean ? '🇺🇸 English' : '🇰🇷 한국어'}
 *   </a>
 * );
 * ```
 *
 * @example 다양한 입력 예시
 * ```typescript
 * buildLocalePath('/entry/hello', 'ko')  // → '/ko/entry/hello'
 * buildLocalePath('/entry/hello', 'en')  // → '/entry/hello'
 * buildLocalePath('/', 'ko')             // → '/ko'
 * buildLocalePath('/', 'en')             // → '/'
 * ```
 *
 * @see {@link stripLocaleFromPath} 반대 작업 - 로케일 prefix 제거
 * @see {@link generateI18nRoutes} 영어+한국어 경로 쌍 생성
 */
export function buildLocalePath(path: string, locale: Language): string {
  if (locale === DEFAULT_LANGUAGE) {
    return path;
  }
  return `/ko${path === '/' ? '' : path}`;
}

/**
 * 데이터 아이템 배열에서 i18n prerender 경로를 생성합니다.
 *
 * 각 아이템에 대해 영어 경로와 한국어 경로 쌍을 생성합니다.
 * 주로 `react-router.config.ts`의 `prerender()` 함수에서 동적 라우트의
 * 사전 렌더링 경로 목록을 생성할 때 사용합니다.
 *
 * @typeParam T - 아이템 타입 (예: Entry, Concept 등)
 * @param items - 경로를 생성할 아이템 배열
 * @param getPath - 각 아이템에서 영어 경로를 추출하는 함수
 * @returns 영어 + 한국어 경로 배열 (items.length * 2개)
 *
 * @example react-router.config.ts에서 사용 (Roots 앱)
 * ```typescript
 * // apps/roots/react-router.config.ts
 * import { generateI18nRoutes } from '@soundblue/i18n';
 * import { concepts } from './app/data/concepts';
 *
 * export default {
 *   ssr: true,
 *   async prerender() {
 *     const staticRoutes = extractStaticRoutes(routes);
 *     const conceptRoutes = generateI18nRoutes(
 *       concepts,
 *       (c) => `/concept/${c.id}`
 *     );
 *     // conceptRoutes: ['/concept/addition', '/ko/concept/addition', ...]
 *     return [...staticRoutes, ...conceptRoutes];
 *   },
 * };
 * ```
 *
 * @example 카테고리 경로 생성
 * ```typescript
 * const categories = [{ id: 'greetings' }, { id: 'food' }];
 * const routes = generateI18nRoutes(categories, (c) => `/category/${c.id}`);
 * // → ['/category/greetings', '/ko/category/greetings',
 * //    '/category/food', '/ko/category/food']
 * ```
 *
 * @see {@link extractStaticRoutes} 정적 라우트 자동 추출
 * @see {@link generateLocalizedPaths} 기본 경로 문자열 배열에서 생성
 */
export function generateI18nRoutes<T>(items: readonly T[], getPath: (item: T) => string): string[] {
  return items.flatMap((item) => {
    const path = getPath(item);
    return [path, `/ko${path}`];
  });
}

/**
 * 기본 경로 배열에서 로컬라이즈된 경로 쌍을 생성합니다.
 *
 * `generateI18nRoutes`와 유사하지만 아이템 객체가 아닌
 * 문자열 경로 배열을 직접 받습니다. 정적 페이지 경로 생성에 적합합니다.
 *
 * @param basePaths - 기본 경로 배열 (예: `['/about', '/contact']`)
 * @returns 영어 + 한국어 경로 배열 (basePaths.length * 2개)
 *
 * @example 정적 페이지 경로 생성
 * ```typescript
 * const staticPages = ['/about', '/privacy', '/terms'];
 * const routes = generateLocalizedPaths(staticPages);
 * // → ['/about', '/ko/about', '/privacy', '/ko/privacy', '/terms', '/ko/terms']
 * ```
 *
 * @example 루트 경로 포함
 * ```typescript
 * const pages = ['/', '/browse'];
 * const routes = generateLocalizedPaths(pages);
 * // → ['/', '/ko', '/browse', '/ko/browse']
 * ```
 *
 * @see {@link generateI18nRoutes} 데이터 아이템 배열에서 생성
 * @see {@link extractStaticRoutes} routes.ts에서 자동 추출
 */
export function generateLocalizedPaths(basePaths: string[]): string[] {
  return basePaths.flatMap((path) => {
    const enPath = path.startsWith('/') ? path : `/${path}`;
    const koPath = enPath === '/' ? '/ko' : `/ko${enPath}`;
    return [enPath, koPath];
  });
}

/**
 * React Router params에서 언어를 추출합니다.
 *
 * `($lang)` 선택적 세그먼트 패턴을 사용하는 라우트에서
 * params.lang 값을 안전하게 Language 타입으로 변환합니다.
 *
 * ⚠️ **주의**: 대부분의 경우 이 함수 대신 `getLocaleFromPath()`를 사용하세요.
 * 현재 프로젝트의 라우트 구조에서는 `params.lang`이 `undefined`인 경우가 많습니다.
 *
 * @param params - React Router params 객체 (`{ lang?: string }`)
 * @returns 감지된 로케일 (`'ko'` 또는 `'en'`)
 *
 * @example ($lang) 선택적 세그먼트 라우트
 * ```typescript
 * // routes.ts: route('($lang)/about', 'routes/($lang).about.tsx')
 * // URL: /ko/about → params.lang = 'ko'
 * // URL: /about   → params.lang = undefined
 *
 * export function loader({ params }) {
 *   const locale = getLanguageFromParams(params);
 *   // locale: 'ko' or 'en'
 * }
 * ```
 *
 * @see {@link getLocaleFromPath} URL pathname에서 추출 (권장)
 */
export function getLanguageFromParams(params: { lang?: string }): Language {
  return params.lang === 'ko' ? 'ko' : DEFAULT_LANGUAGE;
}

/**
 * React Router v7 RouteConfig 엔트리 타입
 *
 * routes.ts에서 정의하는 라우트 설정 객체의 구조입니다.
 * `extractStaticRoutes()` 함수가 이 구조를 파싱합니다.
 *
 * @see {@link https://reactrouter.com/start/framework/routing} React Router v7 Routing
 * @internal 외부에서 직접 사용하지 않습니다
 */
interface RouteConfigEntry {
  /** 라우트 경로 (예: 'entry/:entryId', 'about') */
  path?: string;
  /** index 라우트 여부 */
  index?: boolean;
  /** 라우트 파일 경로 */
  file?: string;
  /** 중첩 라우트 */
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
