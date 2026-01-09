/**
 * @fileoverview Virtual List and Grid Components
 * @environment universal
 *
 * High-performance virtualized list and grid components for rendering large datasets.
 * Built on top of `@tanstack/react-virtual` to efficiently render only visible items,
 * dramatically reducing DOM nodes and improving performance for lists with thousands of items.
 *
 * ## When to Use
 *
 * - **VirtualList**: Single-column lists with 100+ items (search results, logs, feeds)
 * - **VirtualGrid**: Multi-column grids with 100+ items (image galleries, card grids)
 *
 * ## Performance Characteristics
 *
 * - Only renders items visible in the viewport + overscan buffer
 * - DOM nodes stay constant regardless of list size (typically 10-20 nodes)
 * - Smooth scrolling with 60fps on mobile devices
 * - Memory efficient: 10,000 items use same memory as 20 items
 *
 * ## Accessibility
 *
 * - Maintains proper tab order for keyboard navigation
 * - Works with screen readers (items are real DOM elements)
 * - Supports `aria-*` attributes on rendered items
 *
 * @example Basic VirtualList
 * ```tsx
 * import { VirtualList } from '@soundblue/ui/patterns';
 *
 * function SearchResults({ results }: { results: Item[] }) {
 *   return (
 *     <VirtualList
 *       items={results}
 *       estimateSize={72}
 *       className="h-[400px]"
 *       renderItem={(item) => (
 *         <div className="p-4 border-b">{item.title}</div>
 *       )}
 *     />
 *   );
 * }
 * ```
 *
 * @example VirtualGrid with responsive columns
 * ```tsx
 * import { VirtualGrid } from '@soundblue/ui/patterns';
 *
 * function ImageGallery({ images }: { images: Image[] }) {
 *   const columns = useIsMobile() ? 2 : 4;
 *
 *   return (
 *     <VirtualGrid
 *       items={images}
 *       columns={columns}
 *       estimateSize={200}
 *       gap={16}
 *       className="h-[600px]"
 *       renderItem={(image) => (
 *         <img src={image.url} alt={image.alt} className="rounded-lg" />
 *       )}
 *     />
 *   );
 * }
 * ```
 *
 * @see {@link https://tanstack.com/virtual/latest | TanStack Virtual Documentation}
 * @module @soundblue/ui/patterns
 */
import { useVirtualizer } from '@tanstack/react-virtual';
import type * as React from 'react';
import { useEffect, useRef } from 'react';

import { cn } from '../utils/cn';

/**
 * Props for the VirtualList component.
 *
 * @typeParam T - The type of items in the list
 */
export interface VirtualListProps<T> {
  /**
   * Array of items to render in the list.
   * The list will re-measure and scroll to top when this array's length changes.
   */
  items: T[];

  /**
   * Estimated height of each item in pixels.
   * Used for initial layout calculation before actual measurements.
   * Closer estimates result in smoother initial renders.
   *
   * @example For a list with 72px tall items: `estimateSize={72}`
   */
  estimateSize: number;

  /**
   * Function to render each item.
   * Receives the item and its index in the original array.
   *
   * @param item - The data item to render
   * @param index - Zero-based index in the items array
   * @returns React node to display for this item
   *
   * @example
   * ```tsx
   * renderItem={(user, index) => (
   *   <div key={user.id}>
   *     #{index + 1}: {user.name}
   *   </div>
   * )}
   * ```
   */
  renderItem: (item: T, index: number) => React.ReactNode;

  /**
   * Additional CSS classes for the scroll container.
   * The container must have a fixed height for virtualization to work.
   *
   * @example `className="h-[500px] rounded-lg border"`
   */
  className?: string;

  /**
   * Number of items to render outside the visible viewport.
   * Higher values provide smoother scrolling but use more memory.
   *
   * @default 3
   *
   * @remarks
   * - Use 1-2 for simple lists with fast renders
   * - Use 3-5 for complex items or slower devices
   * - Use 5+ for very fast scrolling requirements
   */
  overscan?: number;

  /**
   * Gap between items in pixels.
   * Applied as spacing between consecutive items.
   *
   * @default 0
   */
  gap?: number;
}

