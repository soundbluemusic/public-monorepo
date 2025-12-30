import { cn } from '@soundblue/ui/utils';
import { Shuffle } from 'lucide-react';
import type { FilterStatus } from './useBrowseFilters';

interface QuickActionsProps {
  locale: 'en' | 'ko';
  filterStatus: FilterStatus;
  onRandomWord: () => void;
  onShowBookmarks: () => void;
  onShowUnstudied: () => void;
}

export function QuickActions({
  locale,
  filterStatus,
  onRandomWord,
  onShowBookmarks,
  onShowUnstudied,
}: QuickActionsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onRandomWord}
        className="min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
      >
        <Shuffle size={16} aria-hidden="true" />
        <span>{locale === 'ko' ? '랜덤 단어' : 'Random Word'}</span>
      </button>

      <button
        type="button"
        onClick={onShowBookmarks}
        className={cn(
          'min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
          filterStatus === 'bookmarked'
            ? 'bg-(--accent-primary) text-white'
            : 'bg-(--bg-tertiary) text-(--text-primary) hover:bg-(--border-primary)',
        )}
      >
        {locale === 'ko' ? '북마크만' : 'Bookmarks Only'}
      </button>

      <button
        type="button"
        onClick={onShowUnstudied}
        className={cn(
          'min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
          filterStatus === 'unstudied'
            ? 'bg-(--accent-primary) text-white'
            : 'bg-(--bg-tertiary) text-(--text-primary) hover:bg-(--border-primary)',
        )}
      >
        {locale === 'ko' ? '미학습만' : 'Unstudied Only'}
      </button>
    </div>
  );
}
