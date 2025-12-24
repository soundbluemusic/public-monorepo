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
