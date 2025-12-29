/**
 * Throttle Utility
 *
 * 함수 호출을 지정된 시간 간격으로 제한합니다.
 * 연속 호출 시 일정 간격으로만 실행됩니다.
 *
 * @example
 * ```ts
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll position:', window.scrollY);
 * }, 100);
 *
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */

export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Throttle with trailing call
 *
 * 마지막 호출도 실행되도록 보장합니다.
 */
export function throttleWithTrailing<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    lastArgs = args;

    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(
        () => {
          lastCall = Date.now();
          if (lastArgs) {
            fn(...(lastArgs as Parameters<T>));
          }
          timeoutId = null;
        },
        limit - (now - lastCall),
      );
    }
  };
}
