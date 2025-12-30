/**
 * @fileoverview Media Query Hooks
 * @environment client-only
 *
 * React hooks for responsive design and media query detection.
 */

import { useEffect, useState } from 'react';

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
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return mounted ? matches : false;
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
export function useIsMobile(breakpoint = 768): boolean {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
}
