import { StartClient } from '@tanstack/react-start/client';
import { hydrateRoot } from 'react-dom/client';
import { createRouter } from './router';

const router = createRouter();

// bfcache(Back-Forward Cache) 복원 시 페이지 reload
// bfcache에서 복원되면 React 이벤트 바인딩이 죽은 상태이므로 reload 필요
if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });
}

// Service Worker 등록 (PWA)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 새 버전 사용 가능 알림 (선택적)
                console.log('[PWA] New content available, refresh to update.');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  });
}

// @ts-expect-error - TanStack Start types are not fully compatible
hydrateRoot(document, <StartClient router={router} />);
