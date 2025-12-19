// Constants
export { LIMITS, BREAKPOINTS, RESERVED_NAMES, type ReservedName } from './constants';

// Validation utilities
export {
  validateId,
  isReservedName,
  isValidTheme,
  isValidLanguage,
} from './validation';

// Search utilities
export {
  sanitizeSearchQuery,
  filterBySearch,
  createSearchHandler,
} from './search';

// PWA hooks
export { useOnlineStatus, type UseOnlineStatusReturn } from './hooks/use-online-status';

// Dark mode hook
export { useDarkMode, type UseDarkModeReturn } from './hooks/use-dark-mode';

// PWA components
export { OfflineIndicator } from './components/OfflineIndicator';

// UI components
export { LanguageToggle, type LanguageToggleProps } from './components/LanguageToggle';
export { DarkModeToggle, type DarkModeToggleProps } from './components/DarkModeToggle';

// Skeleton components
export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonList,
  SkeletonGrid,
  PageSkeleton,
} from './components/Skeleton';

// i18n utilities
export {
  type Language,
  type I18nContextType,
  languageNames,
  languageFlags,
  getLocaleFromPath,
  stripLocaleFromPath,
  buildLocalePath,
} from './i18n';

// DB helpers
export {
  type BaseFavorite,
  type BaseSettings,
  type BaseRecentView,
  type FavoritesHelper,
  type SettingsHelper,
  type RecentViewsHelper,
  createFavoritesHelper,
  createSettingsHelper,
  createRecentViewsHelper,
} from './db';

// Data loader utilities are in a separate entry point
// Import from '@soundblue/shared/node' for Node.js-only utilities
// Example: import { loadJsonDirectory } from '@soundblue/shared/node'
