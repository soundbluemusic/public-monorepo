import { metaFactory } from '@soundblue/i18n';
import { useAutoAnimate } from '@soundblue/ui/hooks';
import { cn } from '@soundblue/ui/utils';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
import { EntryListItem } from '@/components/entry/EntryListItem';
import { Layout } from '@/components/layout';
import { Select } from '@/components/Select';
import { StatsCard } from '@/components/StatsCard';
import { categories } from '@/data/categories';
import type { LightEntry } from '@/data/entries';
import { useStudyData } from '@/hooks';
import { useI18n } from '@/i18n';

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 *
 * 경량 버전(LightEntry)을 사용하여 데이터 크기 최적화
 * - 전체 MeaningEntry: ~780KB (gzip ~280KB)
 * - 경량 LightEntry: ~100KB (gzip ~35KB) - 약 85% 절감
 *
 * Pre-sorted arrays와 index maps를 로드하여 런타임 정렬 제거
 *
 * 100만개+ 확장성:
 * - entriesByCategory 제거 (turbo-stream 직렬화 문제 + 메모리 비효율)
 * - 카테고리별 데이터는 /data/by-category/{categoryId}.json에서 동적 fetch
 */
export async function loader() {
  const {
    lightEntries,
    lightEntriesSortedAlphabetically,
    lightEntriesSortedByCategory,
    lightEntriesSortedRecent,
    alphabeticalIndex,
    categoryIndex,
    recentIndex,
  } = await import('@/data/entries');
  return {
    entries: lightEntries,
    sortedArrays: {
      alphabetical: lightEntriesSortedAlphabetically,
      category: lightEntriesSortedByCategory,
      recent: lightEntriesSortedRecent,
    },
    sortIndices: {
      alphabetical: Object.fromEntries(alphabeticalIndex),
      category: Object.fromEntries(categoryIndex),
      recent: Object.fromEntries(recentIndex),
    },
    categories,
    totalEntries: lightEntries.length,
  };
}

export const meta = metaFactory({
  ko: { title: '찾아보기 - Context', description: '모든 한국어 단어 찾아보기 및 필터링' },
  en: { title: 'Browse - Context', description: 'Browse and filter all Korean words' },
});

type FilterCategory = 'all' | string;
type FilterStatus = 'all' | 'studied' | 'unstudied' | 'bookmarked';
type SortOption = 'alphabetical' | 'category' | 'recent';

/** 페이지당 항목 수 */
const PAGE_SIZE = 50;

/**
 * 페이지 번호 배열 생성 (1, 2, ..., 5, 6, 7, ..., 19, 20 형태)
 */
function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];

  // 항상 첫 페이지 포함
  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }

  // 현재 페이지 주변
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  // 항상 마지막 페이지 포함
  pages.push(total);

  return pages;
}

// Loader 반환 타입 (경량 버전 사용)
interface LoaderData {
  entries: LightEntry[];
  sortedArrays: {
    alphabetical: LightEntry[];
    category: LightEntry[];
    recent: LightEntry[];
  };
  sortIndices: {
    alphabetical: Record<string, number>;
    category: Record<string, number>;
    recent: Record<string, number>;
  };
  categories: typeof categories;
  totalEntries: number;
}

