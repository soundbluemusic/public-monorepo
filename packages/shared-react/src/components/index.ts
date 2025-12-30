/**
 * @fileoverview Components exports
 * @environment client-only
 */

// Re-export from pwa
export { OfflineIndicator } from '@soundblue/pwa/react';
// Re-export from ui
export {
  ErrorBoundary,
  type ErrorBoundaryProps,
  ErrorFallbackUI,
  RouteErrorFallback,
  type Toast,
  ToastContainer,
} from '@soundblue/ui/feedback';
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
export {
  LoadingSpinner,
  PageSkeleton,
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  SkeletonText,
} from '@soundblue/ui/primitives';

// Local exports (app-specific components)
export { DarkModeToggle, type DarkModeToggleProps } from './DarkModeToggle';
export {
  type EntryCategory,
  EntryListItem,
  type EntryListItemProps,
} from './EntryListItem';
export { LanguageToggle, type LanguageToggleProps } from './LanguageToggle';
export {
  canShare,
  copyToClipboard,
  ShareButton,
  type ShareButtonProps,
  type ShareData,
  share,
  supportsWebShare,
  useWebShare,
} from './ShareButton';
export {
  ViewTransitionButton,
  type ViewTransitionButtonProps,
  ViewTransitionLink,
  type ViewTransitionLinkProps,
} from './ViewTransitionLink';
