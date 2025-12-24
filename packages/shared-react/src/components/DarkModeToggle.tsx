import { Moon, Sun } from 'lucide-react';
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';

export interface DarkModeToggleProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * Dark mode toggle button
 * Uses useRef + native addEventListener for reliable event handling in SSG
 */
export function DarkModeToggle({ className = '', style }: DarkModeToggleProps) {
  // Log on every render to check if component is being hydrated
  if (typeof window !== 'undefined') {
    console.log('[DarkModeToggle] Component rendering on client!');
  }

  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    console.log('[DarkModeToggle] handleClick called via native listener!');

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

    console.log('[DarkModeToggle] Toggled to:', willBeDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));

    // Attach native click listener directly to button
    const button = buttonRef.current;
    if (button) {
      console.log('[DarkModeToggle] Attaching native click listener');
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
      className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] active:scale-95 min-h-11 min-w-11 flex items-center justify-center ${className}`}
      style={{ color: 'var(--text-secondary)', ...style }}
      aria-label={showDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={showDark ? 'Light mode' : 'Dark mode'}
    >
      {showDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
    </button>
  );
}
