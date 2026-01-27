/**
 * TablePagination 컴포넌트
 *
 * 테이블 페이지네이션 UI입니다.
 */

'use client';

import type { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TablePaginationProps<TData> {
  table: Table<TData>;
  className?: string;
}

export function TablePagination<TData>({ table, className }: TablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <div className={cn('flex items-center justify-between gap-4 px-2 py-4', className)}>
      {/* Page info */}
      <div className="text-sm text-(--text-tertiary)">
        Page {currentPage} of {totalPages}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className={cn(
            'p-2 rounded-lg transition-colors',
            table.getCanPreviousPage()
              ? 'hover:bg-(--bg-tertiary) text-(--text-secondary)'
              : 'text-(--text-tertiary) cursor-not-allowed opacity-50',
          )}
          aria-label="First page"
        >
          <ChevronsLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={cn(
            'p-2 rounded-lg transition-colors',
            table.getCanPreviousPage()
              ? 'hover:bg-(--bg-tertiary) text-(--text-secondary)'
              : 'text-(--text-tertiary) cursor-not-allowed opacity-50',
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-2">
          {generatePageNumbers(currentPage, totalPages).map((page, index) => {
            const key = page === '...' ? `ellipsis-${index < 3 ? 'start' : 'end'}` : `page-${page}`;
            return page === '...' ? (
              <span key={key} className="px-2 text-(--text-tertiary)">
                ...
              </span>
            ) : (
              <button
                key={key}
                type="button"
                onClick={() => table.setPageIndex((page as number) - 1)}
                className={cn(
                  'min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium transition-colors',
                  page === currentPage
                    ? 'bg-(--accent-primary) text-white'
                    : 'hover:bg-(--bg-tertiary) text-(--text-secondary)',
                )}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={cn(
            'p-2 rounded-lg transition-colors',
            table.getCanNextPage()
              ? 'hover:bg-(--bg-tertiary) text-(--text-secondary)'
              : 'text-(--text-tertiary) cursor-not-allowed opacity-50',
          )}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>

        <button
          type="button"
          onClick={() => table.setPageIndex(totalPages - 1)}
          disabled={!table.getCanNextPage()}
          className={cn(
            'p-2 rounded-lg transition-colors',
            table.getCanNextPage()
              ? 'hover:bg-(--bg-tertiary) text-(--text-secondary)'
              : 'text-(--text-tertiary) cursor-not-allowed opacity-50',
          )}
          aria-label="Last page"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}

/**
 * 페이지 번호 배열 생성
 */
function generatePageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}
