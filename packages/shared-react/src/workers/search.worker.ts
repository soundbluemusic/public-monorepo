/**
 * Search Web Worker
 * Performs fuzzy search on a prebuilt index using Fuse.js
 * Runs in a background thread to avoid blocking the UI
 */
import Fuse from 'fuse.js';

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

let fuse: Fuse<SearchIndexItem> | null = null;

function createFuseInstance(index: SearchIndexItem[], locale: 'en' | 'ko'): Fuse<SearchIndexItem> {
  return new Fuse(index, {
    keys: [
      { name: `name.${locale}`, weight: 3 },
      { name: 'name.en', weight: 2 },
      { name: `description.${locale}`, weight: 1.5 },
      { name: 'description.en', weight: 1 },
      { name: 'field', weight: 1 },
      { name: 'tags', weight: 0.5 },
    ],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
  });
}

self.onmessage = (event: MessageEvent<SearchMessage>) => {
  const { type, index, query, locale = 'en', limit = 8 } = event.data;

  try {
    if (type === 'init' && index) {
      fuse = createFuseInstance(index, locale);
      self.postMessage({ type: 'ready' } as SearchResponse);
    } else if (type === 'search' && query && fuse) {
      const results = fuse.search(query, { limit }).map((result) => ({
        item: result.item,
        score: result.score,
      }));
      self.postMessage({ type: 'results', results } as SearchResponse);
    } else if (type === 'search' && !fuse) {
      self.postMessage({ type: 'error', error: 'Search index not initialized' } as SearchResponse);
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as SearchResponse);
  }
};
