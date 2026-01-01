import { cn } from '@soundblue/ui/utils';
import { ChevronLeft, Github } from 'lucide-react';
import type { Language } from '../../../i18n';

interface SidebarFooterProps {
  locale: Language;
  isCollapsed: boolean;
  t: (key: string) => string;
  onToggleCollapse: () => void;
}

export function SidebarFooter({ locale, isCollapsed, t, onToggleCollapse }: SidebarFooterProps) {
  return (
    <div className="p-2 border-t border-(--border-primary)">
      {/* Collapse Toggle Button (desktop only) */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className={cn(
          'hidden lg:flex w-full items-center gap-2 min-h-11 px-3 py-2 rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer',
          isCollapsed && 'justify-center',
        )}
        title={isCollapsed ? t('aria.expandSidebar') : t('aria.collapseSidebar')}
      >
        <ChevronLeft
          size={18}
          aria-hidden="true"
          className={cn('transition-transform', isCollapsed && 'rotate-180')}
        />
        <span className={cn(isCollapsed && 'lg:hidden')}>
          {isCollapsed
            ? locale === 'ko'
              ? '펼치기'
              : 'Expand'
            : locale === 'ko'
              ? '접기'
              : 'Collapse'}
        </span>
      </button>

      {/* GitHub Link */}
      <a
        href="https://github.com/soundbluemusic/public-monorepo"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex items-center gap-3 min-h-11 px-3 py-2 rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors no-underline',
          isCollapsed && 'lg:justify-center',
        )}
        title={isCollapsed ? t('ui.github') : undefined}
      >
        <Github size={18} aria-hidden="true" />
        <div className={cn('flex flex-col', isCollapsed && 'lg:hidden')}>
          <span className="text-sm font-medium">{t('ui.github')}</span>
          <span className="text-xs text-(--text-tertiary)">{t('ui.viewSource')}</span>
        </div>
      </a>
    </div>
  );
}
