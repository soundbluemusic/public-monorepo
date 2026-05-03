/**
 * @fileoverview 공통 사이드바 컴포넌트
 * roots/context/permissive 앱에서 공통으로 사용
 *
 * NOTE: TanStack Start 앱은 LinkComponent prop으로 TanStack Router의 Link를 전달해야 함
 */

import { Link as TanStackLink } from '@tanstack/react-router';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

/** Tab 가능한 요소 셀렉터 (focus trap용) */
const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

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
  const sidebarRef = useRef<HTMLElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

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

  // Focus trap (모바일 사이드바 오픈 시) - 데스크톱(lg)에서는 미디어 쿼리로 비활성화
  useEffect(() => {
    if (!isOpen) return;

    // 데스크톱(lg breakpoint, ≥1024px)에서는 사이드바가 정적 레이아웃이므로 trap 불필요
    const isDesktop =
      typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
    if (isDesktop) return;

    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    // 트리거 요소(보통 햄버거 버튼) 저장 → 닫힐 때 포커스 복귀
    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // 사이드바 내부 첫 focusable 요소로 포커스 이동
    const focusables = Array.from(sidebar.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    focusables[0]?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      // 매번 다시 쿼리 — 동적으로 추가/제거되는 요소 대응
      const current = Array.from(sidebar.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (current.length === 0) {
        e.preventDefault();
        return;
      }
      const first = current[0];
      const last = current[current.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      // 닫힐 때 트리거로 포커스 복귀 (트리거가 여전히 DOM에 있는 경우)
      const trigger = previouslyFocusedRef.current;
      if (trigger && document.body.contains(trigger)) {
        trigger.focus();
      }
      previouslyFocusedRef.current = null;
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
        ref={sidebarRef}
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
        // 모바일에서 열렸을 때만 dialog로 동작 (데스크톱은 정적 nav)
        role={isOpen ? 'dialog' : undefined}
        aria-modal={isOpen ? true : undefined}
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
