/**
 * TableHeader 컴포넌트
 *
 * 정렬 가능한 테이블 헤더 셀입니다.
 */

'use client';

import { flexRender, type Header } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TableHeaderProps<TData> {
  header: Header<TData, unknown>;
  enableSorting?: boolean;
}

export function TableHeader<TData>({ header, enableSorting = true }: TableHeaderProps<TData>) {
  const canSort = enableSorting && header.column.getCanSort();
  const sortDirection = header.column.getIsSorted();

  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-sm font-semibold text-(--text-primary)',
        canSort && 'cursor-pointer select-none hover:bg-(--bg-tertiary)',
      )}
      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
    >
      <div className="flex items-center gap-2">
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}

        {canSort && (
          <span className="text-(--text-tertiary)">
            {sortDirection === 'asc' ? (
              <ArrowUp size={14} />
            ) : sortDirection === 'desc' ? (
              <ArrowDown size={14} />
            ) : (
              <ArrowUpDown size={14} />
            )}
          </span>
        )}
      </div>
    </th>
  );
}
