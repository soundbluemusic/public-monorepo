/**
 * @fileoverview Node.js 전용 유틸리티
 *
 * 이 파일은 빌드 타임에만 사용됩니다.
 * 클라이언트 코드에서 import하면 안 됩니다.
 *
 * @example
 * ```ts
 * // 빌드 스크립트에서만 사용
 * import { loadJsonDirectory } from '@soundblue/shared/node';
 * ```
 */

export {
  loadJsonDirectory,
  loadJsonFile,
  loadJsonAsMap,
  groupJsonBy,
  validateRequiredFields,
  checkDuplicateIds,
  type ValidationResult,
} from './data';
