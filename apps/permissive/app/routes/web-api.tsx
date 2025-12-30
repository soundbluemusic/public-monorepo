import { LIMITS } from '@soundblue/core/validation';
import { metaFactory } from '@soundblue/seo/meta';
import { useAutoAnimate } from '@soundblue/shared-react';
import { cn } from '@soundblue/ui/utils';
import { BarChart2, CalendarPlus, Flame, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { type WebAPI, webApiCategories, webApis } from '../data/web-apis';
import { useI18n } from '../i18n';

const categories = webApiCategories;
type CategoryFilter = (typeof categories)[number];

type SortOption = 'support' | 'newest' | 'name';

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 */
export async function loader() {
  return {
    webApis,
    categories,
  };
}

export const meta = metaFactory({
  ko: { title: 'Web API - Permissive', description: '브라우저에 내장된 웹 표준 API' },
  en: { title: 'Web API - Permissive', description: 'Browser built-in Web Standard APIs' },
});

export default function WebApiPage() {
  const { webApis: apis, categories: cats } = useLoaderData<{
    webApis: WebAPI[];
    categories: typeof categories;
  }>();
  const { locale } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params (one-way: URL → State on mount only)
  const initialParams = {
    q: searchParams.get('q') || '',
    category: (searchParams.get('category') as CategoryFilter) || 'All',
    filter: searchParams.get('filter'),
    trending: searchParams.get('trending'),
  };

  const [search, setSearch] = useState(initialParams.q);
  const [category, setCategory] = useState<CategoryFilter>(
    categories.includes(initialParams.category) ? initialParams.category : 'All',
  );
  const [quickFilter, setQuickFilter] = useState<'trending' | 'highSupport' | 'new' | null>(() => {
    if (initialParams.trending === 'true') return 'trending';
    if (initialParams.filter === 'highSupport' || initialParams.filter === 'new')
      return initialParams.filter;
    return null;
  });
  const [sortBy, setSortBy] = useState<SortOption>('support');

  const filteredApis = useMemo(() => {
    let filtered = apis;

    // Quick filters
    if (quickFilter === 'trending') {
      filtered = filtered.filter((api) => api.trending);
    } else if (quickFilter === 'highSupport') {
      filtered = filtered.filter((api) => Number.parseInt(api.support, 10) >= 95);
    } else if (quickFilter === 'new') {
      filtered = filtered.filter((api) => api.yearStable && api.yearStable >= 2020);
    }

    // Category filter
    if (category !== 'All') {
      filtered = filtered.filter((api) => api.category === category);
    }

    // Search filter
    const q = search.toLowerCase().slice(0, LIMITS.SEARCH_LENGTH);
    if (q) {
      filtered = filtered.filter(
        (api) =>
          api.name.toLowerCase().includes(q) ||
          api.description.toLowerCase().includes(q) ||
          api.descriptionKo.includes(q),
      );
    }

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'support') {
        const aSupport = Number.parseInt(a.support, 10);
        const bSupport = Number.parseInt(b.support, 10);
        return bSupport - aSupport;
      }
      if (sortBy === 'newest') {
        return (b.yearStable || 0) - (a.yearStable || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [apis, search, category, quickFilter, sortBy]);

  const groupedApis = useMemo(() => {
    if (category !== 'All') {
      return { [category]: filteredApis };
    }
    return filteredApis.reduce<Record<string, WebAPI[]>>((acc, api) => {
      const arr = acc[api.category] ?? [];
      arr.push(api);
      acc[api.category] = arr;
      return acc;
    }, {});
  }, [filteredApis, category]);

  const handleQuickFilter = (filter: 'trending' | 'highSupport' | 'new') => {
    if (quickFilter === filter) {
      setQuickFilter(null);
      const params = new URLSearchParams(searchParams);
      params.delete('filter');
      params.delete('trending');
      setSearchParams(params);
    } else {
      setQuickFilter(filter);
      const params = new URLSearchParams(searchParams);
      if (filter === 'trending') {
        params.set('trending', 'true');
      } else {
        params.set('filter', filter);
      }
      setSearchParams(params);
    }
  };

  const clearFilters = () => {
    setQuickFilter(null);
    setCategory('All');
    setSearch('');
    setSearchParams({});
  };

  // Auto-animate for API grid
  const [apiGridRef] = useAutoAnimate<HTMLDivElement>();
  const [quickFiltersRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <DocsLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-(--text-primary) mb-2">Web API</h1>
        <p className="text-(--text-secondary)">
          {locale === 'ko'
            ? '브라우저에 내장된 무료 API. 설치 없이 바로 사용 가능'
            : 'Browser built-in APIs. Free to use, no installation required'}
        </p>
      </div>

      {/* Quick Filters - with auto-animate */}
      <div ref={quickFiltersRef} className="flex flex-wrap gap-2 mb-4">
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
          {locale === 'ko' ? '2023+ 트렌딩' : 'Trending 2023+'}
        </button>
        <button
          type="button"
          onClick={() => handleQuickFilter('highSupport')}
          className={cn(
            'min-h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
            quickFilter === 'highSupport'
              ? 'bg-green-500 text-white'
              : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)',
          )}
        >
          <BarChart2 size={16} aria-hidden="true" />
          {locale === 'ko' ? '높은 지원 (95%+)' : 'High Support (95%+)'}
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
          {locale === 'ko' ? '새로운 (2020+)' : 'New 2020+'}
        </button>
        {quickFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-(--text-tertiary) hover:text-(--text-primary) transition-colors cursor-pointer"
          >
            {locale === 'ko' ? '필터 초기화' : 'Clear filters'}
          </button>
        )}
      </div>

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
              placeholder={locale === 'ko' ? 'API 검색...' : 'Search APIs...'}
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
              className="w-full min-h-11 pl-10 pr-4 rounded-lg bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-hidden focus:border-(--border-focus) transition-colors"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="min-h-11 px-4 rounded-lg bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) focus:outline-hidden focus:border-(--border-focus) transition-colors cursor-pointer"
          >
            <option value="support">{locale === 'ko' ? '지원률순' : 'Most Supported'}</option>
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
        {filteredApis.length} {locale === 'ko' ? '개의 API' : 'APIs'}
      </div>

      {/* API List - with auto-animate */}
      <div ref={apiGridRef} className="space-y-8">
        {Object.entries(groupedApis).map(([categoryName, categoryApis]) => (
          <section key={categoryName}>
            <h2 className="text-lg font-semibold text-(--text-primary) mb-4">{categoryName}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryApis.map((api) => (
                <a
                  key={api.name}
                  href={api.mdnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:border-(--border-focus) hover:shadow-sm group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-(--text-primary)">{api.name}</h3>
                      {api.trending && (
                        <span className="p-1 rounded bg-orange-500/10 text-orange-500">
                          <Flame size={14} aria-hidden="true" />
                        </span>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-600">
                      {api.support}
                    </span>
                  </div>
                  <p className="text-sm text-(--text-secondary) mb-2 line-clamp-2">
                    {locale === 'ko' ? api.descriptionKo : api.description}
                  </p>
                  {api.yearStable && (
                    <p className="text-xs text-(--text-tertiary)">Since {api.yearStable}</p>
                  )}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty state */}
      {filteredApis.length === 0 && (
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
