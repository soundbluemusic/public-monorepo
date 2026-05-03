/**
 * @fileoverview Dark Mode Toggle Component
 * @environment client-only
 */
import { Moon, Sun } from 'lucide-react';
import { type CSSProperties, useCallback, useEffect, useState } from 'react';
import { cn } from '../utils/cn';

export type DarkModeToggleLocale = 'en' | 'ko';

interface DarkModeLabels {
  switchToLight: string;
  switchToDark: string;
  lightMode: string;
  darkMode: string;
}

const DARK_MODE_LABELS: Record<DarkModeToggleLocale, DarkModeLabels> = {
  en: {
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
  },
  ko: {
    switchToLight: '라이트 모드로 전환',
    switchToDark: '다크 모드로 전환',
    lightMode: '라이트 모드',
    darkMode: '다크 모드',
  },
};

export interface DarkModeToggleProps {
  className?: string;
  style?: CSSProperties;
  /**
   * 버튼 라벨 언어. 기본값 'en'.
   * @default 'en'
   */
  locale?: DarkModeToggleLocale;
}

/**
 * Dark mode toggle button
 *
 * Click handling is done by DARK_MODE_TOGGLE_SCRIPT (inlined in root.tsx <body>)
 * which uses event delegation to intercept clicks before React.
 *
 * This component only:
 * 1. Renders the button with correct aria-label
 * 2. Observes classList changes to update icon display
 *
 * The script handles: classList toggle, localStorage update, innerHTML replacement
 */
export function DarkModeToggle({ className = '', style, locale = 'en' }: DarkModeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const updateDarkState = useCallback(() => {
    const next = document.documentElement.classList.contains('dark');
    // setState는 동일 값이면 리렌더링하지 않지만, 명시적으로 비교하여 의도 명확화
    setIsDark((prev) => (prev === next ? prev : next));
  }, []);

  useEffect(() => {
    setMounted(true);
    updateDarkState();

    // Listen for class changes (triggered by DARK_MODE_TOGGLE_SCRIPT)
    const observer = new MutationObserver(updateDarkState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
    };
  }, [updateDarkState]);

  const showDark = mounted ? isDark : false;
  const labels = DARK_MODE_LABELS[locale];

  return (
    <button
      type="button"
      className={cn(
        'min-h-11 min-w-11 flex items-center justify-center rounded-lg',
        'text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer',
        className,
      )}
      style={style}
      aria-label={showDark ? labels.switchToLight : labels.switchToDark}
      title={showDark ? labels.lightMode : labels.darkMode}
    >
      {showDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
    </button>
  );
}
