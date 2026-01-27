/**
 * @fileoverview 찾아보기 페이지 - 영어 버전 (TanStack Start + Query Hydration)
 */

import { dehydrate, HydrationBoundary, QueryClient, queryKeys } from '@soundblue/features/query';
import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback } from 'react';
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
import { APP_CONFIG } from '@/config';
import { BROWSE_CHUNK_SIZE } from '@/constants';
import { categories } from '@/data/categories';
import { jsonEntriesCount, type LightEntry, loadLightEntriesChunkForSSR } from '@/data/entries';
import { useStudyData } from '@/hooks';
import { useI18n } from '@/i18n';

/** Browse 메타데이터 */
interface BrowseMetadata {
  totalEntries: number;
  chunkSize: number;
  totalChunks: number;
  sortTypes: string[];
  generatedAt: string;
}

interface LoaderData {
  dehydratedState: ReturnType<typeof dehydrate>;
  meta: BrowseMetadata;
  categories: typeof categories;
}

export const Route = createFileRoute('/browse')({
  loader: async (): Promise<LoaderData> => {
    const queryClient = new QueryClient();

    // SSR에서 첫 청크를 Query 캐시에 prefetch
    await queryClient.prefetchQuery({
      queryKey: queryKeys.browse.chunk('alphabetical', 0),
      queryFn: () => loadLightEntriesChunkForSSR('alphabetical', 0),
    });

    const meta: BrowseMetadata = {
      totalEntries: jsonEntriesCount,
      chunkSize: BROWSE_CHUNK_SIZE,
      totalChunks: Math.ceil(jsonEntriesCount / BROWSE_CHUNK_SIZE),
      sortTypes: ['alphabetical', 'category', 'recent'],
      generatedAt: new Date().toISOString(),
    };

    return {
      dehydratedState: dehydrate(queryClient),
      meta,
      categories,
    };
  },
  // @ts-expect-error - TanStack Start head function type incompatibility
  head: headFactory(
    {
      ko: { title: '찾아보기 - Context', description: '모든 한국어 단어 찾아보기 및 필터링' },
      en: { title: 'Browse - Context', description: 'Browse and filter all Korean words' },
    },
    APP_CONFIG.baseUrl,
  ),
  component: BrowsePage,
});

function BrowsePage() {
  const { dehydratedState, meta, categories: cats } = Route.useLoaderData();

  return (
    <HydrationBoundary state={dehydratedState}>
      <BrowseContent meta={meta} categories={cats} />
    </HydrationBoundary>
  );
}

function BrowseContent({
  meta,
  categories: cats,
}: {
  meta: BrowseMetadata;
  categories: typeof categories;
}) {
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
    meta,
    studiedIds,
    favoriteIds,
    isLoading,
  });

  const handleRandomWord = useCallback(() => {
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

      {/* 결과 수 */}
      <div className="mb-4 flex items-center gap-4">
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
