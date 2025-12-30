import { LIMITS } from '@soundblue/core/validation';
import { type SearchResult, useSearchWorker } from '@soundblue/search/react';
import { cn } from '@soundblue/ui/utils';
import { Globe, Package, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

interface HomeSearchProps {
  locale: 'en' | 'ko';
  localePath: (path: string) => string;
}

export function HomeSearch({ locale, localePath }: HomeSearchProps) {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = 'homepage-search-listbox';

  const { query, setQuery, results, isLoading, isReady } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: LIMITS.SEARCH_MAX_RESULTS,
  });

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      const item = result.item;
      // Remove 'lib-' or 'api-' prefix from id for correct routing
      const slug = item.id.replace(/^(lib-|api-)/, '');
      const path =
        item.type === 'library'
          ? `${localePath('/library')}/${slug}`
          : `${localePath('/web-api')}#${slug}`;
      navigate(path);
      setShowResults(false);
      setQuery('');
    },
    [navigate, localePath, setQuery],
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleResultClick(results[selectedIndex]);
    } else if (query.trim()) {
      navigate(`${localePath('/libraries')}?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const len = results.length;
    if (!showResults || len === 0) {
      if (e.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % len);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + len) % len);
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="max-w-md mx-auto" ref={containerRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search
          size={18}
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
        />
        <input
          ref={inputRef}
          type="search"
          placeholder={
            locale === 'ko'
              ? 'React, Vite, View Transitions... 검색'
              : 'Search React, Vite, View Transitions...'
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="w-full min-h-12 pl-11 pr-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-hidden focus:border-(--border-focus) transition-colors [&::-webkit-search-cancel-button]:hidden"
          aria-expanded={showResults && results.length > 0}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={selectedIndex >= 0 ? `search-option-${selectedIndex}` : undefined}
          role="combobox"
          aria-autocomplete="list"
          autoComplete="off"
        />
        {(isLoading || (!isReady && query.trim())) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-(--text-tertiary) border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {showResults &&
            !isLoading &&
            results.length > 0 &&
            (locale === 'ko'
              ? `${results.length}개의 검색 결과`
              : `${results.length} search results`)}
          {showResults &&
            !isLoading &&
            query.trim() &&
            results.length === 0 &&
            (locale === 'ko' ? '검색 결과가 없습니다' : 'No results found')}
        </div>
        {showResults && results.length > 0 && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute top-full left-0 right-0 mt-2 py-2 bg-(--bg-elevated) border border-(--border-primary) rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {results.map((result, index) => {
              const item = result.item;
              const name = locale === 'ko' ? item.name.ko : item.name.en;
              const isSelected = index === selectedIndex;
              return (
                <button
                  type="button"
                  key={item.id}
                  id={`search-option-${index}`}
                  role="option"
                  tabIndex={isSelected ? 0 : -1}
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleResultClick(result)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleResultClick(result);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer w-full',
                    isSelected ? 'bg-(--bg-tertiary)' : 'hover:bg-(--bg-tertiary)',
                  )}
                >
                  <span className="text-(--text-tertiary)">
                    {item.type === 'library' ? (
                      <Package size={16} aria-hidden="true" />
                    ) : (
                      <Globe size={16} aria-hidden="true" />
                    )}
                  </span>
                  <span className="flex-1 text-(--text-primary) font-medium">{name}</span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      item.type === 'library'
                        ? 'bg-(--accent-primary)/10 text-(--accent-primary)'
                        : 'bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400',
                    )}
                  >
                    {item.type === 'library' ? 'Library' : 'API'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {showResults &&
          query.trim() &&
          query.length >= 2 &&
          !isLoading &&
          isReady &&
          results.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 py-4 px-4 bg-(--bg-elevated) border border-(--border-primary) rounded-xl shadow-lg z-50 text-center text-(--text-tertiary)">
              {locale === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
            </div>
          )}
      </form>
      <p className="text-sm text-(--text-tertiary) mt-2">
        {locale === 'ko' ? '실시간으로 검색됩니다' : 'Search results appear as you type'}
      </p>
    </div>
  );
}
