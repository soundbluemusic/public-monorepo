/**
 * @fileoverview Search Engine Type Definitions
 * @environment universal
 *
 * 검색 엔진 및 Web Worker 통신에 사용되는 타입 정의.
 * MiniSearch 기반 전문 검색 시스템의 타입 안전성을 보장합니다.
 *
 * ## 아키텍처 개요
 *
 * ```
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  Main Thread                                                    │
 * │  ┌─────────────┐     WorkerMessage      ┌──────────────────┐   │
 * │  │  React Hook │  ─────────────────────► │   Web Worker     │   │
 * │  │  useSearch  │  ◄───────────────────── │  SearchEngine    │   │
 * │  └─────────────┘     WorkerMessage      └──────────────────┘   │
 * └─────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @example
 * ```typescript
 * import type { SearchConfig, SearchResult, WorkerMessage } from '@soundblue/search';
 *
 * // 검색 설정
 * const config: SearchConfig = {
 *   fields: ['title', 'content'],
 *   storeFields: ['title', 'slug'],
 *   searchOptions: { boost: { title: 2 }, fuzzy: 0.2 },
 * };
 *
 * // Worker 초기화 메시지
 * const initMessage: WorkerMessage = {
 *   type: 'INIT',
 *   payload: { config, data: articles },
 * };
 * ```
 */

/**
 * 검색 가능한 아이템의 기본 인터페이스
 *
 * 검색 엔진에 인덱싱할 수 있는 모든 아이템은 이 인터페이스를 확장해야 합니다.
 * `id` 필드는 각 문서를 고유하게 식별하며, 검색 결과에서 원본 아이템을
 * 조회하는 데 사용됩니다.
 *
 * @example
 * ```typescript
 * // 기본 확장
 * interface Article extends SearchableItem {
 *   id: string;
 *   title: string;
 *   content: string;
 *   category: string;
 * }
 *
 * // 다국어 지원
 * interface Entry extends SearchableItem {
 *   id: string;
 *   word: { en: string; ko: string };
 *   definition: { en: string; ko: string };
 * }
 * ```
 */
export interface SearchableItem {
  /** 문서의 고유 식별자. 검색 결과에서 원본 아이템 조회에 사용됨. */
  id: string;
  /** 추가 필드 (동적으로 정의) */
  [key: string]: unknown;
}

/**
 * 검색 엔진 설정
 *
 * MiniSearch 인스턴스를 생성할 때 사용되는 설정입니다.
 * 검색할 필드, 결과에 저장할 필드, 검색 동작 옵션을 정의합니다.
 *
 * @example
 * ```typescript
 * // 한국어 사전 검색 설정
 * const dictionaryConfig: SearchConfig = {
 *   fields: ['korean', 'romanization', 'translations.en.word'],
 *   storeFields: ['korean', 'id', 'category'],
 *   searchOptions: {
 *     boost: {
 *       korean: 3,           // 한글 매칭 우선
 *       romanization: 2,     // 로마자 표기
 *       'translations.en.word': 1,
 *     },
 *     fuzzy: 0.2,            // 20% 오타 허용
 *     prefix: true,          // 접두어 매칭 활성화
 *   },
 * };
 *
 * // 코드 검색 설정 (오타 허용 낮게)
 * const codeConfig: SearchConfig = {
 *   fields: ['name', 'description', 'tags'],
 *   storeFields: ['name', 'id', 'type'],
 *   searchOptions: {
 *     boost: { name: 3, tags: 2, description: 1 },
 *     fuzzy: 0.1,            // 코드명은 정확히 매칭
 *     prefix: true,
 *   },
 * };
 * ```
 */
export interface SearchConfig {
  /**
   * 검색 대상 필드 목록
   *
   * 이 필드들에 대해 전문 검색 인덱스가 생성됩니다.
   * 중첩 필드는 점 표기법으로 접근 가능합니다 (예: `name.ko`).
   *
   * @example ['title', 'content', 'author.name', 'tags']
   */
  fields: string[];

