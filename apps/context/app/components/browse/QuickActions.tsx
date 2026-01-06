import { cn } from '@soundblue/ui/utils';
import { Shuffle } from 'lucide-react';
import { memo } from 'react';
import type { MessageKey } from '@/i18n';
import type { FilterStatus } from './useBrowseFilters';

interface QuickActionsProps {
  filterStatus: FilterStatus;
  onRandomWord: () => void;
  onShowBookmarks: () => void;
  onShowUnstudied: () => void;
  /** i18n translation function (타입 안전) */
  t: (key: MessageKey) => string;
}

export const QuickActions = memo(function QuickActions({
  filterStatus,
  onRandomWord,
  onShowBookmarks,
  onShowUnstudied,
  t,
}: QuickActionsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onRandomWord}
        className="min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
      >
        <Shuffle size={16} aria-hidden="true" />
        <span>{t('randomWord')}</span>
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
        {t('bookmarksOnly')}
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
        {t('unstudiedOnly')}
      </button>
    </div>
  );
});
