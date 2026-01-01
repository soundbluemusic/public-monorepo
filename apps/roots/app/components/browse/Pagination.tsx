/**
 * @fileoverview 페이지네이션 컴포넌트
 */
import { cn } from '@soundblue/ui/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useI18n } from '@/i18n';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * 페이지 번호 배열 생성 (1, 2, ..., 5, 6, 7, ..., 19, 20 형태)
 */
function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];
  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  pages.push(total);
  return pages;
}

export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { locale } = useI18n();

  const pageNumbers = useMemo(
    () => generatePageNumbers(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-6 mb-20 md:mb-0 flex items-center justify-center gap-2"
      aria-label={locale === 'ko' ? '페이지 네비게이션' : 'Page navigation'}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'min-h-10 min-w-10 flex items-center justify-center rounded-lg transition-colors',
          currentPage === 1
            ? 'text-(--text-tertiary) cursor-not-allowed'
            : 'text-(--text-primary) hover:bg-(--bg-tertiary)',
        )}
        aria-label={locale === 'ko' ? '이전 페이지' : 'Previous page'}
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, idx) => {
          // 고유 키 생성: 숫자는 그대로, ellipsis는 위치 기반 (앞/뒤)
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
                'min-h-10 min-w-10 flex items-center justify-center rounded-lg font-medium transition-colors',
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
          'min-h-10 min-w-10 flex items-center justify-center rounded-lg transition-colors',
          currentPage === totalPages
            ? 'text-(--text-tertiary) cursor-not-allowed'
            : 'text-(--text-primary) hover:bg-(--bg-tertiary)',
        )}
        aria-label={locale === 'ko' ? '다음 페이지' : 'Next page'}
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </nav>
  );
});
