/**
 * @fileoverview TanStack Start head 함수 팩토리
 * @environment build-only
 *
 * TanStack Start의 head 속성을 위한 팩토리 함수입니다.
 * React Router v7의 meta 함수와 유사하지만 TanStack Start 형식에 맞게 변환합니다.
 */

/** Meta 데이터 타입 */
export interface MetaData {
  title: string;
  description?: string;
  /** 키워드 (Google은 무시하지만 Bing/Yandex 등에서 참고 가능) */
  keywords?: string[];
}

/** 다국어 Meta 데이터 타입 */
export interface LocalizedMeta {
  ko: MetaData;
  en: MetaData;
}

/**
 * TanStack Start head meta 타입
 */
export type HeadMeta =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { charSet: string }
  | { httpEquiv: string; content: string };

/**
 * TanStack Start head link 타입
 */
export type HeadLink = {
  rel: string;
  href: string;
  hrefLang?: string;
};

/**
 * TanStack Start HeadConfig 타입
 */
export interface HeadConfig {
  meta?: HeadMeta[];
  links?: HeadLink[];
}

/**
 * RouteMatch 부분 타입 (router-core RouteMatch.pathname 사용)
 */
interface MinimalRouteMatch {
  pathname: string;
}

/**
 * head 함수 인자 타입 (TanStack Start AssetFnContextOptions 호환)
 *
 * 주의: TanStack Start의 head ctx에는 `location`이 없고 `match`/`matches`만 있음.
 * 이전 버전에서 location.pathname을 가정하던 코드가 모두 home pathname으로
 * 폴백되는 버그가 있어, match.pathname을 사용하도록 수정.
 */
interface HeadFunctionArgs {
  loaderData?: unknown;
  match?: MinimalRouteMatch;
  matches?: ReadonlyArray<MinimalRouteMatch>;
  location?: { pathname: string };
}

/**
 * 동적 head 함수 인자 타입
 */
interface DynamicHeadFunctionArgs<T> {
  loaderData?: T;
  match?: MinimalRouteMatch;
  matches?: ReadonlyArray<MinimalRouteMatch>;
  location?: { pathname: string };
}

/**
 * head ctx에서 현재 pathname을 안전하게 추출.
 * 우선순위: match.pathname → matches 마지막 → location.pathname → '/'
 */
function resolvePathname(
  ctx?: {
    match?: MinimalRouteMatch;
    matches?: ReadonlyArray<MinimalRouteMatch>;
    location?: { pathname: string };
  },
  fallback = '/',
): string {
  if (!ctx) return fallback;
  if (ctx.match?.pathname) return ctx.match.pathname;
  if (ctx.matches && ctx.matches.length > 0) {
    const last = ctx.matches[ctx.matches.length - 1];
    if (last?.pathname) return last.pathname;
  }
  if (ctx.location?.pathname) return ctx.location.pathname;
  return fallback;
}

/**
 * loaderData가 존재하는지 검증하고 타입을 좁혀 반환합니다.
 *
 * TanStack Start의 AssetFnContextOptions에서 loaderData는 optional로 선언되지만,
 * loader가 정의된 라우트에서 head 함수가 호출될 때는 항상 존재합니다.
 * 이 함수는 런타임에 해당 불변 조건을 검증합니다.
 *
 * @internal
 */
function requireLoaderData<T>(ctx: DynamicHeadFunctionArgs<T>): T {
  if (ctx.loaderData == null) {
    throw new Error('loaderData is required for dynamic head factory');
  }
  return ctx.loaderData;
}

/**
 * SEO URL 계산 (canonical, en, ko)
 *
 * @param pathname - 현재 경로
 * @param baseUrl - 기본 URL (trailing slash 없이)
 * @param trailingSlash - trailing slash 추가 여부 (Cloudflare Workers Assets 호환)
 */
function computeSeoUrls(
  pathname: string,
  baseUrl: string,
  trailingSlash = false,
): { canonical: string; en: string; ko: string } {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  let cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  // Trailing slash 정규화 (루트 경로 제외)
  if (cleanPath !== '/' && cleanPath !== '/ko') {
    if (trailingSlash && !cleanPath.endsWith('/')) {
      cleanPath = `${cleanPath}/`;
    } else if (!trailingSlash && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1);
    }
  }

  const isKorean = cleanPath.startsWith('/ko');
  const pathWithoutLocale = isKorean ? cleanPath.replace(/^\/ko/, '') || '/' : cleanPath;

  const en = pathWithoutLocale === '/' ? cleanBaseUrl : `${cleanBaseUrl}${pathWithoutLocale}`;
  const ko =
    pathWithoutLocale === '/' ? `${cleanBaseUrl}/ko` : `${cleanBaseUrl}/ko${pathWithoutLocale}`;

  return { canonical: isKorean ? ko : en, en, ko };
}

/**
 * SEO 링크 태그 생성 (canonical + hreflang)
 */
