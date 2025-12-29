/**
 * @fileoverview Entry list item component for Context app
 *
 * 단어 목록에서 개별 항목을 렌더링하는 재사용 가능한 컴포넌트입니다.
 * browse.tsx와 category.$categoryId.tsx에서 중복되던 코드를 추출했습니다.
 */

import { Check, Star } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '../utils';

/**
 * Category 정보 (선택적 표시용)
 */
export interface EntryCategory {
  icon: string;
  name: {
    ko: string;
    en: string;
  };
}

/**
 * EntryListItem 컴포넌트 Props
 */
export interface EntryListItemProps {
  /** 단어 ID (링크 생성용) */
  entryId: string;
  /** 한국어 단어 */
  korean: string;
  /** 로마자 표기 */
  romanization: string;
  /** 번역 (현재 locale 기준) */
  translation: string;
  /** 학습 완료 여부 */
  isStudied: boolean;
  /** 즐겨찾기 여부 (선택) */
  isFavorite?: boolean;
  /** 카테고리 정보 (선택) */
  category?: EntryCategory;
  /** 현재 locale */
  locale: 'ko' | 'en';
  /** locale 기반 경로 생성 함수 */
  localePath: (path: string) => string;
}

/**
 * EntryListItem - 단어 목록 항목 컴포넌트
 *
 * @example
 * ```tsx
 * <EntryListItem
 *   entryId="hello-1"
 *   korean="안녕하세요"
 *   romanization="annyeonghaseyo"
 *   translation="Hello"
 *   isStudied={true}
 *   locale="en"
 *   localePath={(path) => `/en${path}`}
 * />
 * ```
 */
export function EntryListItem({
  entryId,
  korean,
  romanization,
  translation,
  isStudied,
  isFavorite,
  category,
  locale,
  localePath,
}: EntryListItemProps) {
  return (
    <Link
      to={localePath(`/entry/${entryId}`)}
      className="flex items-center justify-between py-3 px-2 rounded-lg border-b border-(--border-primary) transition-colors no-underline hover:bg-(--bg-tertiary)"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Checkmark - 학습 완료 표시 */}
        <div
          className={cn(
            'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
            isStudied ? 'bg-(--accent-primary)' : '',
          )}
        >
          {isStudied && <Check size={14} className="text-white" />}
        </div>

        {/* Word info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span
            className={cn(
              'text-lg font-medium',
              isStudied
                ? 'text-(--text-secondary) line-through opacity-70'
                : 'text-(--text-primary)',
            )}
          >
            {korean}
          </span>
          <span className="text-sm text-(--text-tertiary) hidden sm:inline">{romanization}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Category badge (desktop only) */}
        {category && (
          <span className="hidden md:inline px-2.5 py-0.5 rounded-full text-xs font-medium bg-(--bg-secondary) text-(--text-tertiary)">
            {category.icon} {category.name[locale]}
          </span>
        )}

        {/* Translation */}
        <span className="text-sm text-(--text-secondary) ml-2">{translation}</span>

        {/* Bookmark indicator */}
        {isFavorite && (
          <span className="text-sm" title={locale === 'ko' ? '북마크됨' : 'Bookmarked'}>
            <Star size={14} aria-hidden="true" fill="currentColor" />
          </span>
        )}
      </div>
    </Link>
  );
}
