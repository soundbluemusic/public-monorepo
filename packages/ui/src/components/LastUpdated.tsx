/**
 * @fileoverview 마지막 업데이트 날짜 표시 컴포넌트
 * @environment universal
 */

import { Calendar, GitCommit, History } from 'lucide-react';
import { memo, useMemo } from 'react';
import { cn } from '../utils/cn';

export interface LastUpdatedProps {
  /** 날짜 (Date 객체 또는 ISO 문자열) */
  date: Date | string;
  /** 언어 */
  locale?: 'en' | 'ko';
  /** 라벨 텍스트 */
  label?: string;
  /** 상대 시간 표시 ("3일 전" 형태) */
  showRelative?: boolean;
  /** 아이콘 타입 */
  icon?: 'calendar' | 'history' | 'git' | 'none';
  /** 변형 스타일 */
  variant?: 'default' | 'compact' | 'badge';
  /** GitHub 커밋 링크 */
  commitUrl?: string;
  /** 추가 클래스 */
  className?: string;
}

const variantStyles = {
  default: 'inline-flex items-center gap-1.5 text-sm text-(--text-tertiary)',
  compact: 'inline-flex items-center gap-1 text-xs text-(--text-tertiary)',
  badge:
    'inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-(--bg-tertiary) text-(--text-secondary)',
};

const icons = {
  calendar: Calendar,
  history: History,
  git: GitCommit,
  none: null,
};

/**
 * 상대 시간 계산
 */
function getRelativeTime(date: Date, locale: 'en' | 'ko'): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (locale === 'ko') {
    if (diffSec < 60) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;
    if (diffWeek < 4) return `${diffWeek}주 전`;
    if (diffMonth < 12) return `${diffMonth}개월 전`;
    return `${diffYear}년 전`;
  }

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  if (diffWeek < 4) return `${diffWeek} week${diffWeek === 1 ? '' : 's'} ago`;
  if (diffMonth < 12) return `${diffMonth} month${diffMonth === 1 ? '' : 's'} ago`;
  return `${diffYear} year${diffYear === 1 ? '' : 's'} ago`;
}

/**
 * 날짜 포맷팅
 */
function formatDate(date: Date, locale: 'en' | 'ko'): string {
  return date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * 마지막 업데이트 날짜 표시 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <LastUpdated date="2024-01-15" />
 *
 * // 상대 시간
 * <LastUpdated date={new Date()} showRelative />
 *
 * // GitHub 링크 포함
 * <LastUpdated
 *   date="2024-01-15"
 *   commitUrl="https://github.com/org/repo/commit/abc123"
 *   icon="git"
 * />
 * ```
 */
export const LastUpdated = memo(function LastUpdated({
  date,
  locale = 'en',
  label,
  showRelative = false,
  icon = 'calendar',
  variant = 'default',
  commitUrl,
  className,
}: LastUpdatedProps) {
  const dateObj = useMemo(() => {
    return typeof date === 'string' ? new Date(date) : date;
  }, [date]);

  const displayText = useMemo(() => {
    const prefix = label ?? (locale === 'ko' ? '업데이트:' : 'Updated:');
    const dateText = showRelative ? getRelativeTime(dateObj, locale) : formatDate(dateObj, locale);

    return { prefix, dateText };
  }, [dateObj, locale, label, showRelative]);

  const IconComponent = icons[icon];
  const iconSize = variant === 'compact' ? 12 : 14;

  const content = (
    <>
      {IconComponent && <IconComponent size={iconSize} aria-hidden="true" />}
      <span>{displayText.prefix}</span>
      <time dateTime={dateObj.toISOString()} className="font-medium">
        {displayText.dateText}
      </time>
    </>
  );

  if (commitUrl) {
    return (
      <a
        href={commitUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          variantStyles[variant],
          'hover:text-(--accent-primary) transition-colors no-underline',
          className,
        )}
        title={locale === 'ko' ? '변경 이력 보기' : 'View change history'}
      >
        {content}
      </a>
    );
  }

  return <span className={cn(variantStyles[variant], className)}>{content}</span>;
});

/**
 * 버전 히스토리 아이템
 */
export interface VersionHistoryItem {
  version: string;
  date: Date | string;
  description: string;
  commitUrl?: string;
}

export interface VersionHistoryProps {
  items: VersionHistoryItem[];
  locale?: 'en' | 'ko';
  title?: string;
  maxItems?: number;
  className?: string;
}

/**
 * 버전 히스토리 목록 컴포넌트
 */
export const VersionHistory = memo(function VersionHistory({
  items,
  locale = 'en',
  title,
  maxItems = 5,
  className,
}: VersionHistoryProps) {
  const displayedItems = items.slice(0, maxItems);
  const defaultTitle = locale === 'ko' ? '변경 이력' : 'Version History';

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-semibold text-(--text-primary) flex items-center gap-2">
        <History size={16} aria-hidden="true" />
        {title || defaultTitle}
      </h3>

      <ul className="space-y-2">
        {displayedItems.map((item, index) => {
          const dateObj = typeof item.date === 'string' ? new Date(item.date) : item.date;

          return (
            <li key={`${item.version}-${index}`} className="flex items-start gap-3 text-sm">
              <span className="shrink-0 px-2 py-0.5 rounded text-xs font-mono bg-(--bg-tertiary) text-(--text-secondary)">
                {item.version}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-(--text-primary)">{item.description}</p>
                <time dateTime={dateObj.toISOString()} className="text-xs text-(--text-tertiary)">
                  {formatDate(dateObj, locale)}
                </time>
              </div>
              {item.commitUrl && (
                <a
                  href={item.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-(--text-tertiary) hover:text-(--accent-primary)"
                  title="View commit"
                >
                  <GitCommit size={14} aria-hidden="true" />
                </a>
              )}
            </li>
          );
        })}
      </ul>

      {items.length > maxItems && (
        <p className="text-xs text-(--text-tertiary)">
          {locale === 'ko'
            ? `외 ${items.length - maxItems}개 더...`
            : `and ${items.length - maxItems} more...`}
        </p>
      )}
    </div>
  );
});
