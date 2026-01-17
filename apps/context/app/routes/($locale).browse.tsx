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
import { type LightEntry, lightEntriesSortedAlphabetically, jsonEntriesCount } from '@/data/entries';
import { useStudyData } from '@/hooks';
import { useI18n } from '@/i18n';

/**
 * 찾아보기 페이지 데이터 로더 (SSR 모드)
 *
 * ## 최적화 전략
 * - SSR HTML에는 첫 페이지 데이터만 포함 (1000개)
 * - 사전 생성된 lightEntries 데이터 사용 (번들에 포함)
 * - 페이지 전환 시 클라이언트에서 필터링
 */

/** Browse 메타데이터 */
interface BrowseMetadata {
  totalEntries: number;
  chunkSize: number;
  totalChunks: number;
  sortTypes: string[];
  generatedAt: string;
}

interface LoaderData {
  /** 현재 정렬의 첫 청크 (SSG용) */
  initialEntries: LightEntry[];
  /** 메타데이터 */
  meta: BrowseMetadata;
  /** 카테고리 목록 */
  categories: typeof categories;
}

/** 페이지당 표시할 엔트리 수 */
const CHUNK_SIZE = 1000;

/**
 * loader: SSR 모드에서 실행
 * 사전 생성된 lightEntries 데이터를 직접 사용
 */
export async function loader(): Promise<LoaderData> {
  // 첫 청크 반환 (알파벳순 정렬된 첫 1000개)
  const initialEntries = lightEntriesSortedAlphabetically.slice(0, CHUNK_SIZE);

  const meta: BrowseMetadata = {
    totalEntries: jsonEntriesCount,
    chunkSize: CHUNK_SIZE,
    totalChunks: Math.ceil(jsonEntriesCount / CHUNK_SIZE),
    sortTypes: ['alphabetical', 'category', 'recent'],
    generatedAt: new Date().toISOString(),
  };

  return {
    initialEntries,
    meta,
    categories,
  };
}

/**
 * clientLoader: 클라이언트에서 실행
 * SSR에서 전달된 serverLoader 데이터 사용
 */
export async function clientLoader({
  serverLoader,
}: {
  serverLoader: () => Promise<LoaderData>;
}): Promise<LoaderData> {
  return await serverLoader();
}

export const meta = metaFactory(
  {
    ko: { title: '찾아보기 - Context', description: '모든 한국어 단어 찾아보기 및 필터링' },
    en: { title: 'Browse - Context', description: 'Browse and filter all Korean words' },
  },
  'https://context.soundbluemusic.com',
);

export default function BrowsePage() {
  const { initialEntries, meta, categories: cats } = useLoaderData<LoaderData>();
  const { locale, localePath, t } = useI18n();

  const { studiedIds, favoriteIds, overallProgress, todayStudied, bookmarkCount, isLoading } =
    useStudyData({ totalEntries: meta.totalEntries });

  const {
    filterCategory,
    filterStatus,
    sortBy,
    currentPage,
    isLoadingChunk,
    setFilterCategory,
    setFilterStatus,
    setSortBy,
    displayEntries,
    totalFilteredCount,
    totalPages,
    updateUrlParams,
    handlePageChange,
  } = useBrowseFilters({
    categories: cats,
    initialEntries,
    meta,
    studiedIds,
    favoriteIds,
    isLoading,
  });

  const handleRandomWord = useCallback(() => {
    // 현재 표시된 엔트리에서 랜덤 선택
    if (displayEntries.length === 0) return;
    const randomEntry = displayEntries[Math.floor(Math.random() * displayEntries.length)];
    if (randomEntry) {
      window.location.href = localePath(`/entry/${randomEntry.id}`);
    }
  }, [displayEntries, localePath]);

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
          {isLoadingChunk
            ? t('loading')
            : t('browseWordCount').replace('{count}', String(totalFilteredCount))}
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
      {isLoadingChunk ? (
        <div className="min-h-96 flex items-center justify-center text-(--text-tertiary)">
          <p>{t('loading')}</p>
        </div>
      ) : displayEntries.length === 0 ? (
        <div className="text-center py-12 px-4 text-(--text-tertiary)">
          <p>{t('browseNoWords')}</p>
        </div>
      ) : (
        <>
          <EntryList
            locale={locale}
            localePath={localePath}
            entries={displayEntries}
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