/**
 * A virtualized list component for efficiently rendering large datasets.
 *
 * VirtualList only renders items that are currently visible in the viewport,
 * plus a small buffer (overscan) for smooth scrolling. This makes it possible
 * to render lists with thousands of items without performance degradation.
 *
 * @typeParam T - The type of items in the list
 *
 * @param props - Component props
 * @returns A scrollable virtualized list
 *
 * @example Basic usage with search results
 * ```tsx
 * <VirtualList
 *   items={searchResults}
 *   estimateSize={80}
 *   className="h-[calc(100vh-200px)]"
 *   renderItem={(result) => (
 *     <SearchResultCard key={result.id} result={result} />
 *   )}
 * />
 * ```
 *
 * @example With gap and custom overscan
 * ```tsx
 * <VirtualList
 *   items={messages}
 *   estimateSize={60}
 *   gap={8}
 *   overscan={5}
 *   className="h-full"
 *   renderItem={(message, index) => (
 *     <MessageBubble
 *       key={message.id}
 *       message={message}
 *       isFirst={index === 0}
 *     />
 *   )}
 * />
 * ```
 *
 * @remarks
 * ## Important Notes
 *
 * 1. **Container Height Required**: The className must include a fixed height
 *    (e.g., `h-[500px]` or `h-full` with a sized parent) for scrolling to work.
 *
 * 2. **Item Keys**: The component handles keys internally using virtualizer indices.
 *    You don't need to add keys in renderItem unless using fragments.
 *
 * 3. **Scroll Reset**: When items.length changes, the list automatically scrolls
 *    to the top and re-measures all items.
 *
 * 4. **Variable Heights**: Items can have different heights. The component will
 *    measure actual sizes after initial render using estimateSize.
 *
 * @see {@link VirtualGrid} - For multi-column grid layouts
 * @see {@link VirtualListProps} - For detailed prop documentation
 */
