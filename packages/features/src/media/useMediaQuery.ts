/**
 * @fileoverview Media Query Hooks
 * @environment universal
 *
 * React hooks for responsive design and media query detection.
 *
 * SSR 환경에서 안전하며, 클라이언트 첫 렌더링부터 실제 매칭 결과를 반환합니다.
 * `useSyncExternalStore` 기반으로 hydration mismatch를 자동 처리합니다.
 */

import { useCallback, useSyncExternalStore } from 'react';

/**
 * matchMedia 객체 캐싱 — query별로 1번만 생성
 */
const mediaQueryCache = new Map<string, MediaQueryList>();

function getMediaQueryList(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }
  let mql = mediaQueryCache.get(query);
  if (!mql) {
    mql = window.matchMedia(query);
    mediaQueryCache.set(query, mql);
  }
  return mql;
}

/** SSR 스냅샷 (모든 query에 대해 동일) — 참조 동일성 유지 */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Hook to detect if a CSS media query matches
 *
 * @param query - A valid CSS media query string
 * @returns `true` if the media query matches, `false` otherwise
 *
 * @example
 * ```tsx
 * // Detect dark mode preference
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 *
 * // Detect reduced motion preference
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 *
 * // Custom breakpoint
 * const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 * ```
 */
export function useMediaQuery(query: string): boolean {
  // useCallback으로 메모이즈하여 query가 동일하면 동일 함수 참조 유지
  // → useSyncExternalStore가 매 렌더마다 unsubscribe/resubscribe하지 않음
  const subscribe = useCallback(
    (callback: () => void): (() => void) => {
      const mql = getMediaQueryList(query);
      if (!mql) return () => {};
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    [query],
  );

  const getSnapshot = useCallback((): boolean => {
    const mql = getMediaQueryList(query);
    return mql ? mql.matches : false;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Hook to detect if the viewport is mobile-sized
 *
 * @param breakpoint - The width threshold in pixels (default: 768)
 * @returns `true` if viewport width is less than breakpoint
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * const isSmallMobile = useIsMobile(640);
 * ```
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
}
