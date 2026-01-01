import { memo } from 'react';
import { Select } from '@/components/Select';
import type { categories } from '@/data/categories';
import type { FilterCategory, FilterStatus, SortOption } from './useBrowseFilters';

interface BrowseFiltersProps {
  locale: 'en' | 'ko';
  categories: typeof categories;
  filterCategory: FilterCategory;
  filterStatus: FilterStatus;
  sortBy: SortOption;
  onCategoryChange: (value: FilterCategory) => void;
  onStatusChange: (value: FilterStatus) => void;
  onSortChange: (value: SortOption) => void;
  /** i18n translation function */
  t: (key: string) => string;
}

export const BrowseFilters = memo(function BrowseFilters({
  locale,
  categories: cats,
  filterCategory,
  filterStatus,
  sortBy,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  t,
}: BrowseFiltersProps) {
  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <Select
        id="category-filter"
        label={t('filterCategory')}
        value={filterCategory}
        options={[
          { value: 'all', label: t('filterAll') },
          ...cats.map((cat) => ({
            value: cat.id,
            label: `${cat.icon} ${cat.name[locale]}`,
          })),
        ]}
        onChange={(value) => onCategoryChange(value as FilterCategory)}
      />

      <Select
        id="status-filter"
        label={t('filterStatus')}
        value={filterStatus}
        options={[
          { value: 'all', label: t('filterAll') },
          { value: 'studied', label: t('filterStudied') },
          { value: 'unstudied', label: t('filterUnstudied') },
          { value: 'bookmarked', label: t('filterBookmarked') },
        ]}
        onChange={(value) => onStatusChange(value as FilterStatus)}
      />

      <Select
        id="sort-by"
        label={t('filterSort')}
        value={sortBy}
        options={[
          { value: 'alphabetical', label: t('sortAlphabetical') },
          { value: 'category', label: t('sortCategory') },
          { value: 'recent', label: t('sortRecent') },
        ]}
        onChange={(value) => onSortChange(value as SortOption)}
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
});
