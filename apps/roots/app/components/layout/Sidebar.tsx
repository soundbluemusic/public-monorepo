/**
 * @fileoverview Roots 앱 사이드바 컴포넌트
 * BaseSidebar를 사용하여 앱별 데이터만 전달
 */

import { stripLocaleFromPath } from '@soundblue/i18n';
import {
  BaseSidebar,
  FamilySites,
  type SidebarNavItem,
  SidebarSection,
} from '@soundblue/ui/components';
import { cn } from '@soundblue/ui/utils';
import { Link, useRouterState } from '@tanstack/react-router';
import { Bookmark, Home, Info, LayoutGrid, Pi } from 'lucide-react';
import { fields } from '@/data/fields';
import { useI18n } from '@/i18n';

/** 메인 네비게이션 링크 설정 */
const NAV_ITEMS: SidebarNavItem[] = [
  { path: '/', icon: <Home size={20} aria-hidden="true" />, label: 'Home', labelKo: '홈' },
  {
    path: '/browse',
    icon: <LayoutGrid size={20} aria-hidden="true" />,
    label: 'Browse',
    labelKo: '탐색',
  },
  {
    path: '/constants',
    icon: <Pi size={20} aria-hidden="true" />,
    label: 'Constants',
    labelKo: '수학 상수',
  },
  {
    path: '/favorites',
    icon: <Bookmark size={20} aria-hidden="true" />,
    label: 'Favorites',
    labelKo: '즐겨찾기',
  },
  { path: '/about', icon: <Info size={20} aria-hidden="true" />, label: 'About', labelKo: '정보' },
];

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
  const routerState = useRouterState();
  const pathname = routerState.location?.pathname ?? '/';

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
          <span className="text-xl">📐</span>
          <span>Roots</span>
        </>
      }
      ariaLabel={t('mathFields')}
      navItems={NAV_ITEMS}
      closeMenuLabel={locale === 'ko' ? '메뉴 닫기' : 'Close menu'}
      LinkComponent={Link}
    >
      {/* Math Fields Section */}
      <SidebarSection title={t('mathFields')}>
        {fields.map((field) => (
          <Link
            key={field.id}
            to={localePath(`/field/${field.id}`)}
            onClick={onClose}
            preload="intent"
            className={cn(
              'flex items-center gap-3 px-3 py-3 rounded-lg min-h-11 transition-all no-underline',
              isActive(`/field/${field.id}`)
                ? 'bg-(--bg-tertiary) text-(--accent-primary) shadow-sm'
                : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
            )}
          >
            <span className="text-xl shrink-0">{field.icon}</span>
            <span className="font-medium text-sm truncate">
              {field.name[locale] || field.name.en}
            </span>
            {isActive(`/field/${field.id}`) && (
              <div className="w-1 h-6 rounded-full shrink-0 bg-(--accent-primary) ml-auto" />
            )}
          </Link>
        ))}
      </SidebarSection>

      {/* More from Us */}
      <div className="mt-6 pt-4 border-t border-(--border-primary)">
        <FamilySites currentAppId="roots" variant="sidebar" locale={locale} />
      </div>
    </BaseSidebar>
  );
}
