/**
 * @fileoverview React hooks for responsive design and media query detection
 *
 * Provides hooks for detecting viewport sizes, device types, and CSS media queries.
 * Uses the native `window.matchMedia` API with proper cleanup and SSR safety.
 *
 * @remarks
 * - SSR-safe: Returns `false` during SSR, updates on hydration
 * - Reactive: Automatically updates when viewport/media changes
 * - Efficient: Uses native `matchMedia` with event listeners (no polling)
 * - Tailwind-compatible: Default breakpoints match Tailwind CSS
 *
 * @example
 * ```tsx
 * import { useMediaQuery, useIsMobile } from '@soundblue/shared-react';
 *
 * function ResponsiveLayout() {
 *   const isMobile = useIsMobile();
 *   const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 *
 *   return (
 *     <div className={isMobile ? 'stack' : 'grid'}>
 *       {!prefersReducedMotion && <AnimatedHero />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @module @soundblue/shared-react/hooks/useMediaQuery
 */

import { useEffect, useState } from 'react';

/**
 * Hook to detect if a CSS media query matches
 *
 * Uses the native `window.matchMedia` API to reactively track media query state.
 * Automatically updates when the match status changes (e.g., window resize,
 * system theme change, device orientation change).
 *
 * @remarks
 * - Returns `false` during SSR (no window object)
 * - Updates immediately on mount with the correct value
 * - Uses `addEventListener` (not deprecated `addListener`)
 * - Cleans up listeners on unmount or query change
 *
 * @param query - A valid CSS media query string
 *
 * @returns `true` if the media query matches, `false` otherwise
 *
 * @example
 * ```tsx
 * // Detect dark mode preference
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 *
 * // Detect reduced motion preference (for accessibility)
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 *
 * // Detect hover capability (touch vs mouse)
 * const canHover = useMediaQuery('(hover: hover)');
 *
 * // Detect print media
 * const isPrinting = useMediaQuery('print');
 *
 * // Custom breakpoint (Tailwind's lg = 1024px)
 * const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 *
 * // Combine with orientation
 * const isLandscapeMobile = useMediaQuery(
 *   '(max-width: 767px) and (orientation: landscape)'
 * );
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries
 */
export function useMediaQuery(query: string): boolean {
  // Start with false for SSR, update after mount to avoid hydration mismatch
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

  // Return false during SSR/initial render to match server output
  return mounted ? matches : false;
}

/**
 * Hook to detect if the viewport is mobile-sized
 *
 * A convenience wrapper around `useMediaQuery` that checks for viewport width
 * below a breakpoint. Uses `max-width: (breakpoint - 1)px` to match Tailwind's
 * mobile-first breakpoint system.
 *
 * @remarks
 * - Default breakpoint (768px) matches Tailwind's `md` breakpoint
 * - Returns `true` for 0-767px (mobile), `false` for 768px+ (tablet/desktop)
 * - For tablet detection, use `useMediaQuery('(min-width: 768px) and (max-width: 1023px)')`
 *
 * @param breakpoint - The width threshold in pixels (default: 768)
 *                    Viewport widths below this are considered "mobile"
 *
 * @returns `true` if viewport width is less than breakpoint, `false` otherwise
 *
 * @example
 * ```tsx
 * // Basic usage (mobile < 768px)
 * const isMobile = useIsMobile();
 *
 * // Custom breakpoint (mobile < 640px, matches Tailwind's sm)
 * const isSmallMobile = useIsMobile(640);
 *
 * // Larger mobile threshold (mobile < 1024px, matches Tailwind's lg)
 * const isMobileOrTablet = useIsMobile(1024);
 *
 * // Conditional rendering
 * function Navigation() {
 *   const isMobile = useIsMobile();
 *   return isMobile ? <HamburgerMenu /> : <DesktopNav />;
 * }
 *
 * // Conditional data fetching
 * function Gallery() {
 *   const isMobile = useIsMobile();
 *   const itemsPerPage = isMobile ? 10 : 50;
 *   // ...
 * }
 * ```
 *
 * @see https://tailwindcss.com/docs/responsive-design (for breakpoint reference)
 */
export function useIsMobile(breakpoint = 768): boolean {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
}
