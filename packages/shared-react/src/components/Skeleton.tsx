/**
 * @fileoverview Skeleton Loading Components
 *
 * A comprehensive set of skeleton loading placeholder components for displaying
 * animated loading states while content is being fetched or rendered.
 *
 * All components use CSS variables for theming:
 * - `--bg-tertiary`: Background color for skeleton elements
 * - `--bg-elevated`: Background for card-style skeletons
 * - `--border-primary`: Border color for card-style skeletons
 *
 * @module @soundblue/shared-react/components/Skeleton
 *
 * @example Basic usage
 * ```tsx
 * import {
 *   Skeleton,
 *   SkeletonText,
 *   SkeletonCard,
 *   SkeletonList,
 *   SkeletonGrid,
 *   PageSkeleton,
 * } from '@soundblue/shared-react/components';
 *
 * // Show while data is loading
 * if (isLoading) {
 *   return <PageSkeleton />;
 * }
 * ```
 */
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../utils/cn';

/**
 * Props for the base Skeleton component.
 */
interface SkeletonProps {
  /**
   * Additional CSS classes to apply to the skeleton element.
   * Use to customize dimensions, margins, or override default styling.
   * @default ''
   */
  className?: string;
  /**
   * Inline CSS styles for precise control over the skeleton appearance.
   * Useful for dynamic widths/heights based on expected content.
   */
  style?: CSSProperties;
}

/**
 * Base skeleton placeholder component.
 *
 * Renders a single animated pulse element that can be customized to match
 * the expected content dimensions. Use this as a building block for custom
 * skeleton layouts or when other specialized components don't fit your needs.
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes for customization
 * @param props.style - Inline styles for dynamic sizing
 * @returns A pulsing skeleton placeholder element
 *
 * @example Custom avatar skeleton
 * ```tsx
 * <Skeleton className="w-12 h-12 rounded-full" />
 * ```
 *
 * @example Dynamic height based on expected content
 * ```tsx
 * <Skeleton style={{ height: `${expectedLines * 24}px` }} />
 * ```
 *
 * @example Image placeholder with aspect ratio
 * ```tsx
 * <Skeleton className="w-full aspect-video rounded-lg" />
 * ```
 */
export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-(--bg-tertiary) rounded', className)} style={style} />
  );
}

/**
 * Props for the SkeletonText component.
 */
interface SkeletonTextProps {
  /**
   * Number of text lines to display.
   * The last line is automatically rendered at 2/3 width to simulate
   * natural paragraph endings.
   * @default 3
   */
  lines?: number;
  /**
   * Additional CSS classes to apply to the container.
   * @default ''
   */
  className?: string;
}

/**
 * Multi-line text skeleton placeholder.
 *
 * Renders multiple horizontal bars simulating lines of text. The last line
 * is automatically shorter (2/3 width) to create a realistic paragraph ending.
 * Each line has a height of 16px (h-4) with 8px (space-y-2) vertical spacing.
 *
 * @param props - Component props
 * @param props.lines - Number of text lines to render (default: 3)
 * @param props.className - Additional CSS classes for the container
 * @returns A container with multiple animated line placeholders
 *
 * @example Default 3-line paragraph skeleton
 * ```tsx
 * <SkeletonText />
 * ```
 *
 * @example Single line (e.g., for a title)
 * ```tsx
 * <SkeletonText lines={1} />
 * ```
 *
 * @example Article excerpt with 5 lines
 * ```tsx
 * <SkeletonText lines={5} className="max-w-prose" />
 * ```
 */
export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={`skeleton-line-${i}`}
          className={cn('h-4 animate-pulse bg-(--bg-tertiary) rounded', i === lines - 1 && 'w-2/3')}
        />
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
   * Use to customize card dimensions or spacing.
   * @default ''
   */
  className?: string;
}

/**
 * Card-shaped skeleton placeholder.
 *
 * Renders a card with elevated background, border, and internal structure
 * simulating a title (24px height, 3/4 width) and two lines of content.
 * Uses elevated styling with border to match standard card components.
 *
 * Internal structure:
 * - Title bar: 24px height, 3/4 width
 * - Content line 1: 16px height, full width
 * - Content line 2: 16px height, 2/3 width
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes for the card container
 * @returns A card-style skeleton with title and content placeholders
 *
 * @example Standalone card skeleton
 * ```tsx
 * <SkeletonCard />
 * ```
 *
 * @example Card with custom width
 * ```tsx
 * <SkeletonCard className="max-w-sm" />
 * ```
 *
 * @example Multiple cards in a row
 * ```tsx
 * <div className="flex gap-4">
 *   <SkeletonCard className="flex-1" />
 *   <SkeletonCard className="flex-1" />
 * </div>
 * ```
 */
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

/**
 * Props for the SkeletonList component.
 */
interface SkeletonListProps {
  /**
   * Number of list items to render.
   * @default 5
   */
  count?: number;
  /**
   * Additional CSS classes to apply to the list container.
   * @default ''
   */
  className?: string;
}

