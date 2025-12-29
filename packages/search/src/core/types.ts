/**
 * Search Engine Types
 */

/** 검색 가능한 아이템 */
export interface SearchableItem {
  id: string;
  [key: string]: unknown;
}

/** 검색 엔진 설정 */
export interface SearchConfig {
  /** 검색할 필드 */
  fields: string[];
  /** 결과에 저장할 필드 */
  storeFields: string[];
  /** 검색 옵션 */
  searchOptions?: {
    boost?: Record<string, number>;
    fuzzy?: number | boolean;
    prefix?: boolean;
  };
}

/** 검색 결과 */
export interface SearchResult<T = SearchableItem> {
  id: string;
  score: number;
  match: Record<string, string[]>;
  item?: T;
}

/** Worker 메시지 타입 */
export type WorkerMessageType =
  | 'INIT'
  | 'SEARCH'
  | 'SUGGEST'
  | 'READY'
  | 'RESULTS'
  | 'SUGGESTIONS'
  | 'ERROR';

/** Worker 메시지 */
export interface WorkerMessage {
  type: WorkerMessageType;
  payload?: unknown;
  error?: string;
}
