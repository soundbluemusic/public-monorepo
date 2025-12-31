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

/** Worker 메시지 - Discriminated Union으로 타입 안전성 보장 */
export type WorkerMessage =
  | {
      type: 'INIT';
      payload: { config: SearchConfig; data: Array<{ id: string; [key: string]: unknown }> };
    }
  | { type: 'SEARCH'; payload: { query: string; limit?: number } }
  | { type: 'SUGGEST'; payload: { query: string; limit?: number } }
  | { type: 'READY' }
  | { type: 'RESULTS'; payload: SearchResult[] }
  | { type: 'SUGGESTIONS'; payload: string[] }
  | { type: 'ERROR'; error: string };
