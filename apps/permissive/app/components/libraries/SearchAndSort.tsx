import { cn } from '@soundblue/ui/utils';
import { Search } from 'lucide-react';
import { type CategoryFilter, categories } from '../../data/libraries';
import { isSortOption, type SortOption } from './useLibraryFilters';

interface SearchAndSortProps {
  locale: 'en' | 'ko';
  search: string;
  sortBy: SortOption;
  category: CategoryFilter;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onCategoryChange: (value: CategoryFilter) => void;
}

export function SearchAndSort({
  locale,
  search,
  sortBy,
  category,
  onSearchChange,
  onSortChange,
  onCategoryChange,
}: SearchAndSortProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
          />
          <input
            type="text"
            placeholder={locale === 'ko' ? '라이브러리 검색...' : 'Search libraries...'}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full min-h-11 pl-10 pr-4 rounded-lg bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-hidden focus:border-(--border-focus) transition-colors"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => {
            const value = e.target.value;
            if (isSortOption(value)) onSortChange(value);
          }}
          className="min-h-11 px-4 rounded-lg bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) focus:outline-hidden focus:border-(--border-focus) transition-colors cursor-pointer"
        >
          <option value="stars">{locale === 'ko' ? '인기순' : 'Most Popular'}</option>
          <option value="newest">{locale === 'ko' ? '최신순' : 'Newest First'}</option>
          <option value="name">{locale === 'ko' ? '이름순' : 'Name A-Z'}</option>
        </select>
      </div>

      {/* Category filter */}
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-(--bg-primary) to-transparent pointer-events-none z-10 sm:hidden" />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:overflow-visible sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 sm:shrink',
                category === cat
                  ? 'bg-(--accent-primary) text-white'
                  : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)',
              )}
            >
              {cat === 'All' ? (locale === 'ko' ? '전체' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
