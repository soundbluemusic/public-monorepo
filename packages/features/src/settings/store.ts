/**
 * @fileoverview Settings Store
 * @environment client-only
 *
 * Zustand store for managing user preferences with localStorage persistence.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Available theme options for the application.
 * Matches @soundblue/core Theme type for compatibility.
 */
type Theme = 'light' | 'dark' | 'system';

/**
 * Settings store state and actions interface.
 */
interface SettingsState {
  /** Current theme setting. @default 'system' */
  theme: Theme;
  /** Whether the sidebar is in collapsed (icon-only) mode on desktop. @default false */
  sidebarCollapsed: boolean;
  /** Whether the mobile sidebar overlay is open. @default false */
  sidebarOpen: boolean;
  /** Sets the theme and immediately applies it to the DOM. */
  setTheme: (theme: Theme) => void;
  /** Toggles between light and dark themes. */
  toggleTheme: () => void;
  /** Sets the sidebar collapsed state (desktop). */
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** Toggles the sidebar between collapsed and expanded states (desktop). */
  toggleSidebarCollapse: () => void;
  /** Sets the mobile sidebar open state. */
  setSidebarOpen: (open: boolean) => void;
  /** Toggles the mobile sidebar overlay. */
  toggleSidebarOpen: () => void;
}

/**
 * Global settings store for managing user preferences.
 *
 * @example
 * ```tsx
 * import { useSettingsStore } from '@soundblue/features/settings';
 *
 * function Settings() {
 *   const { theme, setTheme, sidebarCollapsed, toggleSidebar } = useSettingsStore();
 *   return (
 *     <div>
 *       <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
 *         <option value="light">Light</option>
 *         <option value="dark">Dark</option>
 *         <option value="system">System</option>
 *       </select>
 *     </div>
 *   );
 * }
 * ```
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarCollapsed: false,
      sidebarOpen: false,

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      toggleTheme: () => {
        const current = get().theme;
        const next = current === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        applyTheme(next);
      },

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebarOpen: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        // sidebarOpen is not persisted (mobile overlay should start closed)
      }),
      onRehydrateStorage: () => (_state) => {
        // Theme is already applied by DARK_MODE_INIT_SCRIPT in <head>
        // Don't re-apply here to prevent flickering
      },
    },
  ),
);

/**
 * Applies the given theme to the DOM.
 * @internal
 */
function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  root.classList.add('theme-transition');

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }

  setTimeout(() => {
    root.classList.remove('theme-transition');
  }, 300);
}

export type { Theme, SettingsState };
