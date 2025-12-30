/**
 * @fileoverview Components exports (re-exports from new packages)
 * @deprecated Use @soundblue/ui, @soundblue/pwa directly
 * @environment client-only
 */

// Re-export from pwa
export { OfflineIndicator } from '@soundblue/pwa/react';
// Re-export from ui/components
export { DarkModeToggle, LanguageToggle } from '@soundblue/ui/components';
// Re-export from ui/feedback
export {
  ErrorBoundary,
  type ErrorBoundaryProps,
  ErrorFallbackUI,
  RouteErrorFallback,
  type Toast,
  ToastContainer,
} from '@soundblue/ui/feedback';
// Re-export from ui/patterns
export {
  LazyLoad,
  type LazyLoadProps,
  LazyLoadSkeleton,
  lazyWithSuspense,
  preloadComponent,
  SearchDropdown,
  type SearchDropdownProps,
  usePreloadOnVisible,
} from '@soundblue/ui/patterns';
// Re-export from ui/primitives
export {
  LoadingSpinner,
  PageSkeleton,
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  SkeletonText,
} from '@soundblue/ui/primitives';
