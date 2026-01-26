/**
 * @fileoverview 공유 버튼 컴포넌트
 * Web Share API 지원 시 네이티브 공유, 미지원 시 링크 복사
 * @environment client-only
 */

import { Check, Facebook, Link as LinkIcon, Share2, Twitter } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';

export interface ShareButtonProps {
  /** 공유할 URL */
  url: string;
  /** 공유 제목 */
  title: string;
  /** 공유 설명 (선택) */
  description?: string;
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 버튼 변형 */
  variant?: 'default' | 'outline' | 'ghost';
  /** 아이콘만 표시 */
  iconOnly?: boolean;
  /** 텍스트 라벨 (기본: 'Share') */
  label?: string;
  /** 복사 성공 메시지 */
  copiedMessage?: string;
  /** 추가 클래스 */
  className?: string;
  /** 드롭다운 메뉴 활성화 (소셜 공유 옵션) */
  showDropdown?: boolean;
  /** 공유 성공 콜백 */
  onShare?: () => void;
}

const sizeStyles = {
  sm: 'h-8 px-2 text-xs gap-1.5',
  md: 'h-10 px-3 text-sm gap-2',
  lg: 'h-12 px-4 text-base gap-2.5',
};

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 20,
};

const variantStyles = {
  default: 'bg-(--accent-primary) text-white hover:bg-(--accent-primary)/90',
  outline: 'border border-(--border-primary) text-(--text-secondary) hover:bg-(--bg-tertiary)',
  ghost: 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
};

/**
 * 공유 버튼 컴포넌트
 *
 * @example
 * ```tsx
 * <ShareButton
 *   url="https://example.com/article/123"
 *   title="흥미로운 글"
 *   description="이 글을 확인해보세요"
 * />
 * ```
 */
export const ShareButton = memo(function ShareButton({
  url,
  title,
  description,
  size = 'md',
  variant = 'outline',
  iconOnly = false,
  label = 'Share',
  copiedMessage = 'Link copied!',
  className,
  showDropdown = false,
  onShare,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Web Share API 지원 확인
  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onShare?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 폴백: 숨겨진 input으로 복사
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      onShare?.();
      setTimeout(() => setCopied(false), 2000);
    }
    setIsOpen(false);
  }, [url, onShare]);

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title,
        text: description,
        url,
      });
      onShare?.();
    } catch (err) {
      // 사용자가 취소한 경우 무시
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
    setIsOpen(false);
  }, [title, description, url, onShare]);

  const shareToTwitter = useCallback(() => {
    const text = encodeURIComponent(`${title}${description ? ` - ${description}` : ''}`);
    const shareUrl = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank');
    onShare?.();
    setIsOpen(false);
  }, [title, description, url, onShare]);

  const shareToFacebook = useCallback(() => {
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
    onShare?.();
    setIsOpen(false);
  }, [url, onShare]);

  const handleClick = useCallback(() => {
    if (showDropdown) {
      setIsOpen((prev) => !prev);
    } else if (canNativeShare) {
      handleNativeShare();
    } else {
      copyToClipboard();
    }
  }, [showDropdown, canNativeShare, handleNativeShare, copyToClipboard]);

  const iconSize = iconSizes[size];

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all',
          'focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:ring-offset-2',
          sizeStyles[size],
          variantStyles[variant],
          iconOnly && 'px-0 aspect-square',
          className,
        )}
        aria-label={iconOnly ? label : undefined}
        aria-expanded={showDropdown ? isOpen : undefined}
        aria-haspopup={showDropdown ? 'menu' : undefined}
      >
        {copied ? (
          <Check size={iconSize} className="text-green-500" aria-hidden="true" />
        ) : (
          <Share2 size={iconSize} aria-hidden="true" />
        )}
        {!iconOnly && <span>{copied ? copiedMessage : label}</span>}
      </button>

      {/* 드롭다운 메뉴 */}
      {showDropdown && isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute right-0 mt-2 w-48 py-1 rounded-lg shadow-lg z-50',
            'bg-(--bg-elevated) border border-(--border-primary)',
            'animate-in fade-in slide-in-from-top-2 duration-150',
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-(--text-primary) hover:bg-(--bg-tertiary) transition-colors"
              role="menuitem"
            >
              <Share2 size={16} aria-hidden="true" />
              <span>Share...</span>
            </button>
          )}
          <button
            type="button"
            onClick={copyToClipboard}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-(--text-primary) hover:bg-(--bg-tertiary) transition-colors"
            role="menuitem"
          >
            <LinkIcon size={16} aria-hidden="true" />
            <span>Copy link</span>
          </button>
          <div className="border-t border-(--border-primary) my-1" />
          <button
            type="button"
            onClick={shareToTwitter}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-(--text-primary) hover:bg-(--bg-tertiary) transition-colors"
            role="menuitem"
          >
            <Twitter size={16} aria-hidden="true" />
            <span>Share on X</span>
          </button>
          <button
            type="button"
            onClick={shareToFacebook}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-(--text-primary) hover:bg-(--bg-tertiary) transition-colors"
            role="menuitem"
          >
            <Facebook size={16} aria-hidden="true" />
            <span>Share on Facebook</span>
          </button>
        </div>
      )}
    </div>
  );
});
