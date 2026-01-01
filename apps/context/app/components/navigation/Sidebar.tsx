import { LIMITS } from '@soundblue/core/validation';
import { FamilySites } from '@soundblue/ui/components';
import { cn } from '@soundblue/ui/utils';
import {
  Bookmark,
  Code2,
  Download,
  Home,
  Info,
  LayoutGrid,
  List,
  MessageCircle,
} from 'lucide-react';
import { Link } from 'react-router';
import { categories } from '@/data/categories';
import { useIsActiveRoute } from '@/hooks';
import { useI18n } from '@/i18n';
import { CategoryLink, CollapseButton, NavLink, SidebarHeader, useSidebarEffects } from './sidebar';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

/** 메인 네비게이션 링크 설정 */
const NAV_ITEMS = [
  { path: '/', icon: Home, labelKey: 'home' },
  { path: '/browse', icon: List, labelKey: 'browse' },
  { path: '/conversations', icon: MessageCircle, labelKey: 'conversationExamples' },
  { path: '/my-learning', icon: LayoutGrid, labelKey: 'myLearning' },
  { path: '/bookmarks', icon: Bookmark, labelKey: 'bookmarks' },
  { path: '/about', icon: Info, labelKey: 'about' },
  { path: '/download', icon: Download, labelKey: 'download' },
] as const;

/** More 섹션 링크 설정 */
const MORE_ITEMS = [
  { path: '/built-with', icon: Code2, labelKey: 'builtWithTitle' },
  { path: '/sitemap', icon: LayoutGrid, labelKey: 'sitemap' },
] as const;

export function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const { locale, t, localePath } = useI18n();
  const { isActive } = useIsActiveRoute();

  useSidebarEffects({ isOpen, onClose });

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-(--bg-elevated) border-r border-(--border-primary)',
          'flex flex-col transform transition-all duration-200',
          'md:translate-x-0 md:top-(--header-height) md:h-[calc(100vh-var(--header-height))]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'w-72 md:w-(--sidebar-width)',
          isCollapsed && 'md:w-(--sidebar-collapsed-width)',
        )}
        data-collapsed={isCollapsed ? 'true' : undefined}
        aria-label={t('menu')}
      >
        {/* Header (mobile only) */}
        <SidebarHeader menuLabel={t('menu')} closeLabel={t('closeMenu')} onClose={onClose} />

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto py-4">
          {/* Main navigation */}
          <div className="px-3 mb-6">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={localePath(item.path)}
                icon={item.icon}
                label={t(item.labelKey)}
                isActive={isActive(item.path)}
                isCollapsed={isCollapsed}
                onClick={onClose}
              />
            ))}
          </div>

          {/* Categories - hidden when collapsed */}
          <div className={cn('px-3 mb-6', isCollapsed && 'md:hidden')}>
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-(--text-tertiary)">
              {t('browseByCategory')}
            </div>
            <div className="flex flex-col gap-0.5">
              {categories.slice(0, LIMITS.SIDEBAR_CATEGORIES_PREVIEW).map((category) => (
                <CategoryLink
                  key={category.id}
                  to={localePath(`/category/${category.id}`)}
                  icon={category.icon}
                  label={category.name[locale]}
                  isActive={isActive(`/category/${category.id}`)}
                  onClick={onClose}
                />
              ))}
              <Link
                to={localePath('/browse')}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11 text-sm text-(--accent-primary) hover:bg-(--bg-tertiary)"
              >
                <span className="text-base text-(--text-secondary)">+{categories.length - 6}</span>
                {t('viewAll')}
              </Link>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-(--border-primary)">
          {/* Collapse Toggle Button (desktop only) */}
          <CollapseButton
            isCollapsed={isCollapsed}
            expandLabel={t('expandSidebar')}
            collapseLabel={t('collapseSidebar')}
            onToggle={onToggleCollapse}
          />

          {/* More section - hidden when collapsed */}
          <div className={cn(isCollapsed && 'md:hidden')}>
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-(--text-tertiary)">
              {t('more')}
            </div>
            {MORE_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={localePath(item.path)}
                icon={item.icon}
                label={t(item.labelKey)}
                isActive={isActive(item.path)}
                isCollapsed={false}
                onClick={onClose}
              />
            ))}

            {/* More from Us */}
            <div className="mt-4">
              <FamilySites currentAppId="context" variant="sidebar" locale={locale} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
