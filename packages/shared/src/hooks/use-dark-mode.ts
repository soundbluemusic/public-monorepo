/**
 * @fileoverview 다크모드 관리 훅
 *
 * localStorage와 시스템 설정을 기반으로 다크모드를 관리합니다.
 *
 * @example
 * ```tsx
 * import { useDarkMode } from '@soundblue/shared';
 *
 * function App() {
 *   const { darkMode, toggleDarkMode } = useDarkMode('my-app-theme');
 *
 *   return (
 *     <button onClick={toggleDarkMode}>
 *       {darkMode() ? '라이트 모드' : '다크 모드'}
 *     </button>
 *   );
 * }
 * ```
 */
import { type Accessor, createSignal, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';

export interface UseDarkModeReturn {
  /** 현재 다크모드 상태 */
  darkMode: Accessor<boolean>;
  /** 다크모드 상태 직접 설정 */
  setDarkMode: (value: boolean) => void;
  /** 다크모드 토글 */
  toggleDarkMode: () => void;
}

/**
 * 다크모드 관리 훅
 *
 * @param storageKey - localStorage에 저장할 키 (기본값: 'dark-mode')
 * @returns 다크모드 상태와 제어 함수들
 *
 * @example
 * ```tsx
 * const { darkMode, toggleDarkMode } = useDarkMode('context-dark-mode');
 * ```
 */
export function useDarkMode(storageKey = 'dark-mode'): UseDarkModeReturn {
  const [darkMode, setDarkModeSignal] = createSignal(false);

  const applyDarkMode = (isDark: boolean) => {
    if (isServer) return;
    document.documentElement.classList.toggle('dark', isDark);
  };

  const setDarkMode = (value: boolean) => {
    if (isServer) return;
    setDarkModeSignal(value);
    applyDarkMode(value);
    localStorage.setItem(storageKey, String(value));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode());
  };

  onMount(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      const isDark = stored === 'true';
      setDarkModeSignal(isDark);
      applyDarkMode(isDark);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkModeSignal(prefersDark);
      applyDarkMode(prefersDark);
    }
  });

  return {
    darkMode,
    setDarkMode,
    toggleDarkMode,
  };
}
