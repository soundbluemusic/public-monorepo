/**
 * SearchDropdown Component
 * Reusable real-time search dropdown with Web Worker support
 * Used across Context, Roots, and Permissive apps
 */
import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SearchResult } from '../hooks/useSearchWorker';

export interface SearchDropdownProps {
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  onSelect: (result: SearchResult) => void;
  locale: 'en' | 'ko';
  placeholder?: { en: string; ko: string };
  renderResult?: (
    result: SearchResult,
    isSelected: boolean,
    locale: 'en' | 'ko',
  ) => React.ReactNode;
  className?: string;
}

export function SearchDropdown({
  query,
  onQueryChange,
  results,
  isLoading,
  onSelect,
  locale,
  placeholder = { en: 'Search... (⌘K)', ko: '검색... (⌘K)' },
  renderResult,
  className = '',
}: SearchDropdownProps) {
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset selection when results change - using ref to avoid dependency issues
  const prevResultsLengthRef = useRef(results.length);
  if (prevResultsLengthRef.current !== results.length) {
    prevResultsLengthRef.current = results.length;
    if (selectedIndex !== 0) {
      setSelectedIndex(0);
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
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
      } else if (e.key === 'Enter' && len > 0) {
        e.preventDefault();
        onSelect(results[selectedIndex]);
        setShowResults(false);
        onQueryChange('');
      }
    },
    [results, selectedIndex, onSelect, onQueryChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
    setShowResults(true);
  };

  const handleResultClick = (result: SearchResult, index: number) => {
    setSelectedIndex(index);
    onSelect(result);
    setShowResults(false);
    onQueryChange('');
  };

  const defaultRenderResult = (result: SearchResult, _isSelected: boolean) => {
    const name = result.item.name[locale] || result.item.name.en;
    const desc = result.item.description?.[locale] || result.item.description?.en;

    return (
      <div className="flex flex-col gap-0.5">
        <span style={{ color: 'var(--text-primary)' }} className="font-medium">
          {name}
        </span>
        {desc && (
          <span style={{ color: 'var(--text-tertiary)' }} className="text-xs line-clamp-1">
            {desc}
          </span>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-tertiary)' }}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder[locale]}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg focus:outline-none"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
          }}
        />
      </div>

      {/* Results Dropdown */}
      {showResults && query.length >= 2 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden z-50"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {locale === 'ko' ? '검색 중...' : 'Searching...'}
            </div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <button
                key={result.item.id}
                type="button"
                onClick={() => handleResultClick(result, index)}
                onMouseEnter={() => setSelectedIndex(index)}
                className="w-full px-4 py-3 text-left text-sm min-h-11"
                style={{
                  backgroundColor: selectedIndex === index ? 'var(--bg-tertiary)' : 'transparent',
                }}
              >
                {renderResult
                  ? renderResult(result, selectedIndex === index, locale)
                  : defaultRenderResult(result, selectedIndex === index)}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {locale === 'ko' ? '결과 없음' : 'No results'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
