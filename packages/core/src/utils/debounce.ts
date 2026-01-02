/**
 * Debounce Utility
 *
 * 함수 호출을 지정된 시간만큼 지연시킵니다.
 * 연속 호출 시 마지막 호출만 실행됩니다.
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching:', query);
 * }, 300);
 *
 * debouncedSearch('h');
 * debouncedSearch('he');
 * debouncedSearch('hello'); // 300ms 후 'hello'만 실행
 * ```
 */

/**
 * Creates a debounced version of a function
 *
 * @typeParam Args - Tuple type of function arguments
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Creates a debounced function with cancel capability
 *
 * @typeParam Args - Tuple type of function arguments
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Object with debounced call method and cancel method
 */
export function debounceWithCancel<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): {
  call: (...args: Args) => void;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return {
    call: (...args: Args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn(...args);
        timeoutId = null;
      }, delay);
    },
    cancel: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
  };
}