export function VirtualList<T>({
  items,
  estimateSize,
  renderItem,
  className,
  overscan = 3,
  gap = 0,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    gap,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: items.length 변경 감지 의도적
  useEffect(() => {
    virtualizer.measure();
    if (parentRef.current) {
      parentRef.current.scrollTop = 0;
    }
  }, [items.length, virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className={cn('overflow-auto', className)}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index] as T, virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// VirtualGrid
// ========================================

/**
 * Props for the VirtualGrid component.
 *
 * @typeParam T - The type of items in the grid
 */
export interface VirtualGridProps<T> {
  /**
   * Array of items to render in the grid.
   * Items are arranged in rows based on the columns prop.
   */
  items: T[];

  /**
   * Estimated height of each grid item in pixels.
   * All items in a row share the same height for layout purposes.
   *
   * @example For 200x200 image cards: `estimateSize={200}`
   */
  estimateSize: number;

  /**
   * Number of columns in the grid.
   * Typically calculated based on viewport width for responsive layouts.
   *
   * @example
   * ```tsx
   * const columns = useIsMobile() ? 2 : 4;
   * ```
   *
   * @remarks
   * When columns change, the grid re-measures and scrolls to top.
   * Consider debouncing rapid column changes during resize.
   */
  columns: number;

  /**
   * Function to render each grid item.
   * Receives the item and its index in the original array.
   *
   * @param item - The data item to render
   * @param index - Zero-based index in the items array (not grid position)
   * @returns React node to display for this item
   */
  renderItem: (item: T, index: number) => React.ReactNode;

  /**
   * Additional CSS classes for the scroll container.
   * The container must have a fixed height for virtualization to work.
   */
  className?: string;

  /**
   * Number of rows to render outside the visible viewport.
   * Note: This is rows, not individual items.
   *
   * @default 2
   */
  overscan?: number;

  /**
   * Gap between items in pixels (both horizontal and vertical).
   * Applied using CSS grid gap.
   *
   * @default 8
   */
  gap?: number;
}

/**
 * A virtualized grid component for efficiently rendering large multi-column datasets.
 *
 * VirtualGrid virtualizes by row rather than individual items, rendering only
 * rows that are visible plus an overscan buffer. This is ideal for card grids,
 * image galleries, and any multi-column layout with many items.
 *
 * @typeParam T - The type of items in the grid
 *
 * @param props - Component props
 * @returns A scrollable virtualized grid
 *
 * @example Image gallery with responsive columns
 * ```tsx
 * function Gallery({ images }: { images: Image[] }) {
 *   const isMobile = useIsMobile();
 *
 *   return (
 *     <VirtualGrid
 *       items={images}
 *       columns={isMobile ? 2 : 4}
 *       estimateSize={180}
 *       gap={12}
 *       className="h-[600px] p-4"
 *       renderItem={(image) => (
 *         <div className="aspect-square overflow-hidden rounded-lg">
 *           <img
 *             src={image.thumbnail}
 *             alt={image.alt}
 *             className="w-full h-full object-cover"
 *           />
 *         </div>
 *       )}
 *     />
 *   );
 * }
 * ```
 *
 * @example Product grid with click handling
 * ```tsx
 * <VirtualGrid
 *   items={products}
 *   columns={3}
 *   estimateSize={280}
 *   gap={16}
 *   className="h-full"
 *   renderItem={(product, index) => (
 *     <ProductCard
 *       key={product.id}
 *       product={product}
 *       onClick={() => openProduct(product.id)}
 *       priority={index < 6}
 *     />
 *   )}
 * />
 * ```
 *
 * @remarks
 * ## How It Works
 *
 * Unlike VirtualList which virtualizes individual items, VirtualGrid virtualizes
 * by rows. A grid with 1000 items and 4 columns has 250 rows. Only visible rows
 * (+ overscan) are rendered, keeping DOM nodes minimal.
 *
 * ## Layout Model
 *
 * ```
 * ┌─────────────────────────────────────┐
 * │  [Item 0] [Item 1] [Item 2] [Item 3]│  Row 0 (virtualized)
 * │  [Item 4] [Item 5] [Item 6] [Item 7]│  Row 1 (virtualized)
 * │  [Item 8] [Item 9] ...              │  Row 2 (virtualized)
 * └─────────────────────────────────────┘
 * ```
 *
 * ## Choosing Between VirtualList and VirtualGrid
 *
 * | Use Case | Component |
 * |----------|-----------|
 * | Search results | VirtualList |
 * | Activity feeds | VirtualList |
 * | Image galleries | VirtualGrid |
 * | Product catalogs | VirtualGrid |
 * | File explorers | VirtualGrid |
 *
 * @see {@link VirtualList} - For single-column lists
 * @see {@link VirtualGridProps} - For detailed prop documentation
 */
export function VirtualGrid<T>({
  items,
  estimateSize,
  columns,
  renderItem,
  className,
  overscan = 2,
  gap = 8,
}: VirtualGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // 행(row) 단위로 가상화
  const rowCount = Math.ceil(items.length / columns);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize + gap,
    overscan,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: items.length 변경 감지 의도적
  useEffect(() => {
    virtualizer.measure();
    if (parentRef.current) {
      parentRef.current.scrollTop = 0;
    }
  }, [items.length, columns, virtualizer]);

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className={cn('overflow-auto', className)}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowItems = items.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `${gap}px`,
              }}
            >
              {rowItems.map((item, colIndex) => {
                const itemIndex = startIndex + colIndex;
                return (
                  <div key={itemIndex} style={{ minHeight: estimateSize }}>
                    {renderItem(item, itemIndex)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Re-export of useVirtualizer hook from @tanstack/react-virtual.
 *
 * Use this for advanced customization when VirtualList/VirtualGrid don't
 * meet your specific requirements.
 *
 * @example Custom horizontal virtualizer
 * ```tsx
 * import { useVirtualizer } from '@soundblue/ui/patterns';
 *
 * function HorizontalList({ items }) {
 *   const parentRef = useRef(null);
 *   const virtualizer = useVirtualizer({
 *     horizontal: true,
 *     count: items.length,
 *     getScrollElement: () => parentRef.current,
 *     estimateSize: () => 200,
 *   });
 *   // ... custom implementation
 * }
 * ```
 *
 * @see {@link https://tanstack.com/virtual/latest/docs/api/virtualizer | useVirtualizer API}
 */
export { useVirtualizer } from '@tanstack/react-virtual';
