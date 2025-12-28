import { cn } from '@soundblue/shared-react';
import { CalendarPlus, Flame, Search, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { useLoaderData, useSearchParams } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { type CategoryFilter, categories, type Library, libraries } from '../data/libraries';
import { useI18n } from '../i18n';

type SortOption = 'stars' | 'newest' | 'name';

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 */
export async function loader() {
  return {
    libraries,
    categories,
  };
}

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  const title = 'Libraries - Permissive';
  const description = isKorean
    ? 'MIT 라이센스 오픈소스 라이브러리'
    : 'MIT licensed open source libraries';

  return [{ title }, { name: 'description', content: description }];
};

export default function LibrariesPage() {
  const { libraries: libs, categories: cats } = useLoaderData<{
    libraries: Library[];
    categories: typeof categories;
  }>();
  const { locale } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params (one-way: URL → State on mount only)
  const initialParams = {
    q: searchParams.get('q') || '',
    category: (searchParams.get('category') as CategoryFilter) || 'All',
    tag: searchParams.get('tag'),
    filter: searchParams.get('filter'),
    trending: searchParams.get('trending'),
  };

  const [search, setSearch] = useState(initialParams.q);
  const [category, setCategory] = useState<CategoryFilter>(
    categories.includes(initialParams.category) ? initialParams.category : 'All',
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(initialParams.tag);
  const [quickFilter, setQuickFilter] = useState<'trending' | 'usedHere' | 'new' | null>(() => {
    if (initialParams.trending === 'true') return 'trending';
    if (initialParams.filter === 'usedHere' || initialParams.filter === 'new')
      return initialParams.filter;
    return null;
  });
  const [sortBy, setSortBy] = useState<SortOption>('stars');

  const filteredLibraries = useMemo(() => {
    let filtered = libs;

    // Quick filters
    if (quickFilter === 'trending') {
      filtered = filtered.filter((lib) => lib.trending);
    } else if (quickFilter === 'usedHere') {
      filtered = filtered.filter((lib) => lib.usedHere);
    } else if (quickFilter === 'new') {
      filtered = filtered.filter((lib) => lib.yearReleased && lib.yearReleased >= 2023);
    }

    // Category filter
    if (category !== 'All') {
      filtered = filtered.filter((lib) => lib.category === category);
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter((lib) => lib.tags?.includes(selectedTag));
    }

    // Search filter
    const q = search.toLowerCase().slice(0, 100);
    if (q) {
      filtered = filtered.filter(
        (lib) =>
          lib.name.toLowerCase().includes(q) ||
          lib.description.toLowerCase().includes(q) ||
          lib.descriptionKo.includes(q),
      );
    }

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'stars') {
        const aStars = Number.parseInt(a.stars.replace('k', '000'), 10);
        const bStars = Number.parseInt(b.stars.replace('k', '000'), 10);
        return bStars - aStars;
      }
      if (sortBy === 'newest') {
        return (b.yearReleased || 0) - (a.yearReleased || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [libs, search, category, selectedTag, quickFilter, sortBy]);

  const groupedLibraries = useMemo(() => {
    if (category !== 'All') {
      return { [category]: filteredLibraries };
    }
    return filteredLibraries.reduce<Record<string, Library[]>>((acc, lib) => {
      const arr = acc[lib.category] ?? [];
      arr.push(lib);
      acc[lib.category] = arr;
      return acc;
    }, {});
  }, [filteredLibraries, category]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setQuickFilter(null);
    const params = new URLSearchParams(searchParams);
    params.set('tag', tag);
    setSearchParams(params);
  };

  const handleQuickFilter = (filter: 'trending' | 'usedHere' | 'new') => {
    if (quickFilter === filter) {
      setQuickFilter(null);
      const params = new URLSearchParams(searchParams);
      params.delete('filter');
      params.delete('trending');
      setSearchParams(params);
    } else {
      setQuickFilter(filter);
      setSelectedTag(null);
      const params = new URLSearchParams(searchParams);
      if (filter === 'trending') {
        params.set('trending', 'true');
      } else {
        params.set('filter', filter);
      }
      params.delete('tag');
      setSearchParams(params);
    }
  };

  const clearFilters = () => {
    setQuickFilter(null);
    setSelectedTag(null);
    setCategory('All');
    setSearch('');
    setSearchParams({});
  };

  return (
    <DocsLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-(--text-primary) mb-2">Libraries</h1>
        <p className="text-(--text-secondary)">
          {locale === 'ko'
            ? 'MIT 라이센스 오픈소스. 상업적 사용 가능'
            : 'MIT licensed open source. Free for commercial use'}
        </p>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleQuickFilter('trending')}
          className={cn(
            'min-h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
            quickFilter === 'trending'
              ? 'bg-orange-500 text-white'
              : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)',
          )}
        >
          <Flame size={16} aria-hidden="true" />
          {locale === 'ko' ? '2025 트렌딩' : 'Trending 2025'}
        </button>
        <button
          type="button"
          onClick={() => handleQuickFilter('usedHere')}
          className={cn(
            'min-h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
            quickFilter === 'usedHere'
              ? 'bg-purple-500 text-white'
              : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)',
          )}
        >
          <Star size={16} aria-hidden="true" />
          {locale === 'ko' ? '사용 중' : 'Used Here'}
        </button>
        <button
          type="button"
          onClick={() => handleQuickFilter('new')}
          className={cn(
            'min-h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
            quickFilter === 'new'
              ? 'bg-blue-500 text-white'
              : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)',
          )}
        >
          <CalendarPlus size={16} aria-hidden="true" />
          {locale === 'ko' ? '새로운 (2023+)' : 'New 2023+'}
        </button>
        {(quickFilter || selectedTag) && (
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-(--text-tertiary) hover:text-(--text-primary) transition-colors cursor-pointer"
          >
            {locale === 'ko' ? '필터 초기화' : 'Clear filters'}
          </button>
        )}
      </div>

      {/* Active Tag Filter Display */}
      {selectedTag && (
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--accent-primary)/10 text-(--accent-primary)">
            <span className="text-sm">{locale === 'ko' ? '태그:' : 'Tag:'}</span>
            <span className="text-sm font-medium">{selectedTag}</span>
            <button
              type="button"
              onClick={() => {
                setSelectedTag(null);
                const params = new URLSearchParams(searchParams);
                params.delete('tag');
                setSearchParams(params);
              }}
              className="ml-1 hover:opacity-70 cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Search, Sort & Filter */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
            />
            <input
              type="text"
              placeholder={locale === 'ko' ? '라이브러리 검색...' : 'Search libraries...'}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                const params = new URLSearchParams(searchParams);
                if (e.target.value) {
                  params.set('q', e.target.value);
                } else {
                  params.delete('q');
                }
                setSearchParams(params);
              }}
              className="w-full min-h-11 pl-10 pr-4 rounded-lg bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-none focus:border-(--border-focus) transition-colors"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="min-h-11 px-4 rounded-lg bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) focus:outline-none focus:border-(--border-focus) transition-colors cursor-pointer"
          >
            <option value="stars">{locale === 'ko' ? '인기순' : 'Most Popular'}</option>
            <option value="newest">{locale === 'ko' ? '최신순' : 'Newest First'}</option>
            <option value="name">{locale === 'ko' ? '이름순' : 'Name A-Z'}</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {cats.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                const params = new URLSearchParams(searchParams);
                if (cat !== 'All') {
                  params.set('category', cat);
                } else {
                  params.delete('category');
                }
                setSearchParams(params);
              }}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                category === cat
                  ? 'bg-(--accent-primary) text-white'
                  : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)',
              )}
            >
              {cat === 'All' ? (locale === 'ko' ? '전체' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-(--text-tertiary) mb-4">
        {filteredLibraries.length} {locale === 'ko' ? '개의 라이브러리' : 'libraries'}
      </div>

      {/* Library List */}
      <div className="space-y-8">
        {Object.entries(groupedLibraries).map(([categoryName, categoryLibs]) => (
          <section key={categoryName}>
            <h2 className="text-lg font-semibold text-(--text-primary) mb-4">{categoryName}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryLibs.map((lib) => (
                <div
                  key={lib.name}
                  className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className="font-medium text-(--text-primary)">{lib.name}</h3>
                      {lib.trending && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-500/10 text-orange-500">
                          <Flame size={12} aria-hidden="true" />
                          {locale === 'ko' ? '트렌드' : 'Trending'}
                        </span>
                      )}
                      {lib.usedHere && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-500">
                          {locale === 'ko' ? '사용 중' : 'Used here'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-(--text-tertiary)">
                      <Star size={14} aria-hidden="true" className="fill-current" />
                      {lib.stars}
                    </div>
                  </div>
                  <p className="text-sm text-(--text-secondary) mb-3">
                    {locale === 'ko' ? lib.descriptionKo : lib.description}
                  </p>
                  {lib.tags && lib.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {lib.tags.slice(0, 4).map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className={cn(
                            'px-2 py-0.5 rounded text-xs transition-colors cursor-pointer',
                            selectedTag === tag
                              ? 'bg-(--accent-primary) text-white'
                              : 'bg-(--bg-tertiary) text-(--text-tertiary) hover:text-(--text-primary)',
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-600 font-medium">
                      {lib.license}
                    </span>
                    {lib.yearReleased && (
                      <span className="text-(--text-tertiary)">Since {lib.yearReleased}</span>
                    )}
                    <a
                      href={lib.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-(--accent-primary) hover:underline"
                    >
                      GitHub
                    </a>
                    {lib.npm && (
                      <a
                        href={`https://www.npmjs.com/package/${lib.npm}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-(--accent-primary) hover:underline"
                      >
                        npm
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty state */}
      {filteredLibraries.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-(--text-secondary)">
            {locale === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
          </p>
        </div>
      )}
    </DocsLayout>
  );
}
