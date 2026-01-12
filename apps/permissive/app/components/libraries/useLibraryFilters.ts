import { LIMITS } from '@soundblue/core/validation';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { type CategoryFilter, categories, type Library } from '../../data/libraries';

export type SortOption = 'stars' | 'newest' | 'name';
export type QuickFilter = 'trending' | 'usedHere' | 'new' | null;

/** 유효한 정렬 옵션 */
const SORT_OPTIONS: readonly SortOption[] = ['stars', 'newest', 'name'] as const;

/** 타입 가드: SortOption 검증 */
export function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

interface UseLibraryFiltersOptions {
  libraries: Library[];
}

export function useLibraryFilters({ libraries: libs }: UseLibraryFiltersOptions) {
  const [searchParams, setSearchParams] = useSearchParams();

  // SSG Hydration 안전: 기본값으로 초기화 (클라이언트에서 useEffect로 URL 동기화)
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>(null);
  const [sortBy, setSortBy] = useState<SortOption>('stars');

  // 클라이언트에서만 URL 파라미터 동기화 (hydration 불일치 방지)
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    const tag = searchParams.get('tag');
    const filter = searchParams.get('filter');
    const trending = searchParams.get('trending');

    if (q) setSearch(q);

    if (cat && (categories as readonly string[]).includes(cat)) {
      setCategory(cat as CategoryFilter);
    }

    if (tag) setSelectedTag(tag);

    if (trending === 'true') {
      setQuickFilter('trending');
    } else if (filter === 'usedHere' || filter === 'new') {
      setQuickFilter(filter);
    }
  }, [searchParams]);

  const filteredLibraries = useMemo(() => {
    let filtered = libs;

    if (quickFilter === 'trending') {
      filtered = filtered.filter((lib) => lib.trending);
    } else if (quickFilter === 'usedHere') {
      filtered = filtered.filter((lib) => lib.usedHere);
    } else if (quickFilter === 'new') {
      filtered = filtered.filter((lib) => lib.yearReleased && lib.yearReleased >= 2023);
    }

    if (category !== 'All') {
      filtered = filtered.filter((lib) => lib.category === category);
    }

    if (selectedTag) {
      filtered = filtered.filter((lib) => lib.tags?.includes(selectedTag));
    }

    const q = search.toLowerCase().slice(0, LIMITS.SEARCH_LENGTH);
    if (q) {
      filtered = filtered.filter(
        (lib) =>
          lib.name.toLowerCase().includes(q) ||
          lib.description.toLowerCase().includes(q) ||
          lib.descriptionKo.includes(q),
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === 'stars') {
        const aStars = Number.parseInt(a.stars.replace('k', '000'), 10);
        const bStars = Number.parseInt(b.stars.replace('k', '000'), 10);
        return bStars - aStars;
      }
      if (sortBy === 'newest') {
        return (b.yearReleased || 0) - (a.yearReleased || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [libs, search, category, selectedTag, quickFilter, sortBy]);

  const groupedLibraries = useMemo(() => {
    if (category !== 'All') {
      return { [category]: filteredLibraries };
    }
    return filteredLibraries.reduce<Record<string, Library[]>>((acc, lib) => {
      const arr = acc[lib.category] ?? [];
      arr.push(lib);
      acc[lib.category] = arr;
      return acc;
    }, {});
  }, [filteredLibraries, category]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setQuickFilter(null);
    const params = new URLSearchParams(searchParams);
    params.set('tag', tag);
    setSearchParams(params);
  };

  const handleQuickFilter = (filter: 'trending' | 'usedHere' | 'new') => {
    if (quickFilter === filter) {
      setQuickFilter(null);
      const params = new URLSearchParams(searchParams);
      params.delete('filter');
      params.delete('trending');
      setSearchParams(params);
    } else {
      setQuickFilter(filter);
      setSelectedTag(null);
      const params = new URLSearchParams(searchParams);
      // 기존 필터 파라미터 먼저 삭제 (상호 배타적)
      params.delete('filter');
      params.delete('trending');
      if (filter === 'trending') {
        params.set('trending', 'true');
      } else {
        params.set('filter', filter);
      }
      params.delete('tag');
      setSearchParams(params);
    }
  };

  const clearFilters = () => {
    setQuickFilter(null);
    setSelectedTag(null);
    setCategory('All');
    setSearch('');
    setSearchParams({});
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (cat: CategoryFilter) => {
    setCategory(cat);
    const params = new URLSearchParams(searchParams);
    if (cat !== 'All') {
      params.set('category', cat);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const handleClearTag = () => {
    setSelectedTag(null);
    const params = new URLSearchParams(searchParams);
    params.delete('tag');
    setSearchParams(params);
  };

  return {
    // State
    search,
    category,
    selectedTag,
    quickFilter,
    sortBy,

    // Computed
    filteredLibraries,
    groupedLibraries,

    // Actions
    setSearch: handleSearchChange,
    setCategory: handleCategoryChange,
    setSortBy,
    handleTagClick,
    handleQuickFilter,
    clearFilters,
    handleClearTag,
  };
}
