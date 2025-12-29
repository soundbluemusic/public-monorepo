import { LIMITS, metaFactory } from '@soundblue/shared';
import { cn, type SearchResult, useSearchWorker } from '@soundblue/shared-react';
import {
  ChevronRight,
  Compass,
  Flame,
  Gamepad2,
  Globe,
  MessageSquare,
  Package,
  Palette,
  Radio,
  Rocket,
  Search,
  Shield,
  Sparkles,
  TestTube,
  Zap,
} from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';

export const meta = metaFactory({
  ko: {
    title: 'Permissive - 무료 웹개발 도구 모음',
    description: '웹표준 API와 MIT 라이센스 라이브러리를 한눈에 보세요',
  },
  en: {
    title: 'Permissive - Free Web Dev Tools',
    description: 'Web Standard APIs and MIT licensed libraries at a glance',
  },
});

const trendingLibraries: { name: string; category: string; icon: ReactNode }[] = [
  { name: 'Bun', category: 'Runtime', icon: <Zap size={18} aria-hidden="true" /> },
  { name: 'Astro', category: 'Meta-framework', icon: <Rocket size={18} aria-hidden="true" /> },
  { name: 'shadcn/ui', category: 'UI', icon: <Palette size={18} aria-hidden="true" /> },
  {
    name: 'TanStack Query',
    category: 'Data Fetching',
    icon: <Radio size={18} aria-hidden="true" />,
  },
  { name: 'Vitest', category: 'Testing', icon: <TestTube size={18} aria-hidden="true" /> },
  { name: 'Zod', category: 'Type Safety', icon: <Shield size={18} aria-hidden="true" /> },
];

const trendingApis: { name: string; icon: ReactNode }[] = [
  { name: 'View Transitions API', icon: <Sparkles size={18} aria-hidden="true" /> },
  { name: 'WebGPU', icon: <Gamepad2 size={18} aria-hidden="true" /> },
  { name: 'Navigation API', icon: <Compass size={18} aria-hidden="true" /> },
  { name: 'Popover API', icon: <MessageSquare size={18} aria-hidden="true" /> },
];

