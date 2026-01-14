import { useCallback, useEffect, useMemo, useState } from 'react';
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

/** 청크 파일 스키마 */
const ChunkFileSchema = z.object({
  chunkIndex: z.number(),
  entries: LightEntryArraySchema,
  hasMore: z.boolean(),
});

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

/** 청크당 항목 수 (generate-browse-chunks.ts와 동기화) */
const CHUNK_SIZE = 1000;

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
  /** SSG에서 로드된 초기 엔트리 (첫 청크) */
  initialEntries: LightEntry[];
  /** 메타데이터 */
  meta: BrowseMetadata;
  studiedIds: Set<string>;
  favoriteIds: Set<string>;
  isLoading: boolean;
}

/** 청크 캐시 (정렬 타입별) */
const chunkCache = new Map<string, LightEntry[]>();

/**
 * 청크 기반 Browse 필터 훅
 *
 * ## 최적화 전략
 * - SSG에서 첫 청크만 로드 (1000개)
 * - 페이지 전환 시 필요한 청크만 fetch
 * - 청크는 메모리에 캐시하여 재사용
 */
export function useBrowseFilters({
  categories: cats,
  initialEntries,
  meta,
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

  // 청크 로딩 상태
  const [isLoadingChunk, setIsLoadingChunk] = useState(false);
  const [currentChunkEntries, setCurrentChunkEntries] = useState<LightEntry[]>(initialEntries);

  // 카테고리별 동적 로드 상태
  const [categoryEntries, setCategoryEntries] = useState<LightEntry[] | null>(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  // 초기 청크를 캐시에 저장
  useEffect(() => {
    const cacheKey = `alphabetical-0`;
    if (!chunkCache.has(cacheKey)) {
      chunkCache.set(cacheKey, initialEntries);
    }
  }, [initialEntries]);

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

  // 청크 fetch 함수
  const fetchChunk = useCallback(
    async (sortType: SortOption, chunkIndex: number): Promise<LightEntry[]> => {
      const cacheKey = `${sortType}-${chunkIndex}`;

      // 캐시 확인
      const cached = chunkCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // fetch
      const response = await fetch(`/data/browse/${sortType}/chunk-${chunkIndex}.json`);
      if (!response.ok) {
        console.error(`Failed to fetch chunk: ${sortType}/${chunkIndex}`);
        return [];
      }

      const data = await response.json();
      const parsed = ChunkFileSchema.parse(data);

      // 캐시에 저장
      chunkCache.set(cacheKey, parsed.entries);
      return parsed.entries;
    },
    [],
  );

  // 페이지에 해당하는 청크 로드
  useEffect(() => {
    // 카테고리 필터 사용 시에는 청크 로드하지 않음
    if (filterCategory !== 'all') {
      return;
    }

    // 현재 페이지가 어느 청크에 속하는지 계산
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const chunkIndex = Math.floor(startIndex / CHUNK_SIZE);
    const cacheKey = `${sortBy}-${chunkIndex}`;

    // 이미 캐시에 있으면 바로 사용
    const cached = chunkCache.get(cacheKey);
    if (cached) {
      setCurrentChunkEntries(cached);
      return;
    }

    // 새 청크 fetch
    setIsLoadingChunk(true);
    fetchChunk(sortBy, chunkIndex)
      .then((entries) => {
        setCurrentChunkEntries(entries);
      })
      .finally(() => {
        setIsLoadingChunk(false);
      });
  }, [currentPage, sortBy, filterCategory, fetchChunk]);

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
  useEffect(() => {
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  // 필터링 및 표시할 엔트리 계산
  const { displayEntries, totalFilteredCount } = useMemo(() => {
    // 카테고리 필터 사용 시
    if (filterCategory !== 'all') {
      if (isLoadingCategory || categoryEntries === null) {
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
    // 상태 필터가 있으면 현재 청크에서 필터링
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
    const chunkIndex = Math.floor(((currentPage - 1) * PAGE_SIZE) / CHUNK_SIZE);
    const offsetInChunk = ((currentPage - 1) * PAGE_SIZE) % CHUNK_SIZE;

    // 상태 필터가 없을 때만 청크 내 페이지네이션 적용
    let paginatedEntries: LightEntry[];
    if (filterStatus === 'all') {
      paginatedEntries = filtered.slice(offsetInChunk, offsetInChunk + PAGE_SIZE);
    } else {
      // 상태 필터 있으면 필터링된 결과에서 페이지네이션
      // (이 경우 totalFilteredCount가 정확하지 않을 수 있음 - 전체 스캔 필요)
      const start = (currentPage - 1) * PAGE_SIZE;
      paginatedEntries = filtered.slice(start % CHUNK_SIZE, (start % CHUNK_SIZE) + PAGE_SIZE);
    }

    return {
      displayEntries: paginatedEntries,
      // 상태 필터 없을 때는 전체 개수, 있을 때는 현재 청크 기준 (근사치)
      totalFilteredCount: filterStatus === 'all' ? meta.totalEntries : filtered.length,
    };
  }, [
    filterCategory,
    filterStatus,
    currentPage,
    categoryEntries,
    isLoadingCategory,
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
      // 상태 필터 시 정확한 페이지 수 계산 불가 - 근사치 사용
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
      setSearchParams(params);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchParams, setSearchParams],
  );

  return {
    // State
    filterCategory,
    filterStatus,
    sortBy,
    currentPage,
    isLoadingChunk: isLoadingChunk || isLoadingCategory,

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
