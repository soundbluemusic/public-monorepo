/**
 * @fileoverview Browse 페이지 탭 컴포넌트
 */
import { cn } from '@soundblue/ui/utils';
import { GitGraph, Grid3X3, LayoutList } from 'lucide-react';
import { useI18n } from '@/i18n';
import type { ViewMode } from './useBrowseFilters';

interface BrowseTabsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function BrowseTabs({ viewMode, onViewModeChange }: BrowseTabsProps) {
  const { t } = useI18n();

  const tabs: { mode: ViewMode; label: string; icon: typeof Grid3X3 }[] = [
    { mode: 'fields', label: t('browseByField'), icon: Grid3X3 },
    { mode: 'concepts', label: t('allConcepts'), icon: LayoutList },
    { mode: 'graph', label: t('relationGraph'), icon: GitGraph },
  ];

  return (
    <div className="flex gap-2 mb-6" role="tablist" aria-label={t('browseViewMode')}>
      {tabs.map(({ mode, label, icon: Icon }) => (
        <button
          key={mode}
          type="button"
          role="tab"
          aria-selected={viewMode === mode}
          aria-controls={`${mode}-panel`}
          onClick={() => onViewModeChange(mode)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors min-h-11',
            viewMode === mode
              ? 'bg-(--accent-primary) text-white'
              : 'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-secondary) hover:text-(--text-primary)',
          )}
        >
          <Icon size={18} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}
