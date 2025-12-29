/**
 * @fileoverview React Router v7 meta 함수 팩토리
 *
 * 모든 라우트에서 반복되는 meta 함수 패턴을 추상화합니다.
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
 * // After (metaFactory 사용)
 * export const meta = metaFactory({
 *   ko: { title: '소개 - Context', description: 'Context 한국어 사전 소개' },
 *   en: { title: 'About - Context', description: 'About Context Korean Dictionary' },
 * });
 * ```
 */

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
 */
type MetaDescriptor =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { charSet: string }
  | { httpEquiv: string; content: string };

/**
 * React Router MetaFunction 호환 타입
 */
type MetaFunctionArgs = {
  location: { pathname: string };
};

/**
 * meta 함수 팩토리
 *
 * URL 경로 기반으로 로케일을 감지하여 적절한 메타 데이터를 반환합니다.
 *
 * @param localizedMeta - 한국어/영어 메타 데이터
 * @returns React Router MetaFunction 호환 함수
 *
 * @example
 * ```tsx
 * // 기본 사용
 * export const meta = metaFactory({
 *   ko: { title: '검색 - 수리', description: '수학 개념 검색' },
 *   en: { title: 'Search - Roots', description: 'Search math concepts' },
 * });
 *
 * // description 없이 title만
 * export const meta = metaFactory({
 *   ko: { title: '404 - 수리' },
 *   en: { title: '404 - Roots' },
 * });
 * ```
 */
export function metaFactory(
  localizedMeta: LocalizedMeta,
): (args: MetaFunctionArgs) => MetaDescriptor[] {
  return ({ location }: MetaFunctionArgs): MetaDescriptor[] => {
    const isKorean = location.pathname.startsWith('/ko');
    const meta = isKorean ? localizedMeta.ko : localizedMeta.en;

    const result: MetaDescriptor[] = [{ title: meta.title }];

    if (meta.description) {
      result.push({ name: 'description', content: meta.description });
    }

    return result;
  };
}

/**
 * 동적 meta 함수 팩토리 (loader 데이터 사용)
 *
 * loader에서 데이터를 받아 동적으로 메타 데이터를 생성합니다.
 *
 * @param getLocalizedMeta - loader 데이터를 받아 LocalizedMeta를 반환하는 함수
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
 * }));
 * ```
 */
export function dynamicMetaFactory<T>(
  getLocalizedMeta: (data: T) => LocalizedMeta,
): (args: MetaFunctionArgs & { data: T }) => MetaDescriptor[] {
  return ({ location, data }): MetaDescriptor[] => {
    const isKorean = location.pathname.startsWith('/ko');
    const localizedMeta = getLocalizedMeta(data);
    const meta = isKorean ? localizedMeta.ko : localizedMeta.en;

    const result: MetaDescriptor[] = [{ title: meta.title }];

    if (meta.description) {
      result.push({ name: 'description', content: meta.description });
    }

    return result;
  };
}
