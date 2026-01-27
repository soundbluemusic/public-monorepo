/**
 * TableFilter 컴포넌트
 *
 * 테이블 글로벌 검색 필터입니다.
 */

'use client';

import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TableFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TableFilter({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: TableFilterProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-10 py-2 rounded-lg',
          'bg-(--bg-elevated) border border-(--border-primary)',
          'text-(--text-primary) placeholder:text-(--text-tertiary)',
          'focus:outline-none focus:border-(--border-focus)',
          'transition-colors',
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-tertiary) hover:text-(--text-secondary)"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
