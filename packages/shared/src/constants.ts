/**
 * Shared constants across all apps
 *
 * @remarks
 * ⛔ **HARDCODING PROHIBITION (하드코딩 절대 금지)**
 *
 * All numeric values MUST be defined here as named constants.
 * Never use raw numbers in application code.
 *
 * @example
 * ```typescript
 * // ❌ NEVER - Magic numbers
 * if (query.length > 100) return;
 * if (window.innerWidth < 768) setMobile(true);
 *
 * // ✅ ALWAYS - Use constants
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
} as const;

export const BREAKPOINTS = {
  /** Mobile breakpoint in pixels */
  MOBILE: 768,
} as const;

/** Reserved JavaScript property names that should not be used as IDs */
export const RESERVED_NAMES = ['__proto__', 'constructor', 'prototype'] as const;

export type ReservedName = (typeof RESERVED_NAMES)[number];
