import { useEffect, useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import styles from '../styles/components.module.scss';

/**
 * Offline banner and reconnection toast component
 */
export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return (
    <>
      {/* Offline banner */}
      {!isOnline && (
        <div className={styles.offlineBanner}>
          <svg
            aria-hidden="true"
            className={styles.offlineIcon}
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
          You are offline
        </div>
      )}

      {/* Reconnection toast */}
      {showReconnected && (
        <div className={styles.reconnectedToast}>
          <svg
            aria-hidden="true"
            className={styles.offlineIcon}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Back online
        </div>
      )}
    </>
  );
}
