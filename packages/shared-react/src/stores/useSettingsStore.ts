import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Available theme options for the application.
 *
 * - `'light'`: Forces light mode regardless of system preference
 * - `'dark'`: Forces dark mode regardless of system preference
 * - `'system'`: Follows the user's operating system preference (default)
 *
 * @example
 * ```ts
 * const { setTheme } = useSettingsStore();
 * setTheme('dark'); // Force dark mode
 * setTheme('system'); // Follow OS preference
 * ```
 */
type Theme = 'light' | 'dark' | 'system';

/**
 * Settings store state and actions interface.
 *
 * This store manages user preferences that persist across sessions using
 * localStorage. All settings are automatically saved and restored on page load.
 */
interface SettingsState {
  /**
   * Current theme setting.
   * @default 'system'
   */
  theme: Theme;

  /**
   * Whether the sidebar is in collapsed (icon-only) mode.
   * Only affects desktop layout; mobile uses a slide-out drawer instead.
   * @default false
   */
  sidebarCollapsed: boolean;

  /**
   * Sets the theme and immediately applies it to the DOM.
   * The theme is persisted to localStorage automatically.
   *
   * @param theme - The theme to apply ('light', 'dark', or 'system')
   *
   * @example
   * ```ts
   * const { setTheme } = useSettingsStore();
   * setTheme('dark');
   * ```
   */
  setTheme: (theme: Theme) => void;

  /**
   * Toggles between light and dark themes.
   *
   * **Note**: This skips the 'system' option intentionally. If the current
   * theme is 'system', it will toggle to 'dark'. This provides a simple
   * binary toggle for quick theme switching.
   *
   * @example
   * ```tsx
   * function ThemeButton() {
   *   const { toggleTheme } = useSettingsStore();
   *   return <button onClick={toggleTheme}>Toggle Theme</button>;
   * }
   * ```
   */
  toggleTheme: () => void;

  /**
   * Sets the sidebar collapsed state.
   *
   * @param collapsed - true to collapse (show icons only), false to expand
   *
   * @example
   * ```ts
   * const { setSidebarCollapsed } = useSettingsStore();
   * setSidebarCollapsed(true); // Collapse sidebar
   * ```
   */
  setSidebarCollapsed: (collapsed: boolean) => void;

  /**
   * Toggles the sidebar between collapsed and expanded states.
   *
   * @example
   * ```tsx
   * function SidebarToggle() {
   *   const { toggleSidebar, sidebarCollapsed } = useSettingsStore();
   *   return (
   *     <button onClick={toggleSidebar}>
   *       {sidebarCollapsed ? 'Expand' : 'Collapse'}
   *     </button>
   *   );
   * }
   * ```
   */
  toggleSidebar: () => void;
}

/**
 * Global settings store for managing user preferences.
 *
 * This Zustand store provides reactive state management for application-wide
 * settings with automatic localStorage persistence. Settings are restored
 * automatically when the app loads.
 *
 * ## Features
 * - **Theme management**: Light, dark, or system-preference themes
 * - **Sidebar state**: Collapsed/expanded state for desktop layouts
 * - **Persistence**: Automatic save/restore via localStorage
 * - **SSR-safe**: Handles server-side rendering without errors
 *
 * ## Storage
 * Settings are stored in localStorage under the key `'settings-storage'`
 * with the following structure:
 * ```json
 * {
 *   "state": {
 *     "theme": "system",
 *     "sidebarCollapsed": false
 *   },
 *   "version": 0
 * }
 * ```
 *
 * ## Theme Application
 * When the theme changes, the store:
 * 1. Adds a `'theme-transition'` class to `<html>` (for CSS transitions)
 * 2. Toggles the `'dark'` class on `<html>` based on the theme
 * 3. Removes `'theme-transition'` after 300ms
 *
 * Your CSS should use the `'dark'` class for dark mode styles:
 * ```css
 * .dark { --bg-primary: #1a1a1a; }
 * .theme-transition * { transition: background-color 0.3s, color 0.3s; }
 * ```
 *
 * @example
 * ### Basic Usage
 * ```tsx
 * import { useSettingsStore } from '@soundblue/shared-react';
 *
 * function Settings() {
 *   const { theme, setTheme, sidebarCollapsed, toggleSidebar } = useSettingsStore();
 *
 *   return (
 *     <div>
 *       <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
 *         <option value="light">Light</option>
 *         <option value="dark">Dark</option>
 *         <option value="system">System</option>
 *       </select>
 *       <button onClick={toggleSidebar}>
 *         Sidebar: {sidebarCollapsed ? 'Collapsed' : 'Expanded'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ### Layout Integration
 * ```tsx
 * function DocsLayout({ children }) {
 *   const { sidebarCollapsed, setSidebarCollapsed } = useSettingsStore();
 *   const isMobile = useIsMobile();
 *
 *   return (
 *     <div>
 *       <Sidebar
 *         isCollapsed={sidebarCollapsed}
 *         onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
 *       />
 *       <main style={{
 *         marginLeft: isMobile ? 0 : sidebarCollapsed ? '64px' : '256px'
 *       }}>
 *         {children}
 *       </main>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ### Reading State Outside React
 * ```ts
 * // Access store state directly (useful for non-React code)
 * const currentTheme = useSettingsStore.getState().theme;
 * const isCollapsed = useSettingsStore.getState().sidebarCollapsed;
 *
 * // Subscribe to changes
 * const unsubscribe = useSettingsStore.subscribe((state) => {
 *   console.log('Theme changed to:', state.theme);
 * });
 * ```
 *
 * @see https://zustand.docs.pmnd.rs/ - Zustand documentation
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarCollapsed: false,

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

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyTheme(state.theme);
        }
      },
    },
  ),
);

/**
 * Applies the given theme to the DOM by toggling the 'dark' class on the
 * document root element.
 *
 * This function:
 * 1. Adds a 'theme-transition' class for smooth CSS transitions
 * 2. Resolves 'system' theme to the actual OS preference
 * 3. Sets or removes the 'dark' class on `<html>`
 * 4. Removes 'theme-transition' after 300ms
 *
 * **SSR-safe**: Returns early if `window` is undefined.
 *
 * @param theme - The theme to apply
 * @internal This function is used internally by the store
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

/**
 * Immediate theme initialization on first load.
 *
 * This block runs synchronously when the module loads to prevent flash of
 * incorrect theme (FOIT). It reads directly from localStorage before React
 * hydration to ensure the correct theme is applied immediately.
 *
 * **Why not wait for Zustand's rehydration?**
 * Zustand's persist middleware rehydrates asynchronously, which would cause
 * a brief flash of the wrong theme. By reading localStorage directly here,
 * we can apply the theme before the first paint.
 *
 * @internal
 */
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('settings-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.state?.theme) {
        applyTheme(parsed.state.theme);
      }
    } catch {
      // Ignore parse errors - will use default theme
    }
  }
}
