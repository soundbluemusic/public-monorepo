/**
 * @fileoverview 온라인/오프라인 상태 감지 훅
 *
 * 브라우저의 네트워크 연결 상태를 실시간으로 감지합니다.
 * `navigator.onLine` API와 `online`/`offline` 이벤트를 사용합니다.
 *
 * @example
 * ```tsx
 * import { useOnlineStatus } from '@soundblue/shared';
 *
 * function NetworkStatus() {
 *   const { isOnline, wasOffline } = useOnlineStatus();
 *
 *   return (
 *     <div>
 *       {!isOnline() && <p>현재 오프라인입니다</p>}
 *       {isOnline() && wasOffline() && <p>다시 온라인이 되었습니다!</p>}
 *     </div>
 *   );
 * }
 * ```
 */
import { type Accessor, createSignal, onCleanup, onMount } from 'solid-js';

/**
 * useOnlineStatus 훅 반환 타입
 * @property isOnline - 현재 온라인 상태 (true: 온라인, false: 오프라인)
 * @property wasOffline - 세션 중 오프라인이었던 적이 있는지 여부 (재연결 알림용)
 */
export interface UseOnlineStatusReturn {
  isOnline: Accessor<boolean>;
  wasOffline: Accessor<boolean>;
}

/**
 * 네트워크 연결 상태를 감지하는 훅
 *
 * @returns {UseOnlineStatusReturn} isOnline과 wasOffline 시그널
 *
 * @example
 * ```tsx
 * const { isOnline, wasOffline } = useOnlineStatus();
 *
 * // 오프라인일 때 UI 표시
 * <Show when={!isOnline()}>
 *   <OfflineBanner />
 * </Show>
 *
 * // 재연결 시 토스트 표시
 * <Show when={isOnline() && wasOffline()}>
 *   <ReconnectedToast />
 * </Show>
 * ```
 */
export function useOnlineStatus(): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = createSignal(true);
  const [wasOffline, setWasOffline] = createSignal(false);

  onMount(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    onCleanup(() => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    });
  });

  return { isOnline, wasOffline };
}
