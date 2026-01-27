/**
 * @fileoverview Browse 필터 훅 (TanStack Query Hydration 기반)
 *
 * SSR에서 prefetch된 데이터가 HydrationBoundary를 통해 Query 캐시에 주입됩니다.
 * useQuery는 캐시에서 즉시 데이터를 반환하므로 로딩 없이 렌더링됩니다.
 */

import { useRouterState } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BROWSE_CHUNK_SIZE, PAGE_SIZE } from '@/constants';
import type { categories } from '@/data/categories';
import type { LightEntry } from '@/data/entries';
import { type SortOption, useBrowseByCategory, useBrowseChunk } from '@/hooks/useBrowseQuery';

/** 카테고리 필터: 'all' 또는 카테고리 ID */
export type FilterCategory = 'all' | string;

/** 유효한 필터 상태 값 (타입과 검증 동기화) */
export const FILTER_STATUSES = ['all', 'studied', 'unstudied', 'bookmarked'] as const;
export type FilterStatus = (typeof FILTER_STATUSES)[number];

/** 유효한 정렬 옵션 값 (타입과 검증 동기화) */
export const SORT_OPTIONS = ['alphabetical', 'category', 'recent'] as const;
export type { SortOption } from '@/hooks/useBrowseQuery';

/** 타입 가드: FilterStatus 검증 */
export function isFilterStatus(value: string): value is FilterStatus {
  return (FILTER_STATUSES as readonly string[]).includes(value);
}

/** 타입 가드: SortOption 검증 */
export function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

export { PAGE_SIZE } from '@/constants';

const CHUNK_SIZE = BROWSE_CHUNK_SIZE;

/** Browse 메타데이터 */
interface BrowseMetadata {
  totalEntries: number;
  chunkSize: number;
  totalChunks: number;
  sortTypes: string[];
  generatedAt: string;
}

interface UseBrowseFiltersOptions {
  categories: typeof categories;
  /** 메타데이터 */
  meta: BrowseMetadata;
  studiedIds: Set<string>;
  favoriteIds: Set<string>;
  isLoading: boolean;
}

/**
 * 청크 기반 Browse 필터 훅 (TanStack Query Hydration)
 *
 * ## 동작 방식
 * 1. SSR loader에서 prefetchQuery로 캐시 채움
 * 2. dehydrate로 캐시 상태 추출
 * 3. HydrationBoundary로 클라이언트 캐시에 주입
 * 4. useQuery가 캐시에서 즉시 반환 (isPending = false)
 */
