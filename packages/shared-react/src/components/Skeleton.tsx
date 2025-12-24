/**
 * @fileoverview Skeleton loading components for displaying placeholder UI
 *
 * A composable family of skeleton components that provide visual feedback
 * during data loading. Uses CSS animations and design tokens from the
 * shared design system.
 *
 * @remarks
 * These components use `animate-pulse` for the loading animation and
 * CSS variables for theming (`--bg-tertiary`, `--bg-elevated`).
 * All skeletons are fully responsive and accessible.
 *
 * @example Basic usage with individual components
 * ```tsx
 * import { Skeleton, SkeletonText, SkeletonCard } from '@soundblue/shared-react';
 *
 * // Single line placeholder
 * <Skeleton className="h-6 w-32" />
 *
 * // Multi-line text placeholder
 * <SkeletonText lines={4} />
 *
 * // Card placeholder with title and text
 * <SkeletonCard />
 * ```
 *
 * @example Full page loading state
 * ```tsx
 * import { PageSkeleton } from '@soundblue/shared-react';
 *
 * function LoadingPage() {
 *   return <PageSkeleton />;
 * }
 * ```
 *
 * @module Skeleton
 */

import type { CSSProperties, ReactNode } from 'react';

/**
 * Props for the base Skeleton component.
 */
interface SkeletonProps {
  /**
   * Additional CSS classes to apply to the skeleton.
   * Use Tailwind utilities to control size: `h-4 w-full`, `h-10 w-10`, etc.
   */
  className?: string;
  /**
   * Inline styles for custom sizing or positioning.
   * Useful for dynamic widths like `{ width: '75%' }`.
   */
  style?: CSSProperties;
}

/**
 * Base skeleton component - a pulsing rectangular placeholder.
 *
 * This is the foundational building block for all skeleton variants.
 * It renders as a rounded, animated div that pulses to indicate loading.
 *
 * @param props - Component props
 * @returns A pulsing skeleton placeholder element
 *
 * @example Basic skeleton shapes
 * ```tsx
 * // Text line placeholder
 * <Skeleton className="h-4 w-full" />
 *
 * // Avatar placeholder (square with rounded corners)
 * <Skeleton className="h-12 w-12 rounded-full" />
 *
 * // Button placeholder
 * <Skeleton className="h-10 w-24" />
 *
 * // Image placeholder with aspect ratio
 * <Skeleton className="h-48 w-full" />
 * ```
 *
 * @example Dynamic width for last line effect
 * ```tsx
 * <div className="space-y-2">
 *   <Skeleton className="h-4" style={{ width: '100%' }} />
 *   <Skeleton className="h-4" style={{ width: '100%' }} />
 *   <Skeleton className="h-4" style={{ width: '60%' }} />
 * </div>
 * ```
 *
 * @see {@link SkeletonText} for multi-line text placeholders
 * @see {@link SkeletonCard} for card-shaped placeholders
 */
