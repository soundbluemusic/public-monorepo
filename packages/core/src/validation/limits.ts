/**
 * Application Limits
 *
 * 앱 전반에서 사용되는 제한 상수들
 *
 * ⛔ HARDCODING RULES:
 * 이 파일의 상수들은 "허용된 하드코딩"입니다.
 * 조건: 명확한 이름 + 문서화 + Single Source + Export
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
  /** Tablet breakpoint in pixels */
  TABLET: 1024,
  /** Desktop breakpoint in pixels */
  DESKTOP: 1280,
} as const;

/** Reserved JavaScript property names that should not be used as IDs */
export const RESERVED_NAMES = ['__proto__', 'constructor', 'prototype'] as const;

export type ReservedName = (typeof RESERVED_NAMES)[number];