export default function BrowsePage() {
  const {
    entries,
    sortedArrays,
    sortIndices,
    categories: cats,
    totalEntries,
  } = useLoaderData<LoaderData>();
  const { locale, localePath } = useI18n();

  // 카테고리별 동적 로드 상태 (100만개+ 확장성)
  const [categoryEntries, setCategoryEntries] = useState<LightEntry[] | null>(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  // Study data from custom hook
  const { studiedIds, favoriteIds, overallProgress, todayStudied, bookmarkCount, isLoading } =
    useStudyData({
      totalEntries,
    });

  // URL params for filter persistence
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter & Sort state
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Sync URL params to state on mount/URL change
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const statusParam = searchParams.get('status');
    const sortParam = searchParams.get('sort');
    const pageParam = searchParams.get('page');

    if (categoryParam) {
      const isValidCategory = categoryParam === 'all' || cats.some((c) => c.id === categoryParam);
      if (isValidCategory) {
        setFilterCategory(categoryParam as FilterCategory);
      }
    }

    if (statusParam) {
      const validStatuses = ['all', 'studied', 'unstudied', 'bookmarked'];
      if (validStatuses.includes(statusParam)) {
        setFilterStatus(statusParam as FilterStatus);
      }
    }

    if (sortParam) {
      const validSorts = ['alphabetical', 'category', 'recent'];
      if (validSorts.includes(sortParam)) {
        setSortBy(sortParam as SortOption);
      }
    }

    if (pageParam) {
      const page = Number.parseInt(pageParam, 10);
      if (!Number.isNaN(page) && page >= 1) {
        setCurrentPage(page);
      }
    }
  }, [searchParams, cats]);

  // 카테고리 변경 시 해당 청크 동적 로드 (100만개+ 확장성)
  useEffect(() => {
    if (filterCategory === 'all') {
      setCategoryEntries(null);
      setIsLoadingCategory(false);
      return;
    }

    setIsLoadingCategory(true);
    fetch(`/data/by-category/${filterCategory}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: LightEntry[]) => {
        setCategoryEntries(data);
        setIsLoadingCategory(false);
      })
      .catch(() => {
        setCategoryEntries([]);
        setIsLoadingCategory(false);
      });
  }, [filterCategory]);

  /**
   * 최적화된 필터링 + 정렬 로직
   *
   * 100만개+ 확장성:
   * - 카테고리 필터: 동적 fetch된 categoryEntries 사용
   * - 전체: pre-sorted 배열 사용
   * - 학습 상태: O(n) 필터 1회 (Set.has O(1))
   * - 정렬: 인덱스 맵으로 O(n) (비교 기반 O(n log n) 대신)
   */
  const filteredEntries = useMemo(() => {
    // 1. 카테고리 필터: 동적 로드된 데이터 또는 pre-sorted 배열
    let baseArray: LightEntry[];
    if (filterCategory !== 'all') {
      // 동적 fetch된 카테고리 데이터 사용
      if (isLoadingCategory || categoryEntries === null) {
        return []; // 로딩 중이거나 아직 데이터 없음
      }
      baseArray = categoryEntries;
    } else {
      // 정렬 옵션에 맞는 pre-sorted 배열 선택 (이미 정렬됨)
      baseArray = sortedArrays[sortBy];
    }

    // 2. 학습 상태 필터: O(n) 1회만 (Set.has는 O(1))
    let filtered: LightEntry[];
    if (isLoading || filterStatus === 'all') {
      filtered = baseArray;
    } else if (filterStatus === 'studied') {
      filtered = baseArray.filter((e) => studiedIds.has(e.id));
    } else if (filterStatus === 'unstudied') {
      filtered = baseArray.filter((e) => !studiedIds.has(e.id));
    } else {
      // bookmarked
      filtered = baseArray.filter((e) => favoriteIds.has(e.id));
    }

    // 3. 정렬: 카테고리 필터 적용 시에만 인덱스 정렬 필요
    //    (filterCategory === 'all'이면 이미 sortedArrays에서 정렬된 상태)
    if (filterCategory !== 'all' || filterStatus !== 'all') {
      // 인덱스 맵으로 O(n) 정렬 (비교 기반 O(n log n) 대신)
      const indexMap = sortIndices[sortBy];
      return [...filtered].sort((a, b) => {
        const idxA = indexMap[a.id] ?? Number.MAX_SAFE_INTEGER;
        const idxB = indexMap[b.id] ?? Number.MAX_SAFE_INTEGER;
        return idxA - idxB;
      });
    }

    return filtered;
  }, [
    filterCategory,
    filterStatus,
    sortBy,
    categoryEntries,
    isLoadingCategory,
    sortedArrays,
    sortIndices,
    studiedIds,
    favoriteIds,
    isLoading,
  ]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredEntries.length / PAGE_SIZE);
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEntries.slice(start, start + PAGE_SIZE);
  }, [filteredEntries, currentPage]);

  // 필터 변경 시 페이지 리셋 (searchParams/setSearchParams는 의도적으로 제외)
  // biome-ignore lint/correctness/useExhaustiveDependencies: 필터 변경에만 반응해야 함
  useEffect(() => {
    setCurrentPage(1);
    // URL에서 page 파라미터 제거
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    setSearchParams(params, { replace: true });
  }, [filterCategory, filterStatus, sortBy]);

  const handleRandomWord = () => {
    if (entries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * entries.length);
    const randomEntry = entries[randomIndex];
    if (randomEntry) {
      window.location.href = localePath(`/entry/${randomEntry.id}`);
    }
  };

  // URL update helper
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    setSearchParams(params);
  };

  const handleShowBookmarksOnly = () => {
    setFilterStatus('bookmarked');
    setFilterCategory('all');
    updateUrlParams({ status: 'bookmarked', category: null });
  };

  const handleShowUnstudiedOnly = () => {
    setFilterStatus('unstudied');
    setFilterCategory('all');
    updateUrlParams({ status: 'unstudied', category: null });
  };

  // Auto-animate for stats grid
  const [statsRef] = useAutoAnimate<HTMLDivElement>();
  const [listRef] = useAutoAnimate<HTMLDivElement>();

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    setSearchParams(params);
    // 리스트 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-2">
          {locale === 'ko' ? '전체 단어 찾아보기' : 'Browse All Words'}
        </h1>
        <p className="text-(--text-secondary)">
          {locale === 'ko' ? '모든 단어를 검색하고 필터링하세요' : 'Search and filter all words'}
        </p>
      </div>

      {/* Quick Stats - with auto-animate */}
      <div ref={statsRef} className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatsCard
          label={locale === 'ko' ? '전체 진행률' : 'Overall Progress'}
          value={`${overallProgress.percentage.toFixed(0)}%`}
          subtitle={`${overallProgress.studied}/${overallProgress.total} ${locale === 'ko' ? '단어' : 'words'}`}
        />
        <StatsCard
          label={locale === 'ko' ? '오늘 학습' : 'Today Studied'}
          value={todayStudied}
          subtitle={locale === 'ko' ? '단어' : 'words'}
        />
        <StatsCard
          label={locale === 'ko' ? '북마크' : 'Bookmarks'}
          value={bookmarkCount}
          subtitle={locale === 'ko' ? '단어' : 'words'}
        />
      </div>

      {/* Quick Access Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleRandomWord}
          className="min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
        >
          <Shuffle size={16} aria-hidden="true" />
          <span>{locale === 'ko' ? '랜덤 단어' : 'Random Word'}</span>
        </button>

        <button
          type="button"
          onClick={handleShowBookmarksOnly}
          className={cn(
            'min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
            filterStatus === 'bookmarked'
              ? 'bg-(--accent-primary) text-white'
              : 'bg-(--bg-tertiary) text-(--text-primary) hover:bg-(--border-primary)',
          )}
        >
          {locale === 'ko' ? '북마크만' : 'Bookmarks Only'}
        </button>

        <button
          type="button"
          onClick={handleShowUnstudiedOnly}
          className={cn(
            'min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
            filterStatus === 'unstudied'
              ? 'bg-(--accent-primary) text-white'
              : 'bg-(--bg-tertiary) text-(--text-primary) hover:bg-(--border-primary)',
          )}
        >
          {locale === 'ko' ? '미학습만' : 'Unstudied Only'}
        </button>
      </div>

      {/* Filter & Sort Controls */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Category Filter */}
        <Select
          id="category-filter"
          label={locale === 'ko' ? '카테고리' : 'Category'}
          value={filterCategory}
          options={[
            { value: 'all', label: locale === 'ko' ? '전체' : 'All' },
            ...cats.map((cat) => ({
              value: cat.id,
              label: `${cat.icon} ${cat.name[locale]}`,
            })),
          ]}
          onChange={(value) => {
            setFilterCategory(value as FilterCategory);
            updateUrlParams({ category: value });
          }}
        />

        {/* Status Filter */}
        <Select
          id="status-filter"
          label={locale === 'ko' ? '학습 상태' : 'Study Status'}
          value={filterStatus}
          options={[
            { value: 'all', label: locale === 'ko' ? '전체' : 'All' },
            { value: 'studied', label: locale === 'ko' ? '학습 완료' : 'Studied' },
            { value: 'unstudied', label: locale === 'ko' ? '미학습' : 'Unstudied' },
            { value: 'bookmarked', label: locale === 'ko' ? '북마크' : 'Bookmarked' },
          ]}
          onChange={(value) => {
            setFilterStatus(value as FilterStatus);
            updateUrlParams({ status: value });
          }}
        />

        {/* Sort */}
        <Select
          id="sort-by"
          label={locale === 'ko' ? '정렬' : 'Sort By'}
          value={sortBy}
          options={[
            { value: 'alphabetical', label: locale === 'ko' ? '가나다순' : 'Alphabetical' },
            { value: 'category', label: locale === 'ko' ? '카테고리별' : 'By Category' },
            { value: 'recent', label: locale === 'ko' ? '최근 추가' : 'Recently Added' },
          ]}
          onChange={(value) => {
            setSortBy(value as SortOption);
            updateUrlParams({ sort: value === 'alphabetical' ? null : value });
          }}
          className="sm:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Results Count & Pagination Info */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-(--text-secondary)">
          {isLoadingCategory
            ? locale === 'ko'
              ? '로딩 중...'
              : 'Loading...'
            : locale === 'ko'
              ? `${filteredEntries.length}개의 단어`
              : `${filteredEntries.length} words`}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-(--text-tertiary)">
            {locale === 'ko'
              ? `${currentPage} / ${totalPages} 페이지`
              : `Page ${currentPage} of ${totalPages}`}
          </p>
        )}
      </div>

      {/* Word List - Paginated */}
      {isLoadingCategory ? (
        <div className="min-h-96 flex items-center justify-center text-(--text-tertiary)">
          <p>{locale === 'ko' ? '카테고리 로딩 중...' : 'Loading category...'}</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12 px-4 text-(--text-tertiary)">
          <p>{locale === 'ko' ? '단어가 없습니다' : 'No words found'}</p>
        </div>
      ) : (
        <>
          <div ref={listRef} className="flex flex-col gap-1">
            {paginatedEntries.map((entry) => {
              const translation = entry.word[locale];
              const isStudied = studiedIds.has(entry.id);
              const isFavorite = favoriteIds.has(entry.id);
              const category = cats.find((c) => c.id === entry.categoryId);

              return (
                <EntryListItem
                  key={entry.id}
                  entryId={entry.id}
                  korean={entry.korean}
                  romanization={entry.romanization}
                  translation={translation}
                  isStudied={isStudied}
                  isFavorite={isFavorite}
                  category={category}
                  locale={locale}
                  localePath={localePath}
                />
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                  'min-h-10 min-w-10 flex items-center justify-center rounded-lg transition-colors',
                  currentPage === 1
                    ? 'text-(--text-tertiary) cursor-not-allowed'
                    : 'text-(--text-primary) hover:bg-(--bg-tertiary)',
                )}
                aria-label={locale === 'ko' ? '이전 페이지' : 'Previous page'}
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {generatePageNumbers(currentPage, totalPages).map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-(--text-tertiary)">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page as number)}
                      className={cn(
                        'min-h-10 min-w-10 flex items-center justify-center rounded-lg font-medium transition-colors',
                        currentPage === page
                          ? 'bg-(--accent-primary) text-white'
                          : 'text-(--text-primary) hover:bg-(--bg-tertiary)',
                      )}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                  'min-h-10 min-w-10 flex items-center justify-center rounded-lg transition-colors',
                  currentPage === totalPages
                    ? 'text-(--text-tertiary) cursor-not-allowed'
                    : 'text-(--text-primary) hover:bg-(--bg-tertiary)',
                )}
                aria-label={locale === 'ko' ? '다음 페이지' : 'Next page'}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
