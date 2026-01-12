/**
 * @fileoverview Mobile Bottom Navigation Component
 * @environment client-only
 *
 * Shared bottom navigation bar for mobile devices.
 * Customizable via items array for different apps.
 */

import type { LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { cn } from '../utils';

export interface BottomNavItem {
  /** Navigation path */
  to: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** English label */
  label: string;
  /** Korean label */
  labelKo: string;
}

export interface BottomNavProps {
  /** Navigation items array */
  items: BottomNavItem[];
  /** Current locale */
  locale: 'en' | 'ko';
  /** Function to add locale prefix to path */
  localePath: (path: string) => string;
  /** Breakpoint to hide nav (default: 'md') */
  hideAt?: 'md' | 'lg';
  /** Height class (default: 'h-16') */
  heightClass?: string;
}

/**
 * Mobile bottom navigation component
 *
 * @example
 * ```tsx
 * const items = [
 *   { to: '/', icon: Home, label: 'Home', labelKo: '홈' },
 *   { to: '/about', icon: Info, label: 'About', labelKo: '정보' },
 * ];
 *
 * <BottomNav
 *   items={items}
 *   locale={locale}
 *   localePath={localePath}
 *   hideAt="md"
 * />
 * ```
 */
export function BottomNav({
  items,
  locale,
  localePath,
  hideAt = 'md',
  heightClass = 'h-16',
}: BottomNavProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === localePath(path);

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-(--bg-elevated) border-t border-(--border-primary)',
        'flex items-center justify-around',
        'pb-[env(safe-area-inset-bottom,0px)]',
        heightClass,
        hideAt === 'md' ? 'md:hidden' : 'lg:hidden',
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.to);
        return (
          <Link
            key={item.to}
            to={localePath(item.to)}
            className={cn(
              'flex flex-col items-center justify-center gap-1',
              'min-h-11 min-w-11 px-3 py-2',
              'transition-colors no-underline',
              active ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={20} aria-hidden="true" />
            <span className="text-[11px] sm:text-xs font-medium">
              {locale === 'ko' ? item.labelKo : item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
