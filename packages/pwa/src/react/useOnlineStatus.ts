/**
 * @fileoverview React hook for detecting network connectivity status
 * @environment client-only
 *
 * Provides a hook for tracking online/offline status using the Navigator API.
 * Useful for PWAs and apps that need to handle offline scenarios gracefully.
 *
 * @remarks
 * - Uses the native `navigator.onLine` API
 * - Listens to `online` and `offline` window events
 * - Tracks if user was ever offline during the session (for sync indicators)
 * - SSR-safe: Assumes online during SSR
 */

import { useEffect, useState } from 'react';

/**
 * Return type for the useOnlineStatus hook
 */
export interface UseOnlineStatusReturn {
  /**
   * Current network status
   *
   * - `true`: Browser reports being online (network available)
   * - `false`: Browser reports being offline (no network)
   *
   * @remarks
   * Note that `isOnline: true` doesn't guarantee internet access -
   * it only means the browser has a network connection. The actual
   * server may still be unreachable.
   */
  isOnline: boolean;

  /**
   * Sticky flag indicating if user went offline during this session
   *
   * Once set to `true`, stays `true` for the component's lifetime.
   * Useful for showing sync indicators after reconnecting.
   *
   * @remarks
   * - Starts as `false`
   * - Set to `true` when first offline event occurs
   * - Never resets to `false` (intentional - use for "needs sync" UI)
   * - Reset by remounting the component
   */
  wasOffline: boolean;
}

/**
 * Hook to detect and track network connectivity status
 *
 * Uses the Navigator Online API to reactively track network status.
 * Also tracks if the user was ever offline during the current session,
 * useful for showing "syncing" or "reconnected" indicators.
 *
 * @remarks
 * - Uses `navigator.onLine` for initial state
 * - Listens to `online` and `offline` window events
 * - `wasOffline` is sticky: once true, stays true until remount
 * - SSR-safe: Assumes `isOnline: true`, `wasOffline: false` on server
 *
 * @returns Object with `isOnline` and `wasOffline` boolean flags
 *
 * @example
 * ```tsx
 * import { useOnlineStatus } from '@soundblue/pwa/react';
 *
 * function App() {
 *   const { isOnline } = useOnlineStatus();
 *
 *   return (
 *     <>
 *       {!isOnline && (
 *         <div className="bg-yellow-100 p-2 text-center">
 *           You are offline. Some features may be unavailable.
 *         </div>
 *       )}
 *       <MainContent />
 *     </>
 *   );
 * }
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event
 */
export function useOnlineStatus(): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Set initial state from navigator
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      // Mark that we've been offline (sticky flag)
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}
