import { useEffect, useMemo, useState } from 'react';
import type { MetaFunction } from 'react-router';
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

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  const title = 'Web API - Permissive';
  const description = isKorean
    ? '브라우저에 내장된 웹 표준 API'
    : 'Browser built-in Web Standard APIs';

  return [{ title }, { name: 'description', content: description }];
};

export default function WebApiPage() {
  const { webApis: apis, categories: cats } = useLoaderData<{
    webApis: WebAPI[];
    categories: typeof categories;
  }>();
  const { locale } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [quickFilter, setQuickFilter] = useState<'trending' | 'highSupport' | 'new' | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('support');

  // Sync URL params on mount
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    const filter = searchParams.get('filter');
    const trending = searchParams.get('trending');

    if (q) setSearch(q);
    if (cat && categories.includes(cat as CategoryFilter)) {
      setCategory(cat as CategoryFilter);
    }
    if (filter === 'highSupport' || filter === 'new') setQuickFilter(filter);
    if (trending === 'true') setQuickFilter('trending');
  }, [searchParams]);

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
    const q = search.toLowerCase().slice(0, 100);
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
      if (!acc[api.category]) acc[api.category] = [];
      acc[api.category].push(api);
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

  return (
    <DocsLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Web API
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ko'
            ? '브라우저에 내장된 무료 API. 설치 없이 바로 사용 가능'
            : 'Browser built-in APIs. Free to use, no installation required'}
        </p>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => handleQuickFilter('trending')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
          style={{
            backgroundColor:
              quickFilter === 'trending' ? 'var(--accent-primary)' : 'var(--bg-elevated)',
            color: quickFilter === 'trending' ? 'white' : 'var(--text-primary)',
            border: `1px solid ${quickFilter === 'trending' ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
          }}
        >
          <span>🔥</span>
          {locale === 'ko' ? '2023+ 트렌딩' : 'Trending 2023+'}
        </button>
        <button
          type="button"
          onClick={() => handleQuickFilter('highSupport')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
          style={{
            backgroundColor:
              quickFilter === 'highSupport' ? 'var(--accent-primary)' : 'var(--bg-elevated)',
            color: quickFilter === 'highSupport' ? 'white' : 'var(--text-primary)',
            border: `1px solid ${quickFilter === 'highSupport' ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
          }}
        >
          <span>📊</span>
          {locale === 'ko' ? '높은 지원 (95%+)' : 'High Support (95%+)'}
        </button>
        <button
          type="button"
          onClick={() => handleQuickFilter('new')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
          style={{
            backgroundColor: quickFilter === 'new' ? 'var(--accent-primary)' : 'var(--bg-elevated)',
            color: quickFilter === 'new' ? 'white' : 'var(--text-primary)',
            border: `1px solid ${quickFilter === 'new' ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
          }}
        >
          <span>📅</span>
          {locale === 'ko' ? '새로운 (2020+)' : 'New 2020+'}
        </button>
        {quickFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{
              color: 'var(--text-tertiary)',
              textDecoration: 'underline',
            }}
          >
            {locale === 'ko' ? '필터 초기화' : 'Clear filters'}
          </button>
        )}
      </div>

      {/* Search, Sort & Filter */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <svg
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: 'var(--text-tertiary)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl transition-all"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="support">
                {locale === 'ko' ? '📊 지원률순' : '📊 Most Supported'}
              </option>
              <option value="newest">{locale === 'ko' ? '📅 최신순' : '📅 Newest First'}</option>
              <option value="name">{locale === 'ko' ? '🔤 이름순' : '🔤 Name A-Z'}</option>
            </select>
          </div>
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
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: category === cat ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: category === cat ? 'white' : 'var(--text-secondary)',
              }}
            >
              {cat === 'All' ? (locale === 'ko' ? '전체' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
        {filteredApis.length} {locale === 'ko' ? '개의 API' : 'APIs'}
      </div>

      {/* API List */}
      <div className="space-y-8">
        {Object.entries(groupedApis).map(([categoryName, categoryApis]) => (
          <section key={categoryName}>
            <h2
              className="text-lg font-semibold mb-4 pb-2"
              style={{
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border-primary)',
              }}
            >
              {categoryName}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryApis.map((api) => (
                <a
                  key={api.name}
                  href={api.mdnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 rounded-xl transition-all hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {api.name}
                      </h3>
                      {api.trending && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: 'rgba(255, 107, 107, 0.15)',
                            color: '#ff6b6b',
                          }}
                        >
                          🔥
                        </span>
                      )}
                    </div>
                    <span className="badge-mit">{api.support}</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {locale === 'ko' ? api.descriptionKo : api.description}
                  </p>
                  {api.yearStable && (
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      Since {api.yearStable}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty state */}
      {filteredApis.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p style={{ color: 'var(--text-tertiary)' }}>
            {locale === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
          </p>
        </div>
      )}
    </DocsLayout>
  );
}
