/**
 * @fileoverview Context 앱 사이드바 컴포넌트
 * BaseSidebar를 사용하여 앱별 데이터만 전달
 */

import { LIMITS } from '@soundblue/core/validation';
import { stripLocaleFromPath } from '@soundblue/i18n';
import {
  BaseSidebar,
  FamilySites,
  type SidebarNavItem,
  SidebarSection,
} from '@soundblue/ui/components';
import { cn } from '@soundblue/ui/utils';
import { Link, useRouterState } from '@tanstack/react-router';
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
import { categories } from '@/data/categories';
import { useI18n } from '@/i18n';

// Use shared utility for locale stripping
const stripLocale = stripLocaleFromPath;

/** 메인 네비게이션 링크 설정 */
const NAV_ITEMS: SidebarNavItem[] = [
  { path: '/', icon: <Home size={20} aria-hidden="true" />, label: 'Home', labelKo: '홈' },
  {
    path: '/browse',
    icon: <List size={20} aria-hidden="true" />,
    label: 'Browse',
    labelKo: '탐색',
  },
  {
    path: '/conversations',
    icon: <MessageCircle size={20} aria-hidden="true" />,
    label: 'Conversations',
    labelKo: '대화 예시',
  },
  {
    path: '/my-learning',
    icon: <LayoutGrid size={20} aria-hidden="true" />,
    label: 'My Learning',
    labelKo: '내 학습',
  },
  {
    path: '/bookmarks',
    icon: <Bookmark size={20} aria-hidden="true" />,
    label: 'Bookmarks',
    labelKo: '북마크',
  },
  { path: '/about', icon: <Info size={20} aria-hidden="true" />, label: 'About', labelKo: '정보' },
  {
    path: '/download',
    icon: <Download size={20} aria-hidden="true" />,
    label: 'Download',
    labelKo: '다운로드',
  },
];

/** More 섹션 링크 설정 */
const MORE_ITEMS = [
  { path: '/built-with', icon: Code2, labelKey: 'builtWithTitle' as const },
  { path: '/sitemap', icon: LayoutGrid, labelKey: 'sitemap' as const },
];

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const { locale, localePath, t } = useI18n();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const isActive = (basePath: string) => {
    const currentPath = stripLocale(pathname);
    return currentPath === basePath || currentPath.startsWith(`${basePath}/`);
  };

  return (
    <BaseSidebar
      isOpen={isOpen}
      isCollapsed={isCollapsed}
      onClose={onClose}
      onToggleCollapse={onToggleCollapse}
      locale={locale}
      localePath={localePath}
      isActive={isActive}
      logo={
        <>
          <span className="text-xl">📖</span>
          <span>Context</span>
        </>
      }
      ariaLabel={t('menu')}
      navItems={NAV_ITEMS}
      closeMenuLabel={t('closeMenu')}
    >
      {/* Categories Section */}
      <SidebarSection title={t('browseByCategory')}>
        {categories.slice(0, LIMITS.SIDEBAR_CATEGORIES_PREVIEW).map((category) => (
          <Link
            key={category.id}
            to={localePath(`/category/${category.id}`)}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-3 rounded-lg min-h-11 transition-all no-underline',
              isActive(`/category/${category.id}`)
                ? 'bg-(--bg-tertiary) text-(--accent-primary) shadow-sm'
                : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
            )}
          >
            <span className="text-lg shrink-0">{category.icon}</span>
            <span className="font-medium text-sm">{category.name[locale]}</span>
            {isActive(`/category/${category.id}`) && (
              <div className="w-1 h-6 rounded-full shrink-0 bg-(--accent-primary) ml-auto" />
            )}
          </Link>
        ))}
        <Link
          to={localePath('/browse')}
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors min-h-11 text-sm text-(--accent-primary) hover:bg-(--bg-tertiary) no-underline"
        >
          <span className="text-base text-(--text-secondary)">+{categories.length - 6}</span>
          {t('viewAll')}
        </Link>
      </SidebarSection>

      {/* More Section */}
      <SidebarSection title={t('more')}>
        {MORE_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={localePath(item.path)}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg min-h-11 transition-all no-underline',
                isActive(item.path)
                  ? 'bg-(--bg-tertiary) text-(--accent-primary) shadow-sm'
                  : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
              )}
            >
              <Icon size={20} aria-hidden="true" className="shrink-0" />
              <span className="font-medium text-sm">{t(item.labelKey)}</span>
              {isActive(item.path) && (
                <div className="w-1 h-6 rounded-full shrink-0 bg-(--accent-primary) ml-auto" />
              )}
            </Link>
          );
        })}
      </SidebarSection>

      {/* More from Us */}
      <div className="mt-6 pt-4 border-t border-(--border-primary)">
        <FamilySites currentAppId="context" variant="sidebar" locale={locale} />
      </div>
    </BaseSidebar>
  );
}
