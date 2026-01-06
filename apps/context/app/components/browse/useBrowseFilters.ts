import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { z } from 'zod';
import type { categories } from '@/data/categories';
import type { LightEntry } from '@/data/entries';

/** Zod schema for runtime validation of fetched LightEntry data */
const LightEntrySchema = z.object({
  id: z.string(),
  korean: z.string(),
  romanization: z.string(),
  categoryId: z.string(),
  word: z.object({
    ko: z.string(),
    en: z.string(),
  }),
});

const LightEntryArraySchema = z.array(LightEntrySchema);

/** 카테고리 필터: 'all' 또는 카테고리 ID */
export type FilterCategory = 'all' | string;

/** 유효한 필터 상태 값 (타입과 검증 동기화) */
export const FILTER_STATUSES = ['all', 'studied', 'unstudied', 'bookmarked'] as const;
export type FilterStatus = (typeof FILTER_STATUSES)[number];

/** 유효한 정렬 옵션 값 (타입과 검증 동기화) */
export const SORT_OPTIONS = ['alphabetical', 'category', 'recent'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

/** 타입 가드: FilterStatus 검증 */
export function isFilterStatus(value: string): value is FilterStatus {
  return (FILTER_STATUSES as readonly string[]).includes(value);
}

/** 타입 가드: SortOption 검증 */
export function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

/** 페이지당 항목 수 */
export const PAGE_SIZE = 50;

interface UseBrowseFiltersOptions {
  categories: typeof categories;
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
  studiedIds: Set<string>;
  favoriteIds: Set<string>;
  isLoading: boolean;
}

export function useBrowseFilters({
  categories: cats,
  sortedArrays,
  sortIndices,
  studiedIds,
  favoriteIds,
  isLoading,
}: UseBrowseFiltersOptions) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter & Sort state
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [currentPage, setCurrentPage] = useState(1);

  // 카테고리별 동적 로드 상태
  const [categoryEntries, setCategoryEntries] = useState<LightEntry[] | null>(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  // Sync URL params to state (타입 가드 사용)
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

  // 카테고리 변경 시 동적 로드
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
      .then((data: unknown) => {
        // Runtime validation of fetched data
        const parsed = LightEntryArraySchema.parse(data);
        setCategoryEntries(parsed);
        setIsLoadingCategory(false);
      })
      .catch(() => {
        setCategoryEntries([]);
        setIsLoadingCategory(false);
      });
  }, [filterCategory]);

  // 필터 변경 시 페이지 리셋
  // biome-ignore lint/correctness/useExhaustiveDependencies: 필터 변경에만 반응해야 함
  useEffect(() => {
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    setSearchParams(params, { replace: true });
  }, [filterCategory, filterStatus, sortBy]);

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

  // 최적화된 필터링 + 정렬 로직
  const filteredEntries = useMemo(() => {
    let baseArray: LightEntry[];
    if (filterCategory !== 'all') {
      if (isLoadingCategory || categoryEntries === null) {
        return [];
      }
      baseArray = categoryEntries;
    } else {
      baseArray = sortedArrays[sortBy];
    }

    let filtered: LightEntry[];
    if (isLoading || filterStatus === 'all') {
      filtered = baseArray;
    } else if (filterStatus === 'studied') {
      filtered = baseArray.filter((e) => studiedIds.has(e.id));
    } else if (filterStatus === 'unstudied') {
      filtered = baseArray.filter((e) => !studiedIds.has(e.id));
    } else {
      filtered = baseArray.filter((e) => favoriteIds.has(e.id));
    }

    if (filterCategory !== 'all' || filterStatus !== 'all') {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    // State
    filterCategory,
    filterStatus,
    sortBy,
    currentPage,
    isLoadingCategory,

    // Setters
    setFilterCategory,
    setFilterStatus,
    setSortBy,

    // Computed
    filteredEntries,
    paginatedEntries,
    totalPages,

    // Actions
    updateUrlParams,
    handlePageChange,
  };
}
