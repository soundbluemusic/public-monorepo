/**
 * useSearch Hook
 *
 * 검색 엔진을 React에서 사용하기 위한 훅
 */
import { useCallback, useMemo, useState } from 'react';
import { SearchEngine } from '../core/engine';
import type { SearchableItem, SearchConfig, SearchResult } from '../core/types';
import { sanitizeSearchQuery } from '../core/utils';

interface UseSearchOptions<T extends SearchableItem> {
  config: SearchConfig;
  data: T[];
  limit?: number;
}

interface UseSearchReturn<T extends SearchableItem> {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult<T>[];
  isSearching: boolean;
  suggestions: string[];
  clear: () => void;
}

export function useSearch<T extends SearchableItem>({
  config,
  data,
  limit = 10,
}: UseSearchOptions<T>): UseSearchReturn<T> {
  const [query, setQueryState] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // 검색 엔진 인스턴스 (데이터 변경 시에만 재생성)
  const engine = useMemo(() => {
    const e = new SearchEngine<T>(config);
    e.addAll(data);
    return e;
  }, [config, data]);

  // 검색 결과
  const results = useMemo(() => {
    if (!query) return [];
    setIsSearching(true);
    const searchResults = engine.search(query, limit);
    setIsSearching(false);
    return searchResults;
  }, [engine, query, limit]);

  // 자동완성 제안
  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    return engine.suggest(query, 5);
  }, [engine, query]);

  const setQuery = useCallback((q: string) => {
    setQueryState(sanitizeSearchQuery(q));
  }, []);

  const clear = useCallback(() => {
    setQueryState('');
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    suggestions,
    clear,
  };
}
