/**
 * Search Web Worker
 * Performs full-text search on a prebuilt index using MiniSearch
 * Runs in a background thread to avoid blocking the UI
 */
import MiniSearch from 'minisearch';

export interface SearchIndexItem {
  id: string;
  type: 'concept' | 'entry' | 'library' | 'api';
  name: { en: string; ko: string };
  description?: { en: string; ko: string };
  field?: string;
  tags?: string[];
}

export interface SearchMessage {
  type: 'init' | 'search';
  index?: SearchIndexItem[];
  query?: string;
  locale?: 'en' | 'ko';
  limit?: number;
}

export interface SearchResult {
  item: SearchIndexItem;
  score?: number;
}

export interface SearchResponse {
  type: 'ready' | 'results' | 'error';
  results?: SearchResult[];
  error?: string;
}

let miniSearch: MiniSearch<SearchIndexItem> | null = null;
let indexData: SearchIndexItem[] | null = null;

function createMiniSearchInstance(
  index: SearchIndexItem[],
  locale: 'en' | 'ko',
): MiniSearch<SearchIndexItem> {
  const instance = new MiniSearch<SearchIndexItem>({
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
      // Handle nested fields like name.ko, description.en
      const parts = fieldName.split('.');
      let value: unknown = document;
      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = (value as Record<string, unknown>)[part];
        } else {
          return undefined;
        }
      }
      // Handle arrays (tags)
      if (Array.isArray(value)) {
        return value.join(' ');
      }
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

  instance.addAll(index);
  return instance;
}

self.onmessage = (event: MessageEvent<SearchMessage>) => {
  const { type, index, query, locale = 'en', limit = 8 } = event.data;

  try {
    if (type === 'init' && index) {
      indexData = index;
      miniSearch = createMiniSearchInstance(index, locale);
      self.postMessage({ type: 'ready' } as SearchResponse);
    } else if (type === 'search' && query && miniSearch && indexData) {
      const searchResults = miniSearch.search(query).slice(0, limit);

      // Map results back to SearchResult format
      const results: SearchResult[] = searchResults.map((result) => {
        const originalItem = indexData?.find((item) => item.id === result.id);
        return {
          item: originalItem || {
            id: result.id as string,
            type: (result.type as SearchIndexItem['type']) || 'entry',
            name: (result.name as { en: string; ko: string }) || { en: '', ko: '' },
            description: result.description as { en: string; ko: string } | undefined,
            field: result.field as string | undefined,
            tags: result.tags as string[] | undefined,
          },
          score: result.score,
        };
      });

      self.postMessage({ type: 'results', results } as SearchResponse);
    } else if (type === 'search' && !miniSearch) {
      self.postMessage({ type: 'error', error: 'Search index not initialized' } as SearchResponse);
    }
  } catch (error: unknown) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as SearchResponse);
  }
};
