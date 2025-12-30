import { cn } from '@soundblue/ui/utils';
import { Link } from 'react-router';
import type { Language } from '../../../i18n';
import type { NavItem } from './sidebarData';

interface SidebarNavProps {
  navItems: readonly NavItem[];
  locale: Language;
  localePath: (path: string) => string;
  isActive: (href: string) => boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

export function SidebarNav({
  navItems,
  locale,
  localePath,
  isActive,
  isCollapsed,
  onClose,
}: SidebarNavProps) {
  return (
    <div className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={localePath(item.href)}
          onClick={onClose}
          className={cn(
            'flex items-center gap-3 min-h-11 px-3 py-2 rounded-lg no-underline transition-colors',
            isActive(item.href)
              ? 'bg-(--accent-primary)/10 text-(--accent-primary)'
              : 'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
            isCollapsed && 'lg:justify-center',
          )}
          title={isCollapsed ? (locale === 'ko' ? item.labelKo : item.label) : undefined}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          <span className="shrink-0">{item.icon}</span>
          <span className={cn(isCollapsed && 'lg:hidden')}>
            {locale === 'ko' ? item.labelKo : item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
