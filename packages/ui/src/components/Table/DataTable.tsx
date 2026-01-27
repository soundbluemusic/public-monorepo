/**
 * DataTable 컴포넌트
 *
 * TanStack Table 기반의 재사용 가능한 데이터 테이블입니다.
 * 정렬, 필터, 페이지네이션을 지원합니다.
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={entries}
 *   columns={columns}
 *   onRowClick={(row) => navigate(`/entry/${row.id}`)}
 * />
 * ```
 */

'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { cn } from '../../utils/cn';
import { TableHeader } from './TableHeader';
import { TablePagination } from './TablePagination';

interface DataTableProps<TData> {
  /** 테이블 데이터 */
  data: TData[];
  /** 컬럼 정의 */
  columns: ColumnDef<TData, unknown>[];
  /** 행 클릭 핸들러 */
  onRowClick?: (row: TData) => void;
  /** 페이지네이션 사용 여부 */
  enablePagination?: boolean;
  /** 페이지 크기 (기본: 20) */
  pageSize?: number;
  /** 정렬 사용 여부 */
  enableSorting?: boolean;
  /** 필터 사용 여부 */
  enableFiltering?: boolean;
  /** 글로벌 필터 값 */
  globalFilter?: string;
  /** 글로벌 필터 변경 핸들러 */
  onGlobalFilterChange?: (value: string) => void;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 빈 상태 메시지 */
  emptyMessage?: string;
  /** 테이블 클래스 */
  className?: string;
}

export function DataTable<TData>({
  data,
  columns,
  onRowClick,
  enablePagination = true,
  pageSize = 20,
  enableSorting = true,
  enableFiltering = true,
  globalFilter,
  onGlobalFilterChange,
  isLoading = false,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
  });

  return (
    <div className={cn('w-full', className)}>
      {/* Table */}
      <div className="rounded-xl border border-(--border-primary) overflow-hidden">
        <table className="w-full">
          <thead className="bg-(--bg-elevated)">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeader key={header.id} header={header} enableSorting={enableSorting} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="h-32 text-center text-(--text-tertiary)">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="h-32 text-center text-(--text-tertiary)">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    'border-t border-(--border-secondary)',
                    'hover:bg-(--bg-tertiary) transition-colors',
                    onRowClick && 'cursor-pointer',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-(--text-secondary)">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && data.length > pageSize && <TablePagination table={table} />}
    </div>
  );
}
