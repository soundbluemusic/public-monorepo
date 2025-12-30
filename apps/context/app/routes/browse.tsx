import { metaFactory } from '@soundblue/i18n';
import { useLoaderData } from 'react-router';
import {
  BrowseFilters,
  BrowseStats,
  EntryList,
  Pagination,
  QuickActions,
  useBrowseFilters,
} from '@/components/browse';
import { Layout } from '@/components/layout';
import { categories } from '@/data/categories';
import type { LightEntry } from '@/data/entries';
import { useStudyData } from '@/hooks';
import { useI18n } from '@/i18n';

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 * 경량 LightEntry를 사용하여 ~85% 데이터 절감
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

  const handleRandomWord = () => {
    if (entries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * entries.length);
    const randomEntry = entries[randomIndex];
    if (randomEntry) {
      window.location.href = localePath(`/entry/${randomEntry.id}`);
    }
  };

  const handleShowBookmarks = () => {
    setFilterStatus('bookmarked');
    setFilterCategory('all');
    updateUrlParams({ status: 'bookmarked', category: null });
  };

  const handleShowUnstudied = () => {
    setFilterStatus('unstudied');
    setFilterCategory('all');
    updateUrlParams({ status: 'unstudied', category: null });
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

      <BrowseStats
        locale={locale}
        overallProgress={overallProgress}
        todayStudied={todayStudied}
        bookmarkCount={bookmarkCount}
      />

      <QuickActions
        locale={locale}
        filterStatus={filterStatus}
        onRandomWord={handleRandomWord}
        onShowBookmarks={handleShowBookmarks}
        onShowUnstudied={handleShowUnstudied}
      />

      <BrowseFilters
        locale={locale}
        categories={cats}
        filterCategory={filterCategory}
        filterStatus={filterStatus}
        sortBy={sortBy}
        onCategoryChange={(value) => {
          setFilterCategory(value);
          updateUrlParams({ category: value });
        }}
        onStatusChange={(value) => {
          setFilterStatus(value);
          updateUrlParams({ status: value });
        }}
        onSortChange={(value) => {
          setSortBy(value);
          updateUrlParams({ sort: value === 'alphabetical' ? null : value });
        }}
      />

      {/* Results Count */}
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

      {/* Word List */}
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
          <EntryList
            locale={locale}
            localePath={localePath}
            entries={paginatedEntries}
            categories={cats}
            studiedIds={studiedIds}
            favoriteIds={favoriteIds}
          />
          <Pagination
            locale={locale}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Layout>
  );
}
