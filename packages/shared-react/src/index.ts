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
  DarkModeToggle,
  type DarkModeToggleProps,
  LanguageToggle,
  type LanguageToggleProps,
  OfflineIndicator,
  PageSkeleton,
  SearchDropdown,
  type SearchDropdownProps,
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  SkeletonText,
} from './components';

// Hooks
export {
  type SearchIndexItem,
  type SearchResult,
  type UseOnlineStatusReturn,
  useIsMobile,
  useMediaQuery,
  useOnlineStatus,
  useSearchWorker,
} from './hooks';
// Stores
export { useSettingsStore } from './stores';

// Utils
export {
  BREAKPOINTS,
  buildLocalePath,
  // Tailwind CSS utility
  cn,
  createSearchHandler,
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
  RESERVED_NAMES,
  type ReservedName,
  // Search
  sanitizeSearchQuery,
  stripLocaleFromPath,
  // Validation
  validateId,
} from './utils';
