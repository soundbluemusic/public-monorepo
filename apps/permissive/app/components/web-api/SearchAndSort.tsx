import { cn } from '@soundblue/ui/utils';
import { Search } from 'lucide-react';
import { type CategoryFilter, isSortOption, type SortOption } from './useWebApiFilters';

interface SearchAndSortProps {
  locale: 'en' | 'ko';
  search: string;
  sortBy: SortOption;
  category: CategoryFilter;
  categories: readonly CategoryFilter[];
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onCategoryChange: (value: CategoryFilter) => void;
}

export function SearchAndSort({
  locale,
  search,
  sortBy,
  category,
  categories,
  onSearchChange,
  onSortChange,
  onCategoryChange,
}: SearchAndSortProps) {
  const sortLabel = locale === 'ko' ? '정렬 방식' : 'Sort by';
  const searchLabel = locale === 'ko' ? 'API 검색' : 'Search APIs';
  const categoryGroupLabel = locale === 'ko' ? 'API 카테고리 필터' : 'API category filter';

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor="webapi-search" className="sr-only">
            {searchLabel}
          </label>
          <Search
            size={18}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
          />
          <input
            id="webapi-search"
            type="text"
            autoComplete="off"
            placeholder={locale === 'ko' ? 'API 검색...' : 'Search APIs...'}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full min-h-11 pl-10 pr-4 rounded-lg bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-hidden focus:border-(--border-focus) transition-colors"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="webapi-sort" className="sr-only">
            {sortLabel}
          </label>
          <select
            id="webapi-sort"
            value={sortBy}
            aria-label={sortLabel}
            onChange={(e) => {
              const value = e.target.value;
              if (isSortOption(value)) onSortChange(value);
            }}
            className="min-h-11 px-4 rounded-lg bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) focus:outline-hidden focus:border-(--border-focus) transition-colors cursor-pointer"
          >
            <option value="support">{locale === 'ko' ? '지원률순' : 'Most Supported'}</option>
            <option value="newest">{locale === 'ko' ? '최신순' : 'Newest First'}</option>
            <option value="name">{locale === 'ko' ? '이름순' : 'Name A-Z'}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label={categoryGroupLabel}>
        {categories.map((cat) => {
          const isSelected = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              aria-pressed={isSelected}
              className={cn(
                'px-4 min-h-9 inline-flex items-center rounded-full text-sm font-medium transition-colors cursor-pointer',
                isSelected
                  ? 'bg-(--accent-primary) text-white'
                  : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)',
              )}
            >
              {cat === 'All' ? (locale === 'ko' ? '전체' : 'All') : cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
