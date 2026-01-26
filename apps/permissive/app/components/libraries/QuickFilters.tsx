import { useAutoAnimate } from '@soundblue/ui/hooks';
import { cn } from '@soundblue/ui/utils';
import { CalendarPlus, Flame, Star } from 'lucide-react';
import type { QuickFilter } from './useLibraryFilters';

interface QuickFiltersProps {
  locale: 'en' | 'ko';
  quickFilter: QuickFilter;
  selectedTag: string | null;
  onQuickFilter: (filter: 'trending' | 'usedHere' | 'new') => void;
  onClearFilters: () => void;
}

export function QuickFilters({
  locale,
  quickFilter,
  selectedTag,
  onQuickFilter,
  onClearFilters,
}: QuickFiltersProps) {
  const [quickFiltersRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <div ref={quickFiltersRef} className="flex flex-wrap gap-2 mb-4">
      <button
        type="button"
        onClick={() => onQuickFilter('trending')}
        className={cn(
          'min-h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
          quickFilter === 'trending'
            ? 'bg-orange-500 text-white'
            : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)',
        )}
      >
        <Flame size={16} aria-hidden="true" />
        {locale === 'ko'
          ? `${new Date().getFullYear()} 트렌딩`
          : `Trending ${new Date().getFullYear()}`}
      </button>
      <button
        type="button"
        onClick={() => onQuickFilter('usedHere')}
        className={cn(
          'min-h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
          quickFilter === 'usedHere'
            ? 'bg-purple-500 text-white'
            : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)',
        )}
      >
        <Star size={16} aria-hidden="true" />
        {locale === 'ko' ? '사용 중' : 'Used Here'}
      </button>
      <button
        type="button"
        onClick={() => onQuickFilter('new')}
        className={cn(
          'min-h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
          quickFilter === 'new'
            ? 'bg-blue-500 text-white'
            : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)',
        )}
      >
        <CalendarPlus size={16} aria-hidden="true" />
        {locale === 'ko' ? '새로운 (2023+)' : 'New 2023+'}
      </button>
      {(quickFilter || selectedTag) && (
        <button
          type="button"
          onClick={onClearFilters}
          className="min-h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-(--text-tertiary) hover:text-(--text-primary) transition-colors cursor-pointer"
        >
          {locale === 'ko' ? '필터 초기화' : 'Clear filters'}
        </button>
      )}
    </div>
  );
}
