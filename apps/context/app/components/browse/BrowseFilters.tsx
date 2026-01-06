import { memo, useMemo } from 'react';
import { Select, type SelectOption } from '@/components/Select';
import type { categories } from '@/data/categories';
import type { MessageKey } from '@/i18n';
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
  /** i18n translation function (타입 안전) */
  t: (key: MessageKey) => string;
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
  // 카테고리 옵션: 동적으로 생성 (categories 데이터 기반)
  // FilterCategory = 'all' | string 이므로 cat.id(string)는 자연스럽게 호환됨
  const categoryOptions = useMemo<SelectOption<FilterCategory>[]>(
    () => [
      { value: 'all', label: t('filterAll') },
      ...cats.map((cat) => ({
        value: cat.id,
        label: `${cat.icon} ${cat.name[locale]}`,
      })),
    ],
    [cats, locale, t],
  );

  // 상태 옵션: i18n 적용
  const statusOptions = useMemo<SelectOption<FilterStatus>[]>(
    () => [
      { value: 'all', label: t('filterAll') },
      { value: 'studied', label: t('filterStudied') },
      { value: 'unstudied', label: t('filterUnstudied') },
      { value: 'bookmarked', label: t('filterBookmarked') },
    ],
    [t],
  );

  // 정렬 옵션: i18n 적용
  const sortOptions = useMemo<SelectOption<SortOption>[]>(
    () => [
      { value: 'alphabetical', label: t('sortAlphabetical') },
      { value: 'category', label: t('sortCategory') },
      { value: 'recent', label: t('sortRecent') },
    ],
    [t],
  );

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <Select<FilterCategory>
        id="category-filter"
        label={t('filterCategory')}
        value={filterCategory}
        options={categoryOptions}
        onChange={onCategoryChange}
      />

      <Select<FilterStatus>
        id="status-filter"
        label={t('filterStatus')}
        value={filterStatus}
        options={statusOptions}
        onChange={onStatusChange}
      />

      <Select<SortOption>
        id="sort-by"
        label={t('filterSort')}
        value={sortBy}
        options={sortOptions}
        onChange={onSortChange}
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
});
