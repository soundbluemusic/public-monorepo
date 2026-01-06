/**
 * @fileoverview 개념 필터 컴포넌트
 */
import { cn } from '@soundblue/ui/utils';
import { X } from 'lucide-react';
import { fields, isMathField } from '@/data/fields';
import { type DifficultyLevel, difficultyLabels, type MathField } from '@/data/types';
import { useI18n } from '@/i18n';
import { isSortOption, type SortOption } from './useBrowseFilters';

interface ConceptFiltersProps {
  filterDifficulty: DifficultyLevel[];
  filterField: MathField | 'all';
  sortBy: SortOption;
  onToggleDifficulty: (level: DifficultyLevel) => void;
  onFieldChange: (field: MathField | 'all') => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export function ConceptFilters({
  filterDifficulty,
  filterField,
  sortBy,
  onToggleDifficulty,
  onFieldChange,
  onSortChange,
  onReset,
  totalCount,
  filteredCount,
}: ConceptFiltersProps) {
  const { locale, t } = useI18n();

  const difficulties: DifficultyLevel[] = [1, 2, 3, 4, 5];
  const hasActiveFilters = filterDifficulty.length > 0 || filterField !== 'all';

  return (
    <div className="space-y-4 mb-6 p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
      {/* 난이도 필터 */}
      <fieldset>
        <legend className="block text-sm font-medium text-(--text-secondary) mb-2">
          {t('difficulty')}
        </legend>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((level) => {
            const isActive = filterDifficulty.includes(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => onToggleDifficulty(level)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-11',
                  isActive
                    ? 'bg-(--accent-bg) text-white'
                    : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-secondary)',
                )}
              >
                {difficultyLabels[level][locale]}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 분야 필터 */}
      <div>
        <label
          htmlFor="field-filter"
          className="block text-sm font-medium text-(--text-secondary) mb-2"
        >
          {t('field')}
        </label>
        <select
          id="field-filter"
          value={filterField}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'all' || isMathField(value)) onFieldChange(value);
          }}
          className="w-full max-w-xs min-h-11 px-3 py-2 rounded-lg bg-(--bg-primary) border border-(--border-primary) text-(--text-primary) focus:outline-hidden focus:border-(--border-focus)"
        >
          <option value="all">{t('allFields')}</option>
          {fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.icon} {field.name[locale]}
            </option>
          ))}
        </select>
      </div>

      {/* 정렬 옵션 */}
      <div>
        <label
          htmlFor="sort-option"
          className="block text-sm font-medium text-(--text-secondary) mb-2"
        >
          {t('sortBy')}
        </label>
        <select
          id="sort-option"
          value={sortBy}
          onChange={(e) => {
            const value = e.target.value;
            if (isSortOption(value)) onSortChange(value);
          }}
          className="w-full max-w-xs min-h-11 px-3 py-2 rounded-lg bg-(--bg-primary) border border-(--border-primary) text-(--text-primary) focus:outline-hidden focus:border-(--border-focus)"
        >
          <option value="name">{t('sortByName')}</option>
          <option value="difficulty">{t('sortByDifficulty')}</option>
          <option value="field">{t('sortByField')}</option>
        </select>
      </div>

      {/* 결과 개수 & 초기화 */}
      <div className="flex items-center justify-between pt-2 border-t border-(--border-primary)">
        <span className="text-sm text-(--text-secondary)">
          {hasActiveFilters
            ? t('filteredResultsCount', { filtered: filteredCount, total: totalCount })
            : t('totalConceptsCount', { count: totalCount })}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-4 py-2 min-h-11 rounded-lg text-sm font-medium text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors"
          >
            <X size={14} aria-hidden="true" />
            {t('resetFilters')}
          </button>
        )}
      </div>
    </div>
  );
}
