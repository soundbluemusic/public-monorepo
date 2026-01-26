/**
 * @fileoverview 빵부스러기(Breadcrumb) 네비게이션 컴포넌트
 * @environment universal
 */

import { ChevronRight, Home } from 'lucide-react';
import { type ComponentType, memo, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface BreadcrumbItem {
  /** 라벨 텍스트 */
  label: string;
  /** 링크 경로 (없으면 현재 페이지) */
  href?: string;
  /** 아이콘 (선택) */
  icon?: ReactNode;
}

export interface BreadcrumbProps {
  /** 빵부스러기 아이템 목록 */
  items: BreadcrumbItem[];
  /** 홈 링크 표시 */
  showHome?: boolean;
  /** 홈 경로 */
  homePath?: string;
  /** 홈 라벨 */
  homeLabel?: string;
  /** 구분자 커스텀 */
  separator?: ReactNode;
  /** 커스텀 Link 컴포넌트 (React Router, TanStack Router 등) */
  LinkComponent?: ComponentType<{ to: string; className?: string; children: ReactNode }>;
  /** 변형 스타일 */
  variant?: 'default' | 'compact' | 'pills';
  /** 추가 클래스 */
  className?: string;
}

const variantStyles = {
  default: 'flex items-center gap-1 text-sm flex-wrap',
  compact: 'flex items-center gap-0.5 text-xs flex-wrap',
  pills: 'flex items-center gap-2 text-sm flex-wrap',
};

const itemStyles = {
  default: {
    link: 'text-(--text-secondary) hover:text-(--accent-primary) hover:underline transition-colors no-underline',
    current: 'text-(--text-primary) font-medium',
    separator: 'text-(--text-tertiary) mx-1',
  },
  compact: {
    link: 'text-(--text-tertiary) hover:text-(--text-secondary) transition-colors no-underline',
    current: 'text-(--text-secondary)',
    separator: 'text-(--text-tertiary) mx-0.5',
  },
  pills: {
    link: 'px-2.5 py-1 rounded-full bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-tertiary)/80 transition-colors no-underline',
    current:
      'px-2.5 py-1 rounded-full bg-(--accent-primary)/10 text-(--accent-primary) font-medium',
    separator: 'text-(--text-tertiary)',
  },
};

/**
 * 기본 <a> 태그 링크 컴포넌트
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
 * 빵부스러기 네비게이션 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <Breadcrumb
 *   items={[
 *     { label: 'Products', href: '/products' },
 *     { label: 'Electronics', href: '/products/electronics' },
 *     { label: 'Phones' },
 *   ]}
 * />
 *
 * // TanStack Router와 함께
 * import { Link } from '@tanstack/react-router';
 * <Breadcrumb
 *   items={items}
 *   LinkComponent={Link}
 * />
 * ```
 */
export const Breadcrumb = memo(function Breadcrumb({
  items,
  showHome = true,
  homePath = '/',
  homeLabel = 'Home',
  separator,
  LinkComponent = DefaultLink,
  variant = 'default',
  className,
}: BreadcrumbProps) {
  const styles = itemStyles[variant];

  // 홈 아이템 추가
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: homeLabel, href: homePath, icon: <Home size={14} /> }, ...items]
    : items;

  const defaultSeparator = (
    <ChevronRight
      size={variant === 'compact' ? 12 : 14}
      className={styles.separator}
      aria-hidden="true"
    />
  );

  return (
    <nav aria-label="Breadcrumb" className={cn(variantStyles[variant], className)}>
      <ol className="flex items-center gap-1 flex-wrap list-none p-0 m-0">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isFirst = index === 0;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {/* 구분자 (첫 번째 제외) */}
              {!isFirst && (separator || defaultSeparator)}

              {/* 아이템 */}
              {item.href && !isLast ? (
                <LinkComponent to={item.href} className={styles.link}>
                  <span className="flex items-center gap-1">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                </LinkComponent>
              ) : (
                <span
                  className={isLast ? styles.current : styles.link}
                  aria-current={isLast ? 'page' : undefined}
                >
                  <span className="flex items-center gap-1">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

/**
 * JSON-LD 구조화 데이터 생성 유틸리티
 * Google 검색 결과에 빵부스러기 표시
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[], baseUrl: string): string {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: item.href ? `${baseUrl}${item.href}` : undefined,
  }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });
}
