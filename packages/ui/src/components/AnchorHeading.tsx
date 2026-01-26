/**
 * @fileoverview 앵커 링크 헤딩 컴포넌트
 * 헤딩 옆에 # 아이콘으로 URL 복사 기능
 * @environment client-only
 */

import { Link as LinkIcon } from 'lucide-react';
import { memo, type ReactNode, useCallback, useState } from 'react';
import { cn } from '../utils/cn';

export interface AnchorHeadingProps {
  /** 헤딩 ID (URL 해시용) */
  id: string;
  /** 헤딩 레벨 */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** 헤딩 내용 */
  children: ReactNode;
  /** 복사 성공 메시지 */
  copiedMessage?: string;
  /** 추가 클래스 */
  className?: string;
  /** 복사 성공 콜백 */
  onCopy?: (id: string) => void;
}

const headingStyles = {
  1: 'text-3xl font-bold',
  2: 'text-2xl font-bold',
  3: 'text-xl font-semibold',
  4: 'text-lg font-semibold',
  5: 'text-base font-semibold',
  6: 'text-sm font-semibold',
};

const iconSizes = {
  1: 20,
  2: 18,
  3: 16,
  4: 14,
  5: 14,
  6: 12,
};

/**
 * 앵커 링크가 있는 헤딩 컴포넌트
 *
 * @example
 * ```tsx
 * <AnchorHeading id="introduction" level={2}>
 *   Introduction
 * </AnchorHeading>
 * // 렌더링: <h2 id="introduction">Introduction <a href="#introduction">#</a></h2>
 * ```
 */
export const AnchorHeading = memo(function AnchorHeading({
  id,
  level,
  children,
  copiedMessage = 'Link copied!',
  className,
  onCopy,
}: AnchorHeadingProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();

      const url = `${window.location.origin}${window.location.pathname}#${id}`;

      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        onCopy?.(id);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // 폴백
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        setCopied(true);
        onCopy?.(id);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    [id, onCopy],
  );

  const handleClick = useCallback(() => {
    // 부드러운 스크롤
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // URL 업데이트
      history.pushState(null, '', `#${id}`);
    }
  }, [id]);

  const Tag = `h${level}` as const;
  const iconSize = iconSizes[level];

  return (
    <Tag
      id={id}
      className={cn(
        'group flex items-center gap-2 scroll-mt-20',
        headingStyles[level],
        'text-(--text-primary)',
        className,
      )}
    >
      <span>{children}</span>
      <a
        href={`#${id}`}
        onClick={handleCopyLink}
        onDoubleClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center rounded p-1',
          'text-(--text-tertiary) hover:text-(--accent-primary)',
          'opacity-0 group-hover:opacity-100 focus:opacity-100',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-(--accent-primary)',
        )}
        aria-label={copied ? copiedMessage : `Copy link to ${id}`}
        title={copied ? copiedMessage : 'Copy link'}
      >
        {copied ? (
          <span className="text-xs text-green-500 font-medium">Copied!</span>
        ) : (
          <LinkIcon size={iconSize} aria-hidden="true" />
        )}
      </a>
    </Tag>
  );
});

/**
 * 텍스트에서 ID를 생성하는 유틸리티
 * "Hello World" → "hello-world"
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '') // 특수문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 중복 하이픈 제거
    .replace(/^-|-$/g, ''); // 앞뒤 하이픈 제거
}
