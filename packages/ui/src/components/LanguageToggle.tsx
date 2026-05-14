/**
 * @fileoverview Language Toggle Component
 * @environment universal
 */

import { useCallback, useRef } from 'react';

export type Language = 'ko' | 'en';

export interface LanguageToggleProps {
  locale: Language;
  /** Current path without locale prefix for building the toggle href */
  currentPath?: string;
}

/**
 * 대상 URL을 prefetch (브라우저 캐시에 미리 로드 → 깜빡임 감소)
 * - 이미 추가된 경우 noop
 * - 서버 사이드에서는 noop
 */
function ensurePrefetchLink(href: string): void {
  if (typeof document === 'undefined') return;
  const existing = document.head.querySelector<HTMLLinkElement>(
    `link[rel="prefetch"][href="${CSS.escape(href)}"]`,
  );
  if (existing) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  link.as = 'document';
  document.head.appendChild(link);
}

/**
 * Language toggle using anchor tag for SSR compatibility
 * Works without JavaScript hydration. 호버/포커스 시 대상 페이지를 prefetch
 * 하여 언어 전환 시 깜빡임을 줄입니다.
 */
export function LanguageToggle({ locale, currentPath = '/' }: LanguageToggleProps) {
  const targetLocale = locale === 'en' ? 'ko' : 'en';
  const href = targetLocale === 'en' ? currentPath : `/ko${currentPath === '/' ? '' : currentPath}`;
  const prefetchedRef = useRef(false);

  const handlePrefetch = useCallback(() => {
    if (prefetchedRef.current) return;
    prefetchedRef.current = true;
    ensurePrefetchLink(href);
  }, [href]);

  // Use visible text in aria-label to satisfy WCAG 2.5.3 Label in Name
  const displayText = locale === 'en' ? 'EN' : 'KR';
  const ariaLabel =
    locale === 'en' ? `${displayText} - Switch to Korean` : `${displayText} - Switch to English`;

  return (
    <a
      href={href}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      onTouchStart={handlePrefetch}
      className="min-h-11 min-w-11 flex items-center justify-center rounded-lg text-sm font-medium text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors no-underline"
      aria-label={ariaLabel}
      title={locale === 'en' ? '한국어로 전환' : 'Switch to English'}
    >
      {displayText}
    </a>
  );
}
