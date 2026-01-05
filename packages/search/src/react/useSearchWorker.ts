/**
 * useSearchWorker Hook
 * @module @soundblue/search/react
 * @environment client-only
 *
 * Client-side full-text search with MiniSearch.
 * Provides debounced search with loading states and locale-aware field boosting.
 *
 * ## Why MiniSearch over Fuse.js?
 * - MiniSearch: O(log n) indexed search using inverted index
 * - Fuse.js: O(n) linear scan through all documents
 * - For datasets with 500+ items, MiniSearch is significantly faster
 *
 * ## Why synchronous instead of Web Workers?
 * For SSG apps with small datasets (<1000 items), synchronous search is:
 * - More reliable (no worker initialization/communication overhead)
 * - Simpler to debug
 * - Fast enough (< 5ms search time on modern devices)
 *
 * ## Performance Characteristics
 * | Dataset Size | Indexing Time | Search Time |
 * |--------------|---------------|-------------|
 * | 100 items    | ~10ms         | < 1ms       |
 * | 500 items    | ~40ms         | < 2ms       |
 * | 1000 items   | ~80ms         | < 5ms       |
 *
 * @see https://lucaong.github.io/minisearch/ - MiniSearch documentation
 */
import MiniSearch from 'minisearch';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Represents a searchable item in the search index.
 *
 * This interface defines the structure of items that can be indexed and searched.
 * All apps (Context, Roots, Permissive) use this unified format in their
 * `/search-index.json` files.
 *
 * @example
 * ```typescript
 * // Context app entry
 * const entry: SearchIndexItem = {
 *   id: 'hello',
 *   type: 'entry',
 *   name: { en: 'Hello', ko: '안녕하세요' },
 *   description: { en: 'A greeting', ko: '인사말' },
 *   tags: ['greetings', 'basic'],
 * };
 *
 * // Roots app concept
 * const concept: SearchIndexItem = {
 *   id: 'pythagorean-theorem',
 *   type: 'concept',
 *   name: { en: 'Pythagorean Theorem', ko: '피타고라스 정리' },
 *   field: 'geometry',
 * };
 * ```
 */
export interface SearchIndexItem {
  /** Unique identifier (kebab-case, e.g., 'hello-world', 'pythagorean-theorem') */
  id: string;

  /**
   * Item type for categorization and icon display.
   * - 'concept': Math concept (Roots app)
   * - 'entry': Korean word entry (Context app)
   * - 'library': NPM library (Permissive app)
   * - 'api': Web API (Permissive app)
   */
  type: 'concept' | 'entry' | 'library' | 'api';

  /** Localized name (required for all items) */
  name: { en: string; ko: string };

  /** Localized description (optional, improves search relevance) */
  description?: { en: string; ko: string };

  /** Category/domain field (e.g., 'geometry', 'algebra', 'greetings') */
  field?: string;

  /** Additional search keywords */
  tags?: string[];
}

/**
 * Search result with the matched item and relevance score.
 *
 * @example
 * ```typescript
 * const result: SearchResult = {
 *   item: { id: 'hello', type: 'entry', name: { en: 'Hello', ko: '안녕하세요' } },
 *   score: 15.234, // Higher = more relevant
 * };
 * ```
 */
export interface SearchResult {
  /** The matched search index item */
  item: SearchIndexItem;

  /**
   * Relevance score from MiniSearch.
   * Higher values indicate better matches.
   * Score is affected by field boost weights and fuzzy matching.
   */
  score?: number;
}

/**
 * Configuration options for the useSearchWorker hook.
 *
 * @example
 * ```typescript
 * const options: UseSearchWorkerOptions = {
 *   indexUrl: '/search-index.json',
 *   locale: 'ko',
 *   debounceMs: 200,  // Slower typing = lower debounce
 *   maxResults: 10,
 * };
 * ```
 */
interface UseSearchWorkerOptions {
  /**
   * URL to the JSON search index file.
   * Should be a static JSON file served from the public directory.
   *
   * @example '/search-index.json'
   */
  indexUrl: string;

  /**
   * Current locale for search field prioritization.
   * Affects which language fields get higher boost scores:
   * - 'ko': Korean name/description prioritized (boost 3x/1.5x)
   * - 'en': English name/description prioritized (boost 3x/1.5x)
   */
  locale: 'en' | 'ko';

  /**
   * Debounce delay in milliseconds before triggering search.
   *
   * @default 150
   *
   * Why 150ms?
   * - Average typing speed: 200-300ms between keystrokes
   * - 150ms catches most "still typing" scenarios
   * - Short enough to feel responsive
   * - Long enough to avoid unnecessary searches
   *
   * Adjust based on use case:
   * - Mobile users: Consider 200-250ms (slower typing)
   * - Power users: Consider 100ms (faster feedback)
   */
  debounceMs?: number;

  /**
   * Maximum number of results to return.
   *
   * @default 8
   *
   * Keep this small for dropdown UIs (5-10).
   * Increase for full search result pages (20-50).
   */
  maxResults?: number;
}

