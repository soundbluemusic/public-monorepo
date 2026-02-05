/**
 * @fileoverview TanStack Start head 함수 팩토리
 * @environment build-only
 *
 * TanStack Start의 head 속성을 위한 팩토리 함수입니다.
 * React Router v7의 meta 함수와 유사하지만 TanStack Start 형식에 맞게 변환합니다.
 */

import type { LocalizedMeta, MetaData } from './factory';

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
 * head 함수 인자 타입
 */
interface HeadFunctionArgs {
  loaderData?: unknown;
  location?: { pathname: string };
}

/**
 * 동적 head 함수 인자 타입
 *
 * TanStack Start의 AssetFnContextOptions에서 loaderData는 optional이므로
 * 여기서도 optional로 정의합니다.
 */
interface DynamicHeadFunctionArgs<T> {
  loaderData?: T;
  location?: { pathname: string };
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
 */
function computeSeoUrls(
  pathname: string,
  baseUrl: string,
): { canonical: string; en: string; ko: string } {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

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
function generateSeoLinks(pathname: string, baseUrl: string): HeadLink[] {
  const urls = computeSeoUrls(pathname, baseUrl);

  return [
    { rel: 'canonical', href: urls.canonical },
    { rel: 'alternate', hrefLang: 'en', href: urls.en },
    { rel: 'alternate', hrefLang: 'ko', href: urls.ko },
    { rel: 'alternate', hrefLang: 'x-default', href: urls.en },
  ];
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
): (args: HeadFunctionArgs) => HeadConfig {
  return ({ location }: HeadFunctionArgs): HeadConfig => {
    const pathname = location?.pathname ?? '/';
    const isKorean = pathname.startsWith('/ko');
    const meta = isKorean ? localizedMeta.ko : localizedMeta.en;
    const urls = computeSeoUrls(pathname, baseUrl);

    return {
      meta: metaDataToHeadMeta(meta, {
        url: urls.canonical,
        locale: isKorean ? 'ko' : 'en',
      }),
      links: generateSeoLinks(pathname, baseUrl),
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
): (args: DynamicHeadFunctionArgs<T>) => HeadConfig {
  return (ctx: DynamicHeadFunctionArgs<T>): HeadConfig => {
    const loaderData = requireLoaderData(ctx);
    const pathname = ctx.location?.pathname ?? '/';
    const isKorean = pathname.startsWith('/ko');
    const localizedMeta = getLocalizedMeta(loaderData);
    const meta = isKorean ? localizedMeta.ko : localizedMeta.en;
    const urls = computeSeoUrls(pathname, baseUrl);

    return {
      meta: metaDataToHeadMeta(meta, {
        url: urls.canonical,
        locale: isKorean ? 'ko' : 'en',
      }),
      links: generateSeoLinks(pathname, baseUrl),
    };
  };
}

/**
 * 한글 경로용 head 팩토리 (locale이 고정된 경우)
 * /ko 접두사가 항상 붙는 라우트에서 사용
 */
export function headFactoryKo(localizedMeta: LocalizedMeta, baseUrl: string): () => HeadConfig {
  return (): HeadConfig => {
    const meta = localizedMeta.ko;
    const pathname = '/ko'; // 한글 페이지는 /ko 기준
    const urls = computeSeoUrls(pathname, baseUrl);

    return {
      meta: metaDataToHeadMeta(meta, { url: urls.canonical, locale: 'ko' }),
      links: generateSeoLinks(pathname, baseUrl),
    };
  };
}

/**
 * 영어 경로용 head 팩토리 (locale이 고정된 경우)
 * /ko 접두사가 없는 라우트에서 사용
 */
export function headFactoryEn(localizedMeta: LocalizedMeta, baseUrl: string): () => HeadConfig {
  return (): HeadConfig => {
    const meta = localizedMeta.en;
    const pathname = '/'; // 영어 페이지는 / 기준
    const urls = computeSeoUrls(pathname, baseUrl);

    return {
      meta: metaDataToHeadMeta(meta, { url: urls.canonical, locale: 'en' }),
      links: generateSeoLinks(pathname, baseUrl),
    };
  };
}

/**
 * 동적 한글 경로용 head 팩토리
 */
export function dynamicHeadFactoryKo<T>(
  getLocalizedMeta: (data: T) => LocalizedMeta,
  baseUrl: string,
  getPathname?: (data: T) => string,
): (ctx: DynamicHeadFunctionArgs<T>) => HeadConfig {
  return (ctx): HeadConfig => {
    const loaderData = requireLoaderData(ctx);
    const localizedMeta = getLocalizedMeta(loaderData);
    const meta = localizedMeta.ko;
    const pathname = getPathname
      ? `/ko${getPathname(loaderData)}`
      : (ctx.location?.pathname ?? '/ko');
    const urls = computeSeoUrls(pathname, baseUrl);

    return {
      meta: metaDataToHeadMeta(meta, { url: urls.canonical, locale: 'ko' }),
      links: generateSeoLinks(pathname, baseUrl),
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
): (ctx: DynamicHeadFunctionArgs<T>) => HeadConfig {
  return (ctx): HeadConfig => {
    const loaderData = requireLoaderData(ctx);
    const localizedMeta = getLocalizedMeta(loaderData);
    const meta = localizedMeta.en;
    const pathname = getPathname ? getPathname(loaderData) : (ctx.location?.pathname ?? '/');
    const urls = computeSeoUrls(pathname, baseUrl);

    return {
      meta: metaDataToHeadMeta(meta, { url: urls.canonical, locale: 'en' }),
      links: generateSeoLinks(pathname, baseUrl),
    };
  };
}
