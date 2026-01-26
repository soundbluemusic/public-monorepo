/**
 * @fileoverview 읽는 시간 표시 컴포넌트
 * 텍스트 길이 기반 읽기 시간 계산 및 표시
 * @environment universal
 */

import { Clock } from 'lucide-react';
import { memo, useMemo } from 'react';
import { cn } from '../utils/cn';

export interface ReadingTimeProps {
  /** 콘텐츠 텍스트 (HTML 태그 포함 가능) */
  content?: string;
  /** 단어 수 (직접 제공 시) */
  wordCount?: number;
  /** 분당 읽는 단어 수 (기본: 200) */
  wordsPerMinute?: number;
  /** 한글 분당 글자 수 (기본: 500) */
  charsPerMinute?: number;
  /** 언어 */
  locale?: 'en' | 'ko';
  /** 아이콘 표시 */
  showIcon?: boolean;
  /** 변형 스타일 */
  variant?: 'default' | 'compact' | 'badge';
  /** 추가 클래스 */
  className?: string;
}

const variantStyles = {
  default: 'inline-flex items-center gap-1.5 text-sm text-(--text-tertiary)',
  compact: 'inline-flex items-center gap-1 text-xs text-(--text-tertiary)',
  badge:
    'inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-(--bg-tertiary) text-(--text-secondary)',
};

/**
 * HTML 태그 제거
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * 단어 수 계산
 * 영어: 공백 기준 분리
 * 한글: 글자 수 기준
 */
function countWords(text: string): { english: number; korean: number } {
  const cleanText = stripHtml(text).trim();

  // 한글 문자 추출
  const koreanChars = cleanText.match(/[\uAC00-\uD7A3]/g) || [];
  const koreanCount = koreanChars.length;

  // 영어/숫자 단어 추출
  const nonKorean = cleanText.replace(/[\uAC00-\uD7A3]/g, ' ');
  const englishWords = nonKorean.split(/\s+/).filter((word) => word.length > 0);
  const englishCount = englishWords.length;

  return { english: englishCount, korean: koreanCount };
}

/**
 * 읽는 시간 계산 (분 단위)
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute = 200,
  charsPerMinute = 500,
): number {
  const { english, korean } = countWords(content);

  const englishMinutes = english / wordsPerMinute;
  const koreanMinutes = korean / charsPerMinute;

  return Math.ceil(englishMinutes + koreanMinutes);
}

/**
 * 읽는 시간 표시 컴포넌트
 *
 * @example
 * ```tsx
 * // 콘텐츠 기반
 * <ReadingTime content={articleContent} />
 *
 * // 단어 수 기반
 * <ReadingTime wordCount={1500} />
 *
 * // 한글
 * <ReadingTime content={koreanContent} locale="ko" />
 * ```
 */
export const ReadingTime = memo(function ReadingTime({
  content,
  wordCount: propWordCount,
  wordsPerMinute = 200,
  charsPerMinute = 500,
  locale = 'en',
  showIcon = true,
  variant = 'default',
  className,
}: ReadingTimeProps) {
  const minutes = useMemo(() => {
    if (propWordCount !== undefined) {
      return Math.ceil(propWordCount / wordsPerMinute);
    }

    if (content) {
      return calculateReadingTime(content, wordsPerMinute, charsPerMinute);
    }

    return 0;
  }, [content, propWordCount, wordsPerMinute, charsPerMinute]);

  if (minutes === 0) {
    return null;
  }

  const label =
    locale === 'ko' ? `${minutes}분 읽기` : minutes === 1 ? '1 min read' : `${minutes} min read`;

  return (
    <span className={cn(variantStyles[variant], className)}>
      {showIcon && <Clock size={variant === 'compact' ? 12 : 14} aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
});

/**
 * 단어 수 표시 컴포넌트
 */
export interface WordCountProps {
  /** 콘텐츠 텍스트 */
  content?: string;
  /** 단어 수 (직접 제공 시) */
  count?: number;
  /** 언어 */
  locale?: 'en' | 'ko';
  /** 추가 클래스 */
  className?: string;
}

export const WordCount = memo(function WordCount({
  content,
  count: propCount,
  locale = 'en',
  className,
}: WordCountProps) {
  const count = useMemo(() => {
    if (propCount !== undefined) return propCount;
    if (content) {
      const { english, korean } = countWords(content);
      return english + Math.ceil(korean / 2);
    }
    return 0;
  }, [content, propCount]);

  if (count === 0) return null;

  const label =
    locale === 'ko' ? `${count.toLocaleString()}단어` : `${count.toLocaleString()} words`;

  return <span className={cn('text-xs text-(--text-tertiary)', className)}>{label}</span>;
});