export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded bg-[var(--bg-tertiary)] ${className}`} style={style} />
  );
}

/**
 * Props for the SkeletonText component.
 */
interface SkeletonTextProps {
  /**
   * Number of text lines to display.
   * The last line will be shorter (60% width) for a natural appearance.
   * @defaultValue 3
   */
  lines?: number;
  /**
   * Additional CSS classes to apply to the container.
   */
  className?: string;
}

/**
 * Multi-line text skeleton with natural appearance.
 *
 * Renders multiple skeleton lines with the last line at 60% width,
 * mimicking the natural flow of paragraph text.
 *
 * @param props - Component props
 * @returns A container with multiple skeleton text lines
 *
 * @example Different line counts
 * ```tsx
 * // Short description (2 lines)
 * <SkeletonText lines={2} />
 *
 * // Full paragraph (5 lines)
 * <SkeletonText lines={5} />
 *
 * // Single line summary
 * <SkeletonText lines={1} />
 * ```
 *
 * @example With custom styling
 * ```tsx
 * <SkeletonText lines={3} className="max-w-md" />
 * ```
 *
 * @see {@link Skeleton} for individual line placeholders
 * @see {@link SkeletonCard} for combined title + text placeholders
 */
export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className="h-4" style={{ width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  );
}

/**
 * Props for the SkeletonCard component.
 */
interface SkeletonCardProps {
  /**
   * Additional CSS classes to apply to the card container.
   */
  className?: string;
}

/**
 * Card-shaped skeleton with title and text placeholders.
 *
 * Renders a card with an elevated background containing a title skeleton
 * (1/3 width) and 2 lines of text skeleton below.
 *
 * @param props - Component props
 * @returns A card-shaped skeleton with title and body placeholders
 *
 * @example Basic card placeholder
 * ```tsx
 * <SkeletonCard />
 * ```
 *
 * @example Custom card styling
 * ```tsx
 * // With shadow and border
 * <SkeletonCard className="shadow-md border border-gray-200" />
 *
 * // With max width
 * <SkeletonCard className="max-w-sm" />
 * ```
 *
 * @example In a list layout
 * ```tsx
 * <div className="space-y-4">
 *   <SkeletonCard />
 *   <SkeletonCard />
 *   <SkeletonCard />
 * </div>
 * ```
 *
 * @see {@link SkeletonGrid} for a grid of card placeholders
 * @see {@link SkeletonText} for just the text portion
 */
export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{ backgroundColor: 'var(--bg-elevated)' }}
    >
      <Skeleton className="h-6 w-1/3 mb-3" />
      <SkeletonText lines={2} />
    </div>
  );
}

/**
 * Props for the SkeletonList component.
 */
interface SkeletonListProps {
  /**
   * Number of list items to display.
   * @defaultValue 5
   */
  count?: number;
  /**
   * Additional CSS classes to apply to the list container.
   */
  className?: string;
}

/**
 * List skeleton with avatar and two-line text per item.
 *
 * Renders a vertical list of items, each with a square avatar (40x40px)
 * on the left and two lines of text (title + subtitle) on the right.
 * Ideal for navigation lists, search results, or data tables.
 *
 * @param props - Component props
 * @returns A list of skeleton items with avatar and text placeholders
 *
 * @example Default list (5 items)
 * ```tsx
 * <SkeletonList />
 * ```
 *
 * @example Custom item count
 * ```tsx
 * // Short list for sidebar
 * <SkeletonList count={3} />
 *
 * // Long list for search results
 * <SkeletonList count={10} />
 * ```
 *
 * @example With container styling
 * ```tsx
 * <SkeletonList count={5} className="max-w-lg mx-auto" />
 * ```
 *
 * @example Replacing actual list data
 * ```tsx
 * function UserList({ users, isLoading }) {
 *   if (isLoading) {
 *     return <SkeletonList count={users?.length ?? 5} />;
 *   }
 *   return <ul>{users.map(user => <UserItem key={user.id} user={user} />)}</ul>;
 * }
 * ```
 *
 * @see {@link SkeletonGrid} for card-based grid layouts
 * @see {@link SkeletonCard} for individual card placeholders
 */
export function SkeletonList({ count = 5, className = '' }: SkeletonListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Props for the SkeletonGrid component.
 */
interface SkeletonGridProps {
  /**
   * Number of cards to display in the grid.
   * @defaultValue 6
   */
  count?: number;
  /**
   * Number of columns in the grid.
   * Uses CSS Grid with equal-width columns.
   * @defaultValue 3
   */
  columns?: number;
  /**
   * Additional CSS classes to apply to the grid container.
   */
  className?: string;
}

/**
 * Grid of skeleton cards for gallery or catalog layouts.
 *
 * Renders a responsive CSS Grid of SkeletonCard components.
 * The grid uses `minmax(0, 1fr)` for equal-width columns that
 * respect container boundaries.
 *
 * @param props - Component props
 * @returns A grid container with skeleton card placeholders
 *
 * @example Default grid (6 cards, 3 columns)
 * ```tsx
 * <SkeletonGrid />
 * ```
 *
 * @example Custom grid configuration
 * ```tsx
 * // 2-column layout for sidebar
 * <SkeletonGrid count={4} columns={2} />
 *
 * // 4-column gallery
 * <SkeletonGrid count={8} columns={4} />
 *
 * // Single column for mobile
 * <SkeletonGrid count={3} columns={1} />
 * ```
 *
 * @example Responsive grid with Tailwind
 * ```tsx
 * // Use className to override grid on different breakpoints
 * <SkeletonGrid
 *   count={6}
 *   columns={3}
 *   className="sm:!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3"
 * />
 * ```
 *
 * @example Matching actual data grid
 * ```tsx
 * function ProductGrid({ products, isLoading }) {
 *   if (isLoading) {
 *     return <SkeletonGrid count={products?.length ?? 6} columns={3} />;
 *   }
 *   return (
 *     <div className="grid grid-cols-3 gap-4">
 *       {products.map(p => <ProductCard key={p.id} product={p} />)}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link SkeletonCard} for individual card placeholders
 * @see {@link SkeletonList} for vertical list layouts
 * @see {@link PageSkeleton} for full-page loading states
 */
export function SkeletonGrid({ count = 6, columns = 3, className = '' }: SkeletonGridProps) {
  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/**
 * Props for the PageSkeleton component.
 */
interface PageSkeletonProps {
  /**
   * Optional custom content to display instead of the default grid.
   * Pass custom skeleton configurations for non-standard page layouts.
   */
  children?: ReactNode;
}

/**
 * Full-page skeleton for complete page loading states.
 *
 * Renders a standard page layout skeleton with:
 * - Title placeholder (h-9, 1/4 width)
 * - Subtitle/description placeholder (h-5, 1/2 width)
 * - Content area (default: 6-item, 3-column grid OR custom children)
 *
 * @param props - Component props
 * @returns A full-page skeleton with title, subtitle, and content placeholders
 *
 * @example Default page skeleton
 * ```tsx
 * // Shows title, subtitle, and 6-card grid
 * <PageSkeleton />
 * ```
 *
 * @example With custom content
 * ```tsx
 * // Replace default grid with custom skeleton layout
 * <PageSkeleton>
 *   <SkeletonList count={10} />
 * </PageSkeleton>
 * ```
 *
 * @example In a route loading state
 * ```tsx
 * function ProductsPage() {
 *   const { products, isLoading } = useProducts();
 *
 *   if (isLoading) {
 *     return <PageSkeleton />;
 *   }
 *
 *   return (
 *     <div className="space-y-6">
 *       <h1>Products</h1>
 *       <p>Browse our catalog</p>
 *       <ProductGrid products={products} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Custom layout with sidebar
 * ```tsx
 * <PageSkeleton>
 *   <div className="flex gap-6">
 *     <aside className="w-64">
 *       <SkeletonList count={6} />
 *     </aside>
 *     <main className="flex-1">
 *       <SkeletonGrid count={9} columns={3} />
 *     </main>
 *   </div>
 * </PageSkeleton>
 * ```
 *
 * @see {@link SkeletonGrid} for just the content grid
 * @see {@link SkeletonList} for list-based content layouts
 */
export function PageSkeleton({ children }: PageSkeletonProps) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-1/4" />
      <Skeleton className="h-5 w-1/2" />
      {children || <SkeletonGrid count={6} columns={3} />}
    </div>
  );
}
