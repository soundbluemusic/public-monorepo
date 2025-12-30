/**
 * @fileoverview Virtual List Component
 * @environment universal
 *
 * @tanstack/react-virtual 기반 가상 스크롤 리스트
 */
import { useVirtualizer } from '@tanstack/react-virtual';
import type * as React from 'react';
import { useEffect, useRef } from 'react';

import { cn } from '../utils/cn';

export interface VirtualListProps<T> {
  items: T[];
  estimateSize: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  gap?: number;
}

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

// Re-export for direct usage
export { useVirtualizer } from '@tanstack/react-virtual';
