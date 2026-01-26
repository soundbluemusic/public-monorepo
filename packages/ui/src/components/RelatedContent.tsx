/**
 * @fileoverview 관련 콘텐츠 추천 컴포넌트
 * @environment universal
 */

import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { type ComponentType, memo, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface RelatedItem {
  /** 아이템 ID */
  id: string;
  /** 제목 */
  title: string;
  /** 설명 (선택) */
  description?: string;
  /** 링크 경로 */
  href: string;
  /** 외부 링크 여부 */
  external?: boolean;
  /** 아이콘 또는 이미지 */
  icon?: ReactNode;
  /** 태그/카테고리 */
  tag?: string;
  /** 메타 정보 (읽는 시간 등) */
  meta?: string;
}

export interface RelatedContentProps {
  /** 관련 아이템 목록 */
  items: RelatedItem[];
  /** 섹션 제목 */
  title?: string;
  /** 커스텀 Link 컴포넌트 */
  LinkComponent?: ComponentType<{ to: string; className?: string; children: ReactNode }>;
  /** 변형 스타일 */
  variant?: 'default' | 'cards' | 'compact' | 'inline';
  /** 최대 표시 개수 */
  maxItems?: number;
  /** 추가 클래스 */
  className?: string;
  /** 아이템 클릭 콜백 */
  onItemClick?: (item: RelatedItem) => void;
}

const variantStyles = {
  default: 'space-y-4',
  cards: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  compact: 'space-y-2',
  inline: 'flex flex-wrap gap-2',
};

/**
 * 기본 링크 컴포넌트
 */
const DefaultLink = ({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) => (
  <a href={to} className={className}>
    {children}
  </a>
);

/**
 * 관련 콘텐츠 추천 컴포넌트
 *
 * @example
 * ```tsx
 * <RelatedContent
 *   title="Related Articles"
 *   items={[
 *     { id: '1', title: 'Getting Started', href: '/docs/start' },
 *     { id: '2', title: 'Advanced Guide', href: '/docs/advanced', tag: 'Advanced' },
 *   ]}
 * />
 * ```
 */
export const RelatedContent = memo(function RelatedContent({
  items,
  title = 'Related',
  LinkComponent = DefaultLink,
  variant = 'default',
  maxItems,
  className,
  onItemClick,
}: RelatedContentProps) {
  const displayedItems = maxItems ? items.slice(0, maxItems) : items;

  if (displayedItems.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* 헤더 */}
      <h3 className="flex items-center gap-2 text-sm font-semibold text-(--text-primary) mb-4">
        <BookOpen size={16} aria-hidden="true" />
        {title}
      </h3>

      {/* 아이템 목록 */}
      <div className={variantStyles[variant]}>
        {displayedItems.map((item) => (
          <RelatedItemComponent
            key={item.id}
            item={item}
            variant={variant}
            LinkComponent={LinkComponent}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    </div>
  );
});

/**
 * 개별 관련 아이템 컴포넌트
 */
interface RelatedItemComponentProps {
  item: RelatedItem;
  variant: 'default' | 'cards' | 'compact' | 'inline';
  LinkComponent: ComponentType<{ to: string; className?: string; children: ReactNode }>;
  onClick?: () => void;
}

const RelatedItemComponent = memo(function RelatedItemComponent({
  item,
  variant,
  LinkComponent,
  onClick,
}: RelatedItemComponentProps) {
  const handleClick = () => {
    onClick?.();
  };

  // 외부 링크
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={getItemClassName(variant)}
      >
        <ItemContent item={item} variant={variant} />
        <ExternalLink size={14} className="shrink-0 text-(--text-tertiary)" aria-hidden="true" />
      </a>
    );
  }

  // 내부 링크
  return (
    <LinkComponent to={item.href} className={getItemClassName(variant)}>
      <ItemContent item={item} variant={variant} />
      <ArrowRight
        size={14}
        className={cn(
          'shrink-0 text-(--text-tertiary) transition-transform',
          'group-hover:translate-x-1',
        )}
        aria-hidden="true"
      />
    </LinkComponent>
  );
});

/**
 * 아이템 내용 컴포넌트
 */
const ItemContent = memo(function ItemContent({
  item,
  variant,
}: {
  item: RelatedItem;
  variant: string;
}) {
  if (variant === 'cards') {
    return (
      <div className="flex-1 min-w-0">
        {item.tag && (
          <span className="text-xs text-(--accent-primary) font-medium mb-1 block">{item.tag}</span>
        )}
        <h4 className="font-medium text-(--text-primary) group-hover:text-(--accent-primary) transition-colors">
          {item.title}
        </h4>
        {item.description && (
          <p className="text-sm text-(--text-secondary) mt-1 line-clamp-2">{item.description}</p>
        )}
        {item.meta && (
          <span className="text-xs text-(--text-tertiary) mt-2 block">{item.meta}</span>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return <span>{item.title}</span>;
  }

  // default, compact
  return (
    <>
      {item.icon && <span className="shrink-0">{item.icon}</span>}
      <div className="flex-1 min-w-0">
        <span className="text-(--text-primary) group-hover:text-(--accent-primary) transition-colors">
          {item.title}
        </span>
        {item.tag && (
          <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-(--bg-tertiary) text-(--text-tertiary)">
            {item.tag}
          </span>
        )}
      </div>
    </>
  );
});

/**
 * 변형별 아이템 클래스
 */
function getItemClassName(variant: string): string {
  const base = 'group flex items-center gap-3 no-underline transition-colors';

  switch (variant) {
    case 'cards':
      return cn(
        base,
        'p-4 rounded-lg border border-(--border-primary)',
        'bg-(--bg-secondary) hover:bg-(--bg-tertiary)',
        'hover:border-(--accent-primary)/30',
      );
    case 'compact':
      return cn(base, 'py-1.5 text-sm hover:text-(--accent-primary)');
    case 'inline':
      return cn(
        'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm',
        'bg-(--bg-tertiary) text-(--text-secondary)',
        'hover:bg-(--accent-primary)/10 hover:text-(--accent-primary)',
        'transition-colors no-underline',
      );
    default:
      return cn(base, 'py-2 px-3 rounded-lg', 'hover:bg-(--bg-tertiary)');
  }
}

/**
 * 관련 콘텐츠 섹션 (이전/다음 네비게이션 포함)
 */
export interface ContentNavigationProps {
  prev?: RelatedItem;
  next?: RelatedItem;
  LinkComponent?: ComponentType<{ to: string; className?: string; children: ReactNode }>;
  className?: string;
}

export const ContentNavigation = memo(function ContentNavigation({
  prev,
  next,
  LinkComponent = DefaultLink,
  className,
}: ContentNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Content navigation"
      className={cn('flex flex-col sm:flex-row gap-4', className)}
    >
      {/* 이전 */}
      {prev ? (
        <LinkComponent
          to={prev.href}
          className={cn(
            'group flex-1 flex flex-col p-4 rounded-lg border border-(--border-primary)',
            'bg-(--bg-secondary) hover:bg-(--bg-tertiary) hover:border-(--accent-primary)/30',
            'transition-colors no-underline',
          )}
        >
          <span className="text-xs text-(--text-tertiary) mb-1">Previous</span>
          <span className="font-medium text-(--text-primary) group-hover:text-(--accent-primary)">
            {prev.title}
          </span>
        </LinkComponent>
      ) : (
        <div className="flex-1" />
      )}

      {/* 다음 */}
      {next ? (
        <LinkComponent
          to={next.href}
          className={cn(
            'group flex-1 flex flex-col p-4 rounded-lg border border-(--border-primary)',
            'bg-(--bg-secondary) hover:bg-(--bg-tertiary) hover:border-(--accent-primary)/30',
            'transition-colors no-underline text-right',
          )}
        >
          <span className="text-xs text-(--text-tertiary) mb-1">Next</span>
          <span className="font-medium text-(--text-primary) group-hover:text-(--accent-primary)">
            {next.title}
          </span>
        </LinkComponent>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
});
