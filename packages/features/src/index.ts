/**
 * @fileoverview Features Package
 * @environment client-only
 *
 * Business logic hooks for React applications.
 * UI-free - hooks only.
 *
 * @packageDocumentation
 */

// Media
export { useIsMobile, useMediaQuery } from './media';
// Settings
export { type SettingsState, type Theme, useSettingsStore } from './settings';
// Toast
export {
  clearToasts,
  removeToast,
  type Toast,
  type ToastOptions,
  type ToastType,
  toast,
  useToast,
} from './toast';
