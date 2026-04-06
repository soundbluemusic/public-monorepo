/**
 * @fileoverview 찾아보기 페이지 공유 컴포넌트
 *
 * 영어/한국어 라우트 파일에서 공통으로 사용하는 UI 컴포넌트입니다.
 * useI18n()을 통해 locale에 따라 자동으로 번역된 텍스트를 표시합니다.
 */

import { generateItemListSchema, serializeSchema } from '@soundblue/seo/structured-data';
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
import type { Category } from '@/data/types';
import { useStudyData } from '@/hooks';
import { useI18n } from '@/i18n';

/** Browse 메타데이터 */
export interface BrowseMetadata {
  totalEntries: number;
  chunkSize: number;
  totalChunks: number;
  sortTypes: string[];
  generatedAt: string;
}

interface BrowsePageContentProps {
  meta: BrowseMetadata;
  categories: Category[];
}

export function BrowsePageContent({ meta, categories: cats }: BrowsePageContentProps) {
  const { locale, localePath, t } = useI18n();
  const { baseUrl } = APP_CONFIG;
  const localePrefix = locale === 'ko' ? '/ko' : '';

  const categoryListSchema = generateItemListSchema({
    name: locale === 'ko' ? '카테고리별 한국어 단어' : 'Korean Words by Category',
    url: `${baseUrl}${localePrefix}/browse`,
    items: cats.map((cat) => ({
      name: cat.name[locale],
      url: `${baseUrl}${localePrefix}/category/${cat.id}`,
    })),
    numberOfItems: meta.totalEntries,
  });

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
      {/* JSON-LD - content is generated from trusted category metadata */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: serializeSchema(categoryListSchema) }}
      />
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
            labels={{
              navLabel: t('pageNavigation'),
              previousPage: t('previousPage'),
              nextPage: t('nextPage'),
            }}
          />
        </>
      )}
    </Layout>
  );
}
