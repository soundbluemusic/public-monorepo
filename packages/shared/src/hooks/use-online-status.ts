import { createSignal, onMount, onCleanup, type Accessor } from "solid-js";

export interface UseOnlineStatusReturn {
  isOnline: Accessor<boolean>;
  wasOffline: Accessor<boolean>;
}

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

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    onCleanup(() => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    });
  });

  return { isOnline, wasOffline };
}