export default function Home() {
  const { locale, localePath } = useI18n();
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = 'homepage-search-listbox';

  // Real-time search with Fuse.js (full index)
  const { query, setQuery, results, isLoading } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: LIMITS.SEARCH_MAX_RESULTS,
  });

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      const item = result.item;
      const path =
        item.type === 'library'
          ? `${localePath('/libraries')}#${item.id}`
          : `${localePath('/web-api')}#${item.id}`;
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
        setSelectedIndex((prev) => (prev + 1) % len); // Wrap around
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + len) % len); // Wrap around
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Click-outside to close dropdown (fixes mobile touch race condition)
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
    <DocsLayout>
      {/* Hero Section */}
      <div className="text-center py-12 md:py-16">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 text-xs sm:text-sm font-medium mb-6 max-w-full">
          <Flame size={16} aria-hidden="true" className="shrink-0" />
          <span className="truncate">
            {locale === 'ko' ? '2025년 최신 기술 업데이트' : '2025 Latest Tech Updated'}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-(--text-primary) mb-4">
          {locale === 'ko' ? '무료 웹개발 도구 모음' : 'Free Web Dev Tools'}
        </h1>

        <p className="text-lg text-(--text-secondary) mb-8 max-w-xl mx-auto">
          {locale === 'ko'
            ? '100개 이상의 MIT 라이브러리와 58개 웹표준 API를 한눈에'
            : '100+ MIT licensed libraries and 58 Web Standard APIs at a glance'}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 mb-8">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-(--accent-primary)">100+</div>
            <div className="text-sm text-(--text-tertiary)">
              {locale === 'ko' ? 'OSS 라이브러리' : 'OSS Libraries'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-(--accent-primary)">58</div>
            <div className="text-sm text-(--text-tertiary)">
              {locale === 'ko' ? '웹 표준 API' : 'Web APIs'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-(--accent-primary)">13</div>
            <div className="text-sm text-(--text-tertiary)">
              {locale === 'ko' ? '카테고리' : 'Categories'}
            </div>
          </div>
        </div>

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
                className="absolute top-full left-0 right-0 mt-2 py-2 bg-(--bg-elevated) border border-(--border-primary) rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
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
                            ? 'bg-purple-500/10 text-purple-500'
                            : 'bg-blue-500/10 text-blue-500',
                        )}
                      >
                        {item.type === 'library' ? 'Library' : 'API'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {/* No results message */}
            {showResults && query.trim() && !isLoading && results.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 py-4 px-4 bg-(--bg-elevated) border border-(--border-primary) rounded-xl shadow-lg z-50 text-center text-(--text-tertiary)">
                {locale === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
              </div>
            )}
          </form>
          <p className="text-sm text-(--text-tertiary) mt-2">
            {locale === 'ko' ? '실시간으로 검색됩니다' : 'Search results appear as you type'}
          </p>
        </div>
      </div>

      {/* Trending Section */}
      <div className="py-8">
        <h2 className="text-xl font-semibold text-(--text-primary) mb-6 flex items-center gap-2">
          <Flame size={20} aria-hidden="true" className="text-orange-500" />
          {locale === 'ko' ? '2025년 트렌딩' : 'Trending 2025'}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Trending Libraries */}
          <div>
            <h3 className="text-sm font-medium text-(--text-tertiary) uppercase tracking-wider mb-3">
              Libraries
            </h3>
            <div className="space-y-2">
              {trendingLibraries.map((lib) => (
                <Link
                  key={lib.name}
                  to={`${localePath('/libraries')}?trending=true`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:border-(--border-focus) hover:shadow-sm group"
                >
                  <span className="text-(--accent-primary)">{lib.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-(--text-primary)">{lib.name}</div>
                    <div className="text-xs text-(--text-tertiary)">{lib.category}</div>
                  </div>
                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className="text-(--text-tertiary) opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Web APIs */}
          <div>
            <h3 className="text-sm font-medium text-(--text-tertiary) uppercase tracking-wider mb-3">
              Web APIs
            </h3>
            <div className="space-y-2">
              {trendingApis.map((api) => (
                <Link
                  key={api.name}
                  to={`${localePath('/web-api')}?trending=true`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:border-(--border-focus) hover:shadow-sm group"
                >
                  <span className="text-(--accent-primary)">{api.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-(--text-primary) truncate">{api.name}</div>
                  </div>
                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className="text-(--text-tertiary) opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Main Cards */}
      <div className="grid md:grid-cols-2 gap-4 py-8">
        {/* Web API Card */}
        <Link
          to={localePath('/web-api')}
          className="p-6 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:-translate-y-1 hover:shadow-lg hover:border-(--border-focus) group"
        >
          <div className="text-blue-500 mb-4">
            <Globe size={32} aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-(--text-primary) mb-2">Web API</h2>
          <p className="text-sm text-(--text-secondary) mb-4">
            {locale === 'ko'
              ? '브라우저 내장 API. 설치 없이 무료로 사용'
              : 'Browser built-in APIs. Free to use, no installation'}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-(--accent-primary)">58</div>
            <div className="flex items-center gap-1 text-sm text-(--accent-primary) font-medium">
              {locale === 'ko' ? '둘러보기' : 'Browse'}
              <ChevronRight
                size={16}
                aria-hidden="true"
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </Link>

        {/* Libraries Card */}
        <Link
          to={localePath('/libraries')}
          className="p-6 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:-translate-y-1 hover:shadow-lg hover:border-(--border-focus) group"
        >
          <div className="text-purple-500 mb-4">
            <Package size={32} aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-(--text-primary) mb-2">Libraries</h2>
          <p className="text-sm text-(--text-secondary) mb-4">
            {locale === 'ko'
              ? 'MIT 라이센스 오픈소스. 상업적 사용 가능'
              : 'MIT licensed open source. Free for commercial use'}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-(--accent-primary)">100+</div>
            <div className="flex items-center gap-1 text-sm text-(--accent-primary) font-medium">
              {locale === 'ko' ? '둘러보기' : 'Browse'}
              <ChevronRight
                size={16}
                aria-hidden="true"
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Categories */}
      <div className="py-8 text-center">
        <h3 className="text-sm font-medium text-(--text-tertiary) uppercase tracking-wider mb-4">
          {locale === 'ko' ? '카테고리로 탐색' : 'Browse by Category'}
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            'Meta-frameworks',
            'Build Tools',
            'State Management',
            'UI Components',
            'Testing',
            'Animation',
          ].map((cat) => (
            <Link
              key={cat}
              to={`${localePath('/libraries')}?category=${encodeURIComponent(cat)}`}
              className="px-4 py-2 rounded-full bg-(--bg-tertiary) text-(--text-secondary) text-sm font-medium no-underline transition-colors hover:bg-(--accent-primary)/10 hover:text-(--accent-primary)"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Built with section */}
      <div className="py-8 text-center border-t border-(--border-primary)">
        <p className="text-sm text-(--text-tertiary) mb-3">
          {locale === 'ko'
            ? '이 사이트도 여기 있는 도구로 만들었어요'
            : 'This site is built with tools listed here'}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {['React Router v7', 'React', 'Tailwind CSS', 'TypeScript', 'Vite'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-(--bg-tertiary) text-(--text-secondary) text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </DocsLayout>
  );
}
