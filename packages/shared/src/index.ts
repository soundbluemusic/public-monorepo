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
export { BREAKPOINTS, LIMITS, RESERVED_NAMES, type ReservedName } from './constants';
// Dark mode utilities for SSG apps
export {
  // Option C: Dual icons with CSS toggle
  DARK_MODE_DUAL_ICONS_CSS,
  // Option B: CSS mask-image
  DARK_MODE_ICONS_CSS,
  DARK_MODE_INIT_SCRIPT,
  DARK_MODE_TOGGLE_SCRIPT,
  DARK_MODE_TOGGLE_SCRIPT_CSS,
  DARK_MODE_TOGGLE_SCRIPT_DUAL,
  MOON_ICON_SVG,
  // Option A: innerHTML replacement
  SUN_ICON_SVG,
} from './dark-mode';
// DB helpers
export {
  type BaseFavorite,
  type BaseRecentView,
  type BaseSettings,
  createFavoritesHelper,
  createRecentViewsHelper,
  createSettingsHelper,
  type FavoritesHelper,
  type RecentViewsHelper,
  type SettingsHelper,
} from './db';

// i18n utilities
export {
  buildLocalePath,
  extractStaticRoutes,
  generateI18nRoutes,
  getLocaleFromPath,
  type I18nContextType,
  type Language,
  languageFlags,
  languageNames,
  stripLocaleFromPath,
} from './i18n';
// Search utilities
export {
  createSearchHandler,
  filterBySearch,
  sanitizeSearchQuery,
} from './search';
// Meta utilities for React Router
export {
  dynamicMetaFactory,
  type LocalizedMeta,
  type MetaData,
  metaFactory,
} from './utils/meta';
// Validation utilities
export {
  isReservedName,
  isValidLanguage,
  isValidTheme,
  validateId,
} from './validation';

// Data loader utilities are in a separate entry point
// Import from '@soundblue/shared/node' for Node.js-only utilities
// Example: import { loadJsonDirectory } from '@soundblue/shared/node'
