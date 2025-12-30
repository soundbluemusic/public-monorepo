/**
 * @fileoverview React Router v7 meta 함수 팩토리
 * @environment build-only
 *
 * 모든 라우트에서 반복되는 meta 함수 패턴을 추상화합니다.
 */

/** Meta 데이터 타입 */
export interface MetaData {
  title: string;
  description?: string;
}

/** 다국어 Meta 데이터 타입 */
export interface LocalizedMeta {
  ko: MetaData;
  en: MetaData;
}

type MetaDescriptor =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { charSet: string }
  | { httpEquiv: string; content: string };

type MetaFunctionArgs = {
  location: { pathname: string };
};

/**
 * meta 함수 팩토리
 *
 * @example
 * ```tsx
 * export const meta = metaFactory({
 *   ko: { title: '검색 - 수리', description: '수학 개념 검색' },
 *   en: { title: 'Search - Roots', description: 'Search math concepts' },
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
 * @example
 * ```tsx
 * export const meta = dynamicMetaFactory((data: { entry: Entry }) => ({
 *   ko: { title: `${data.entry.korean} - Context` },
 *   en: { title: `${data.entry.english} - Context` },
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