  /**
   * 검색 결과에 저장할 필드 목록
   *
   * 검색 결과 객체에서 바로 접근할 수 있는 필드들입니다.
   * 인덱싱된 필드와 다를 수 있습니다 (예: 제목만 인덱싱하고 ID만 저장).
   *
   * @example ['id', 'title', 'slug']
   */
  storeFields: string[];

  /**
   * 검색 동작 옵션
   *
   * 부스팅, 퍼지 매칭, 접두어 매칭 등 검색 동작을 세밀하게 제어합니다.
   */
  searchOptions?: {
    /**
     * 필드별 가중치 (boost)
     *
     * 특정 필드의 매칭에 더 높은 점수를 부여합니다.
     * 값이 클수록 해당 필드 매칭 시 높은 점수를 받습니다.
     *
     * @example { title: 3, tags: 2, content: 1 }
     * @default {}
     */
    boost?: Record<string, number>;

    /**
     * 퍼지 매칭 허용 범위
     *
     * - `false`: 정확한 매칭만
     * - `true`: 기본 퍼지 매칭 (약 0.2)
     * - `number`: 0-1 사이 값. 허용 오타 비율 (0.2 = 20% 오타 허용)
     *
     * @example 0.2 // "hello" 검색 시 "helo", "helllo" 등도 매칭
     * @default 0.2
     */
    fuzzy?: number | boolean;

    /**
     * 접두어 매칭 활성화
     *
     * true일 경우, "hel"로 "hello", "help" 등을 찾을 수 있습니다.
     * 자동완성 기능 구현 시 필수입니다.
     *
     * @example true
     * @default true
     */
    prefix?: boolean;
  };
}

/**
 * 검색 결과 항목
 *
 * 검색 쿼리에 매칭된 단일 문서의 정보를 담습니다.
 * 관련도 점수, 매칭된 필드 정보, 원본 아이템을 포함합니다.
 *
 * @typeParam T - 검색된 아이템의 타입. `SearchableItem`을 확장해야 합니다.
 *
 * @example
 * ```typescript
 * const results: SearchResult<Article>[] = engine.search('react', 5);
 *
 * results.forEach(result => {
 *   console.log(`ID: ${result.id}`);
 *   console.log(`점수: ${result.score.toFixed(2)}`);
 *   console.log(`매칭 필드: ${Object.keys(result.match).join(', ')}`);
 *   console.log(`제목: ${result.item?.title}`);
 * });
 * ```
 */
export interface SearchResult<T = SearchableItem> {
  /** 매칭된 문서의 ID */
  id: string;

  /**
   * 관련도 점수
   *
   * BM25 알고리즘 기반 점수. 높을수록 쿼리와 관련성이 높습니다.
   * 부스트 설정에 따라 가중치가 적용됩니다.
   */
  score: number;

  /**
   * 필드별 매칭 정보
   *
   * 어떤 필드에서 어떤 검색어가 매칭되었는지 나타냅니다.
   * 검색 결과 하이라이팅에 활용할 수 있습니다.
   *
   * @example { title: ['react'], content: ['react', 'hooks'] }
   */
  match: Record<string, string[]>;

  /**
   * 원본 아이템 (선택적)
   *
   * `storeFields`에 지정된 필드들을 포함한 원본 문서입니다.
   * 인덱스 로드 방식에 따라 undefined일 수 있습니다.
   */
  item?: T;
}

