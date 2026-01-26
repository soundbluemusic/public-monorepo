/**
 * @fileoverview 코드 복사 버튼 컴포넌트
 * 코드 블록, 공식, 텍스트 복사용
 * @environment client-only
 */

import { Check, Copy } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { cn } from '../utils/cn';

export interface CopyButtonProps {
  /** 복사할 텍스트 */
  text: string;
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 버튼 변형 */
  variant?: 'default' | 'ghost' | 'overlay';
  /** 성공 메시지 */
  successMessage?: string;
  /** 기본 라벨 */
  label?: string;
  /** 아이콘만 표시 */
  iconOnly?: boolean;
  /** 추가 클래스 */
  className?: string;
  /** 복사 성공 콜백 */
  onCopy?: () => void;
}

const sizeStyles = {
  sm: 'h-7 px-2 text-xs gap-1',
  md: 'h-8 px-2.5 text-sm gap-1.5',
  lg: 'h-10 px-3 text-sm gap-2',
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
};

const variantStyles = {
  default:
    'bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-tertiary)/80 border border-(--border-primary)',
  ghost: 'text-(--text-tertiary) hover:text-(--text-secondary) hover:bg-(--bg-tertiary)',
  overlay: 'bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm',
};

/**
 * 복사 버튼 컴포넌트
 *
 * @example
 * ```tsx
 * // 코드 블록 내부
 * <div className="relative">
 *   <pre><code>{code}</code></pre>
 *   <CopyButton text={code} variant="overlay" className="absolute top-2 right-2" />
 * </div>
 *
 * // 인라인 사용
 * <CopyButton text="npm install package" label="Copy command" />
 * ```
 */
export const CopyButton = memo(function CopyButton({
  text,
  size = 'md',
  variant = 'default',
  successMessage = 'Copied!',
  label = 'Copy',
  iconOnly = true,
  className,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 폴백: 숨겨진 textarea로 복사
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text, onCopy]);

  const iconSize = iconSizes[size];

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:ring-offset-1',
        sizeStyles[size],
        variantStyles[variant],
        iconOnly && 'px-0 aspect-square',
        className,
      )}
      aria-label={iconOnly ? (copied ? successMessage : label) : undefined}
      title={iconOnly ? (copied ? successMessage : label) : undefined}
    >
      {copied ? (
        <Check size={iconSize} className="text-green-500" aria-hidden="true" />
      ) : (
        <Copy size={iconSize} aria-hidden="true" />
      )}
      {!iconOnly && <span>{copied ? successMessage : label}</span>}
    </button>
  );
});

/**
 * 코드 블록 래퍼 컴포넌트 (복사 버튼 포함)
 */
export interface CodeBlockProps {
  /** 코드 내용 */
  code: string;
  /** 언어 (표시용) */
  language?: string;
  /** 파일명 (표시용) */
  filename?: string;
  /** 추가 클래스 */
  className?: string;
  /** 자식 요소 (하이라이트된 코드) */
  children?: React.ReactNode;
}

export const CodeBlock = memo(function CodeBlock({
  code,
  language,
  filename,
  className,
  children,
}: CodeBlockProps) {
  return (
    <div className={cn('relative group rounded-lg overflow-hidden', className)}>
      {/* 헤더 (파일명/언어) */}
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-(--bg-tertiary) border-b border-(--border-primary)">
          <span className="text-xs text-(--text-tertiary) font-mono">{filename || language}</span>
        </div>
      )}

      {/* 코드 영역 */}
      <div className="relative">
        {children || (
          <pre className="p-4 overflow-x-auto bg-(--bg-secondary) text-sm">
            <code className="font-mono text-(--text-primary)">{code}</code>
          </pre>
        )}

        {/* 복사 버튼 */}
        <CopyButton
          text={code}
          variant="overlay"
          size="sm"
          className={cn(
            'absolute top-2 right-2',
            'opacity-0 group-hover:opacity-100 transition-opacity',
          )}
        />
      </div>
    </div>
  );
});
