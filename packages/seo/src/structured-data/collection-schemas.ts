import type {
  ItemListJsonLd,
  ItemListSchema,
  SiteNavigationJsonLd,
  SiteNavigationSchema,
} from './schema-types';

/**
 * SiteNavigationElement JSON-LD 스키마를 생성합니다.
 *
 * 사이트의 주요 네비게이션 링크를 검색엔진에 명시적으로 알려줍니다.
 * Google 검색 결과에서 사이트링크(Sitelinks) 노출에 도움을 줍니다.
 *
 * @param config - SiteNavigation 스키마 설정 객체
 * @returns Schema.org ItemList + SiteNavigationElement 형식의 JSON-LD 객체
 *
 * @example
 * ```typescript
 * const schema = generateSiteNavigationSchema({
 *   name: 'Main Navigation',
 *   url: 'https://context.soundbluemusic.com',
 *   navigationItems: [
 *     { name: 'Home', url: 'https://context.soundbluemusic.com/' },
 *     { name: 'Browse', url: 'https://context.soundbluemusic.com/browse' },
 *   ],
 * });
 * ```
 *
 * @see https://schema.org/SiteNavigationElement
 */
export function generateSiteNavigationSchema(config: SiteNavigationSchema): SiteNavigationJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.name,
    url: config.url,
    itemListElement: config.navigationItems.map((item, index) => ({
      '@type': 'SiteNavigationElement' as const,
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * ItemList JSON-LD 스키마를 생성합니다.
 *
 * 목록 페이지의 항목들을 구조화된 데이터로 제공합니다.
 * Google 검색 결과에서 캐러셀/리스트 리치 스니펫으로 표시될 수 있습니다.
 *
 * @param config - ItemList 스키마 설정 객체
 * @returns Schema.org ItemList 형식의 JSON-LD 객체
 *
 * @example 카테고리 목록
 * ```typescript
 * const schema = generateItemListSchema({
 *   name: 'Categories',
 *   url: 'https://context.soundbluemusic.com/',
 *   items: categories.map(c => ({
 *     name: c.name.en,
 *     url: `https://context.soundbluemusic.com/category/${c.id}`,
 *   })),
 * });
 * ```
 *
 * @example 라이브러리 목록
 * ```typescript
 * const schema = generateItemListSchema({
 *   name: 'MIT Licensed Libraries',
 *   url: 'https://permissive.soundbluemusic.com/libraries',
 *   items: libraries.map(lib => ({
 *     name: lib.name,
 *     url: `https://permissive.soundbluemusic.com/library/${lib.slug}`,
 *     description: lib.description,
 *   })),
 * });
 * ```
 *
 * @see https://schema.org/ItemList
 * @see https://developers.google.com/search/docs/appearance/structured-data/carousel
 */
export function generateItemListSchema(config: ItemListSchema): ItemListJsonLd {
  const schema: ItemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: config.url,
    numberOfItems: config.numberOfItems ?? config.items.length,
    itemListElement: config.items.map((item, index) => {
      const listItem: ItemListJsonLd['itemListElement'][number] = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
      };

      if (item.description) {
        listItem.description = item.description;
      }

      return listItem;
    }),
  };

  if (config.name) {
    schema.name = config.name;
  }

  if (config.description) {
    schema.description = config.description;
  }

  return schema;
}
