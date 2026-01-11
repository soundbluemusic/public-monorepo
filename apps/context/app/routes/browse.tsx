import { metaFactory } from '@soundblue/i18n';
import { useCallback } from 'react';
import { useLoaderData } from 'react-router';
import {
  BrowseFilters,
  BrowseStats,
  EntryList,
  type FilterCategory,
  type FilterStatus,
  Pagination,
  QuickActions,
  type SortOption,
  useBrowseFilters,
} from '@/components/browse';
import { Layout } from '@/components/layout';
import { categories } from '@/data/categories';
import type { LightEntry } from '@/data/entries';
import { useStudyData } from '@/hooks';
import { useI18n } from '@/i18n';

/**
 * 찾아보기 페이지 데이터 로더
 *
 * loader: SSG 빌드 시 실행 - 정적 데이터 포함
 * clientLoader: 런타임에 실행 - serverLoader 데이터 활용
 */

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

/**
 * loader: SSG 빌드 시 실행
 * 정렬된 엔트리 배열과 인덱스를 HTML에 포함
 */
export async function loader(): Promise<LoaderData> {
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

/**
 * clientLoader: 클라이언트에서 실행
 * serverLoader 데이터가 있으면 사용, 없으면 직접 로드
 */
export async function clientLoader({
  serverLoader,
}: {
  serverLoader: () => Promise<LoaderData>;
}): Promise<LoaderData> {
  try {
    return await serverLoader();
  } catch {
    // Pages 빌드에서 loader가 없는 경우 직접 로드
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
}

export const meta = metaFactory(
  {
    ko: { title: '찾아보기 - Context', description: '모든 한국어 단어 찾아보기 및 필터링' },
    en: { title: 'Browse - Context', description: 'Browse and filter all Korean words' },
  },
  'https://context.soundbluemusic.com',
);

export default function BrowsePage() {
  const {
    entries,
    sortedArrays,
    sortIndices,
    categories: cats,
    totalEntries,
  } = useLoaderData<LoaderData>();
  const { locale, localePath, t } = useI18n();

  const { studiedIds, favoriteIds, overallProgress, todayStudied, bookmarkCount, isLoading } =
    useStudyData({ totalEntries });

  const {
    filterCategory,
    filterStatus,
    sortBy,
    currentPage,
    isLoadingCategory,
    setFilterCategory,
    setFilterStatus,
    setSortBy,
    filteredEntries,
    paginatedEntries,
    totalPages,
    updateUrlParams,
    handlePageChange,
  } = useBrowseFilters({
    categories: cats,
    sortedArrays,
    sortIndices,
    studiedIds,
    favoriteIds,
    isLoading,
  });

  const handleRandomWord = useCallback(() => {
    if (entries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * entries.length);
    const randomEntry = entries[randomIndex];
    if (randomEntry) {
      window.location.href = localePath(`/entry/${randomEntry.id}`);
    }
  }, [entries, localePath]);

  const handleShowBookmarks = useCallback(() => {
    setFilterStatus('bookmarked');
    setFilterCategory('all');
    updateUrlParams({ status: 'bookmarked', category: null });
  }, [setFilterStatus, setFilterCategory, updateUrlParams]);

  const handleShowUnstudied = useCallback(() => {
    setFilterStatus('unstudied');
    setFilterCategory('all');
    updateUrlParams({ status: 'unstudied', category: null });
  }, [setFilterStatus, setFilterCategory, updateUrlParams]);

  const handleCategoryChange = useCallback(
    (value: FilterCategory) => {
      setFilterCategory(value);
      updateUrlParams({ category: value });
    },
    [setFilterCategory, updateUrlParams],
  );

  const handleStatusChange = useCallback(
    (value: FilterStatus) => {
      setFilterStatus(value);
      updateUrlParams({ status: value });
    },
    [setFilterStatus, updateUrlParams],
  );

  const handleSortChange = useCallback(
    (value: SortOption) => {
      setSortBy(value);
      updateUrlParams({ sort: value === 'alphabetical' ? null : value });
    },
    [setSortBy, updateUrlParams],
  );

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-2">
          {t('browseAllWords')}
        </h1>
        <p className="text-(--text-secondary)">{t('browseSearchAndFilter')}</p>
      </div>

      <BrowseStats
        overallProgress={overallProgress}
        todayStudied={todayStudied}
        bookmarkCount={bookmarkCount}
        t={t}
      />

      <QuickActions
        filterStatus={filterStatus}
        onRandomWord={handleRandomWord}
        onShowBookmarks={handleShowBookmarks}
        onShowUnstudied={handleShowUnstudied}
        t={t}
      />

      <BrowseFilters
        locale={locale}
        categories={cats}
        filterCategory={filterCategory}
        filterStatus={filterStatus}
        sortBy={sortBy}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
        t={t}
      />

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-(--text-secondary)">
          {isLoadingCategory
            ? t('loading')
            : t('browseWordCount').replace('{count}', String(filteredEntries.length))}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-(--text-tertiary)">
            {t('browsePageOf')
              .replace('{current}', String(currentPage))
              .replace('{total}', String(totalPages))}
          </p>
        )}
      </div>

      {/* Word List */}
      {isLoadingCategory ? (
        <div className="min-h-96 flex items-center justify-center text-(--text-tertiary)">
          <p>{t('browseLoadingCategory')}</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12 px-4 text-(--text-tertiary)">
          <p>{t('browseNoWords')}</p>
        </div>
      ) : (
        <>
          <EntryList
            locale={locale}
            localePath={localePath}
            entries={paginatedEntries}
            categories={cats}
            studiedIds={studiedIds}
            favoriteIds={favoriteIds}
            bookmarkedLabel={t('bookmarked')}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            t={t}
          />
        </>
      )}
    </Layout>
  );
}
