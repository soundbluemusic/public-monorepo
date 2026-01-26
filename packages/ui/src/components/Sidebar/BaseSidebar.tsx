/**
 * @fileoverview 공통 사이드바 컴포넌트
 * roots/context/permissive 앱에서 공통으로 사용
 *
 * NOTE: TanStack Start 앱은 LinkComponent prop으로 TanStack Router의 Link를 전달해야 함
 */

import { Link as TanStackLink } from '@tanstack/react-router';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface SidebarNavItem {
  path: string;
  icon: ReactNode;
  label: string;
  labelKo: string;
}

/** Link 컴포넌트 Props 인터페이스 (React Router / TanStack Router 호환) */
export interface LinkComponentProps {
  to: string;
  onClick?: () => void;
  className?: string;
  title?: string;
  children: ReactNode;
}

export interface BaseSidebarProps {
  /** 모바일에서 사이드바 열림 상태 */
  isOpen: boolean;
  /** 데스크톱에서 사이드바 접힘 상태 */
  isCollapsed: boolean;
  /** 사이드바 닫기 콜백 (모바일) */
  onClose: () => void;
  /** 사이드바 접기/펼치기 토글 콜백 (데스크톱) */
  onToggleCollapse: () => void;
  /** 현재 locale */
  locale: 'en' | 'ko';
  /** locale path 생성 함수 */
  localePath: (path: string) => string;
  /** 현재 경로가 활성 상태인지 확인하는 함수 */
  isActive: (path: string) => boolean;
  /** 사이드바 로고 (모바일 헤더용) */
  logo: ReactNode;
  /** aria-label for accessibility */
  ariaLabel: string;
  /** 메인 네비게이션 아이템들 */
  navItems: SidebarNavItem[];
  /** 추가 섹션들 (categories, quick links 등) - collapsed일 때 숨겨짐 */
  children?: ReactNode;
  /** 닫기 메뉴 label */
  closeMenuLabel?: string;
  /** 커스텀 Link 컴포넌트 (TanStack Router 사용 시 전달) */
  LinkComponent?: ComponentType<LinkComponentProps>;
}

export function BaseSidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
  locale,
  localePath,
  isActive,
  logo,
  ariaLabel,
  navItems,
  children,
  closeMenuLabel = locale === 'ko' ? '메뉴 닫기' : 'Close menu',
  LinkComponent = TanStackLink,
}: BaseSidebarProps) {
  // Use the provided Link component (React Router or TanStack Router)
  const Link = LinkComponent;
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
          'fixed left-0 z-50 bg-elevated border-r border-primary',
          // Mobile: full height from top, Desktop: below header
          'top-0 h-full lg:top-(--header-height) lg:h-[calc(100vh-var(--header-height))]',
          // transition-transform만 사용 (너비 전환 시 버벅임 방지)
          'flex flex-col transform transition-transform duration-200',
          // Mobile: slide in/out based on isOpen
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Width: 모바일은 항상 w-64, 데스크톱은 collapsed 상태에 따라
          'w-64 lg:w-sidebar',
          isCollapsed && 'lg:w-sidebar-collapsed',
        )}
        data-collapsed={isCollapsed ? 'true' : undefined}
        aria-label={ariaLabel}
      >
        {/* Header (mobile only) */}
        <div className="lg:hidden h-14 flex items-center justify-between px-4 shrink-0 border-b border-(--border-primary)">
          <Link
            to={localePath('/')}
            onClick={onClose}
            className="flex items-center gap-2 text-(--text-primary) font-semibold no-underline"
          >
            {logo}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary)"
            aria-label={closeMenuLabel}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Main navigation"
          className={cn(
            'flex-1 overflow-y-auto p-4',
            'supports-[-webkit-overflow-scrolling:touch]:[-webkit-overflow-scrolling:touch]',
            isCollapsed && 'lg:p-2',
          )}
        >
          {/* Main navigation */}
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={localePath(item.path)}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg min-h-11 transition-all no-underline',
                  isActive(item.path)
                    ? 'bg-(--bg-tertiary) text-(--accent-primary) shadow-sm'
                    : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
                  isCollapsed && 'lg:justify-center lg:px-0',
                )}
                title={isCollapsed ? (locale === 'ko' ? item.labelKo : item.label) : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className={cn('font-medium text-sm', isCollapsed && 'lg:hidden')}>
                  {locale === 'ko' ? item.labelKo : item.label}
                </span>
                {isActive(item.path) && (
                  <div
                    className={cn(
                      'w-1 h-6 rounded-full shrink-0 bg-(--accent-primary) ml-auto',
                      isCollapsed && 'lg:hidden',
                    )}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Additional sections - hidden when collapsed on desktop */}
          {children && (
            <div className={cn('sidebar-children-section', isCollapsed && 'lg:hidden')}>
              {children}
            </div>
          )}
        </nav>

        {/* Footer with collapse toggle */}
        <div
          className={cn('shrink-0 p-4 border-t border-(--border-primary)', isCollapsed && 'lg:p-2')}
        >
          {/* Collapse Toggle Button (desktop only) */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              'hidden lg:flex w-full items-center gap-2 min-h-11 px-3 py-2 rounded-lg',
              'text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer',
              isCollapsed && 'justify-center px-0',
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
              {isCollapsed
                ? locale === 'ko'
                  ? '펼치기'
                  : 'Expand'
                : locale === 'ko'
                  ? '접기'
                  : 'Collapse'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
