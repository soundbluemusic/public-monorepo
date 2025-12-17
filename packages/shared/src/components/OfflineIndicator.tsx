import { Show, createSignal, createEffect } from "solid-js";
import { useOnlineStatus } from "../hooks/use-online-status";

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [showReconnected, setShowReconnected] = createSignal(false);

  createEffect(() => {
    if (isOnline() && wasOffline()) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <>
      {/* 오프라인 배너 */}
      <Show when={!isOnline()}>
        <div class="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-amber-950 text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-12.728-12.728m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          오프라인 상태입니다
        </div>
      </Show>

      {/* 온라인 복귀 토스트 */}
      <Show when={showReconnected()}>
        <div class="fixed top-4 right-4 z-[9999] bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          다시 온라인 상태입니다
        </div>
      </Show>
    </>
  );
}
