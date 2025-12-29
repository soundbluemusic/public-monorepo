/**
 * useSearchWorker Hook
 * Client-side full-text search with MiniSearch
 * Provides debounced search with loading states
 *
 * Note: For SSG apps with small datasets (<1000 items), a synchronous approach
 * is more reliable than Web Workers and still provides excellent performance.
 * MiniSearch offers O(log n) indexed search vs Fuse.js O(n) linear scan.
 */
import MiniSearch from 'minisearch';
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

  const miniSearchRef = useRef<MiniSearch<SearchIndexItem> | null>(null);
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

        // Create MiniSearch instance with locale-aware fields
        miniSearchRef.current = new MiniSearch<SearchIndexItem>({
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

        // Index all documents
        miniSearchRef.current.addAll(index);

        setIsReady(true);
        setIsLoading(false);
      } catch (err: unknown) {
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
      if (
        !miniSearchRef.current ||
        !indexRef.current ||
        !searchQuery.trim() ||
        searchQuery.length < 2
      ) {
        setResults([]);
        return;
      }

      const searchResults = miniSearchRef.current.search(searchQuery).slice(0, maxResults);

      // Map MiniSearch results back to SearchResult format
      const mappedResults: SearchResult[] = searchResults.map((result) => {
        // Find original item from index
        const originalItem = indexRef.current?.find((item) => item.id === result.id);
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

      setResults(mappedResults);
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
