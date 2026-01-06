import { LIMITS } from '@soundblue/core/validation';
import { useMemo, useState } from 'react';
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

  // Initialize state from URL params
  const initialParams = {
    q: searchParams.get('q') || '',
    category: searchParams.get('category'),
    tag: searchParams.get('tag'),
    filter: searchParams.get('filter'),
    trending: searchParams.get('trending'),
  };

  const [search, setSearch] = useState(initialParams.q);
  const [category, setCategory] = useState<CategoryFilter>(() => {
    const cat = initialParams.category;
    return cat && (categories as readonly string[]).includes(cat) ? (cat as CategoryFilter) : 'All';
  });
  const [selectedTag, setSelectedTag] = useState<string | null>(initialParams.tag);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>(() => {
    if (initialParams.trending === 'true') return 'trending';
    if (initialParams.filter === 'usedHere' || initialParams.filter === 'new')
      return initialParams.filter;
    return null;
  });
  const [sortBy, setSortBy] = useState<SortOption>('stars');

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
