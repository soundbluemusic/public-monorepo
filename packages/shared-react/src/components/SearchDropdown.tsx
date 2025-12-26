/**
 * SearchDropdown Component
 * Reusable real-time search dropdown with Web Worker support
 * Used across Context, Roots, and Permissive apps
 *
 * Features:
 * - Keyboard shortcuts: ⌘K/Ctrl+K, /, ↑↓, Enter, Escape
 * - ARIA accessibility (combobox pattern)
 * - Responsive design with touch targets
 * - Clear button and shortcut badge
 */
import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SearchResult } from '../hooks/useSearchWorker';
import { cn } from '../utils/cn';

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
  placeholder = { en: 'Search...', ko: '검색...' },
  renderResult,
  className = '',
}: SearchDropdownProps) {
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useRef(`search-listbox-${Math.random().toString(36).slice(2, 9)}`).current;

  // Detect Mac for shortcut display
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const shortcutKey = isMac ? '⌘K' : 'Ctrl+K';

  // Reset selection when results change
  const prevResultsLengthRef = useRef(results.length);
  if (prevResultsLengthRef.current !== results.length) {
    prevResultsLengthRef.current = results.length;
    if (selectedIndex !== -1) {
      setSelectedIndex(-1);
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

  // Global keyboard shortcuts (Cmd/Ctrl + K, /)
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowResults(true);
      }
      // "/" shortcut (only when not in input/textarea)
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
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    onQueryChange('');
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult, index: number) => {
    setSelectedIndex(index);
    onSelect(result);
    setShowResults(false);
    onQueryChange('');
  };

  const handleFocus = () => {
    setShowResults(true);
  };

  const defaultRenderResult = (result: SearchResult, _isSelected: boolean) => {
    const name = result.item.name[locale] || result.item.name.en;
    const desc = result.item.description?.[locale] || result.item.description?.en;

    return (
      <div className="flex flex-col items-start gap-0.5">
        <span className="font-medium text-(--text-primary)">{name}</span>
        {desc && <span className="text-xs text-(--text-tertiary) line-clamp-1">{desc}</span>}
      </div>
    );
  };

  const isOpen = showResults && query.length >= 2;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        {/* Search Icon */}
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-tertiary) pointer-events-none"
          aria-hidden="true"
        />

        {/* Input */}
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder[locale]}
          className={cn(
            'w-full h-9 max-md:h-10 text-base',
            'pl-9 pr-16',
            'bg-(--bg-tertiary) border border-(--border-primary) rounded-xl',
            'text-(--text-primary) placeholder:text-(--text-tertiary)',
            'focus:outline-none focus:border-(--border-focus) focus:bg-(--bg-secondary)',
            'transition-colors',
          )}
          // ARIA attributes for combobox pattern
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={selectedIndex >= 0 ? `search-option-${selectedIndex}` : undefined}
        />

        {/* Right side: Clear button or Shortcut badge */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query ? (
            // Clear button
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded text-(--text-tertiary) hover:text-(--text-primary) hover:bg-(--bg-tertiary) transition-colors"
              aria-label={locale === 'ko' ? '검색어 지우기' : 'Clear search'}
            >
              <X size={14} />
            </button>
          ) : (
            // Shortcut badge (hidden on mobile)
            <span
              className="hidden md:inline-flex text-[0.6875rem] px-1.5 py-0.5 bg-(--bg-secondary) border border-(--border-primary) rounded text-(--text-tertiary)"
              aria-hidden="true"
            >
              {shortcutKey}
            </span>
          )}
        </div>
      </div>

      {/* Results Dropdown - uses ARIA combobox pattern (role="listbox" + role="option") */}
      {isOpen && (
        <div
          id={listboxId}
          tabIndex={-1}
          className="absolute top-[calc(100%+4px)] left-0 right-0 z-[600] max-h-75 overflow-y-auto rounded-xl bg-(--bg-secondary) border border-(--border-primary) shadow-lg"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-(--text-tertiary)">
              {locale === 'ko' ? '검색 중...' : 'Searching...'}
            </div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <button
                key={result.item.id}
                id={`search-option-${index}`}
                type="button"
                aria-selected={selectedIndex === index}
                onClick={() => handleResultClick(result, index)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  'w-full px-4 py-3 text-left transition-colors cursor-pointer',
                  selectedIndex === index ? 'bg-(--accent-primary)/10' : 'hover:bg-(--bg-tertiary)',
                )}
              >
                {renderResult
                  ? renderResult(result, selectedIndex === index, locale)
                  : defaultRenderResult(result, selectedIndex === index)}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-(--text-tertiary)">
              {locale === 'ko' ? '검색 결과 없음' : 'No results found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
