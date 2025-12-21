import * as Toggle from '@radix-ui/react-toggle';
import { Moon, Sun } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';

export interface DarkModeToggleProps {
  isDark?: boolean;
  onToggle?: () => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Dark mode toggle button using Radix UI Toggle
 * Supports both controlled (isDark/onToggle) and uncontrolled (store-based) modes
 */
export function DarkModeToggle({
  isDark: controlledIsDark,
  onToggle,
  className = '',
  style,
}: DarkModeToggleProps) {
  const { theme, toggleTheme } = useSettingsStore();
  const isDark = controlledIsDark ?? theme === 'dark';
  const handleToggle = onToggle ?? toggleTheme;

  return (
    <Toggle.Root
      pressed={isDark}
      onPressedChange={handleToggle}
      className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] active:scale-95 ${className}`}
      style={{ color: 'var(--text-secondary)', ...style }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
    </Toggle.Root>
  );
}
