/**
 * @fileoverview 공유 HomePage 컴포넌트 - Apple 스타일 미니멀 디자인
 */

import { LIMITS } from '@soundblue/core/validation';
import { type SearchResult, useSearchWorker } from '@soundblue/search/react';
import { useAutoAnimate } from '@soundblue/ui/hooks';
import { cn } from '@soundblue/ui/utils';
import { Link, useNavigate } from '@tanstack/react-router';
import { BookOpen, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FEATURED_CONCEPTS, featuredCardColors } from '../../data/featuredConcepts';
import { useI18n } from '../../i18n';
import { preloadSearchIndex } from '../../lib/search';
import { Layout } from '../layout/Layout';

export function HomePage() {
  const { locale, localePath, t } = useI18n();
  const navigate = useNavigate();

  // Search state
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = 'homepage-search-listbox';

  // Real-time search with Fuse.js
  const { query, setQuery, results, isLoading } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: LIMITS.SEARCH_MAX_RESULTS,
  });

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      const item = result.item;
      navigate({ to: localePath(`/concept/${item.id}`) });
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
      navigate({ to: `${localePath('/browse')}?q=${encodeURIComponent(query)}` });
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

  // Click-outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색 인덱스 프리로드
  useEffect(() => {
    preloadSearchIndex();
  }, []);

  // Auto-animate for featured concepts grid
  const [featuredGridRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center py-12 mb-8">
        <h1 className="text-4xl font-bold text-(--text-primary) mb-3">{t('logoText')}</h1>
        <p className="text-lg text-(--text-secondary) mb-8">{t('heroSubtitle')}</p>

        {/* Quick Search */}
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
              placeholder={t('searchConceptsPlaceholder')}
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
              aria-activedescendant={
                selectedIndex >= 0 ? `search-option-${selectedIndex}` : undefined
              }
              role="combobox"
              aria-autocomplete="list"
              autoComplete="off"
            />
            {/* Loading indicator */}
            {isLoading && query.trim() && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-(--text-tertiary) border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {/* Search Results Dropdown */}
            {showResults && results.length > 0 && (
              <div
                id={listboxId}
                role="listbox"
                className="absolute top-full left-0 right-0 mt-2 py-2 bg-(--bg-elevated) border border-(--border-primary) rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto text-left"
              >
                {results.map((result, index) => {
                  const item = result.item;
                  const name = locale === 'ko' ? item.name.ko : item.name.en;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      id={`search-option-${index}`}
                      role="option"
                      tabIndex={-1}
                      aria-selected={isSelected}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => handleResultClick(result)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleResultClick(result);
                      }}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer',
                        isSelected ? 'bg-(--bg-tertiary)' : 'hover:bg-(--bg-tertiary)',
                      )}
                    >
                      <span className="text-(--text-tertiary)">
                        <BookOpen size={16} aria-hidden="true" />
                      </span>
                      <span className="flex-1 text-(--text-primary) font-medium">{name}</span>
                      {item.field && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-(--accent-primary)/10 text-(--accent-primary)">
                          {item.field}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {/* No results message */}
            {showResults && query.trim() && !isLoading && results.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 py-4 px-4 bg-(--bg-elevated) border border-(--border-primary) rounded-xl shadow-lg z-50 text-center text-(--text-tertiary)">
                {t('noResults')}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Featured Concepts Grid */}
      <section aria-labelledby="featured-concepts-heading">
        <h2 id="featured-concepts-heading" className="sr-only">
          {t('featuredConcepts')}
        </h2>
        <div ref={featuredGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURED_CONCEPTS.map((concept) => (
            <Link
              key={concept.id}
              to={localePath(`/concept/${concept.id}`)}
              className={`block p-4 rounded-xl border no-underline transition-all hover:-translate-y-0.5 hover:shadow-md ${featuredCardColors[concept.colorClass]}`}
            >
              <div className="text-3xl mb-2">{concept.icon}</div>
              <h3 className="text-base font-medium text-(--text-primary) mb-1">
                {locale === 'ko' ? concept.nameKo : concept.nameEn}
              </h3>
              <p className="text-sm text-(--text-secondary) leading-snug">
                {locale === 'ko' ? concept.descKo : concept.descEn}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse All Link */}
      <div className="text-center mt-12">
        <Link
          to={localePath('/browse')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-(--accent-primary) font-medium transition-colors hover:bg-(--bg-tertiary)"
        >
          {t('browseAllConcepts')}
          <span>→</span>
        </Link>
      </div>
    </Layout>
  );
}
