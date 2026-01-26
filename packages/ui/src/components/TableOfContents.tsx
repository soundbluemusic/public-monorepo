/**
 * @fileoverview 목차(Table of Contents) 컴포넌트
 * 페이지 내 헤딩들을 자동으로 감지하여 네비게이션 제공
 * @environment client-only
 */

import { ChevronDown, ChevronUp, List } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';

export interface TocItem {
  /** 헤딩 ID */
  id: string;
  /** 헤딩 텍스트 */
  text: string;
  /** 헤딩 레벨 (1-6) */
  level: number;
}

export interface TableOfContentsProps {
  /** 목차 아이템 목록 (직접 제공 시) */
  items?: TocItem[];
  /** 자동 추출할 컨테이너 셀렉터 */
  containerSelector?: string;
  /** 포함할 헤딩 레벨 */
  headingLevels?: number[];
  /** 제목 */
  title?: string;
  /** 접기/펼치기 가능 여부 */
  collapsible?: boolean;
  /** 초기 펼침 상태 */
  defaultOpen?: boolean;
  /** 현재 활성 섹션 하이라이트 */
  highlightActive?: boolean;
  /** 스크롤 오프셋 (sticky 헤더 고려) */
  scrollOffset?: number;
  /** 변형 스타일 */
  variant?: 'default' | 'minimal' | 'card';
  /** 추가 클래스 */
  className?: string;
  /** 아이템 클릭 콜백 */
  onItemClick?: (item: TocItem) => void;
}

const variantStyles = {
  default: 'bg-(--bg-secondary) border border-(--border-primary) rounded-lg p-4',
  minimal: '',
  card: 'bg-(--bg-elevated) border border-(--border-primary) rounded-xl p-5 shadow-sm',
};

/**
 * 목차(Table of Contents) 컴포넌트
 *
 * @example
 * ```tsx
 * // 자동 추출
 * <TableOfContents containerSelector="#main-content" />
 *
 * // 수동 제공
 * <TableOfContents
 *   items={[
 *     { id: 'intro', text: 'Introduction', level: 2 },
 *     { id: 'setup', text: 'Setup', level: 2 },
 *   ]}
 * />
 * ```
 */
export const TableOfContents = memo(function TableOfContents({
  items: propItems,
  containerSelector = '#main-content',
  headingLevels = [2, 3],
  title = 'On this page',
  collapsible = true,
  defaultOpen = true,
  highlightActive = true,
  scrollOffset = 80,
  variant = 'default',
  className,
  onItemClick,
}: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>(propItems || []);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 자동으로 헤딩 추출
  useEffect(() => {
    if (propItems) {
      setItems(propItems);
      return;
    }

    const container = document.querySelector(containerSelector);
    if (!container) return;

    const selector = headingLevels.map((l) => `h${l}[id]`).join(', ');
    const headings = container.querySelectorAll(selector);

    const extractedItems: TocItem[] = Array.from(headings).map((heading) => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1), 10),
    }));

    setItems(extractedItems);
  }, [propItems, containerSelector, headingLevels]);

  // 활성 섹션 감지 (Intersection Observer)
  useEffect(() => {
    if (!highlightActive || items.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${scrollOffset}px 0px -70% 0px`,
        threshold: 0,
      },
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [items, highlightActive, scrollOffset]);

  const handleItemClick = useCallback(
    (item: TocItem) => {
      const element = document.getElementById(item.id);
      if (element) {
        const top = element.offsetTop - scrollOffset;
        window.scrollTo({ top, behavior: 'smooth' });
        history.pushState(null, '', `#${item.id}`);
      }
      onItemClick?.(item);
    },
    [scrollOffset, onItemClick],
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  if (items.length === 0) {
    return null;
  }

  const minLevel = Math.min(...items.map((item) => item.level));

  return (
    <nav aria-label="Table of contents" className={cn(variantStyles[variant], className)}>
      {/* 헤더 */}
      {collapsible ? (
        <button
          type="button"
          onClick={toggleOpen}
          className="w-full flex items-center justify-between gap-2 text-sm font-semibold text-(--text-primary)"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-2">
            <List size={16} aria-hidden="true" />
            {title}
          </span>
          {isOpen ? (
            <ChevronUp size={16} aria-hidden="true" />
          ) : (
            <ChevronDown size={16} aria-hidden="true" />
          )}
        </button>
      ) : (
        <div className="flex items-center gap-2 text-sm font-semibold text-(--text-primary) mb-3">
          <List size={16} aria-hidden="true" />
          {title}
        </div>
      )}

      {/* 목차 리스트 */}
      {isOpen && (
        <ul className="mt-3 space-y-1" role="list">
          {items.map((item) => {
            const indent = (item.level - minLevel) * 12;
            const isActive = activeId === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'w-full text-left text-sm py-1.5 px-2 rounded transition-colors',
                    'hover:bg-(--bg-tertiary)',
                    isActive
                      ? 'text-(--accent-primary) font-medium bg-(--bg-tertiary)'
                      : 'text-(--text-secondary)',
                  )}
                  style={{ paddingLeft: `${indent + 8}px` }}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {item.text}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
});

/**
 * 페이지 콘텐츠에서 TOC 아이템 추출하는 유틸리티
 */
export function extractTocItems(container: Element | null, levels: number[] = [2, 3]): TocItem[] {
  if (!container) return [];

  const selector = levels.map((l) => `h${l}[id]`).join(', ');
  const headings = container.querySelectorAll(selector);

  return Array.from(headings).map((heading) => ({
    id: heading.id,
    text: heading.textContent || '',
    level: parseInt(heading.tagName.charAt(1), 10),
  }));
}
