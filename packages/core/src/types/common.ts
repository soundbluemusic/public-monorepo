/**
 * Common Types
 *
 * 앱 전반에서 사용되는 공통 타입 정의
 * TypeScript 고급 패턴 포함
 */

// ========================================
// Basic Types
// ========================================

/** 지원 언어 */
export type Language = 'ko' | 'en';

/** 테마 */
export type Theme = 'light' | 'dark' | 'system';

/** 다국어 텍스트 */
export interface LocalizedString {
  ko: string;
  en: string;
}

/** 다국어 텍스트 (선택적) */
export interface LocalizedStringOptional {
  ko?: string;
  en?: string;
}

// ========================================
// Entity Traits (Mixins)
// ========================================

/** ID를 가진 엔티티 */
export interface Identifiable {
  id: string;
}

/** 타임스탬프를 가진 엔티티 */
export interface Timestamped {
  createdAt?: string;
  updatedAt?: string;
}

/** 정렬 가능한 엔티티 */
export interface Sortable {
  order?: number;
}

// ========================================
// Pagination
// ========================================

/** 페이지네이션 파라미터 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/** 페이지네이션 결과 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ========================================
// Result Type (Rust-like)
// ========================================

/**
 * 성공 결과
 */
export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

/**
 * 실패 결과
 */
export interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

/**
 * Result 타입 - 성공 또는 실패를 명시적으로 표현
 *
 * @example
 * function divide(a: number, b: number): Result<number, string> {
 *   if (b === 0) return { ok: false, error: 'Division by zero' };
 *   return { ok: true, value: a / b };
 * }
 *
 * const result = divide(10, 2);
 * if (result.ok) {
 *   console.log(result.value); // 5
 * } else {
 *   console.error(result.error);
 * }
 */
export type Result<T, E = Error> = Ok<T> | Err<E>;

/** Result 헬퍼: 성공 생성 */
export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });

/** Result 헬퍼: 실패 생성 */
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

// ========================================
// Branded Types (Nominal Typing)
// ========================================

/**
 * Branded Type 생성을 위한 심볼
 * 컴파일 타임에만 존재하며 런타임에는 영향 없음
 */
declare const __brand: unique symbol;

/**
 * Branded Type 정의
 *
 * @example
 * type UserId = Brand<string, 'UserId'>;
 * type PostId = Brand<string, 'PostId'>;
 *
 * function getUser(id: UserId) { ... }
 *
 * const userId = 'user_123' as UserId;
 * const postId = 'post_456' as PostId;
 *
 * getUser(userId); // ✅ OK
 * getUser(postId); // ❌ Type error
 */
export type Brand<T, B extends string> = T & { readonly [__brand]: B };

// 앱에서 사용할 Branded Types
export type EntryId = Brand<string, 'EntryId'>;
export type ConceptId = Brand<string, 'ConceptId'>;
export type CategoryId = Brand<string, 'CategoryId'>;

// ========================================
// Discriminated Unions
// ========================================

/**
 * 로딩 상태를 표현하는 Discriminated Union
 *
 * @example
 * const [state, setState] = useState<AsyncState<User>>({ status: 'idle' });
 *
 * if (state.status === 'success') {
 *   console.log(state.data.name); // 타입 안전
 * }
 */
export type AsyncState<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

/**
 * 옵션 상태 (선택됨/선택 안됨)
 */
export type SelectionState<T> = { selected: false } | { selected: true; item: T };

// ========================================
// Utility Types
// ========================================

/**
 * 객체의 모든 값을 특정 타입으로 변환
 */
export type ValueOf<T> = T[keyof T];

/**
 * 특정 키만 필수로 만들기
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * 특정 키만 선택적으로 만들기
 */
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 읽기 전용 깊은 복사
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * null/undefined 제거
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * 함수 타입의 첫 번째 인자 타입 추출
 */
export type FirstArg<F> = F extends (arg: infer A, ...args: unknown[]) => unknown ? A : never;

/**
 * Promise 내부 타입 추출
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

// ========================================
// Type Guards
// ========================================

/**
 * null/undefined 체크 타입 가드
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * 문자열 체크 타입 가드
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * 숫자 체크 타입 가드
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * 배열 체크 타입 가드
 */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * 객체 체크 타입 가드 (null 제외)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
