import MiniSearch from 'minisearch';
import type { LoadedSearchIndex, SearchIndexItem } from './types';

const searchIndexCache = new Map<string, Promise<LoadedSearchIndex>>();
const miniSearchCache = new Map<string, Promise<MiniSearch<SearchIndexItem>>>();

export function clearSearchIndexCache() {
  searchIndexCache.clear();
  miniSearchCache.clear();
}

export async function loadSearchIndex(indexUrl: string): Promise<LoadedSearchIndex> {
  const cached = searchIndexCache.get(indexUrl);
  if (cached) return cached;

  const loadPromise = fetch(indexUrl)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load search index: ${response.status}`);
      }

      const items: SearchIndexItem[] = await response.json();
      return {
        items,
        itemsById: new Map(items.map((item) => [item.id, item])),
      };
    })
    .catch((error: unknown) => {
      searchIndexCache.delete(indexUrl);
      throw error;
    });

  searchIndexCache.set(indexUrl, loadPromise);
  return loadPromise;
}

function createMiniSearch(locale: 'en' | 'ko'): MiniSearch<SearchIndexItem> {
  return new MiniSearch<SearchIndexItem>({
    fields: [
      `name.${locale}`,
      'name.en',
      `description.${locale}`,
      'description.en',
      'field',
      'tags',
    ],
    storeFields: ['id', 'type', 'name', 'description', 'field', 'tags'],
    extractField: (document, fieldName) => {
      const parts = fieldName.split('.');
      let value: unknown = document;

      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = (value as Record<string, unknown>)[part];
        } else {
          return undefined;
        }
      }

      if (Array.isArray(value)) return value.join(' ');
      return typeof value === 'string' ? value : undefined;
    },
    searchOptions: {
      boost: {
        [`name.${locale}`]: 3,
        'name.en': 2,
        [`description.${locale}`]: 1.5,
        'description.en': 1,
        field: 1,
        tags: 0.5,
      },
      fuzzy: 0.2,
      prefix: true,
    },
  });
}

export async function loadMiniSearch(
  indexUrl: string,
  locale: 'en' | 'ko',
): Promise<MiniSearch<SearchIndexItem>> {
  const cacheKey = `${indexUrl}::${locale}`;
  const cached = miniSearchCache.get(cacheKey);
  if (cached) return cached;

  const loadPromise = loadSearchIndex(indexUrl)
    .then((index) => {
      const miniSearch = createMiniSearch(locale);
      miniSearch.addAll(index.items);
      return miniSearch;
    })
    .catch((error: unknown) => {
      miniSearchCache.delete(cacheKey);
      throw error;
    });

  miniSearchCache.set(cacheKey, loadPromise);
  return loadPromise;
}
