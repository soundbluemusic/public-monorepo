/**
 * @fileoverview React Router v7 meta 함수 팩토리
 * @environment build-only
 *
 * 모든 라우트에서 반복되는 meta 함수 패턴을 추상화합니다.
 * SEO용 canonical 및 hreflang 링크 태그도 자동으로 생성합니다.
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
  | { httpEquiv: string; content: string }
  | { tagName: 'link'; rel: string; href: string; hreflang?: string };

type MetaFunctionArgs = {
  location: { pathname: string };
};

/**
 * SEO 링크 태그 생성 (canonical + hreflang)
 * React Router v7에서는 meta 함수에서 link 태그도 생성 가능
 */
function generateSeoLinkTags(pathname: string, baseUrl: string): MetaDescriptor[] {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  const isKorean = cleanPath.startsWith('/ko');
  const pathWithoutLocale = isKorean ? cleanPath.replace(/^\/ko/, '') || '/' : cleanPath;

  const enUrl = pathWithoutLocale === '/' ? cleanBaseUrl : `${cleanBaseUrl}${pathWithoutLocale}`;
  const koUrl =
    pathWithoutLocale === '/' ? `${cleanBaseUrl}/ko` : `${cleanBaseUrl}/ko${pathWithoutLocale}`;

  const canonicalUrl = isKorean ? koUrl : enUrl;

  return [
    { tagName: 'link', rel: 'canonical', href: canonicalUrl },
    { tagName: 'link', rel: 'alternate', hreflang: 'en', href: enUrl },
    { tagName: 'link', rel: 'alternate', hreflang: 'ko', href: koUrl },
    { tagName: 'link', rel: 'alternate', hreflang: 'x-default', href: enUrl },
  ];
}

/**
 * meta 함수 팩토리
 *
 * @example
 * ```tsx
 * export const meta = metaFactory(
 *   {
 *     ko: { title: '검색 - 수리', description: '수학 개념 검색' },
 *     en: { title: 'Search - Roots', description: 'Search math concepts' },
 *   },
 *   'https://roots.soundbluemusic.com',
 * );
 * ```
 */
export function metaFactory(
  localizedMeta: LocalizedMeta,
  baseUrl: string,
): (args: MetaFunctionArgs) => MetaDescriptor[] {
  return ({ location }: MetaFunctionArgs): MetaDescriptor[] => {
    const isKorean = location.pathname.startsWith('/ko');
    const meta = isKorean ? localizedMeta.ko : localizedMeta.en;

    const result: MetaDescriptor[] = [{ title: meta.title }];

    if (meta.description) {
      result.push({ name: 'description', content: meta.description });
    }

    // SEO link tags (canonical + hreflang)
    result.push(...generateSeoLinkTags(location.pathname, baseUrl));

    return result;
  };
}

/**
 * 동적 meta 함수 팩토리 (loader 데이터 사용)
 *
 * @example
 * ```tsx
 * export const meta = dynamicMetaFactory(
 *   (data: { entry: Entry }) => ({
 *     ko: { title: `${data.entry.korean} - Context` },
 *     en: { title: `${data.entry.english} - Context` },
 *   }),
 *   'https://context.soundbluemusic.com',
 * );
 * ```
 */
export function dynamicMetaFactory<T>(
  getLocalizedMeta: (data: T) => LocalizedMeta,
  baseUrl: string,
): (args: MetaFunctionArgs & { data: T }) => MetaDescriptor[] {
  return ({ location, data }): MetaDescriptor[] => {
    const isKorean = location.pathname.startsWith('/ko');
    const localizedMeta = getLocalizedMeta(data);
    const meta = isKorean ? localizedMeta.ko : localizedMeta.en;

    const result: MetaDescriptor[] = [{ title: meta.title }];

    if (meta.description) {
      result.push({ name: 'description', content: meta.description });
    }

    // SEO link tags (canonical + hreflang)
    result.push(...generateSeoLinkTags(location.pathname, baseUrl));

    return result;
  };
}
