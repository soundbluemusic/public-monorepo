/**
 * @fileoverview SearchDropdown Component
 * @environment universal
 *
 * Reusable real-time search dropdown with keyboard navigation
 */
import type * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';

/** Generic search result item interface */
export interface SearchResultItem {
  id: string;
  name: { en: string; ko?: string };
  description?: { en: string; ko?: string };
}

/** Search result wrapper */
export interface SearchResult<T extends SearchResultItem = SearchResultItem> {
  item: T;
  score?: number;
}

export interface SearchDropdownProps<T extends SearchResultItem = SearchResultItem> {
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResult<T>[];
  isLoading: boolean;
  onSelect: (result: SearchResult<T>) => void;
  locale: 'en' | 'ko';
  placeholder?: { en: string; ko: string };
  renderResult?: (
    result: SearchResult<T>,
    isSelected: boolean,
    locale: 'en' | 'ko',
  ) => React.ReactNode;
  className?: string;
}

export function SearchDropdown<T extends SearchResultItem = SearchResultItem>({
  query,
  onQueryChange,
  results,
  isLoading,
  onSelect,
  locale,
  placeholder = { en: 'Search...', ko: '검색...' },
  renderResult,
  className = '',
}: SearchDropdownProps<T>) {
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useRef(`search-listbox-${Math.random().toString(36).slice(2, 9)}`).current;

  const isMac =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  const shortcutKey = isMac ? '\u2318K' : 'Ctrl+K';

  const prevResultsLengthRef = useRef(results.length);
  if (prevResultsLengthRef.current !== results.length) {
    prevResultsLengthRef.current = results.length;
    if (selectedIndex !== -1) {
      setSelectedIndex(-1);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowResults(true);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
        setShowResults(true);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const len = results.length;

      if (e.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
        return;
      }

      if (e.key === 'ArrowDown' && len > 0) {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % len);
      } else if (e.key === 'ArrowUp' && len > 0) {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + len) % len);
      } else if (e.key === 'Enter' && selectedIndex >= 0 && len > 0) {
        e.preventDefault();
        const selectedResult = results[selectedIndex];
        if (selectedResult) {
          onSelect(selectedResult);
          setShowResults(false);
          onQueryChange('');
        }
      }
    },
    [results, selectedIndex, onSelect, onQueryChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
    setShowResults(true);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    onQueryChange('');
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult<T>, index: number) => {
    setSelectedIndex(index);
    onSelect(result);
    setShowResults(false);
    onQueryChange('');
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query.trim()) setShowResults(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const defaultRenderResult = (result: SearchResult<T>, _isSelected: boolean) => {
    const name = result.item.name[locale] || result.item.name.en;
    const desc = result.item.description?.[locale] || result.item.description?.en;

    return (
      <>
        <span className="text-sm font-medium text-(--text-primary)">{name}</span>
        {desc && <span className="text-xs text-(--text-tertiary)">{desc}</span>}
      </>
    );
  };

  const isOpen = showResults && query.length >= 2;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative flex items-center">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-tertiary) pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder[locale]}
          className={cn(
            'w-full h-9 max-md:h-10 text-sm',
            'pl-9 pr-10',
            'rounded-xl outline-hidden',
            'transition-[border-color,background-color] duration-150',
            '[&::-webkit-search-cancel-button]:hidden',
            'text-(--text-primary) placeholder:text-(--text-tertiary)',
            'bg-(--bg-tertiary) border border-(--border-primary)',
            'focus:bg-(--bg-secondary) focus:border-(--border-focus)',
          )}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={selectedIndex >= 0 ? `search-option-${selectedIndex}` : undefined}
        />

        {!isFocused && !query && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center px-1.5 py-0.5 text-[0.6875rem] font-medium rounded pointer-events-none max-md:hidden text-(--text-tertiary) bg-(--bg-secondary) border border-(--border-primary)"
            aria-hidden="true"
          >
            {shortcutKey}
          </span>
        )}

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 p-0 bg-transparent border-none rounded cursor-pointer transition-all duration-150 text-(--text-tertiary) hover:text-(--text-primary) active:scale-90"
            aria-label={locale === 'ko' ? '검색어 지우기' : 'Clear search'}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          className="absolute top-[calc(100%+4px)] left-0 right-0 z-[600] max-h-75 overflow-y-auto rounded-xl shadow-lg m-0 p-1 bg-(--bg-secondary) border border-(--border-primary)"
        >
          {isLoading ? (
            <div className="px-3 py-2.5 text-sm text-(--text-tertiary)">
              {locale === 'ko' ? '검색 중...' : 'Searching...'}
            </div>
          ) : (
            results.map((result, index) => (
              <button
                key={result.item.id}
                id={`search-option-${index}`}
                type="button"
                role="option"
                tabIndex={0}
                aria-selected={selectedIndex === index}
                onClick={() => handleResultClick(result, index)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  'flex flex-col gap-0.5 w-full py-2.5 px-3 text-left rounded-lg transition-all duration-150 cursor-pointer border-none',
                  selectedIndex === index ? 'bg-(--bg-tertiary)' : 'hover:bg-(--bg-tertiary)',
                )}
              >
                {renderResult
                  ? renderResult(result, selectedIndex === index, locale)
                  : defaultRenderResult(result, selectedIndex === index)}
              </button>
            ))
          )}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && !isLoading && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-[600] rounded-xl shadow-lg p-4 text-center text-sm bg-(--bg-secondary) border border-(--border-primary) text-(--text-tertiary)">
          {locale === 'ko' ? '검색 결과 없음' : 'No results found'}
        </div>
      )}
    </div>
  );
}
