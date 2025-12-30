import { useAutoAnimate } from '@soundblue/ui/hooks';
import { cn } from '@soundblue/ui/utils';
import { BarChart2, CalendarPlus, Flame } from 'lucide-react';

interface QuickFiltersProps {
  locale: 'en' | 'ko';
  quickFilter: 'trending' | 'highSupport' | 'new' | null;
  onQuickFilter: (filter: 'trending' | 'highSupport' | 'new') => void;
  onClearFilters: () => void;
}

export function QuickFilters({
  locale,
  quickFilter,
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
        {locale === 'ko' ? '2023+ 트렌딩' : 'Trending 2023+'}
      </button>
      <button
        type="button"
        onClick={() => onQuickFilter('highSupport')}
        className={cn(
          'min-h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
          quickFilter === 'highSupport'
            ? 'bg-green-500 text-white'
            : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)',
        )}
      >
        <BarChart2 size={16} aria-hidden="true" />
        {locale === 'ko' ? '높은 지원 (95%+)' : 'High Support (95%+)'}
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
        {locale === 'ko' ? '새로운 (2020+)' : 'New 2020+'}
      </button>
      {quickFilter && (
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
