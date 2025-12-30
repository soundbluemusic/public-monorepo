/**
 * @soundblue/shared-react - Shared React components, hooks, and stores
 *
 * This package re-exports from new specialized packages for backward compatibility:
 * - @soundblue/ui - UI components
 * - @soundblue/features - Business hooks
 * - @soundblue/pwa - PWA utilities
 *
 * Plus app-specific components that remain here.
 *
 * @packageDocumentation
 */

// ============================================================================
// Re-exports from @soundblue/features
// ============================================================================
export {
  // Toast
  clearToasts,
  removeToast,
  type ToastOptions,
  type ToastType,
  toast,
  // Media queries
  useIsMobile,
  useMediaQuery,
  // Settings store
  useSettingsStore,
  useToast,
} from '@soundblue/features';
// ============================================================================
// Re-exports from @soundblue/pwa
// ============================================================================
export {
  OfflineIndicator,
  type UseOnlineStatusReturn,
  useOnlineStatus,
} from '@soundblue/pwa/react';
// ============================================================================
// Re-exports from @soundblue/ui
// ============================================================================
export {
  COMMON_PRECONNECTS,
  // Utils
  cn,
  createNavigationPreloads,
  dnsPrefetch,
  // Feedback
  ErrorBoundary,
  type ErrorBoundaryProps,
  ErrorFallbackUI,
  // Animation
  FadeIn,
  // Patterns
  LazyLoad,
  type LazyLoadProps,
  LazyLoadSkeleton,
  // Primitives
  LoadingSpinner,
  lazyWithSuspense,
  modulePreload,
  PageSkeleton,
  type PreloadLinkDescriptor,
  ProgressBar,
  type ProgressBarProps,
  preconnect,
  prefetchLink,
  preloadComponent,
  preloadFont,
  preloadImage,
  preloadLink,
  preloadScript,
  preloadStyle,
  RouteErrorFallback,
  SearchDropdown,
  type SearchDropdownProps,
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  SkeletonText,
  type Toast,
  ToastContainer,
  usePreloadOnVisible,
  VirtualList,
  type VirtualListProps,
} from '@soundblue/ui';
export { useAutoAnimate } from '@soundblue/ui/hooks';
// ============================================================================
// App-specific components (re-exports from ui/components)
// ============================================================================
export { DarkModeToggle, LanguageToggle } from './components';
// ============================================================================
// App-specific hooks (re-exports from search, ui)
// ============================================================================
export {
  type SearchIndexItem,
  type SearchResult,
  useSearchWorker,
} from './hooks';

// ============================================================================
// Utils (remain in this package - re-exported from @soundblue/shared)
// ============================================================================
export {
  BREAKPOINTS,
  buildLocalePath,
  createSearchHandler,
  filterBySearch,
  getLocaleFromPath,
  type I18nContextType,
  isReservedName,
  isValidLanguage,
  isValidTheme,
  type Language,
  LIMITS,
  languageFlags,
  languageNames,
  RESERVED_NAMES,
  type ReservedName,
  sanitizeSearchQuery,
  stripLocaleFromPath,
  validateId,
} from './utils';