function generateSeoLinks(pathname: string, baseUrl: string, trailingSlash = false): HeadLink[] {
  const urls = computeSeoUrls(pathname, baseUrl, trailingSlash);

  return [
    { rel: 'canonical', href: urls.canonical },
    { rel: 'alternate', hrefLang: 'en', href: urls.en },
    { rel: 'alternate', hrefLang: 'ko', href: urls.ko },
    { rel: 'alternate', hrefLang: 'x-default', href: urls.en },
  ];
}

/**
 * Head Factory 공통 옵션
 */
export interface HeadFactoryOptions {
  /**
   * URL에 trailing slash 추가 여부
   * - true: /concept/addition/ (Cloudflare Workers Assets 호환)
   * - false: /concept/addition (기본값)
   */
  trailingSlash?: boolean;
}

/**
 * OG 메타 태그 추가 옵션
 */
interface OgMetaOptions {
  /** 현재 페이지의 정규화된 URL (og:url) */
  url?: string;
  /** 현재 로케일 (og:locale) */
  locale?: 'en' | 'ko';
}

/**
 * MetaData를 HeadMeta 배열로 변환
 */
function metaDataToHeadMeta(meta: MetaData, options?: OgMetaOptions): HeadMeta[] {
  const result: HeadMeta[] = [{ title: meta.title }];

  if (meta.description) {
    result.push({ name: 'description', content: meta.description });
  }

  if (meta.keywords && meta.keywords.length > 0) {
    result.push({ name: 'keywords', content: meta.keywords.join(', ') });
  }

  // Open Graph
  result.push({ property: 'og:title', content: meta.title });
  if (meta.description) {
    result.push({ property: 'og:description', content: meta.description });
  }
  result.push({ property: 'og:type', content: 'website' });
  if (options?.url) {
    result.push({ property: 'og:url', content: options.url });
  }
  if (options?.locale) {
    const ogLocale = options.locale === 'ko' ? 'ko_KR' : 'en_US';
    const ogLocaleAlt = options.locale === 'ko' ? 'en_US' : 'ko_KR';
    result.push({ property: 'og:locale', content: ogLocale });
    result.push({ property: 'og:locale:alternate', content: ogLocaleAlt });
  }

  // Twitter Card
  result.push({ name: 'twitter:card', content: 'summary' });
  result.push({ name: 'twitter:title', content: meta.title });
  if (meta.description) {
    result.push({ name: 'twitter:description', content: meta.description });
  }

  return result;
}

/**
 * TanStack Start head 함수 팩토리 (정적 페이지용)
 *
 * @example
 * ```tsx
 * export const Route = createFileRoute('/about')({
 *   head: headFactory(
 *     {
 *       ko: { title: '소개 - 수리', description: '수학 문서 소개' },
 *       en: { title: 'About - Roots', description: 'About math documentation' },
 *     },
 *     'https://roots.soundbluemusic.com',
 *   ),
 *   component: AboutPage,
 * });
 * ```
 */
export function headFactory(
  localizedMeta: LocalizedMeta,
  baseUrl: string,
  options?: HeadFactoryOptions,
): (args: HeadFunctionArgs) => HeadConfig {
  const trailingSlash = options?.trailingSlash ?? false;
  return (args: HeadFunctionArgs): HeadConfig => {
    const pathname = resolvePathname(args, '/');
    const isKorean = pathname.startsWith('/ko');
    const meta = isKorean ? localizedMeta.ko : localizedMeta.en;
    const urls = computeSeoUrls(pathname, baseUrl, trailingSlash);

    return {
      meta: metaDataToHeadMeta(meta, {
        url: urls.canonical,
        locale: isKorean ? 'ko' : 'en',
      }),
      links: generateSeoLinks(pathname, baseUrl, trailingSlash),
    };
  };
}

/**
 * TanStack Start 동적 head 함수 팩토리 (loader 데이터 사용)
 *
 * @example
 * ```tsx
 * export const Route = createFileRoute('/entry/$entryId')({
 *   loader: async ({ params }) => {
 *     const entry = await getEntry(params.entryId);
 *     return { entry };
 *   },
 *   head: dynamicHeadFactory(
 *     (data: { entry: Entry }) => ({
 *       ko: { title: `${data.entry.korean} - Context`, description: data.entry.description },
 *       en: { title: `${data.entry.english} - Context`, description: data.entry.description },
 *     }),
 *     'https://context.soundbluemusic.com',
 *   ),
 *   component: EntryPage,
 * });
 * ```
 */
export function dynamicHeadFactory<T>(
  getLocalizedMeta: (data: T) => LocalizedMeta,
  baseUrl: string,
  options?: HeadFactoryOptions,
): (args: DynamicHeadFunctionArgs<T>) => HeadConfig {
  const trailingSlash = options?.trailingSlash ?? false;
  return (ctx: DynamicHeadFunctionArgs<T>): HeadConfig => {
    const loaderData = requireLoaderData(ctx);
    const pathname = resolvePathname(ctx, '/');
    const isKorean = pathname.startsWith('/ko');
    const localizedMeta = getLocalizedMeta(loaderData);
    const meta = isKorean ? localizedMeta.ko : localizedMeta.en;
    const urls = computeSeoUrls(pathname, baseUrl, trailingSlash);

    return {
      meta: metaDataToHeadMeta(meta, {
        url: urls.canonical,
        locale: isKorean ? 'ko' : 'en',
      }),
      links: generateSeoLinks(pathname, baseUrl, trailingSlash),
    };
  };
}

