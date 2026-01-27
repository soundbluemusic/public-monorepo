/**
 * @fileoverview Pagination Component
 * @environment universal
 *
 * 재사용 가능한 페이지네이션 컴포넌트.
 * i18n 독립적으로 설계되어 labels를 props로 받습니다.
 */
import { generatePageNumbers } from '@soundblue/core/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo, useMemo } from 'react';
import { cn } from '../utils/cn';

export interface PaginationLabels {
  /** 페이지 네비게이션 aria-label */
  navLabel?: string;
  /** 이전 페이지 버튼 aria-label */
  previousPage?: string;
  /** 다음 페이지 버튼 aria-label */
  nextPage?: string;
}

export interface PaginationProps {
  /** 현재 페이지 (1부터 시작) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void;
  /** 접근성 라벨 (선택사항) */
  labels?: PaginationLabels;
  /** 추가 클래스명 */
  className?: string;
}

const DEFAULT_LABELS: Required<PaginationLabels> = {
  navLabel: 'Page navigation',
  previousPage: 'Previous page',
  nextPage: 'Next page',
};

/**
 * 페이지네이션 컴포넌트
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => setPage(page)}
 *   labels={{
 *     navLabel: '페이지 네비게이션',
 *     previousPage: '이전 페이지',
 *     nextPage: '다음 페이지',
 *   }}
 * />
 * ```
 */
export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  labels,
  className,
}: PaginationProps) {
  const mergedLabels = { ...DEFAULT_LABELS, ...labels };

  const pageNumbers = useMemo(
    () => generatePageNumbers(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn('mt-6 mb-20 md:mb-0 flex items-center justify-center gap-2', className)}
      aria-label={mergedLabels.navLabel}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors',
          currentPage === 1
            ? 'text-(--text-tertiary) cursor-not-allowed'
            : 'text-(--text-primary) hover:bg-(--bg-tertiary)',
        )}
        aria-label={mergedLabels.previousPage}
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, idx) => {
          const key = page === '...' ? `ellipsis-${idx < 3 ? 'start' : 'end'}` : `page-${page}`;
          return page === '...' ? (
            <span key={key} className="px-2 text-(--text-tertiary)" aria-hidden="true">
              ...
            </span>
          ) : (
            <button
              key={key}
              type="button"
              onClick={() => onPageChange(page as number)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={cn(
                'min-h-11 min-w-11 flex items-center justify-center rounded-lg font-medium transition-colors',
                currentPage === page
                  ? 'bg-(--accent-primary) text-white'
                  : 'text-(--text-primary) hover:bg-(--bg-tertiary)',
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors',
          currentPage === totalPages
            ? 'text-(--text-tertiary) cursor-not-allowed'
            : 'text-(--text-primary) hover:bg-(--bg-tertiary)',
        )}
        aria-label={mergedLabels.nextPage}
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </nav>
  );
});
