/**
 * Shared constants across all apps
 *
 * @remarks
 * ⛔ **HARDCODING RULES (하드코딩 규칙)**
 *
 * 이 파일의 상수들은 "허용된 하드코딩"의 예시입니다.
 * 허용 조건: 명확한 이름 + 문서화 + Single Source + Export
 *
 * @example
 * ```typescript
 * // ❌ NEVER - 익명의 매직 넘버
 * if (query.length > 100) return;
 *
 * // ✅ ALLOWED - 이 파일의 상수 사용
 * import { LIMITS, BREAKPOINTS } from '@soundblue/shared';
 * if (query.length > LIMITS.SEARCH_LENGTH) return;
 * if (window.innerWidth < BREAKPOINTS.MOBILE) setMobile(true);
 * ```
 */

export const LIMITS = {
  /** Maximum length for ID fields (libraryId, apiId, entryId) */
  ID_LENGTH: 100,
  /** Maximum length for search queries */
  SEARCH_LENGTH: 100,
  /** Maximum search results to display */
  SEARCH_MAX_RESULTS: 8,
  /** Number of recent items to display in lists */
  RECENT_ITEMS_DISPLAY: 10,
  /** Number of categories to show in sidebar preview */
  SIDEBAR_CATEGORIES_PREVIEW: 6,
  /** Number of tags to show in preview */
  TAGS_PREVIEW: 4,
} as const;

export const BREAKPOINTS = {
  /** Mobile breakpoint in pixels */
  MOBILE: 768,
} as const;

/** Reserved JavaScript property names that should not be used as IDs */
export const RESERVED_NAMES = ['__proto__', 'constructor', 'prototype'] as const;

export type ReservedName = (typeof RESERVED_NAMES)[number];
