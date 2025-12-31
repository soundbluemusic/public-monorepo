/**
 * @fileoverview React Search Hook
 * @environment client-only
 *
 * SearchEngine을 React 컴포넌트에서 사용하기 위한 훅.
 * 상태 관리, 메모이제이션, 자동완성을 통합합니다.
 *
 * @example
 * ```tsx
 * import { useSearch } from '@soundblue/search/react';
 *
 * function SearchPage({ entries }) {
 *   const { query, setQuery, results, suggestions } = useSearch({
 *     config: { fields: ['word', 'definition'], storeFields: ['word'] },
 *     data: entries,
 *     limit: 20,
 *   });
 *
 *   return (
 *     <div>
 *       <input value={query} onChange={e => setQuery(e.target.value)} />
 *       {suggestions.map(s => <span key={s}>{s}</span>)}
 *       {results.map(r => <div key={r.id}>{r.item.word}</div>)}
 *     </div>
 *   );
 * }
 * ```
 */
import { useCallback, useMemo, useState } from 'react';
import { SearchEngine } from '../core/engine';
import type { SearchableItem, SearchConfig, SearchResult } from '../core/types';
import { sanitizeSearchQuery } from '../core/utils';

/**
 * useSearch 훅 옵션
 *
 * @typeParam T - 검색 가능한 아이템 타입
 */
export interface UseSearchOptions<T extends SearchableItem> {
  /** 검색 엔진 설정 (fields, storeFields, searchOptions) */
  config: SearchConfig;
  /** 검색할 데이터 배열 */
  data: T[];
  /** 반환할 최대 결과 수 (기본값: 10) */
  limit?: number;
}

/**
 * useSearch 훅 반환 타입
 *
 * @typeParam T - 검색 가능한 아이템 타입
 */
export interface UseSearchReturn<T extends SearchableItem> {
  /** 현재 검색어 */
  query: string;
  /** 검색어 설정 함수 (자동으로 sanitize됨) */
  setQuery: (query: string) => void;
  /** 검색 결과 배열 */
  results: SearchResult<T>[];
  /** 검색 진행 중 여부 */
  isSearching: boolean;
  /** 자동완성 제안 목록 */
  suggestions: string[];
  /** 검색어 초기화 함수 */
  clear: () => void;
}

/**
 * React 검색 훅
 *
 * SearchEngine을 React 컴포넌트에서 쉽게 사용할 수 있도록 래핑합니다.
 * 검색 엔진 인스턴스는 데이터 변경 시에만 재생성되어 성능을 최적화합니다.
 *
 * @typeParam T - 검색 가능한 아이템 타입. `SearchableItem`을 확장해야 합니다.
 *
 * @param options - 검색 옵션
 * @param options.config - 검색 엔진 설정
 * @param options.data - 검색할 데이터 배열
 * @param options.limit - 최대 결과 수 (기본값: 10)
 *
 * @returns 검색 상태와 제어 함수
 *
 * @example
 * ```tsx
 * function DictionarySearch({ entries }: { entries: Entry[] }) {
 *   const {
 *     query,
 *     setQuery,
 *     results,
 *     isSearching,
 *     suggestions,
 *     clear,
 *   } = useSearch({
 *     config: {
 *       fields: ['word', 'definition', 'examples'],
 *       storeFields: ['word', 'category'],
 *       searchOptions: {
 *         boost: { word: 3, definition: 1 },
 *         fuzzy: 0.2,
 *       },
 *     },
 *     data: entries,
 *     limit: 20,
 *   });
 *
 *   return (
 *     <div>
 *       <SearchInput
 *         value={query}
 *         onChange={setQuery}
 *         onClear={clear}
 *         suggestions={suggestions}
 *       />
 *       {isSearching && <Spinner />}
 *       <SearchResults results={results} />
 *     </div>
 *   );
 * }
 * ```
 */
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
