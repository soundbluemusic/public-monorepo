import { LIMITS } from '@soundblue/core/validation';
import { useSearchWorker } from '@soundblue/search/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseGlobalSearchOptions {
  locale: 'en' | 'ko';
  localePath: (path: string) => string;
}

/**
 * 글로벌 검색 로직을 담당하는 커스텀 훅
 * - 검색 워커 통합
 * - 키보드 단축키 (Ctrl+K, /)
 * - 검색 결과 선택 및 네비게이션
 */
export function useGlobalSearch({ locale, localePath }: UseGlobalSearchOptions) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fuzzy search with debouncing via useSearchWorker
  const {
    query,
    setQuery,
    results: searchResults,
    isReady,
  } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: LIMITS.SEARCH_MAX_RESULTS,
  });

  // Map search results to simple format for rendering
  const results = useMemo(
    () =>
      searchResults.map((r) => ({
        id: r.item.id,
        name: r.item.name,
      })),
    [searchResults],
  );

  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Global keyboard shortcuts
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      inputRef.current?.focus();
    }
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleGlobalKeyDown, handleClickOutside]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) {
        if (e.key === 'Enter' && query.trim()) setIsOpen(true);
        return;
      }
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
          break;
        case 'Enter': {
          e.preventDefault();
          const selectedResult = results[selectedIndex];
          if (selectedIndex >= 0 && selectedResult) {
            navigate({ to: localePath(`/entry/${selectedResult.id}`) });
            setIsOpen(false);
            setQuery('');
          }
          break;
        }
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, results, selectedIndex, query, navigate, localePath, setQuery],
  );

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      setIsOpen(value.trim().length > 0);
      setSelectedIndex(-1);
    },
    [setQuery],
  );

  const handleFocus = useCallback(() => {
    if (query.trim()) setIsOpen(true);
  }, [query]);

  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, [setQuery]);

  const handleResultClick = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, [setQuery]);

  const handleMouseEnter = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return {
    // Refs
    inputRef,
    containerRef,
    // State
    query,
    results,
    isOpen,
    isReady,
    selectedIndex,
    // Handlers
    handleKeyDown,
    handleChange,
    handleFocus,
    handleBlur: () => {}, // Not needed for state, only for UI
    handleClear,
    handleResultClick,
    handleMouseEnter,
  };
}
