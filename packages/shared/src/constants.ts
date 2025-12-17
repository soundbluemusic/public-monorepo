/**
 * Shared constants across all apps
 */

export const LIMITS = {
  /** Maximum length for ID fields (libraryId, apiId, entryId) */
  ID_LENGTH: 100,
  /** Maximum length for search queries */
  SEARCH_LENGTH: 100,
} as const;

export const BREAKPOINTS = {
  /** Mobile breakpoint in pixels */
  MOBILE: 768,
} as const;

/** Reserved JavaScript property names that should not be used as IDs */
export const RESERVED_NAMES = ["__proto__", "constructor", "prototype"] as const;

export type ReservedName = (typeof RESERVED_NAMES)[number];
