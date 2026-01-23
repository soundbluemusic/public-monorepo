import { LIMITS } from '@soundblue/core/validation';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { HIGH_SUPPORT_THRESHOLD, NEW_API_YEAR } from '../../constants';
import type { WebAPI, webApiCategories } from '../../data/web-apis';

export type CategoryFilter = (typeof webApiCategories)[number];
export type SortOption = 'support' | 'newest' | 'name';
type QuickFilterType = 'trending' | 'highSupport' | 'new' | null;

/** 유효한 정렬 옵션 */
const SORT_OPTIONS: readonly SortOption[] = ['support', 'newest', 'name'] as const;

/** 타입 가드: SortOption 검증 */
export function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

interface UseWebApiFiltersOptions {
  apis: WebAPI[];
  categories: readonly string[];
}

interface SearchParams {
  q?: string;
  category?: string;
  filter?: string;
  trending?: string;
}

export function useWebApiFilters({ apis, categories }: UseWebApiFiltersOptions) {
  const searchParams = useSearch({ strict: false }) as SearchParams;
  const navigate = useNavigate();

  // Initialize state from URL params (one-way: URL → State on mount only)
  const categoryParam = searchParams.category;
  const initialParams = {
    q: searchParams.q || '',
    // 카테고리 검증: categories 배열에 포함된 경우만 사용
    category: (categoryParam && categories.includes(categoryParam)
      ? categoryParam
      : 'All') as CategoryFilter,
    filter: searchParams.filter,
    trending: searchParams.trending,
  };

  const [search, setSearch] = useState(initialParams.q);
  const [category, setCategory] = useState<CategoryFilter>(initialParams.category);
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>(() => {
    if (initialParams.trending === 'true') return 'trending';
    if (initialParams.filter === 'highSupport' || initialParams.filter === 'new')
      return initialParams.filter;
    return null;
  });
  const [sortBy, setSortBy] = useState<SortOption>('support');

  const filteredApis = useMemo(() => {
    let filtered = apis;

    // Quick filters
    if (quickFilter === 'trending') {
      filtered = filtered.filter((api) => api.trending);
    } else if (quickFilter === 'highSupport') {
      filtered = filtered.filter(
        (api) => Number.parseInt(api.support, 10) >= HIGH_SUPPORT_THRESHOLD,
      );
    } else if (quickFilter === 'new') {
      filtered = filtered.filter((api) => api.yearStable && api.yearStable >= NEW_API_YEAR);
    }

    // Category filter
    if (category !== 'All') {
      filtered = filtered.filter((api) => api.category === category);
    }

    // Search filter
    const q = search.toLowerCase().slice(0, LIMITS.SEARCH_LENGTH);
    if (q) {
      filtered = filtered.filter(
        (api) =>
          api.name.toLowerCase().includes(q) ||
          api.description.toLowerCase().includes(q) ||
          api.descriptionKo.includes(q),
      );
    }

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'support') {
        const aSupport = Number.parseInt(a.support, 10);
        const bSupport = Number.parseInt(b.support, 10);
        return bSupport - aSupport;
      }
      if (sortBy === 'newest') {
        return (b.yearStable || 0) - (a.yearStable || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [apis, search, category, quickFilter, sortBy]);

  const groupedApis = useMemo(() => {
    if (category !== 'All') {
      return { [category]: filteredApis };
    }
    return filteredApis.reduce<Record<string, WebAPI[]>>((acc, api) => {
      const arr = acc[api.category] ?? [];
      arr.push(api);
      acc[api.category] = arr;
      return acc;
    }, {});
  }, [filteredApis, category]);

  const updateSearchParams = (updates: Partial<SearchParams>) => {
    navigate({
      search: ((prev: SearchParams) => {
        const newParams = { ...prev };
        for (const [key, value] of Object.entries(updates)) {
          if (value === undefined || value === null || value === '') {
            delete newParams[key as keyof SearchParams];
          } else {
            (newParams as Record<string, string>)[key] = value;
          }
        }
        return newParams;
      }) as never,
      replace: true,
    });
  };

  const handleQuickFilter = (filter: 'trending' | 'highSupport' | 'new') => {
    if (quickFilter === filter) {
      setQuickFilter(null);
      updateSearchParams({ filter: undefined, trending: undefined });
    } else {
      setQuickFilter(filter);
      if (filter === 'trending') {
        updateSearchParams({ trending: 'true', filter: undefined });
      } else {
        updateSearchParams({ filter, trending: undefined });
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateSearchParams({ q: value || undefined });
  };

  const handleCategoryChange = (cat: CategoryFilter) => {
    setCategory(cat);
    updateSearchParams({ category: cat !== 'All' ? cat : undefined });
  };

  const clearFilters = () => {
    setQuickFilter(null);
    setCategory('All');
    setSearch('');
    navigate({ search: {} as never, replace: true });
  };

  return {
    search,
    category,
    quickFilter,
    sortBy,
    filteredApis,
    groupedApis,
    setSearch: handleSearchChange,
    setCategory: handleCategoryChange,
    setSortBy,
    handleQuickFilter,
    clearFilters,
  };
}
