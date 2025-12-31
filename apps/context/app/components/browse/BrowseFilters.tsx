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
}

export function BrowseFilters({
  locale,
  categories: cats,
  filterCategory,
  filterStatus,
  sortBy,
  onCategoryChange,
  onStatusChange,
  onSortChange,
}: BrowseFiltersProps) {
  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <Select
        id="category-filter"
        label={locale === 'ko' ? '카테고리' : 'Category'}
        value={filterCategory}
        options={[
          { value: 'all', label: locale === 'ko' ? '전체' : 'All' },
          ...cats.map((cat) => ({
            value: cat.id,
            label: `${cat.icon} ${cat.name[locale]}`,
          })),
        ]}
        onChange={(value) => {
          console.log('[DEBUG] Category changed to:', value);
          onCategoryChange(value as FilterCategory);
        }}
      />

      <Select
        id="status-filter"
        label={locale === 'ko' ? '학습 상태' : 'Study Status'}
        value={filterStatus}
        options={[
          { value: 'all', label: locale === 'ko' ? '전체' : 'All' },
          { value: 'studied', label: locale === 'ko' ? '학습 완료' : 'Studied' },
          { value: 'unstudied', label: locale === 'ko' ? '미학습' : 'Unstudied' },
          { value: 'bookmarked', label: locale === 'ko' ? '북마크' : 'Bookmarked' },
        ]}
        onChange={(value) => onStatusChange(value as FilterStatus)}
      />

      <Select
        id="sort-by"
        label={locale === 'ko' ? '정렬' : 'Sort By'}
        value={sortBy}
        options={[
          { value: 'alphabetical', label: locale === 'ko' ? '가나다순' : 'Alphabetical' },
          { value: 'category', label: locale === 'ko' ? '카테고리별' : 'By Category' },
          { value: 'recent', label: locale === 'ko' ? '최근 추가' : 'Recently Added' },
        ]}
        onChange={(value) => onSortChange(value as SortOption)}
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
}
