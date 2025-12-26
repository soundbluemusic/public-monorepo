import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../utils/cn';

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-[var(--bg-tertiary)] rounded', className)} style={style} />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders never reorder
        <div
          key={`skeleton-line-${i}`}
          className={cn(
            'h-4 animate-pulse bg-[var(--bg-tertiary)] rounded',
            i === lines - 1 && 'w-2/3',
          )}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]',
        className,
      )}
    >
      <div className="h-6 w-3/4 mb-3 animate-pulse bg-[var(--bg-tertiary)] rounded" />
      <div className="space-y-2">
        <div className="h-4 animate-pulse bg-[var(--bg-tertiary)] rounded" />
        <div className="h-4 w-2/3 animate-pulse bg-[var(--bg-tertiary)] rounded" />
      </div>
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export function SkeletonList({ count = 5, className = '' }: SkeletonListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders never reorder
        <div key={`skeleton-list-${i}`} className="flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0 animate-pulse bg-[var(--bg-tertiary)] rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse bg-[var(--bg-tertiary)] rounded" />
            <div className="h-3 w-2/3 animate-pulse bg-[var(--bg-tertiary)] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  columns?: number;
  className?: string;
}

export function SkeletonGrid({ count = 6, columns = 3, className = '' }: SkeletonGridProps) {
  const columnClasses: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  const columnClass = columnClasses[columns] || `grid-cols-${columns}`;

  return (
    <div className={cn('grid gap-4', columnClass, className)}>
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders never reorder
        <SkeletonCard key={`skeleton-grid-${i}`} />
      ))}
    </div>
  );
}

interface PageSkeletonProps {
  children?: ReactNode;
}

export function PageSkeleton({ children }: PageSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="h-8 w-1/3 animate-pulse bg-[var(--bg-tertiary)] rounded" />
      <div className="h-5 w-2/3 animate-pulse bg-[var(--bg-tertiary)] rounded" />
      {children || <SkeletonGrid count={6} columns={3} />}
    </div>
  );
}
