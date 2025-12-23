import { Moon, Sun } from 'lucide-react';
import { type CSSProperties, useEffect, useState } from 'react';

export interface DarkModeToggleProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * Dark mode toggle button
 * Uses localStorage directly to avoid SSG hydration issues
 */
export function DarkModeToggle({ className = '', style }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check current theme from document
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const handleToggle = () => {
    console.log('[DarkModeToggle] Button clicked');
    // Always read from DOM to ensure correct state
    const currentIsDark = document.documentElement.classList.contains('dark');
    console.log('[DarkModeToggle] Current is dark:', currentIsDark);
    const newIsDark = !currentIsDark;
    console.log('[DarkModeToggle] New is dark:', newIsDark);

    setIsDark(newIsDark);

    // Apply theme to DOM
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      console.log('[DarkModeToggle] Added dark class');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('[DarkModeToggle] Removed dark class');
    }

    // Verify the change
    const verified = document.documentElement.classList.contains('dark');
    console.log('[DarkModeToggle] Verified dark class:', verified);

    // Persist to localStorage
    try {
      const stored = localStorage.getItem('settings-storage');
      const data = stored ? JSON.parse(stored) : { state: {} };
      data.state = { ...data.state, theme: newIsDark ? 'dark' : 'light' };
      localStorage.setItem('settings-storage', JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  };

  // Show moon icon as default before hydration
  const showDark = mounted ? isDark : false;

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] active:scale-95 min-h-11 min-w-11 flex items-center justify-center ${className}`}
      style={{ color: 'var(--text-secondary)', ...style }}
      aria-label={showDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={showDark ? 'Light mode' : 'Dark mode'}
    >
      {showDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
    </button>
  );
}
