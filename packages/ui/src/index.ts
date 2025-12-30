/**
 * @fileoverview UI Package
 * @environment universal
 *
 * Reusable UI components for React applications.
 * SSG-safe, no client-only dependencies in core exports.
 *
 * @packageDocumentation
 */

// Animation
export {
  AnimatePresence,
  FadeIn,
  motion,
  Pressable,
  ScaleIn,
  SlideUp,
  Stagger,
  StaggerItem,
} from './animation';

// Feedback
export {
  ErrorBoundary,
  type ErrorBoundaryProps,
  ErrorFallbackUI,
  RouteErrorFallback,
  type Toast,
  ToastContainer,
} from './feedback';

// Patterns
export {
  LazyLoad,
  type LazyLoadProps,
  LazyLoadSkeleton,
  lazyWithSuspense,
  preloadComponent,
  SearchDropdown,
  type SearchDropdownProps,
  type SearchResult,
  type SearchResultItem,
  usePreloadOnVisible,
  useVirtualizer,
  VirtualList,
  type VirtualListProps,
} from './patterns';

// Primitives
export {
  LoadingSpinner,
  type LoadingSpinnerProps,
  PageSkeleton,
  ProgressBar,
  type ProgressBarProps,
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  SkeletonText,
} from './primitives';

// Utils
export {
  COMMON_PRECONNECTS,
  cn,
  createNavigationPreloads,
  dnsPrefetch,
  modulePreload,
  type PreloadLinkDescriptor,
  preconnect,
  prefetchLink,
  preloadFont,
  preloadImage,
  preloadLink,
  preloadScript,
  preloadStyle,
} from './utils';
