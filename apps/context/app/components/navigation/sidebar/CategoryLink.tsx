import { cn } from '@soundblue/ui/utils';
import { Link } from '@tanstack/react-router';
import { memo } from 'react';

interface CategoryLinkProps {
  to: string;
  icon: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

/**
 * 카테고리 링크 컴포넌트
 * 이모지 아이콘과 카테고리 이름 표시
 */
export const CategoryLink = memo(function CategoryLink({
  to,
  icon,
  label,
  isActive,
  onClick,
}: CategoryLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11 text-sm',
        'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
        isActive && 'bg-(--bg-tertiary) text-(--accent-primary)',
      )}
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
});
