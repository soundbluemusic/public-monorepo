/**
 * @soundblue/shared - Shared utilities for Soundblue monorepo
 *
 * @remarks
 * ⛔ **HARDCODING RULES (하드코딩 규칙)**
 *
 * 하드코딩은 우수한 설계 목적일 경우에만 허용됩니다.
 * Hardcoding is only allowed for excellent design purposes.
 *
 * @example
 * ```typescript
 * // ❌ NEVER - 익명의 매직 넘버
 * if (id.length > 100) throw new Error('Too long');
 *
 * // ✅ ALLOWED - 명확한 이름과 문서화
 * import { LIMITS } from '@soundblue/shared';
 * if (id.length > LIMITS.ID_LENGTH) throw new Error('Too long');
 * ```
 *
 * @packageDocumentation
 */

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

// Dark mode utilities for SSG apps
export {
  // Option A: innerHTML replacement
  SUN_ICON_SVG,
  MOON_ICON_SVG,
  DARK_MODE_INIT_SCRIPT,
  DARK_MODE_TOGGLE_SCRIPT,
  // Option B: CSS mask-image
  DARK_MODE_ICONS_CSS,
  DARK_MODE_TOGGLE_SCRIPT_CSS,
  // Option C: Dual icons with CSS toggle
  DARK_MODE_DUAL_ICONS_CSS,
  DARK_MODE_TOGGLE_SCRIPT_DUAL,
} from './dark-mode';

// Data loader utilities are in a separate entry point
// Import from '@soundblue/shared/node' for Node.js-only utilities
// Example: import { loadJsonDirectory } from '@soundblue/shared/node'
