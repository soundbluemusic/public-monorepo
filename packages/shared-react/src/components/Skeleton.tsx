import type { CSSProperties, ReactNode } from 'react';
import styles from '../styles/components.module.scss';

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return <div className={`${styles.skeleton} ${className}`} style={style} />;
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={`${styles.skeletonText} ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders never reorder
        <div
          key={`skeleton-line-${i}`}
          className={`${styles.skeleton} ${styles.skeletonLine} ${i === lines - 1 ? styles.skeletonLineShort : ''}`}
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
    <div className={`${styles.skeletonCard} ${className}`}>
      <div className={`${styles.skeleton} ${styles.skeletonCardHeader}`} />
      <div className={styles.skeletonCardBody}>
        <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
        <div className={`${styles.skeleton} ${styles.skeletonLine} ${styles.skeletonLineShort}`} />
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
    <div className={`${styles.skeletonList} ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders never reorder
        <div key={`skeleton-list-${i}`} className={styles.skeletonListItem}>
          <div className={`${styles.skeleton} ${styles.skeletonAvatar}`} />
          <div className={styles.skeletonListContent}>
            <div className={`${styles.skeleton} ${styles.skeletonListTitle}`} />
            <div className={`${styles.skeleton} ${styles.skeletonListDesc}`} />
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
  return (
    <div
      className={`${styles.skeletonGrid} ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
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
    <div className={styles.skeletonPage}>
      <div className={`${styles.skeleton} ${styles.skeletonPageTitle}`} />
      <div className={`${styles.skeleton} ${styles.skeletonPageSubtitle}`} />
      {children || <SkeletonGrid count={6} columns={3} />}
    </div>
  );
}
