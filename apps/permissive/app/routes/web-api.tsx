import { useEffect, useMemo, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { useLoaderData, useSearchParams } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { type WebAPI, webApiCategories, webApis } from '../data/web-apis';
import { useI18n } from '../i18n';
import styles from '../styles/app.module.scss';

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
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Web API</h1>
        <p className={styles.pageSubtitle}>
          {locale === 'ko'
            ? '브라우저에 내장된 무료 API. 설치 없이 바로 사용 가능'
            : 'Browser built-in APIs. Free to use, no installation required'}
        </p>
      </div>

      {/* Quick Filters */}
      <div className={styles.quickFilters}>
        <button
          type="button"
          onClick={() => handleQuickFilter('trending')}
          className={`${styles.quickFilterButton} ${quickFilter === 'trending' ? styles.quickFilterButtonActive : ''}`}
        >
          <span>🔥</span>
          {locale === 'ko' ? '2023+ 트렌딩' : 'Trending 2023+'}
        </button>
        <button
          type="button"
          onClick={() => handleQuickFilter('highSupport')}
          className={`${styles.quickFilterButton} ${quickFilter === 'highSupport' ? styles.quickFilterButtonActive : ''}`}
        >
          <span>📊</span>
          {locale === 'ko' ? '높은 지원 (95%+)' : 'High Support (95%+)'}
        </button>
        <button
          type="button"
          onClick={() => handleQuickFilter('new')}
          className={`${styles.quickFilterButton} ${quickFilter === 'new' ? styles.quickFilterButtonActive : ''}`}
        >
          <span>📅</span>
          {locale === 'ko' ? '새로운 (2020+)' : 'New 2020+'}
        </button>
        {quickFilter && (
          <button type="button" onClick={clearFilters} className={styles.clearFiltersButton}>
            {locale === 'ko' ? '필터 초기화' : 'Clear filters'}
          </button>
        )}
      </div>

      {/* Search, Sort & Filter */}
      <div className={styles.filterControls}>
        <div className={styles.filterRow}>
          <div className={styles.searchInputWrapper}>
            <svg
              aria-hidden="true"
              className={styles.searchIcon}
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
              className={styles.filterInput}
            />
          </div>
          <div className={styles.gap2}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className={styles.filterSelect}
            >
              <option value="support">
                {locale === 'ko' ? '📊 지원률순' : '📊 Most Supported'}
              </option>
              <option value="newest">{locale === 'ko' ? '📅 최신순' : '📅 Newest First'}</option>
              <option value="name">{locale === 'ko' ? '🔤 이름순' : '🔤 Name A-Z'}</option>
            </select>
          </div>
        </div>

        <div className={styles.categoryFilters}>
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
              className={`${styles.categoryButton} ${category === cat ? styles.categoryButtonActive : ''}`}
            >
              {cat === 'All' ? (locale === 'ko' ? '전체' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsCount}>
        {filteredApis.length} {locale === 'ko' ? '개의 API' : 'APIs'}
      </div>

      {/* API List */}
      <div className={styles.libraryList}>
        {Object.entries(groupedApis).map(([categoryName, categoryApis]) => (
          <section key={categoryName} className={styles.libraryCategorySection}>
            <h2>{categoryName}</h2>
            <div className={styles.apiGrid}>
              {categoryApis.map((api) => (
                <a
                  key={api.name}
                  href={api.mdnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.apiCard}
                >
                  <div className={styles.apiHeader}>
                    <div className={styles.apiTitleRow}>
                      <h3 className={styles.apiName}>{api.name}</h3>
                      {api.trending && (
                        <span className={`${styles.libraryBadge} ${styles.libraryBadgeTrending}`}>
                          🔥
                        </span>
                      )}
                    </div>
                    <span className={styles.licenseBadge}>{api.support}</span>
                  </div>
                  <p className={styles.apiDescription}>
                    {locale === 'ko' ? api.descriptionKo : api.description}
                  </p>
                  {api.yearStable && <p className={styles.apiYear}>Since {api.yearStable}</p>}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty state */}
      {filteredApis.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateEmoji}>🔍</div>
          <p className={styles.emptyStateText}>
            {locale === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
          </p>
        </div>
      )}
    </DocsLayout>
  );
}