/**
 * 한글 경로용 head 팩토리 (locale이 고정된 경우)
 * /ko 접두사가 항상 붙는 라우트에서 사용
 *
 * canonical/og:url은 ctx.location.pathname을 기반으로 페이지별로 계산됨.
 */
export function headFactoryKo(
  localizedMeta: LocalizedMeta,
  baseUrl: string,
  options?: HeadFactoryOptions,
): (args?: HeadFunctionArgs) => HeadConfig {
  const trailingSlash = options?.trailingSlash ?? false;
  return (args?: HeadFunctionArgs): HeadConfig => {
    const meta = localizedMeta.ko;
    const pathname = resolvePathname(args, '/ko');
    const urls = computeSeoUrls(pathname, baseUrl, trailingSlash);

    return {
      meta: metaDataToHeadMeta(meta, { url: urls.canonical, locale: 'ko' }),
      links: generateSeoLinks(pathname, baseUrl, trailingSlash),
    };
  };
}

/**
 * 영어 경로용 head 팩토리 (locale이 고정된 경우)
 * /ko 접두사가 없는 라우트에서 사용
 *
 * canonical/og:url은 ctx.location.pathname을 기반으로 페이지별로 계산됨.
 */
export function headFactoryEn(
  localizedMeta: LocalizedMeta,
  baseUrl: string,
  options?: HeadFactoryOptions,
): (args?: HeadFunctionArgs) => HeadConfig {
  const trailingSlash = options?.trailingSlash ?? false;
  return (args?: HeadFunctionArgs): HeadConfig => {
    const meta = localizedMeta.en;
    const pathname = resolvePathname(args, '/');
    const urls = computeSeoUrls(pathname, baseUrl, trailingSlash);

    return {
      meta: metaDataToHeadMeta(meta, { url: urls.canonical, locale: 'en' }),
      links: generateSeoLinks(pathname, baseUrl, trailingSlash),
    };
  };
}

/**
 * 한글 locale prefix 정규화 (이중 prefix 방지)
 *
 * 호출자가 locale-agnostic 경로(`/concept/addition`)를 반환하든
 * locale-prefixed 경로(`/ko/concept/addition`)를 반환하든 안전하게 처리.
 */
function prefixKoreanLocale(path: string): string {
  if (typeof path !== 'string' || path.length === 0) {
    return '/ko';
  }
  if (path === '/ko' || path.startsWith('/ko/')) {
    return path;
  }
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return withSlash === '/' ? '/ko' : `/ko${withSlash}`;
}

/**
 * 동적 한글 경로용 head 팩토리
 *
 * `getPathname`은 locale-agnostic 경로(`/concept/{id}`)를 반환하는 것을 권장하나,
 * `/ko/concept/{id}`와 같이 prefix가 포함된 경로를 반환해도 이중 prefix를
 * 발생시키지 않습니다.
 */
export function dynamicHeadFactoryKo<T>(
  getLocalizedMeta: (data: T) => LocalizedMeta,
  baseUrl: string,
  getPathname?: (data: T) => string,
  options?: HeadFactoryOptions,
): (ctx: DynamicHeadFunctionArgs<T>) => HeadConfig {
  const trailingSlash = options?.trailingSlash ?? false;
  return (ctx): HeadConfig => {
    const loaderData = requireLoaderData(ctx);
    const localizedMeta = getLocalizedMeta(loaderData);
    const meta = localizedMeta.ko;
    const pathname = getPathname
      ? prefixKoreanLocale(getPathname(loaderData))
      : resolvePathname(ctx, '/ko');
    const urls = computeSeoUrls(pathname, baseUrl, trailingSlash);

    return {
      meta: metaDataToHeadMeta(meta, { url: urls.canonical, locale: 'ko' }),
      links: generateSeoLinks(pathname, baseUrl, trailingSlash),
    };
  };
}

/**
 * 동적 영어 경로용 head 팩토리
 */
export function dynamicHeadFactoryEn<T>(
  getLocalizedMeta: (data: T) => LocalizedMeta,
  baseUrl: string,
  getPathname?: (data: T) => string,
  options?: HeadFactoryOptions,
): (ctx: DynamicHeadFunctionArgs<T>) => HeadConfig {
  const trailingSlash = options?.trailingSlash ?? false;
  return (ctx): HeadConfig => {
    const loaderData = requireLoaderData(ctx);
    const localizedMeta = getLocalizedMeta(loaderData);
    const meta = localizedMeta.en;
    const pathname = getPathname ? getPathname(loaderData) : resolvePathname(ctx, '/');
    const urls = computeSeoUrls(pathname, baseUrl, trailingSlash);

    return {
      meta: metaDataToHeadMeta(meta, { url: urls.canonical, locale: 'en' }),
      links: generateSeoLinks(pathname, baseUrl, trailingSlash),
    };
  };
}
