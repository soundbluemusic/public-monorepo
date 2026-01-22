/**
 * @fileoverview Browse 페이지 필터 훅
 *
 * URL 파라미터로 필터 상태를 관리하여 북마크/공유 가능
 * TanStack Router 호환: Browser URLSearchParams API 직접 사용
 */
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  difficultyIndex,
  fieldIndex,
  type LightConcept,
  lightConceptsSortedByDifficulty,
  lightConceptsSortedByField,
  lightConceptsSortedByName,
  nameIndex,
} from '@/data/concepts';
import { isMathField } from '@/data/fields';
import type { DifficultyLevel, MathField } from '@/data/types';

export type SortOption = 'name' | 'difficulty' | 'field';
export type ViewMode = 'fields' | 'concepts' | 'graph';

/** 유효한 정렬 옵션 */
const SORT_OPTIONS: readonly SortOption[] = ['name', 'difficulty', 'field'] as const;

/** 유효한 뷰 모드 */
const VIEW_MODES: readonly ViewMode[] = ['fields', 'concepts', 'graph'] as const;

/** 타입 가드: SortOption 검증 */
export function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

/** 타입 가드: ViewMode 검증 */
export function isViewMode(value: string): value is ViewMode {
  return (VIEW_MODES as readonly string[]).includes(value);
}

/** 페이지당 항목 수 */
export const PAGE_SIZE = 50;

interface UseBrowseFiltersReturn {
  // State
  viewMode: ViewMode;
  filterDifficulty: DifficultyLevel[];
  filterField: MathField | 'all';
  sortBy: SortOption;
  currentPage: number;

  // Setters
  setViewMode: (mode: ViewMode) => void;
  toggleDifficulty: (level: DifficultyLevel) => void;
  setFilterField: (field: MathField | 'all') => void;
  setSortBy: (sort: SortOption) => void;

  // Computed
  filteredConcepts: LightConcept[];
  paginatedConcepts: LightConcept[];
  totalPages: number;
  totalCount: number;

  // Actions
  handlePageChange: (page: number) => void;
  resetFilters: () => void;
}

export function useBrowseFilters(): UseBrowseFiltersReturn {
  const routerState = useRouterState();
  const navigate = useNavigate();

  // Parse search params from router state
  const getSearchParams = useCallback(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(routerState.location.search);
  }, [routerState.location.search]);

  // View mode state
  const [viewMode, setViewModeState] = useState<ViewMode>('fields');

  // Filter & Sort state
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel[]>([]);
  const [filterField, setFilterField] = useState<MathField | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [currentPage, setCurrentPage] = useState(1);

  // Sync URL params to state (on mount)
  useEffect(() => {
    const searchParams = getSearchParams();
    const viewParam = searchParams.get('view');
    const diffParam = searchParams.get('difficulty');
    const fieldParam = searchParams.get('field');
    const sortParam = searchParams.get('sort');
    const pageParam = searchParams.get('page');

    if (viewParam && isViewMode(viewParam) && viewParam !== 'fields') {
      setViewModeState(viewParam);
    }

    if (diffParam) {
      const levels = diffParam
        .split(',')
        .map((s) => Number.parseInt(s, 10))
        .filter((n) => n >= 1 && n <= 5) as DifficultyLevel[];
      if (levels.length > 0) {
        setFilterDifficulty(levels);
      }
    }

    if (fieldParam && fieldParam !== 'all' && isMathField(fieldParam)) {
      setFilterField(fieldParam);
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
  }, [getSearchParams]);

  // URL update helper - use browser history API
  const updateUrlParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = getSearchParams();
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '' || value === 'all') {
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
    [getSearchParams, routerState.location.pathname],
  );

  // View mode setter
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    updateUrlParams({
      view: mode === 'fields' ? null : mode,
    });
  };

  // Difficulty toggle
  const toggleDifficulty = (level: DifficultyLevel) => {
    setFilterDifficulty((prev) => {
      const next = prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level];
      updateUrlParams({
        difficulty: next.length > 0 ? next.sort().join(',') : null,
        page: null, // Reset page on filter change
      });
      setCurrentPage(1);
      return next;
    });
  };

  // Field setter
  const setFilterFieldAndUpdate = (field: MathField | 'all') => {
    setFilterField(field);
    updateUrlParams({
      field: field === 'all' ? null : field,
      page: null,
    });
    setCurrentPage(1);
  };

  // Sort setter
  const setSortByAndUpdate = (sort: SortOption) => {
    setSortBy(sort);
    updateUrlParams({
      sort: sort === 'name' ? null : sort,
      page: null,
    });
    setCurrentPage(1);
  };

  // Get sorted array based on sortBy
  const getSortedArray = useCallback((): LightConcept[] => {
    switch (sortBy) {
      case 'difficulty':
        return lightConceptsSortedByDifficulty;
      case 'field':
        return lightConceptsSortedByField;
      default:
        return lightConceptsSortedByName;
    }
  }, [sortBy]);

  // Get sort index based on sortBy
  const getSortIndex = useCallback((): Map<string, number> => {
    switch (sortBy) {
      case 'difficulty':
        return difficultyIndex;
      case 'field':
        return fieldIndex;
      default:
        return nameIndex;
    }
  }, [sortBy]);

  // Filtered concepts
  const filteredConcepts = useMemo(() => {
    const baseArray = getSortedArray();

    // No filters = return base array as-is
    if (filterDifficulty.length === 0 && filterField === 'all') {
      return baseArray;
    }

    // Filter
    let filtered = baseArray;

    if (filterDifficulty.length > 0) {
      filtered = filtered.filter((c) => filterDifficulty.includes(c.difficulty));
    }

    if (filterField !== 'all') {
      filtered = filtered.filter((c) => c.field === filterField);
    }

    // If filtered, need to re-sort using index
    if (filterDifficulty.length > 0 || filterField !== 'all') {
      const indexMap = getSortIndex();
      return [...filtered].sort((a, b) => {
        const idxA = indexMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const idxB = indexMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        return idxA - idxB;
      });
    }

    return filtered;
  }, [filterDifficulty, filterField, getSortedArray, getSortIndex]);

  // Pagination
  const totalCount = filteredConcepts.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const paginatedConcepts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredConcepts.slice(start, start + PAGE_SIZE);
  }, [filteredConcepts, currentPage]);

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = getSearchParams();
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
  };

  // Reset filters
  const resetFilters = () => {
    setFilterDifficulty([]);
    setFilterField('all');
    setSortBy('name');
    setCurrentPage(1);
    window.history.replaceState(null, '', routerState.location.pathname);
  };

  return {
    // State
    viewMode,
    filterDifficulty,
    filterField,
    sortBy,
    currentPage,

    // Setters
    setViewMode,
    toggleDifficulty,
    setFilterField: setFilterFieldAndUpdate,
    setSortBy: setSortByAndUpdate,

    // Computed
    filteredConcepts,
    paginatedConcepts,
    totalPages,
    totalCount,

    // Actions
    handlePageChange,
    resetFilters,
  };
}
