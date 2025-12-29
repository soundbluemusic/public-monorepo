/**
 * Common Types
 *
 * 앱 전반에서 사용되는 공통 타입 정의
 */

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
