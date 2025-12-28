import { type ComponentPropsWithoutRef, useCallback, useState } from 'react';

export interface ShareData {
  /** The title to share */
  title?: string;
  /** The text/description to share */
  text?: string;
  /** The URL to share */
  url?: string;
}

export interface ShareButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onClick'> {
  /** Data to share */
  shareData: ShareData;
  /** Callback when share is successful */
  onShareSuccess?: () => void;
  /** Callback when share fails or is cancelled */
  onShareError?: (error: Error) => void;
  /** Fallback behavior when Web Share API is not supported */
  fallback?: 'copy' | 'none';
  /** Custom icon element */
  icon?: React.ReactNode;
}

/**
 * Check if Web Share API is supported
 */
export function supportsWebShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Check if sharing specific data is supported
 */
export function canShare(data: ShareData): boolean {
  if (!supportsWebShare()) return false;
  if ('canShare' in navigator) {
    return navigator.canShare(data);
  }
  return true;
}

/**
 * Share data using the Web Share API
 */
export async function share(data: ShareData): Promise<void> {
  if (!supportsWebShare()) {
    throw new Error('Web Share API is not supported');
  }
  await navigator.share(data);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

/**
 * Default share icon (SVG)
 */
function DefaultShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/**
 * Share button component that uses Web Share API with clipboard fallback
 *
 * @example
 * ```tsx
 * <ShareButton
 *   shareData={{
 *     title: 'Check this out!',
 *     text: 'Amazing content',
 *     url: 'https://example.com'
 *   }}
 *   fallback="copy"
 * >
 *   Share
 * </ShareButton>
 * ```
 */
export function ShareButton({
  shareData,
  onShareSuccess,
  onShareError,
  fallback = 'copy',
  icon,
  children,
  className = '',
  ...props
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      if (supportsWebShare() && canShare(shareData)) {
        await share(shareData);
        onShareSuccess?.();
      } else if (fallback === 'copy' && shareData.url) {
        await copyToClipboard(shareData.url);
        setCopied(true);
        onShareSuccess?.();
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error: unknown) {
      // User cancelled sharing - not an error
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      onShareError?.(error instanceof Error ? error : new Error('Share failed'));
    }
  }, [shareData, fallback, onShareSuccess, onShareError]);

  // Don't render if no fallback and Web Share not supported
  if (!supportsWebShare() && fallback === 'none') {
    return null;
  }

  const showCopyFeedback = !supportsWebShare() && fallback === 'copy';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn-ghost ${className}`}
      aria-label={copied ? '복사됨 / Copied' : '공유하기 / Share'}
      {...props}
    >
      {icon || <DefaultShareIcon />}
      {children && <span>{copied ? '복사됨!' : children}</span>}
      {!children && showCopyFeedback && copied && <span className="text-sm">복사됨!</span>}
    </button>
  );
}

/**
 * Hook for using Web Share API
 *
 * @example
 * ```tsx
 * const { share, canShare, isSupported } = useWebShare();
 *
 * const handleShare = async () => {
 *   if (canShare({ url: window.location.href })) {
 *     await share({ title: 'My Page', url: window.location.href });
 *   }
 * };
 * ```
 */
export function useWebShare() {
  const isSupported = supportsWebShare();

  const shareContent = useCallback(
    async (data: ShareData) => {
      if (!isSupported) {
        throw new Error('Web Share API is not supported');
      }
      await navigator.share(data);
    },
    [isSupported],
  );

  const canShareContent = useCallback((data: ShareData) => {
    return canShare(data);
  }, []);

  return {
    share: shareContent,
    canShare: canShareContent,
    isSupported,
    copyToClipboard,
  };
}
