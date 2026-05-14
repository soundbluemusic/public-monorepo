/**
 * @fileoverview Offline Indicator Component
 * @environment client-only
 *
 * Shows offline banner and reconnection toast for PWA apps.
 */

import { useEffect, useState } from 'react';
import { useOnlineStatus } from './useOnlineStatus';

export type OfflineIndicatorLocale = 'en' | 'ko';

interface OfflineMessages {
  offline: string;
  online: string;
}

const OFFLINE_MESSAGES: Record<OfflineIndicatorLocale, OfflineMessages> = {
  en: { offline: 'You are offline', online: 'Back online' },
  ko: { offline: '오프라인 상태입니다', online: '다시 연결되었습니다' },
};

export interface OfflineIndicatorProps {
  /**
   * 표시 언어. 미지정 시 'en'.
   * 한국어 페이지(`/ko/*`)에서는 'ko'를 전달하세요.
   * @default 'en'
   */
  locale?: OfflineIndicatorLocale;
}

/**
 * Offline banner and reconnection toast component
 *
 * Displays:
 * - Red banner at top when offline
 * - Green toast at bottom when reconnected (auto-dismisses after 3s)
 *
 * @example
 * ```tsx
 * import { OfflineIndicator } from '@soundblue/pwa/react';
 *
 * function App() {
 *   const { locale } = useI18n();
 *   return (
 *     <>
 *       <OfflineIndicator locale={locale} />
 *       <MainContent />
 *     </>
 *   );
 * }
 * ```
 */
export function OfflineIndicator({ locale = 'en' }: OfflineIndicatorProps = {}) {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const messages = OFFLINE_MESSAGES[locale];

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
    return; // Explicit return for noImplicitReturns
  }, [isOnline, wasOffline]);

  return (
    <>
      {/* Offline banner */}
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 h-10 bg-red-500 text-white text-sm font-medium"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-12.728-12.728m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
          {messages.offline}
        </div>
      )}

      {/* Reconnection toast */}
      {showReconnected && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium shadow-lg animate-[fadeInUp_0.3s_ease-out]"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {messages.online}
        </div>
      )}
    </>
  );
}
