import { Moon, Sun } from 'lucide-react';
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { cn } from '../utils/cn';

export interface DarkModeToggleProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * Dark mode toggle button
 * Uses useRef + native addEventListener for reliable event handling in SSG
 */
export function DarkModeToggle({ className = '', style }: DarkModeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    // Toggle dark class directly
    const html = document.documentElement;
    const willBeDark = !html.classList.contains('dark');

    if (willBeDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Update store
    useSettingsStore.getState().setTheme(willBeDark ? 'dark' : 'light');
    setIsDark(willBeDark);
  }, []);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));

    // Attach native click listener directly to button
    const button = buttonRef.current;
    if (button) {
      button.addEventListener('click', handleClick);
    }

    // Listen for class changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      if (button) {
        button.removeEventListener('click', handleClick);
      }
      observer.disconnect();
    };
  }, [handleClick]);

  const showDark = mounted ? isDark : false;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={cn(
        'min-h-11 min-w-11 flex items-center justify-center rounded-lg',
        'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer',
        className,
      )}
      style={style}
      aria-label={showDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={showDark ? 'Light mode' : 'Dark mode'}
    >
      {showDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
    </button>
  );
}
