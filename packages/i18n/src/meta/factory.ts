/**
 * React Router v7 meta 함수 팩토리
 *
 * 모든 라우트에서 반복되는 meta 함수 패턴을 추상화합니다.
 * canonical URL과 hreflang 태그도 meta 함수에서 생성합니다.
 *
 * @example
 * ```tsx
 * // Before (반복 패턴)
 * export const meta: MetaFunction = ({ location }) => {
 *   const isKorean = location.pathname.startsWith('/ko');
 *   if (isKorean) {
 *     return [{ title: '소개 - Context' }, { name: 'description', content: '...' }];
 *   }
 *   return [{ title: 'About - Context' }, { name: 'description', content: '...' }];
 * };
 *
 * // After (metaFactory 사용 - canonical/hreflang 포함)
 * export const meta = metaFactory({
 *   ko: { title: '소개 - Context', description: 'Context 한국어 사전 소개' },
 *   en: { title: 'About - Context', description: 'About Context Korean Dictionary' },
 * }, 'https://context.soundbluemusic.com');
 * ```
 */
import { isKoreanPath } from '../utils/routing';

/**
 * Meta 데이터 타입
 */
export interface MetaData {
  /** 페이지 제목 */
  title: string;
  /** 페이지 설명 (optional) */
  description?: string;
}

/**
 * 다국어 Meta 데이터 타입
 */
export interface LocalizedMeta {
  /** 한국어 메타 데이터 */
  ko: MetaData;
  /** 영어 메타 데이터 */
  en: MetaData;
}

/**
 * React Router MetaFunction 반환 타입
 * react-router의 MetaDescriptor와 호환
 * tagName: "link"를 통해 canonical과 hreflang 태그도 지원
 */
type MetaDescriptor =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { charSet: string }
  | { httpEquiv: string; content: string }
  | { tagName: 'link'; rel: string; href: string; hrefLang?: string };

/**
 * React Router MetaFunction 호환 타입
 */
type MetaFunctionArgs = {
  location: { pathname: string };
};

/**
 * canonical URL과 hreflang 태그를 생성하는 헬퍼 함수
 *
 * @param pathname - 현재 페이지 경로
 * @param baseUrl - 사이트 기본 URL
 * @returns MetaDescriptor 배열 (link 태그들)
 */
function generateSeoLinkTags(pathname: string, baseUrl: string): MetaDescriptor[] {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  // 현재 로케일 감지: /ko로 시작하면 한국어, 아니면 영어
  const isKorean = cleanPath.startsWith('/ko');

  // 로케일 prefix 제거하여 순수 경로 추출
  const pathWithoutLocale = isKorean ? cleanPath.replace(/^\/ko/, '') || '/' : cleanPath;

  // 각 언어별 URL 생성
  // 영어: prefix 없음 (기본 언어)
  // 한국어: /ko prefix
  const enUrl = pathWithoutLocale === '/' ? cleanBaseUrl : `${cleanBaseUrl}${pathWithoutLocale}`;
  const koUrl =
    pathWithoutLocale === '/' ? `${cleanBaseUrl}/ko` : `${cleanBaseUrl}/ko${pathWithoutLocale}`;

  // 현재 페이지의 canonical URL
  const canonicalUrl = isKorean ? koUrl : enUrl;

  return [
    // Canonical: 현재 페이지 자기 자신
    { tagName: 'link', rel: 'canonical', href: canonicalUrl },
    // hreflang: 영어 버전
    { tagName: 'link', rel: 'alternate', hrefLang: 'en', href: enUrl },
    // hreflang: 한국어 버전
    { tagName: 'link', rel: 'alternate', hrefLang: 'ko', href: koUrl },
    // x-default: 기본 언어 (영어)
    { tagName: 'link', rel: 'alternate', hrefLang: 'x-default', href: enUrl },
  ];
}

/**
 * meta 함수 팩토리
 *
 * URL 경로 기반으로 로케일을 감지하여 적절한 메타 데이터를 반환합니다.
 * canonical URL과 hreflang 태그도 자동으로 생성합니다.
 *
 * @param localizedMeta - 한국어/영어 메타 데이터
 * @param baseUrl - 사이트 기본 URL (SEO 태그 생성용)
 * @returns React Router MetaFunction 호환 함수
 *
 * @example
 * ```tsx
 * // 기본 사용 (canonical/hreflang 포함)
 * export const meta = metaFactory({
 *   ko: { title: '검색 - 수리', description: '수학 개념 검색' },
 *   en: { title: 'Search - Roots', description: 'Search math concepts' },
 * }, 'https://roots.soundbluemusic.com');
 *
 * // description 없이 title만
 * export const meta = metaFactory({
 *   ko: { title: '404 - 수리' },
 *   en: { title: '404 - Roots' },
 * }, 'https://roots.soundbluemusic.com');
 * ```
 */
export function metaFactory(
  localizedMeta: LocalizedMeta,
  baseUrl: string,
): (args: MetaFunctionArgs) => MetaDescriptor[] {
  return ({ location }: MetaFunctionArgs): MetaDescriptor[] => {
    const isKorean = isKoreanPath(location.pathname);
    const meta = isKorean ? localizedMeta.ko : localizedMeta.en;

    const result: MetaDescriptor[] = [{ title: meta.title }];

    if (meta.description) {
      result.push({ name: 'description', content: meta.description });
    }

    // canonical 및 hreflang 태그 추가
    result.push(...generateSeoLinkTags(location.pathname, baseUrl));

    return result;
  };
}

/**
 * 동적 meta 함수 팩토리 (loader 데이터 사용)
 *
 * loader에서 데이터를 받아 동적으로 메타 데이터를 생성합니다.
 * canonical URL과 hreflang 태그도 자동으로 생성합니다.
 *
 * @param getLocalizedMeta - loader 데이터를 받아 LocalizedMeta를 반환하는 함수
 * @param baseUrl - 사이트 기본 URL (SEO 태그 생성용)
 * @returns React Router MetaFunction 호환 함수
 *
 * @example
 * ```tsx
 * export const meta = dynamicMetaFactory((data: { entry: MeaningEntry }) => ({
 *   ko: {
 *     title: `${data.entry.korean} - Context`,
 *     description: `${data.entry.korean} 뜻과 예문`,
 *   },
 *   en: {
 *     title: `${data.entry.translations.en.word} - Context`,
 *     description: `Meaning and examples of ${data.entry.korean}`,
 *   },
 * }), 'https://context.soundbluemusic.com');
 * ```
 */
export function dynamicMetaFactory<T>(
  getLocalizedMeta: (data: T) => LocalizedMeta,
  baseUrl: string,
): (args: MetaFunctionArgs & { data: T }) => MetaDescriptor[] {
  return ({ location, data }): MetaDescriptor[] => {
    const isKorean = isKoreanPath(location.pathname);
    const localizedMeta = getLocalizedMeta(data);
    const meta = isKorean ? localizedMeta.ko : localizedMeta.en;

    const result: MetaDescriptor[] = [{ title: meta.title }];

    if (meta.description) {
      result.push({ name: 'description', content: meta.description });
    }

    // canonical 및 hreflang 태그 추가
    result.push(...generateSeoLinkTags(location.pathname, baseUrl));

    return result;
  };
}
