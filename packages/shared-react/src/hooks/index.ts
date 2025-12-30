/**
 * @fileoverview Hooks exports (re-exports from new packages)
 * @deprecated Use @soundblue/ui, @soundblue/features, @soundblue/search, @soundblue/pwa directly
 * @environment client-only
 */

// Re-export from features/media
export { useIsMobile, useMediaQuery } from '@soundblue/features/media';

// Re-export from features/toast
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
// Re-export from search/react
export {
  type SearchIndexItem,
  type SearchResult,
  useSearchWorker,
} from '@soundblue/search/react';
// Re-export from ui/hooks
export { useAutoAnimate } from '@soundblue/ui/hooks';