/**
 * Web Worker 메시지 프로토콜
 *
 * 메인 스레드와 검색 Worker 간의 통신에 사용되는 메시지 타입입니다.
 * Discriminated Union으로 구현되어 타입 안전한 메시지 처리가 가능합니다.
 *
 * ## 메시지 흐름
 *
 * ```
 * Main Thread                         Worker Thread
 *     │                                    │
 *     │─── INIT (config, data) ───────────►│ 인덱스 생성
 *     │◄───────────── READY ───────────────│
 *     │                                    │
 *     │─── SEARCH (query, limit) ─────────►│ 검색 실행
 *     │◄────────── RESULTS (items) ────────│
 *     │                                    │
 *     │─── SUGGEST (query, limit) ────────►│ 자동완성
 *     │◄──────── SUGGESTIONS (terms) ──────│
 *     │                                    │
 *     │◄─────────── ERROR (msg) ───────────│ (에러 발생 시)
 *     ▼                                    ▼
 * ```
 *
 * ## 사용 예시
 *
 * ### 워커 초기화
 * ```typescript
 * const worker = new Worker('/search.worker.js');
 *
 * // 인덱스 초기화
 * worker.postMessage({
 *   type: 'INIT',
 *   payload: {
 *     config: { fields: ['title'], storeFields: ['title', 'id'] },
 *     data: [{ id: '1', title: 'Hello World' }],
 *   },
 * } satisfies WorkerMessage);
 *
 * // 응답 처리
 * worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
 *   switch (e.data.type) {
 *     case 'READY':
 *       console.log('검색 엔진 준비 완료');
 *       break;
 *     case 'RESULTS':
 *       console.log('검색 결과:', e.data.payload);
 *       break;
 *     case 'ERROR':
 *       console.error('에러:', e.data.error);
 *       break;
 *   }
 * };
 * ```
 *
 * ### 검색 실행
 * ```typescript
 * worker.postMessage({
 *   type: 'SEARCH',
 *   payload: { query: 'hello', limit: 10 },
 * } satisfies WorkerMessage);
 * ```
 *
 * @see {@link SearchConfig} 검색 엔진 설정
 * @see {@link SearchResult} 검색 결과 형식
 */
export type WorkerMessage =
  /**
   * 인덱스 초기화 요청 (Main → Worker)
   *
   * Worker 시작 시 첫 번째로 보내야 하는 메시지입니다.
   * 검색 설정과 인덱싱할 데이터를 전달합니다.
   */
  | {
      type: 'INIT';
      payload: {
        /** 검색 엔진 설정 */
        config: SearchConfig;
        /** 인덱싱할 데이터 배열 */
        data: SearchableItem[];
      };
    }
  /**
   * 검색 요청 (Main → Worker)
   *
   * READY 메시지 수신 후에만 사용할 수 있습니다.
   * 쿼리와 매칭되는 문서를 검색합니다.
   */
  | {
      type: 'SEARCH';
      payload: {
        /** 검색 쿼리 문자열 */
        query: string;
        /** 반환할 최대 결과 수 (기본값: 전체) */
        limit?: number;
      };
    }
  /**
   * 자동완성 요청 (Main → Worker)
   *
   * 사용자 입력에 대한 검색어 제안을 요청합니다.
   * 타이핑 중 실시간 제안에 사용됩니다.
   */
  | {
      type: 'SUGGEST';
      payload: {
        /** 현재 입력 중인 문자열 */
        query: string;
        /** 반환할 최대 제안 수 (기본값: 5) */
        limit?: number;
      };
    }
  /**
   * 초기화 완료 알림 (Worker → Main)
   *
   * INIT 요청 처리가 완료되어 검색 준비가 되었음을 알립니다.
   */
  | { type: 'READY' }
  /**
   * 검색 결과 응답 (Worker → Main)
   *
   * SEARCH 요청에 대한 응답입니다.
   * 관련도 순으로 정렬된 검색 결과를 포함합니다.
   */
  | { type: 'RESULTS'; payload: SearchResult[] }
  /**
   * 자동완성 제안 응답 (Worker → Main)
   *
   * SUGGEST 요청에 대한 응답입니다.
   * 입력과 매칭되는 검색어 제안 목록을 포함합니다.
   */
  | { type: 'SUGGESTIONS'; payload: string[] }
  /**
   * 에러 알림 (Worker → Main)
   *
   * 처리 중 에러 발생 시 전송됩니다.
   * 초기화 전 SEARCH/SUGGEST 요청 시에도 발생합니다.
   */
  | { type: 'ERROR'; error: string };
