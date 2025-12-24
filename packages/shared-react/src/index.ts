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

// Stores
export { useSettingsStore } from './stores';

// Hooks
export {
  useOnlineStatus,
  useMediaQuery,
  useIsMobile,
  useSearchWorker,
  type UseOnlineStatusReturn,
  type SearchIndexItem,
  type SearchResult,
} from './hooks';

// Components
export {
  DarkModeToggle,
  LanguageToggle,
  OfflineIndicator,
  SearchDropdown,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonList,
  SkeletonGrid,
  PageSkeleton,
  type DarkModeToggleProps,
  type LanguageToggleProps,
  type SearchDropdownProps,
} from './components';

// Utils
export {
  // Constants
  LIMITS,
  BREAKPOINTS,
  RESERVED_NAMES,
  type ReservedName,
  // Validation
  validateId,
  isReservedName,
  isValidTheme,
  isValidLanguage,
  // Search
  sanitizeSearchQuery,
  filterBySearch,
  createSearchHandler,
  // i18n
  type Language,
  type I18nContextType,
  languageNames,
  languageFlags,
  getLocaleFromPath,
  stripLocaleFromPath,
  buildLocalePath,
} from './utils';
