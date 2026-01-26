/**
 * @fileoverview Skeleton Loading Components
 * @environment universal
 */
import { type CSSProperties, type ReactNode, useMemo } from 'react';
import { cn } from '../utils/cn';

/** Generate stable IDs for skeleton items */
function useSkeletonIds(prefix: string, count: number): string[] {
  return useMemo(
    () => Array.from({ length: count }, (_, i) => `${prefix}-${i}`),
    [prefix, count],
  );
}

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

/** Base skeleton placeholder component */
export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-(--bg-tertiary) rounded', className)} style={style} />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

/** Multi-line text skeleton placeholder */
export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  const ids = useSkeletonIds('skeleton-line', lines);
  return (
    <div className={cn('space-y-2', className)}>
      {ids.map((id, i) => (
        <div
          key={id}
          className={cn('h-4 animate-pulse bg-(--bg-tertiary) rounded', i === lines - 1 && 'w-2/3')}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
}

/** Card-shaped skeleton placeholder */
export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)',
        className,
      )}
    >
      <div className="h-6 w-3/4 mb-3 animate-pulse bg-(--bg-tertiary) rounded" />
      <div className="space-y-2">
        <div className="h-4 animate-pulse bg-(--bg-tertiary) rounded" />
        <div className="h-4 w-2/3 animate-pulse bg-(--bg-tertiary) rounded" />
      </div>
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
  className?: string;
}

/** List skeleton with avatar and text placeholders */
export function SkeletonList({ count = 5, className = '' }: SkeletonListProps) {
  const ids = useSkeletonIds('skeleton-list', count);
  return (
    <div className={cn('space-y-3', className)}>
      {ids.map((id) => (
        <div key={id} className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 animate-pulse bg-(--bg-tertiary) rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse bg-(--bg-tertiary) rounded" />
            <div className="h-3 w-2/3 animate-pulse bg-(--bg-tertiary) rounded" />
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

/** Grid of skeleton cards */
export function SkeletonGrid({ count = 6, columns = 3, className = '' }: SkeletonGridProps) {
  const ids = useSkeletonIds('skeleton-grid', count);
  const columnClasses: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };
  const columnClass = columnClasses[columns] || `grid-cols-${columns}`;

  return (
    <div className={cn('grid gap-4', columnClass, className)}>
      {ids.map((id) => (
        <SkeletonCard key={id} />
      ))}
    </div>
  );
}

interface PageSkeletonProps {
  children?: ReactNode;
}

/** Full page skeleton layout */
export function PageSkeleton({ children }: PageSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="h-8 w-1/3 animate-pulse bg-(--bg-tertiary) rounded" />
      <div className="h-5 w-2/3 animate-pulse bg-(--bg-tertiary) rounded" />
      {children || <SkeletonGrid count={6} columns={3} />}
    </div>
  );
}
