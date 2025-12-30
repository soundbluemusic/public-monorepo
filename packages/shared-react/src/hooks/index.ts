/**
 * @fileoverview Hooks exports
 * @environment client-only
 */

export { useIsMobile, useMediaQuery } from '@soundblue/features/media';
// Re-export from features
export {
  clearToasts,
  removeToast,
  type Toast,
  type ToastOptions,
  type ToastType,
  toast,
  useToast,
} from '@soundblue/features/toast';

// Re-export from pwa
export { type UseOnlineStatusReturn, useOnlineStatus } from '@soundblue/pwa/react';

// Local exports (app-specific hooks)
export { useAutoAnimate } from './useAutoAnimate';
export {
  type SearchIndexItem,
  type SearchResult,
  useSearchWorker,
} from './useSearchWorker';
export {
  startViewTransition,
  supportsViewTransitions,
  useViewTransition,
} from './useViewTransition';
