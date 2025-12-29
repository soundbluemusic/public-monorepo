import { metaFactory } from '@soundblue/shared';
import { cn, EntryListItem, useAutoAnimate, VirtualList } from '@soundblue/shared-react';
import { Shuffle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
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
 */
export async function loader() {
  const {
    lightEntries,
    lightEntriesByCategory,
    lightEntriesSortedAlphabetically,
    lightEntriesSortedByCategory,
    lightEntriesSortedRecent,
    alphabeticalIndex,
    categoryIndex,
    recentIndex,
  } = await import('@/data/entries');
  return {
    entries: lightEntries,
    entriesByCategory: Object.fromEntries(lightEntriesByCategory),
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

// Loader 반환 타입 (경량 버전 사용)
interface LoaderData {
  entries: LightEntry[];
  entriesByCategory: Record<string, LightEntry[]>;
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
    entriesByCategory,
    sortedArrays,
    sortIndices,
    categories: cats,
    totalEntries,
  } = useLoaderData<LoaderData>();
  const { locale, localePath } = useI18n();

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

  // Sync URL params to state on mount/URL change
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const statusParam = searchParams.get('status');
    const sortParam = searchParams.get('sort');

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
  }, [searchParams, cats]);

  /**
   * 최적화된 필터링 + 정렬 로직
   *
   * 기존: O(n) 필터 × 3 + O(n log n) 정렬 = ~O(n log n) 매번
   * 개선: O(1) 카테고리 조회 + O(n) 필터 1회 + O(n) 인덱스 정렬
   *
   * 10,000개 항목 기준:
   * - 기존: ~130,000 비교 (정렬만)
   * - 개선: ~10,000 비교 (인덱스 조회)
   */
  const filteredEntries = useMemo(() => {
    // 1. 카테고리 필터: O(1) Map 조회 또는 pre-sorted 배열 사용
    let baseArray: LightEntry[];
    if (filterCategory !== 'all') {
      // O(1) 카테고리별 사전 그룹화된 배열 조회
      baseArray = entriesByCategory[filterCategory] || [];
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
    entriesByCategory,
    sortedArrays,
    sortIndices,
    studiedIds,
    favoriteIds,
    isLoading,
  ]);

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

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-(--text-secondary)">
          {locale === 'ko'
            ? `${filteredEntries.length}개의 단어`
            : `${filteredEntries.length} words`}
        </p>
      </div>

      {/* Word List - VirtualList for 751+ items */}
      <VirtualList
        key={`${filterCategory}-${filterStatus}-${sortBy}`}
        items={filteredEntries}
        estimateSize={52}
        className="h-150"
        overscan={5}
        renderItem={useCallback(
          (entry: LightEntry) => {
            // LightEntry에서 직접 word 접근 (경량 버전)
            const translation = entry.word[locale];
            const isStudied = studiedIds.has(entry.id);
            const isFavorite = favoriteIds.has(entry.id);
            const category = cats.find((c) => c.id === entry.categoryId);

            return (
              <EntryListItem
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
          },
          [locale, studiedIds, favoriteIds, cats, localePath],
        )}
      />

      {filteredEntries.length === 0 && (
        <div className="text-center py-12 px-4 text-(--text-tertiary)">
          <p>{locale === 'ko' ? '단어가 없습니다' : 'No words found'}</p>
        </div>
      )}
    </Layout>
  );
}
