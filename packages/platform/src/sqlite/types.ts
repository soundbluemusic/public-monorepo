/**
 * 오프라인 SQLite 저장소 타입 정의
 */

/**
 * 오프라인 DB 메타데이터
 */
export interface OfflineDBMeta {
  /** 데이터 버전 (타임스탬프) */
  version: number;
  /** 다운로드 완료 시점 */
  downloadedAt: number;
  /** 엔트리 수 */
  entriesCount: number;
  /** 카테고리 수 */
  categoriesCount: number;
  /** 대화 수 */
  conversationsCount: number;
}

/**
 * 오프라인 DB 상태
 */
export type OfflineDBStatus =
  | 'not-downloaded' // 다운로드 안됨
  | 'downloading' // 다운로드 중
  | 'ready' // 사용 가능
  | 'updating' // 업데이트 중
  | 'error'; // 오류

/**
 * 다운로드 진행 상태
 */
export interface DownloadProgress {
  /** 현재 단계 */
  phase: 'fetching' | 'parsing' | 'storing' | 'complete';
  /** 진행률 (0-100) */
  percent: number;
  /** 다운로드된 바이트 */
  bytesLoaded?: number;
  /** 전체 바이트 */
  bytesTotal?: number;
}

/**
 * D1 덤프 응답 형식
 */
export interface D1DumpResponse {
  version: number;
  tables: {
    entries: D1EntryRow[];
    categories: D1CategoryRow[];
    conversations: D1ConversationRow[];
  };
  meta: {
    entriesCount: number;
    categoriesCount: number;
    conversationsCount: number;
  };
}

/**
 * D1 entries 테이블 row
 */
export interface D1EntryRow {
  id: string;
  korean: string;
  romanization: string | null;
  part_of_speech: string | null;
  category_id: string;
  difficulty: string | null;
  frequency: string | null;
  tags: string | null;
  translations: string | null;
  created_at: number | null;
}

/**
 * D1 categories 테이블 row
 */
export interface D1CategoryRow {
  id: string;
  name_ko: string;
  name_en: string;
  description_ko: string | null;
  description_en: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
}

/**
 * D1 conversations 테이블 row
 */
export interface D1ConversationRow {
  id: string;
  category_id: string | null;
  title_ko: string;
  title_en: string;
  dialogue: string;
}

/**
 * 오프라인 SQLite 어댑터 인터페이스
 */
export interface OfflineSQLiteAdapter {
  /** 초기화 */
  init(): Promise<void>;

  /** 상태 확인 */
  getStatus(): OfflineDBStatus;

  /** 메타데이터 조회 */
  getMeta(): Promise<OfflineDBMeta | null>;

  /** 데이터 다운로드 및 저장 */
  download(onProgress?: (progress: DownloadProgress) => void): Promise<void>;

  /** 엔트리 조회 */
  getEntry(id: string): Promise<D1EntryRow | null>;

  /** 카테고리별 엔트리 조회 */
  getEntriesByCategory(categoryId: string): Promise<D1EntryRow[]>;

  /** 모든 카테고리 조회 */
  getCategories(): Promise<D1CategoryRow[]>;

  /** 대화 조회 */
  getConversationsByCategory(categoryId: string): Promise<D1ConversationRow[]>;

  /** 데이터 삭제 */
  clear(): Promise<void>;

  /** 업데이트 확인 */
  checkForUpdate(): Promise<{ hasUpdate: boolean; serverVersion: number }>;
}
