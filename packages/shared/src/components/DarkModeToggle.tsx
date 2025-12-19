/**
 * @fileoverview 다크모드 토글 버튼 컴포넌트
 *
 * 달/해 아이콘으로 다크모드를 토글하는 버튼입니다.
 *
 * @example
 * ```tsx
 * import { DarkModeToggle } from '@soundblue/shared';
 *
 * // 기본 사용
 * <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
 *
 * // 커스텀 스타일
 * <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} class="my-class" />
 * ```
 */
import type { Accessor, JSX } from 'solid-js';

export interface DarkModeToggleProps {
  /** 현재 다크모드 상태 */
  darkMode: Accessor<boolean>;
  /** 토글 핸들러 */
  onToggle: () => void;
  /** 추가 CSS 클래스 */
  class?: string;
  /** 추가 스타일 */
  style?: JSX.CSSProperties;
}

/**
 * 다크모드 토글 버튼
 *
 * @example
 * ```tsx
 * const { darkMode, toggleDarkMode } = useDarkMode('my-app');
 * <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
 * ```
 */
export function DarkModeToggle(props: DarkModeToggleProps) {
  // 안전하게 darkMode 값 가져오기 (함수가 아닐 경우 대비)
  const isDark = () => (typeof props.darkMode === 'function' ? props.darkMode() : false);

  return (
    <button
      type="button"
      onClick={props.onToggle}
      class={`p-2 rounded-lg transition-colors cursor-pointer hover:bg-(--bg-tertiary) ${props.class || ''}`}
      style={{ color: 'var(--text-secondary)', ...props.style }}
      aria-label={isDark() ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark() ? 'Light mode' : 'Dark mode'}
    >
      {isDark() ? (
        // Sun icon (현재 다크 모드 → 라이트로 전환)
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        // Moon icon (현재 라이트 모드 → 다크로 전환)
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
