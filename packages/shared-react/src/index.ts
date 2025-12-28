/**
 * @soundblue/shared-react - Shared React components, hooks, and stores
 *
 * @remarks
 * ⛔ **HARDCODING RULES (하드코딩 규칙)**
 *
 * 하드코딩은 우수한 설계 목적일 경우에만 허용됩니다.
 * 허용: CSS 변수, Tailwind 클래스, @soundblue/shared 상수
 *
 * @example
 * ```tsx
 * // ❌ NEVER - 익명의 매직 넘버
 * <div style={{ height: '56px' }}>
 * const isMobile = window.innerWidth < 768;
 *
 * // ✅ ALLOWED - CSS 변수와 공유 상수
 * <div className="h-header pt-header">
 * import { BREAKPOINTS } from '@soundblue/shared';
 * const isMobile = window.innerWidth < BREAKPOINTS.MOBILE;
 * ```
 *
 * @packageDocumentation
 */

// Components
export {
  canShare,
  copyToClipboard,
  DarkModeToggle,
  type DarkModeToggleProps,
  ErrorBoundary,
  type ErrorBoundaryProps,
  ErrorFallbackUI,
  LanguageToggle,
  type LanguageToggleProps,
  LazyLoad,
  type LazyLoadProps,
  LazyLoadSkeleton,
  LoadingSpinner,
  lazyWithSuspense,
  OfflineIndicator,
  PageSkeleton,
  preloadComponent,
  RouteErrorFallback,
  SearchDropdown,
  type SearchDropdownProps,
  ShareButton,
  type ShareButtonProps,
  type ShareData,
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  SkeletonText,
  share,
  supportsWebShare,
  usePreloadOnVisible,
  useWebShare,
  ViewTransitionButton,
  type ViewTransitionButtonProps,
  ViewTransitionLink,
  type ViewTransitionLinkProps,
} from './components';

// UI Components (shadcn/ui style)
export {
  Button,
  type ButtonProps,
  buttonVariants,
} from './components/ui/button';
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog';
export { Input, type InputProps } from './components/ui/input';
export { Label } from './components/ui/label';
export { FadeIn, Pressable, ScaleIn, SlideUp, Stagger } from './components/ui/motion';
export { VirtualList, type VirtualListProps } from './components/ui/virtual-list';

// Hooks
export {
  type SearchIndexItem,
  type SearchResult,
  startViewTransition,
  supportsViewTransitions,
  type UseOnlineStatusReturn,
  useIsMobile,
  useMediaQuery,
  useOnlineStatus,
  useSearchWorker,
  useViewTransition,
} from './hooks';
export { useAutoAnimate } from './hooks/useAutoAnimate';
// Stores
export { useSettingsStore } from './stores';

// Utils
export {
  BREAKPOINTS,
  buildLocalePath,
  // Preload hints
  COMMON_PRECONNECTS,
  // Tailwind CSS utility
  cn,
  createNavigationPreloads,
  createSearchHandler,
  dnsPrefetch,
  filterBySearch,
  getLocaleFromPath,
  type I18nContextType,
  isReservedName,
  isValidLanguage,
  isValidTheme,
  // i18n
  type Language,
  // Constants
  LIMITS,
  languageFlags,
  languageNames,
  modulePreload,
  type PreloadLinkDescriptor,
  preconnect,
  prefetchLink,
  preloadFont,
  preloadImage,
  preloadLink,
  preloadScript,
  preloadStyle,
  RESERVED_NAMES,
  type ReservedName,
  // Search
  sanitizeSearchQuery,
  stripLocaleFromPath,
  // Validation
  validateId,
} from './utils';