export function useBrowseFilters({
  categories: cats,
  meta,
  studiedIds,
  favoriteIds,
  isLoading,
}: UseBrowseFiltersOptions) {
  const routerState = useRouterState();
  const searchParams = useMemo(
    () => new URLSearchParams(routerState.location.search),
    [routerState.location.search],
  );

  // Filter & Sort state
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [currentPage, setCurrentPage] = useState(1);

  // 현재 페이지에 해당하는 청크 인덱스 계산
  const chunkIndex = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return Math.floor(startIndex / CHUNK_SIZE);
  }, [currentPage]);

  // 청크 Query (카테고리 필터가 'all'일 때만 활성화)
  // HydrationBoundary로 SSR 데이터가 캐시에 있으므로 즉시 반환
  const { data: chunkData, isPending: isChunkPending } = useBrowseChunk(
    sortBy,
    chunkIndex,
    filterCategory === 'all',
  );

  // 카테고리 Query (카테고리 필터가 있을 때만 활성화)
  const { data: categoryData, isPending: isCategoryPending } = useBrowseByCategory(
    filterCategory,
    filterCategory !== 'all',
  );

  // 현재 청크 엔트리 (Query 캐시에서 가져옴)
  const currentChunkEntries = useMemo(() => {
    if (filterCategory !== 'all') {
      return []; // 카테고리 모드에서는 사용 안함
    }
    return chunkData ?? [];
  }, [filterCategory, chunkData]);

  // 카테고리 엔트리
  const categoryEntries = useMemo(() => {
    if (filterCategory === 'all') return null;
    return categoryData ?? null;
  }, [filterCategory, categoryData]);

  // Sync URL params to state
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const statusParam = searchParams.get('status');
    const sortParam = searchParams.get('sort');
    const pageParam = searchParams.get('page');

    if (categoryParam) {
      const isValidCategory = categoryParam === 'all' || cats.some((c) => c.id === categoryParam);
      if (isValidCategory) {
        setFilterCategory(categoryParam);
      }
    }

    if (statusParam && isFilterStatus(statusParam)) {
      setFilterStatus(statusParam);
    }

    if (sortParam && isSortOption(sortParam)) {
      setSortBy(sortParam);
    }

    if (pageParam) {
      const page = Number.parseInt(pageParam, 10);
      if (!Number.isNaN(page) && page >= 1) {
        setCurrentPage(page);
      }
    }
  }, [searchParams, cats]);

  // 필터 변경 시 페이지 리셋
  const prevFiltersRef = useRef({ filterCategory, filterStatus, sortBy });
  useEffect(() => {
    const prev = prevFiltersRef.current;
    const filtersChanged =
      prev.filterCategory !== filterCategory ||
      prev.filterStatus !== filterStatus ||
      prev.sortBy !== sortBy;

    if (filtersChanged) {
      setCurrentPage(1);
      prevFiltersRef.current = { filterCategory, filterStatus, sortBy };
    }
  }, [filterCategory, filterStatus, sortBy]);

  // URL update helper
  const updateUrlParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const search = params.toString();
      const newUrl = search
        ? `${routerState.location.pathname}?${search}`
        : routerState.location.pathname;
      window.history.replaceState(null, '', newUrl);
    },
    [searchParams, routerState.location.pathname],
  );

  // 필터링 및 표시할 엔트리 계산
  const { displayEntries, totalFilteredCount } = useMemo(() => {
    // 카테고리 필터 사용 시
    if (filterCategory !== 'all') {
      if (isCategoryPending || categoryEntries === null) {
        return { displayEntries: [], totalFilteredCount: 0 };
      }

      let filtered = categoryEntries;

      // 상태 필터 적용
      if (!isLoading && filterStatus !== 'all') {
        if (filterStatus === 'studied') {
          filtered = categoryEntries.filter((e) => studiedIds.has(e.id));
        } else if (filterStatus === 'unstudied') {
          filtered = categoryEntries.filter((e) => !studiedIds.has(e.id));
        } else if (filterStatus === 'bookmarked') {
          filtered = categoryEntries.filter((e) => favoriteIds.has(e.id));
        }
      }

      // 페이지네이션 적용
      const start = (currentPage - 1) * PAGE_SIZE;
      const paginatedEntries = filtered.slice(start, start + PAGE_SIZE);

      return {
        displayEntries: paginatedEntries,
        totalFilteredCount: filtered.length,
      };
    }

    // 전체 목록 (청크 기반)
    let filtered = currentChunkEntries;

    if (!isLoading && filterStatus !== 'all') {
      if (filterStatus === 'studied') {
        filtered = currentChunkEntries.filter((e) => studiedIds.has(e.id));
      } else if (filterStatus === 'unstudied') {
        filtered = currentChunkEntries.filter((e) => !studiedIds.has(e.id));
      } else if (filterStatus === 'bookmarked') {
        filtered = currentChunkEntries.filter((e) => favoriteIds.has(e.id));
      }
    }

    // 청크 내 페이지 위치 계산
    const offsetInChunk = ((currentPage - 1) * PAGE_SIZE) % CHUNK_SIZE;

    // 상태 필터가 없을 때만 청크 내 페이지네이션 적용
    let paginatedEntries: LightEntry[];
    if (filterStatus === 'all') {
      paginatedEntries = filtered.slice(offsetInChunk, offsetInChunk + PAGE_SIZE);
    } else {
      const start = (currentPage - 1) * PAGE_SIZE;
      paginatedEntries = filtered.slice(start % CHUNK_SIZE, (start % CHUNK_SIZE) + PAGE_SIZE);
    }

    return {
      displayEntries: paginatedEntries,
      totalFilteredCount: filterStatus === 'all' ? meta.totalEntries : filtered.length,
    };
  }, [
    filterCategory,
    filterStatus,
    currentPage,
    categoryEntries,
    isCategoryPending,
    currentChunkEntries,
    studiedIds,
    favoriteIds,
    isLoading,
    meta.totalEntries,
  ]);

  // 총 페이지 수 계산
  const totalPages = useMemo(() => {
    if (filterCategory !== 'all') {
      return Math.ceil(totalFilteredCount / PAGE_SIZE);
    }
    if (filterStatus !== 'all') {
      return Math.ceil(totalFilteredCount / PAGE_SIZE);
    }
    return Math.ceil(meta.totalEntries / PAGE_SIZE);
  }, [filterCategory, filterStatus, totalFilteredCount, meta.totalEntries]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      const params = new URLSearchParams(searchParams);
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', String(page));
      }
      const search = params.toString();
      const newUrl = search
        ? `${routerState.location.pathname}?${search}`
        : routerState.location.pathname;
      window.history.replaceState(null, '', newUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchParams, routerState.location.pathname],
  );

  // 로딩 상태 통합
  const isLoadingChunk = filterCategory === 'all' ? isChunkPending : isCategoryPending;

  return {
    // State
    filterCategory,
    filterStatus,
    sortBy,
    currentPage,
    isLoadingChunk,

    // Setters
    setFilterCategory,
    setFilterStatus,
    setSortBy,

    // Computed
    displayEntries,
    totalFilteredCount,
    totalPages,

    // Actions
    updateUrlParams,
    handlePageChange,
  };
}
