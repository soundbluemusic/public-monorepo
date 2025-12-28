import { useCallback } from 'react';
import { type NavigateOptions, useNavigate } from 'react-router';

/**
 * Check if View Transitions API is supported
 */
export function supportsViewTransitions(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
}

/**
 * Hook for navigating with View Transitions API
 *
 * @example
 * ```tsx
 * const { navigateWithTransition } = useViewTransition();
 * navigateWithTransition('/entry/hello');
 * ```
 */
export function useViewTransition() {
  const navigate = useNavigate();

  const navigateWithTransition = useCallback(
    (to: string, options?: NavigateOptions) => {
      if (!supportsViewTransitions()) {
        navigate(to, options);
        return;
      }

      // Use View Transitions API for smooth page transitions
      document.startViewTransition(() => {
        navigate(to, options);
      });
    },
    [navigate],
  );

  return { navigateWithTransition, supportsViewTransitions: supportsViewTransitions() };
}

/**
 * Trigger a view transition for any DOM update
 *
 * @example
 * ```tsx
 * startViewTransition(() => setTheme('dark'));
 * ```
 */
export function startViewTransition(callback: () => void): void {
  if (!supportsViewTransitions()) {
    callback();
    return;
  }

  document.startViewTransition(callback);
}
