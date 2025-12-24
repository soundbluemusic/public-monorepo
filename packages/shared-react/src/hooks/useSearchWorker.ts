/**
 * useSearchWorker Hook
 * Client-side fuzzy search with Fuse.js
 * Provides debounced search with loading states
 *
 * Note: For SSG apps with small datasets (<500 items), a synchronous approach
 * is more reliable than Web Workers and still provides excellent performance.
 */
import Fuse from 'fuse.js';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface SearchIndexItem {
  id: string;
  type: 'concept' | 'entry' | 'library' | 'api';
  name: { en: string; ko: string };
  description?: { en: string; ko: string };
  field?: string;
  tags?: string[];
}

export interface SearchResult {
  item: SearchIndexItem;
  score?: number;
}

interface UseSearchWorkerOptions {
  indexUrl: string;
  locale: 'en' | 'ko';
  debounceMs?: number;
  maxResults?: number;
}

interface UseSearchWorkerReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
}

export function useSearchWorker({
  indexUrl,
  locale,
  debounceMs = 150,
  maxResults = 8,
}: UseSearchWorkerOptions): UseSearchWorkerReturn {
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fuseRef = useRef<Fuse<SearchIndexItem> | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef<SearchIndexItem[] | null>(null);

  // Load and initialize search index
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let cancelled = false;

    const loadIndex = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(indexUrl);
        if (!response.ok) {
          throw new Error(`Failed to load search index: ${response.status}`);
        }
        const index: SearchIndexItem[] = await response.json();

        if (cancelled) return;

        indexRef.current = index;
        fuseRef.current = new Fuse(index, {
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

        setIsReady(true);
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load search index');
        setIsLoading(false);
      }
    };

    loadIndex();

    return () => {
      cancelled = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [indexUrl, locale]);

  // Perform search
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!fuseRef.current || !searchQuery.trim() || searchQuery.length < 2) {
        setResults([]);
        return;
      }

      const searchResults = fuseRef.current.search(searchQuery, { limit: maxResults });
      setResults(
        searchResults.map((result) => ({
          item: result.item,
          score: result.score,
        })),
      );
    },
    [maxResults],
  );

  // Debounced query handler
  const setQuery = useCallback(
    (searchQuery: string) => {
      setQueryState(searchQuery);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (!searchQuery.trim() || searchQuery.length < 2) {
        setResults([]);
        return;
      }

      debounceTimerRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, debounceMs);
    },
    [debounceMs, performSearch],
  );

  return {
    query,
    setQuery,
    results,
    isLoading,
    isReady,
    error,
  };
}
