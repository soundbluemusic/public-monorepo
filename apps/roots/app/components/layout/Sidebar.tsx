/**
 * @fileoverview 사이드바 컴포넌트 - 수학 분야 카테고리 네비게이션
 */

import { stripLocaleFromPath } from '@soundblue/i18n';
import { FamilySites } from '@soundblue/ui/components';
import { cn } from '@soundblue/ui/utils';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { fields } from '@/data/fields';
import { useI18n } from '@/i18n';

// Use shared utility for locale stripping
const stripLocale = stripLocaleFromPath;

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const { locale, localePath, t } = useI18n();
  const location = useLocation();

  // Escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open (mobile)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (fieldId: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === `/field/${fieldId}` || currentPath.startsWith(`/field/${fieldId}/`);
  };

  const collapseLabel = isCollapsed
    ? locale === 'ko'
      ? '사이드바 펼치기'
      : 'Expand sidebar'
    : locale === 'ko'
      ? '사이드바 접기'
      : 'Collapse sidebar';

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-(--bg-primary) border-r border-(--border-primary)',
          'flex flex-col transform transition-all duration-200',
          // Mobile: slide in/out based on isOpen
          'lg:translate-x-0 lg:top-(--header-height) lg:h-[calc(100vh-var(--header-height))]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Width based on collapsed state
          'w-64 lg:w-(--sidebar-width)',
          isCollapsed && 'lg:w-(--sidebar-collapsed-width)',
        )}
        data-collapsed={isCollapsed ? 'true' : undefined}
        aria-label="Math fields"
      >
        {/* Header (mobile only) */}
        <div className="lg:hidden h-14 flex items-center justify-between px-4 shrink-0 border-b border-(--border-primary)">
          <span className="font-semibold text-(--text-primary)">{t('mathFields')}</span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary)"
            aria-label={locale === 'ko' ? '메뉴 닫기' : 'Close menu'}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Math fields navigation" className="flex-1 overflow-y-auto p-4">
          {/* Section Header - hidden when collapsed */}
          <div
            className={cn(
              'mb-4 pb-4 border-b border-(--border-primary)',
              isCollapsed && 'lg:hidden',
            )}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-(--text-tertiary) m-0">
              {t('mathFields')}
            </h2>
          </div>

          <div className="flex flex-col gap-1">
            {fields.map((field) => (
              <Link
                key={field.id}
                to={localePath(`/field/${field.id}`)}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg min-h-11 transition-all no-underline',
                  isActive(field.id)
                    ? 'bg-(--bg-tertiary) text-(--accent-primary) shadow-sm'
                    : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
                  isCollapsed && 'lg:justify-center lg:px-0',
                )}
                title={isCollapsed ? field.name[locale] || field.name.en : undefined}
              >
                <span className="text-xl shrink-0">{field.icon}</span>
                <div className={cn('flex-1 min-w-0', isCollapsed && 'lg:hidden')}>
                  <div
                    className={cn(
                      'font-medium text-sm truncate',
                      isActive(field.id) ? 'text-(--accent-primary)' : 'text-(--text-primary)',
                    )}
                  >
                    {field.name[locale] || field.name.en}
                  </div>
                </div>
                {isActive(field.id) && (
                  <div
                    className={cn(
                      'w-1 h-6 rounded-full shrink-0 bg-(--accent-primary)',
                      isCollapsed && 'lg:hidden',
                    )}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* More from Us - hidden when collapsed */}
          <div
            className={cn(
              'mt-6 pt-4 border-t border-(--border-primary)',
              isCollapsed && 'lg:hidden',
            )}
          >
            <FamilySites currentAppId="roots" variant="sidebar" locale={locale} />
          </div>
        </nav>

        {/* Footer with collapse toggle */}
        <div className="shrink-0 p-4 border-t border-(--border-primary)">
          {/* Collapse Toggle Button (desktop only) */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              'hidden lg:flex w-full items-center gap-2 min-h-11 px-3 py-2 rounded-lg',
              'text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer',
              isCollapsed && 'justify-center',
            )}
            title={collapseLabel}
            aria-label={collapseLabel}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={18} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={18} aria-hidden="true" />
            )}
            <span className={cn(isCollapsed && 'lg:hidden')}>
              {locale === 'ko' ? '접기' : 'Collapse'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
