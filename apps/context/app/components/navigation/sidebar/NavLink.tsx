import { cn } from '@soundblue/ui/utils';
import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router';

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

/**
 * 사이드바 네비게이션 링크 컴포넌트
 * 접힌 상태에서는 아이콘만 표시하고 툴팁 제공
 */
export const NavLink = memo(function NavLink({
  to,
  icon: Icon,
  label,
  isActive,
  isCollapsed,
  onClick,
}: NavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
        'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
        isActive && 'bg-(--bg-tertiary) text-(--accent-primary)',
        isCollapsed && 'lg:justify-center lg:px-0',
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon size={20} aria-hidden="true" className="shrink-0" />
      <span className={cn(isCollapsed && 'lg:hidden')}>{label}</span>
    </Link>
  );
});
