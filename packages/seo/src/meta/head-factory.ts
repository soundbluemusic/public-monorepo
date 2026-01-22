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
  location: { pathname: string };
}

/**
 * 동적 head 함수 인자 타입
 */
interface DynamicHeadFunctionArgs<T> {
  loaderData: T;
  location: { pathname: string };
}

/**
 * SEO 링크 태그 생성 (canonical + hreflang)
 */
function generateSeoLinks(pathname: string, baseUrl: string): HeadLink[] {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  const isKorean = cleanPath.startsWith('/ko');
  const pathWithoutLocale = isKorean ? cleanPath.replace(/^\/ko/, '') || '/' : cleanPath;

  const enUrl = pathWithoutLocale === '/' ? cleanBaseUrl : `${cleanBaseUrl}${pathWithoutLocale}`;
  const koUrl =
    pathWithoutLocale === '/' ? `${cleanBaseUrl}/ko` : `${cleanBaseUrl}/ko${pathWithoutLocale}`;

  const canonicalUrl = isKorean ? koUrl : enUrl;

  return [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'alternate', hrefLang: 'en', href: enUrl },
    { rel: 'alternate', hrefLang: 'ko', href: koUrl },
    { rel: 'alternate', hrefLang: 'x-default', href: enUrl },
  ];
}

/**
 * MetaData를 HeadMeta 배열로 변환
 */
function metaDataToHeadMeta(meta: MetaData): HeadMeta[] {
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
    const isKorean = location.pathname.startsWith('/ko');
    const meta = isKorean ? localizedMeta.ko : localizedMeta.en;

    return {
      meta: metaDataToHeadMeta(meta),
      links: generateSeoLinks(location.pathname, baseUrl),
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
  return ({ loaderData, location }: DynamicHeadFunctionArgs<T>): HeadConfig => {
    const isKorean = location.pathname.startsWith('/ko');
    const localizedMeta = getLocalizedMeta(loaderData);
    const meta = isKorean ? localizedMeta.ko : localizedMeta.en;

    return {
      meta: metaDataToHeadMeta(meta),
      links: generateSeoLinks(location.pathname, baseUrl),
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

    return {
      meta: metaDataToHeadMeta(meta),
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

    return {
      meta: metaDataToHeadMeta(meta),
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
  // biome-ignore lint/suspicious/noExplicitAny: TanStack Router context type is complex and varies by route
): (args: any) => HeadConfig {
  // biome-ignore lint/suspicious/noExplicitAny: TanStack Router context type is complex and varies by route
  return (ctx: any): HeadConfig => {
    const loaderData = ctx.loaderData as T;
    const localizedMeta = getLocalizedMeta(loaderData);
    const meta = localizedMeta.ko;
    const pathname = getPathname
      ? `/ko${getPathname(loaderData)}`
      : (ctx.location?.pathname ?? '/ko');

    return {
      meta: metaDataToHeadMeta(meta),
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
  // biome-ignore lint/suspicious/noExplicitAny: TanStack Router context type is complex and varies by route
): (args: any) => HeadConfig {
  // biome-ignore lint/suspicious/noExplicitAny: TanStack Router context type is complex and varies by route
  return (ctx: any): HeadConfig => {
    const loaderData = ctx.loaderData as T;
    const localizedMeta = getLocalizedMeta(loaderData);
    const meta = localizedMeta.en;
    const pathname = getPathname ? getPathname(loaderData) : (ctx.location?.pathname ?? '/');

    return {
      meta: metaDataToHeadMeta(meta),
      links: generateSeoLinks(pathname, baseUrl),
    };
  };
}