/**
 * List skeleton with avatar and text placeholders.
 *
 * Renders multiple list items, each consisting of a circular avatar (40x40px)
 * and two lines of text. Ideal for user lists, chat threads, notifications,
 * or any content with an avatar/icon and text pattern.
 *
 * Each item structure:
 * - Avatar: 40x40px circle (rounded-full)
 * - Title: 16px height, 1/3 width
 * - Subtitle: 12px height, 2/3 width
 *
 * @param props - Component props
 * @param props.count - Number of list items to render (default: 5)
 * @param props.className - Additional CSS classes for the list container
 * @returns A list of avatar-and-text skeleton items
 *
 * @example Default 5-item list
 * ```tsx
 * <SkeletonList />
 * ```
 *
 * @example Short list for notifications
 * ```tsx
 * <SkeletonList count={3} />
 * ```
 *
 * @example Long scrollable list
 * ```tsx
 * <div className="max-h-96 overflow-y-auto">
 *   <SkeletonList count={10} />
 * </div>
 * ```
 *
 * @example Chat thread skeleton
 * ```tsx
 * <SkeletonList count={8} className="divide-y divide-(--border-primary)" />
 * ```
 */
export function SkeletonList({ count = 5, className = '' }: SkeletonListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={`skeleton-list-${i}`} className="flex items-center gap-3">
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

/**
 * Props for the SkeletonGrid component.
 */
interface SkeletonGridProps {
  /**
   * Number of cards to render in the grid.
   * @default 6
   */
  count?: number;
  /**
   * Number of grid columns.
   * Optimized values: 2, 3, 4 (pre-defined classes).
   * Other values will generate dynamic classes but may require Tailwind safelist.
   * @default 3
   */
  columns?: number;
  /**
   * Additional CSS classes to apply to the grid container.
   * @default ''
   */
  className?: string;
}

/**
 * Grid of skeleton cards.
 *
 * Renders multiple SkeletonCard components in a responsive grid layout.
 * Pre-defined column classes (2, 3, 4) are optimized for Tailwind CSS.
 * Other column values generate dynamic classes that may need to be added
 * to Tailwind's safelist for production builds.
 *
 * @param props - Component props
 * @param props.count - Number of cards to display (default: 6)
 * @param props.columns - Number of grid columns (default: 3, optimized: 2-4)
 * @param props.className - Additional CSS classes for the grid container
 * @returns A grid of skeleton card placeholders
 *
 * @remarks
 * Column class mapping for optimized builds:
 * - 2 columns: `grid-cols-2`
 * - 3 columns: `grid-cols-3`
 * - 4 columns: `grid-cols-4`
 * - Other values: Dynamic `grid-cols-{n}` (requires Tailwind safelist)
 *
 * @example Default 6 cards in 3 columns
 * ```tsx
 * <SkeletonGrid />
 * ```
 *
 * @example 2-column layout for mobile
 * ```tsx
 * <SkeletonGrid columns={2} count={4} />
 * ```
 *
 * @example Product grid skeleton
 * ```tsx
 * <SkeletonGrid
 *   count={12}
 *   columns={4}
 *   className="px-4"
 * />
 * ```
 *
 * @example Responsive grid (combine with container queries or media queries)
 * ```tsx
 * <div className="sm:hidden">
 *   <SkeletonGrid columns={2} count={4} />
 * </div>
 * <div className="hidden sm:block">
 *   <SkeletonGrid columns={4} count={8} />
 * </div>
 * ```
 */
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
        <SkeletonCard key={`skeleton-grid-${i}`} />
      ))}
    </div>
  );
}

/**
 * Props for the PageSkeleton component.
 */
interface PageSkeletonProps {
  /**
   * Custom content to render below the page header skeleton.
   * If not provided, defaults to a SkeletonGrid with 6 cards in 3 columns.
   */
  children?: ReactNode;
}

/**
 * Full page skeleton layout.
 *
 * Renders a complete page loading state with a header section (title and subtitle)
 * and customizable body content. By default, displays a 3x2 grid of skeleton cards,
 * but accepts children for custom layouts.
 *
 * Default structure:
 * - Title: 32px height, 1/3 width
 * - Subtitle: 20px height, 2/3 width
 * - Content: SkeletonGrid (6 cards, 3 columns) or custom children
 *
 * @param props - Component props
 * @param props.children - Custom content (default: SkeletonGrid with 6 cards)
 * @returns A full page skeleton layout
 *
 * @example Default page skeleton with grid
 * ```tsx
 * // Loading state for a typical page
 * if (isLoading) {
 *   return <PageSkeleton />;
 * }
 * ```
 *
 * @example Page with custom content skeleton
 * ```tsx
 * <PageSkeleton>
 *   <SkeletonText lines={5} />
 *   <SkeletonList count={3} />
 * </PageSkeleton>
 * ```
 *
 * @example Article page skeleton
 * ```tsx
 * <PageSkeleton>
 *   <Skeleton className="w-full h-64 rounded-lg mb-4" /> {/* Hero image *\/}
 *   <SkeletonText lines={10} className="max-w-prose" />
 * </PageSkeleton>
 * ```
 *
 * @example Dashboard page skeleton
 * ```tsx
 * <PageSkeleton>
 *   <div className="grid grid-cols-3 gap-4 mb-6">
 *     <Skeleton className="h-24" />
 *     <Skeleton className="h-24" />
 *     <Skeleton className="h-24" />
 *   </div>
 *   <SkeletonList count={5} />
 * </PageSkeleton>
 * ```
 */
export function PageSkeleton({ children }: PageSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="h-8 w-1/3 animate-pulse bg-(--bg-tertiary) rounded" />
      <div className="h-5 w-2/3 animate-pulse bg-(--bg-tertiary) rounded" />
      {children || <SkeletonGrid count={6} columns={3} />}
    </div>
  );
}
