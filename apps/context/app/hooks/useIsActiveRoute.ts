import { stripLocaleFromPath } from '@soundblue/i18n';
import { useRouterState } from '@tanstack/react-router';
import { useCallback } from 'react';

/**
 * Route matching mode for active link detection
 * - 'exact': Only matches if path is exactly equal
 * - 'prefix': Matches if current path starts with the given path
 */
type MatchMode = 'exact' | 'prefix';

/**
 * Hook to check if a route is currently active
 * Eliminates duplicate isActive logic across navigation components
 *
 * @example
 * const { isActive, isActiveExact } = useIsActiveRoute();
 *
 * // Exact match (default for most nav items)
 * isActive('/browse') // true only on /browse
 *
 * // Prefix match (for nested routes)
 * isActive('/browse', 'prefix') // true on /browse, /browse/123, etc.
 *
 * // Special handling for home route
 * isActiveExact('/') // true only on exactly /
 */
export function useIsActiveRoute() {
  const routerState = useRouterState();
  const currentPath = stripLocaleFromPath(routerState.location.pathname);

  /**
   * Check if the given path is active
   * @param basePath - The path to check against
   * @param mode - 'exact' for exact match, 'prefix' for startsWith match
   */
  const isActive = useCallback(
    (basePath: string, mode: MatchMode = 'exact'): boolean => {
      if (mode === 'exact') {
        return currentPath === basePath;
      }
      // prefix mode
      if (basePath === '/') {
        return currentPath === '/';
      }
      return currentPath.startsWith(basePath);
    },
    [currentPath],
  );

  /**
   * Convenience method for exact matching
   */
  const isActiveExact = useCallback(
    (basePath: string): boolean => isActive(basePath, 'exact'),
    [isActive],
  );

  /**
   * Convenience method for prefix matching
   */
  const isActivePrefix = useCallback(
    (basePath: string): boolean => isActive(basePath, 'prefix'),
    [isActive],
  );

  return {
    /** Current path without locale prefix */
    currentPath,
    /** Check if path is active (exact by default) */
    isActive,
    /** Exact match only */
    isActiveExact,
    /** Prefix match (for nested routes) */
    isActivePrefix,
  };
}
