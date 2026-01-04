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
      onRehydrateStorage: () => (state) => {
        // Rehydration 후 테마 상태와 DOM 동기화
        // DARK_MODE_INIT_SCRIPT가 이미 적용했지만, React hydration 후
        // 불일치가 발생할 수 있으므로 명시적으로 동기화
        if (state && typeof window !== 'undefined') {
          const root = document.documentElement;
          const currentTheme = state.theme;

          if (currentTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.toggle('dark', prefersDark);
          } else {
            root.classList.toggle('dark', currentTheme === 'dark');
          }
        }
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

// ========================================
// Selector Hooks (Performance Optimization)
// ========================================
// 각 selector hook은 해당 상태만 구독하여 불필요한 리렌더 방지

/** 현재 테마만 구독 */
export const useTheme = () => useSettingsStore((s) => s.theme);

/** 테마 액션들만 구독 */
export const useThemeActions = () =>
  useSettingsStore((s) => ({
    setTheme: s.setTheme,
    toggleTheme: s.toggleTheme,
  }));

/** 사이드바 접힘 상태만 구독 (데스크톱) */
export const useSidebarCollapsed = () => useSettingsStore((s) => s.sidebarCollapsed);

/** 사이드바 열림 상태만 구독 (모바일) */
export const useSidebarOpen = () => useSettingsStore((s) => s.sidebarOpen);

/** 사이드바 액션들만 구독 */
export const useSidebarActions = () =>
  useSettingsStore((s) => ({
    setSidebarCollapsed: s.setSidebarCollapsed,
    toggleSidebarCollapse: s.toggleSidebarCollapse,
    setSidebarOpen: s.setSidebarOpen,
    toggleSidebarOpen: s.toggleSidebarOpen,
  }));
