/**
 * @fileoverview 페이지네이션 유틸리티
 *
 * 페이지 번호 배열 생성 함수를 제공합니다.
 */

/**
 * 페이지 번호 배열 생성 (1, 2, ..., 5, 6, 7, ..., 19, 20 형태)
 *
 * @param current - 현재 페이지 번호
 * @param total - 전체 페이지 수
 * @returns 페이지 번호와 생략 기호('...')로 구성된 배열
 *
 * @example
 * generatePageNumbers(1, 5)   // [1, 2, 3, 4, 5]
 * generatePageNumbers(5, 20)  // [1, '...', 4, 5, 6, '...', 20]
 * generatePageNumbers(1, 20)  // [1, 2, '...', 20]
 */
export function generatePageNumbers(current: number, total: number): (number | '...')[] {
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
