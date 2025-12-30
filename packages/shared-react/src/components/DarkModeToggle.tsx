import { cn } from '@soundblue/ui/utils';
import { Moon, Sun } from 'lucide-react';
import { type CSSProperties, useEffect, useState } from 'react';

export interface DarkModeToggleProps {
  className?: string;
  style?: CSSProperties;
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
export function DarkModeToggle({ className = '', style }: DarkModeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));

    // Listen for class changes (triggered by DARK_MODE_TOGGLE_SCRIPT)
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  const showDark = mounted ? isDark : false;

  return (
    <button
      type="button"
      className={cn(
        'min-h-11 min-w-11 flex items-center justify-center rounded-lg',
        'text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer',
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
