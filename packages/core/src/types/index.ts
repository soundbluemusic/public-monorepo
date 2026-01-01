/**
 * @soundblue/core - Types
 *
 * 공통 타입 정의 및 TypeScript 고급 패턴
 */

// Basic Types
// Result Type (Rust-like)
// Branded Types (Nominal Typing)
// Discriminated Unions
// Utility Types
export type {
  AsyncState,
  Awaited,
  Brand,
  CategoryId,
  ConceptId,
  DeepReadonly,
  EntryId,
  Err,
  FirstArg,
  Identifiable,
  Language,
  LocalizedString,
  LocalizedStringOptional,
  NonNullableFields,
  Ok,
  PaginatedResult,
  PaginationParams,
  PartialKeys,
  RequireKeys,
  Result,
  SelectionState,
  Sortable,
  Theme,
  Timestamped,
  ValueOf,
} from './common';
// Type Guards
export { err, isArray, isDefined, isNumber, isObject, isString, ok } from './common';
