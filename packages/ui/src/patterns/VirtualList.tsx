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

// ========================================
// VirtualGrid - 다중 컬럼 그리드 가상화
// ========================================

export interface VirtualGridProps<T> {
  items: T[];
  /** 각 아이템의 예상 높이 */
  estimateSize: number;
  /** 컬럼 수 (반응형: 뷰포트에 따라 변경) */
  columns: number;
  /** 아이템 렌더링 함수 */
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  /** 미리 렌더링할 행 수 */
  overscan?: number;
  /** 아이템 간 간격 (px) */
  gap?: number;
}

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

// Re-export for direct usage
export { useVirtualizer } from '@tanstack/react-virtual';
