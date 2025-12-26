/**
 * SearchDropdown Component
 * Reusable real-time search dropdown with Web Worker support
 * Used across Context, Roots, and Permissive apps
 */
import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SearchResult } from '../hooks/useSearchWorker';
import styles from '../styles/components.module.scss';

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
      <div className={styles.searchResultContent}>
        <span className={styles.searchResultName}>{name}</span>
        {desc && <span className={styles.searchResultField}>{desc}</span>}
      </div>
    );
  };

  return (
    <div ref={containerRef} className={`${styles.searchContainer} ${className}`}>
      <div style={{ position: 'relative' }}>
        <Search size={16} className={styles.searchIcon} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder[locale]}
          className={styles.searchInput}
        />
      </div>

      {/* Results Dropdown */}
      {showResults && query.length >= 2 && (
        <div className={styles.searchDropdown}>
          {isLoading ? (
            <div className={styles.searchLoading}>
              {locale === 'ko' ? '검색 중...' : 'Searching...'}
            </div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <button
                key={result.item.id}
                type="button"
                onClick={() => handleResultClick(result, index)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`${styles.searchResultButton} ${selectedIndex === index ? styles.searchResultButtonSelected : ''}`}
              >
                {renderResult
                  ? renderResult(result, selectedIndex === index, locale)
                  : defaultRenderResult(result, selectedIndex === index)}
              </button>
            ))
          ) : (
            <div className={styles.searchNoResults}>
              {locale === 'ko' ? '결과 없음' : 'No results'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
