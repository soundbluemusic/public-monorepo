/**
 * @fileoverview i18n 모듈 진입점
 *
 * URL 기반 로케일 라우팅 시스템의 공통 유틸리티를 내보냅니다.
 *
 * @example
 * ```tsx
 * import {
 *   type Language,
 *   getLocaleFromPath,
 *   stripLocaleFromPath,
 *   buildLocalePath,
 *   languageNames,
 *   languageFlags,
 * } from '@soundblue/shared/i18n';
 * ```
 */

// Types
export type { I18nContextType, Language } from './types';
export { languageFlags, languageNames } from './types';

// Utilities
export { buildLocalePath, getLocaleFromPath, stripLocaleFromPath } from './utils';
