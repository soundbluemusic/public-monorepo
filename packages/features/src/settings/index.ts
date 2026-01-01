/**
 * @fileoverview Settings Feature
 * @environment client-only
 */

export {
  type SettingsState,
  type Theme,
  useSettingsStore,
  useSidebarActions,
  useSidebarCollapsed,
  useSidebarOpen,
  // Selector hooks for performance
  useTheme,
  useThemeActions,
} from './store';