/**
 * Return type of the useSearchWorker hook.
 *
 * @example
 * ```typescript
 * const { query, setQuery, results, isLoading, isReady, error } = useSearchWorker({
 *   indexUrl: '/search-index.json',
 *   locale: 'en',
 * });
 *
 * // Check states
 * if (!isReady) return <Skeleton />;
 * if (error) return <Error message={error} />;
 * if (isLoading) return <Spinner />;
 * ```
 */
interface UseSearchWorkerReturn {
  /** Current search query string */
  query: string;

  /**
   * Update the search query.
   * Automatically debounces and triggers search.
   * Searches are skipped for queries shorter than 2 characters.
   */
  setQuery: (query: string) => void;

  /** Array of search results (empty if no query or no matches) */
  results: SearchResult[];

  /**
   * True while loading the search index (initial load only).
   * Use this to show a loading spinner on first mount.
   */
  isLoading: boolean;

  /**
   * True once the search index is loaded and ready.
   * Search operations are no-ops until this is true.
   * If user types before index loads, search runs automatically when ready.
   */
  isReady: boolean;

  /**
   * Error message if index loading failed.
   * Common errors: network failure, invalid JSON, 404.
   */
  error: string | null;
}

/**
 * React hook for client-side full-text search with MiniSearch.
 *
 * Provides a complete search solution with:
 * - Lazy loading of search index from a JSON file
 * - Debounced search to avoid excessive re-renders
 * - Locale-aware field boosting (prioritizes current language)
 * - Fuzzy matching and prefix search
 * - Loading, ready, and error states
 *
 * ## Basic Usage
 *
 * @example
 * ```tsx
 * function SearchBox() {
 *   const { query, setQuery, results, isReady, isLoading } = useSearchWorker({
 *     indexUrl: '/search-index.json',
 *     locale: 'en',
 *   });
 *
 *   return (
 *     <div>
 *       <input
 *         type="search"
 *         value={query}
 *         onChange={(e) => setQuery(e.target.value)}
 *         placeholder="Search..."
 *       />
 *       {isLoading && <Spinner />}
 *       {results.map((result) => (
 *         <div key={result.item.id}>
 *           {result.item.name.en} (score: {result.score?.toFixed(2)})
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * ## With Keyboard Navigation
 *
 * @example
 * ```tsx
 * function SearchDropdown() {
 *   const { query, setQuery, results, isReady } = useSearchWorker({
 *     indexUrl: '/search-index.json',
 *     locale: 'ko',
 *     maxResults: 5,
 *   });
 *   const [selectedIndex, setSelectedIndex] = useState(-1);
 *
 *   const handleKeyDown = (e: React.KeyboardEvent) => {
 *     switch (e.key) {
 *       case 'ArrowDown':
 *         setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
 *         break;
 *       case 'ArrowUp':
 *         setSelectedIndex((prev) => Math.max(prev - 1, 0));
 *         break;
 *       case 'Enter':
 *         if (results[selectedIndex]) {
 *           navigateTo(results[selectedIndex].item.id);
 *         }
 *         break;
 *     }
 *   };
 *
 *   return (
 *     <input
 *       value={query}
 *       onChange={(e) => setQuery(e.target.value)}
 *       onKeyDown={handleKeyDown}
 *     />
 *   );
 * }
 * ```
 *
 * ## Search Index Format
 *
 * The search index JSON file should be an array of {@link SearchIndexItem} objects:
 *
 * ```json
 * [
 *   {
 *     "id": "hello",
 *     "type": "entry",
 *     "name": { "en": "Hello", "ko": "안녕하세요" },
 *     "description": { "en": "A greeting", "ko": "인사말" },
 *     "tags": ["greetings"]
 *   }
 * ]
 * ```
 *
 * ## Field Boost Weights
 *
 * | Field                  | Boost | Rationale                              |
 * |------------------------|-------|----------------------------------------|
 * | name.{locale}          | 3x    | Primary match (current language)       |
 * | name.en                | 2x    | Fallback language                      |
 * | description.{locale}   | 1.5x  | Secondary content (current language)   |
 * | description.en         | 1x    | Base relevance                         |
 * | field                  | 1x    | Category matching                      |
 * | tags                   | 0.5x  | Auxiliary keywords                     |
 *
 * @param options - Configuration options
 * @returns Search state and controls
 *
 * @remarks
 * ## Implementation Notes
 *
 * **Cancellation Pattern**: Uses a `cancelled` flag to prevent state updates
 * after component unmount. This is safer than AbortController for our use case
 * because we need to handle both fetch and post-fetch processing.
 *
 * **Re-search on Ready**: If the user types before the index loads, the hook
 * automatically performs the search once the index becomes ready. This provides
 * a seamless UX without requiring manual retry logic.
 *
 * **Minimum Query Length**: Searches are skipped for queries shorter than 2
 * characters to avoid overly broad results and unnecessary processing.
 */
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

  // Refs for mutable values that don't trigger re-renders
  const miniSearchRef = useRef<MiniSearch<SearchIndexItem> | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef<SearchIndexItem[] | null>(null);

  // Load and initialize search index on mount
  // Re-initializes if indexUrl or locale changes
  useEffect(() => {
    // Skip on server-side (SSG build)
    if (typeof window === 'undefined') {
      return;
    }

    // Cancellation flag for cleanup - prevents state updates after unmount
    // This pattern is preferred over AbortController because we need to
    // cancel both the fetch AND post-fetch processing (indexing)
    let cancelled = false;

    const loadIndex = async () => {
      try {
        setIsLoading(true);

        // Fetch the search index JSON from public directory
        const response = await fetch(indexUrl);
        if (!response.ok) {
          throw new Error(`Failed to load search index: ${response.status}`);
        }
        const index: SearchIndexItem[] = await response.json();

        // Check cancellation after async operation
        if (cancelled) return;

        // Store raw index for result mapping later
        indexRef.current = index;

        // Create MiniSearch instance with locale-aware configuration
        // Fields are ordered by priority (locale-specific first)
        miniSearchRef.current = new MiniSearch<SearchIndexItem>({
          // Searchable fields - order doesn't affect search, boost does
          fields: [
            `name.${locale}`, // Primary: current locale name
            'name.en', // Fallback: English name (always indexed)
            `description.${locale}`, // Secondary: current locale description
            'description.en', // Fallback: English description
            'field', // Category/domain field
            'tags', // Additional keywords
          ],
          // Fields to store in search results (for display without lookup)
          storeFields: ['id', 'type', 'name', 'description', 'field', 'tags'],

          // Custom field extractor for nested objects (name.ko, description.en)
          // MiniSearch only handles flat objects by default
          extractField: (document, fieldName) => {
            // Split field path: "name.ko" → ["name", "ko"]
            const parts = fieldName.split('.');
            let value: unknown = document;

            // Traverse the object path
            for (const part of parts) {
              if (value && typeof value === 'object' && part in value) {
                value = (value as Record<string, unknown>)[part];
              } else {
                return undefined;
              }
            }

            // Join arrays (tags) into space-separated string for indexing
            if (Array.isArray(value)) {
              return value.join(' ');
            }

            return typeof value === 'string' ? value : undefined;
          },

          // Default search options applied to all queries
          searchOptions: {
            // Boost multipliers for field relevance ranking
            boost: {
              [`name.${locale}`]: 3, // Primary language name: highest priority
              'name.en': 2, // English name: high priority (fallback)
              [`description.${locale}`]: 1.5, // Primary language desc: medium
              'description.en': 1, // English description: base relevance
              field: 1, // Category: base relevance
              tags: 0.5, // Tags: lower (auxiliary keywords)
            },
            // Fuzzy matching: 0.2 = allow 20% character differences
            // "hello" matches "helo" (1 char diff in 5 chars = 20%)
            fuzzy: 0.2,
            // Prefix matching: "hel" matches "hello"
            prefix: true,
          },
        });

        // Index all documents (synchronous, fast for <1000 items)
        miniSearchRef.current.addAll(index);

        setIsReady(true);
        setIsLoading(false);
      } catch (err: unknown) {
        // Check cancellation before setting error state
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load search index');
        setIsLoading(false);
      }
    };

    loadIndex();

    // Cleanup: prevent state updates and clear pending debounce
    return () => {
      cancelled = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [indexUrl, locale]); // Re-initialize if URL or locale changes

  /**
   * Execute search and update results state.
   * Memoized to prevent unnecessary re-renders.
   */
  const performSearch = useCallback(
    (searchQuery: string) => {
      // Guard: require initialized index and valid query
      if (
        !miniSearchRef.current ||
        !indexRef.current ||
        !searchQuery.trim() ||
        searchQuery.length < 2 // Skip single-character queries (too broad)
      ) {
        setResults([]);
        return;
      }

      // Execute MiniSearch query and limit results
      const searchResults = miniSearchRef.current.search(searchQuery).slice(0, maxResults);

      // Map MiniSearch results back to our SearchResult format
      // We prefer original items from indexRef for complete data
      const mappedResults: SearchResult[] = searchResults.map((result) => {
        // Look up original item for complete, typed data
        // MiniSearch's stored fields may have type issues
        const originalItem = indexRef.current?.find((item) => item.id === result.id);
        return {
          item: originalItem || {
            // Fallback: construct from MiniSearch's stored fields
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

  /**
   * Debounced query setter.
   * Updates query state immediately (for controlled input) but
   * delays search execution to avoid excessive re-renders during typing.
   */
  const setQuery = useCallback(
    (searchQuery: string) => {
      // Update state immediately for controlled input value
      setQueryState(searchQuery);

      // Clear any pending debounced search
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Clear results immediately for empty/short queries
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setResults([]);
        return;
      }

      // Schedule debounced search
      debounceTimerRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, debounceMs);
    },
    [debounceMs, performSearch],
  );

  // Handle "type-before-ready" scenario:
  // If user typed a query before the index loaded, perform search when ready
  useEffect(() => {
    if (isReady && query.trim() && query.length >= 2) {
      performSearch(query);
    }
  }, [isReady, query, performSearch]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isReady,
    error,
  };
}
