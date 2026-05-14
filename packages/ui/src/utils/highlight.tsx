/**
 * @fileoverview Search query highlighting helper
 * @environment universal
 *
 * 검색 결과 텍스트에서 매칭되는 부분을 `<mark>` 태그로 감싸 시각적으로 강조합니다.
 */
import { Fragment, type ReactNode } from 'react';

/** 정규식 특수문자 이스케이프 */
function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * `text`에서 `query`와 일치하는 부분(대소문자 무시)을 `<mark>` 태그로 감쌉니다.
 *
 * - `query`가 비어있으면 원본 문자열을 그대로 반환
 * - 매칭 부분이 없으면 원본 문자열을 그대로 반환
 * - 모든 매칭 위치를 강조 (탐색용)
 *
 * @example
 * ```tsx
 * <p>{highlightMatches('JavaScript 함수 문법', '함수')}</p>
 * // 렌더링 결과: JavaScript <mark>함수</mark> 문법
 * ```
 */
export function highlightMatches(
  text: string,
  query: string,
  className = 'bg-yellow-200 dark:bg-yellow-500/30 text-(--text-primary) rounded px-0.5',
): ReactNode {
  if (typeof text !== 'string' || text.length === 0) return text;
  const trimmed = typeof query === 'string' ? query.trim() : '';
  if (trimmed.length === 0) return text;

  const pattern = new RegExp(`(${escapeRegExp(trimmed)})`, 'gi');
  const parts = text.split(pattern);
  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, index) => {
        const key = `${index}-${part}`;
        if (index % 2 === 1) {
          return (
            <mark key={key} className={className}>
              {part}
            </mark>
          );
        }
        return <Fragment key={key}>{part}</Fragment>;
      })}
    </>
  );
}
