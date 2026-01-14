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
 * 찾아보기 페이지 데이터 로더 (청크 기반)
 *
 * ## 최적화 전략
 * - SSG HTML에는 첫 페이지 데이터만 포함 (1000개)
 * - 페이지 전환 시 청크 JSON fetch
 * - 초기 로드 크기: ~7MB → ~100KB (98% 감소)
 */

/** 청크당 엔트리 수 (generate-browse-chunks.ts와 동기화) */
const CHUNK_SIZE = 1000;

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

/**
 * loader: SSG 빌드 시 실행
 * 첫 청크 데이터만 HTML에 포함 (기존 대비 98% 용량 감소)
 */
export async function loader(): Promise<LoaderData> {
  // SSG 빌드 시 (Node.js 환경)
  if (typeof window === 'undefined') {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');

    const initialPath = join(process.cwd(), 'public/data/browse/initial.json');
    const initialData = JSON.parse(readFileSync(initialPath, 'utf-8'));

    return {
      initialEntries: initialData.alphabetical,
      meta: initialData.meta,
      categories,
    };
  }

  // 런타임 시 (이 코드는 실행되지 않음 - SSG이므로)
  throw new Error('loader should only run at build time');
}

/**
 * clientLoader: 클라이언트에서 실행
 * serverLoader 데이터가 있으면 사용, 없으면 fetch
 */
export async function clientLoader({
  serverLoader,
}: {
  serverLoader: () => Promise<LoaderData>;
}): Promise<LoaderData> {
  try {
    return await serverLoader();
  } catch {
    // Pages 빌드에서 SSG 데이터가 없는 경우 fetch
    const response = await fetch('/data/browse/initial.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch initial browse data: ${response.status}`);
    }
    const initialData = await response.json();

    return {
      initialEntries: initialData.alphabetical,
      meta: initialData.meta,
      categories,
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
    // 랜덤 페이지로 이동 후 해당 페이지에서 랜덤 선택
    const randomPage = Math.floor(Math.random() * meta.totalChunks);
    const randomIndex = Math.floor(Math.random() * meta.chunkSize);
    // 간단히 현재 표시된 엔트리에서 랜덤 선택
    if (displayEntries.length === 0) return;
    const randomEntry = displayEntries[Math.floor(Math.random() * displayEntries.length)];
    if (randomEntry) {
      window.location.href = localePath(`/entry/${randomEntry.id}`);
    }
  }, [displayEntries, localePath, meta.totalChunks, meta.chunkSize]);

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
