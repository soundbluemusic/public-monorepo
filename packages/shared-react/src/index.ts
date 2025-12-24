/**
 * @soundblue/shared-react - Shared React components, hooks, and stores
 *
 * @remarks
 * ⛔ **HARDCODING PROHIBITION (하드코딩 절대 금지)**
 *
 * NEVER use inline magic values in components. ALWAYS use:
 * - CSS variables (`var(--header-height)`)
 * - Tailwind classes (`h-header`, `pt-header`)
 * - Shared constants from `@soundblue/shared`
 *
 * @example
 * ```tsx
 * // ❌ NEVER - Hardcoded values
 * <div style={{ height: '56px', paddingTop: '56px' }}>
 * const isMobile = window.innerWidth < 768;
 *
 * // ✅ ALWAYS - CSS variables and shared constants
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
