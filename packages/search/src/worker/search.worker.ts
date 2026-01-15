/**
 * @fileoverview Search Web Worker
 * @environment client-only (Web Worker context)
 *
 * 메인 스레드를 차단하지 않고 백그라운드에서 전문 검색을 수행하는 Web Worker입니다.
 * 대용량 데이터셋(1000+ 문서) 검색 시 UI 응답성을 유지합니다.
 *
 * ## 아키텍처
 *
 * ```
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  Main Thread (UI)                                               │
 * │  ┌─────────────────────────────────────────────────────────┐   │
 * │  │  useSearch() Hook                                        │   │
 * │  │  - 사용자 입력 디바운싱                                    │   │
 * │  │  - UI 상태 관리 (isLoading, results)                      │   │
 * │  │  - Worker 메시지 송수신                                    │   │
 * │  └─────────────────────────────────────────────────────────┘   │
 * │                              │ postMessage                      │
 * │                              ▼                                  │
 * └──────────────────────────────┬──────────────────────────────────┘
 *                                │
 * ┌──────────────────────────────┼──────────────────────────────────┐
 * │  Worker Thread               │                                  │
 * │  ┌───────────────────────────▼─────────────────────────────┐   │
 * │  │  search.worker.ts (이 파일)                              │   │
 * │  │  - SearchEngine 인스턴스 관리                            │   │
 * │  │  - INIT: 인덱스 생성                                     │   │
 * │  │  - SEARCH: 검색 실행                                     │   │
 * │  │  - SUGGEST: 자동완성 제안                                │   │
 * │  └─────────────────────────────────────────────────────────┘   │
 * │                                                                 │
 * │  ⚡ 메인 스레드와 완전 분리 → UI 블로킹 없음                    │
 * └─────────────────────────────────────────────────────────────────┘
 * ```
 *
 * ## 상태 관리
 *
 * Worker는 단일 `engine` 인스턴스를 모듈 레벨에서 관리합니다.
 * - INIT 전: `engine = null` → SEARCH/SUGGEST 요청 시 ERROR 응답
 * - INIT 후: `engine` 인스턴스 생성 → 검색 준비 완료
 *
 * ## 사용 시점
 *
 * | 데이터 크기 | 권장 방식 | 이유 |
 * |------------|----------|------|
 * | < 500 문서 | 동기 SearchEngine | Worker 오버헤드 불필요 |
 * | 500-2000 문서 | 선택적 | 상황에 따라 판단 |
 * | > 2000 문서 | Web Worker | UI 블로킹 방지 필수 |
 *
 * ## 예제: React에서 사용
 *
 * ```typescript
 * // 1. Worker 생성 (Vite)
 * const worker = new Worker(
 *   new URL('@soundblue/search/worker/search.worker', import.meta.url),
 *   { type: 'module' }
 * );
 *
 * // 2. 초기화
 * useEffect(() => {
 *   worker.postMessage({
 *     type: 'INIT',
 *     payload: { config, data: documents },
 *   });
 *
 *   worker.onmessage = (e) => {
 *     switch (e.data.type) {
 *       case 'READY':
 *         setIsReady(true);
 *         break;
 *       case 'RESULTS':
 *         setResults(e.data.payload);
 *         break;
 *     }
 *   };
 *
 *   return () => worker.terminate();
 * }, []);
 *
 * // 3. 검색 실행
 * const handleSearch = (query: string) => {
 *   worker.postMessage({ type: 'SEARCH', payload: { query, limit: 10 } });
 * };
 * ```
 *
 * @see {@link WorkerMessage} 메시지 프로토콜 타입
 * @see {@link SearchEngine} 핵심 검색 엔진 클래스
 */
import { SearchEngine } from '../core/engine';
import type { SearchableItem, WorkerMessage } from '../core/types';

/**
 * 검색 엔진 인스턴스
 *
 * 모듈 레벨에서 관리되어 Worker 생명주기 동안 유지됩니다.
 * INIT 메시지 처리 시 초기화되며, Worker 종료 시 자동 해제됩니다.
 *
 * ⚠️ null 체크 필수: INIT 전에 SEARCH/SUGGEST 요청이 오면 ERROR 응답
 */
let engine: SearchEngine<SearchableItem> | null = null;

/**
 * 메시지 핸들러
 *
 * 메인 스레드로부터 수신한 메시지를 처리합니다.
 * Discriminated Union 패턴으로 타입 안전한 메시지 분기를 수행합니다.
 *
 * @param e - MessageEvent containing WorkerMessage
 *
 * ## 메시지 처리 흐름
 *
 * ```
 * onmessage
 *     │
 *     ├─── type: 'INIT'
 *     │    └─► SearchEngine 생성 → addAll(data) → postMessage(READY)
 *     │
 *     ├─── type: 'SEARCH'
 *     │    ├─► engine null? → postMessage(ERROR)
 *     │    └─► engine.search() → postMessage(RESULTS)
 *     │
 *     └─── type: 'SUGGEST'
 *          ├─► engine null? → postMessage(ERROR)
 *          └─► engine.suggest() → postMessage(SUGGESTIONS)
 * ```
 */
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const message = e.data;

  switch (message.type) {
    /**
     * 인덱스 초기화 처리
     *
     * 1. 설정과 데이터를 받아 SearchEngine 인스턴스 생성
     * 2. 모든 문서를 인덱싱 (addAll)
     * 3. READY 메시지로 완료 알림
     *
     * ⏱️ 시간 복잡도: O(n * m) - n: 문서 수, m: 필드 당 평균 토큰 수
     */
    case 'INIT': {
      const { config, data } = message.payload;
      engine = new SearchEngine(config);
      engine.addAll(data);
      self.postMessage({ type: 'READY' } satisfies WorkerMessage);
      break;
    }

    /**
     * 검색 요청 처리
     *
     * 1. 엔진 초기화 여부 확인
     * 2. 쿼리로 검색 실행 (BM25 + 퍼지 매칭)
     * 3. 관련도 순 정렬된 결과 반환
     *
     * ⏱️ 시간 복잡도: O(log n) - 역인덱스 기반 검색
     */
    case 'SEARCH': {
      if (!engine) {
        self.postMessage({
          type: 'ERROR',
          error: 'Engine not initialized',
        } satisfies WorkerMessage);
        return;
      }
      const { query, limit } = message.payload;
      const results = engine.search(query, limit);
      self.postMessage({
        type: 'RESULTS',
        payload: results,
      } satisfies WorkerMessage);
      break;
    }

    /**
     * 자동완성 요청 처리
     *
     * 1. 엔진 초기화 여부 확인
     * 2. 접두어 기반 검색어 제안 생성
     * 3. 관련도 순 정렬된 제안 목록 반환
     *
     * ⏱️ 시간 복잡도: O(k) - k: 접두어 매칭 결과 수
     */
    case 'SUGGEST': {
      if (!engine) {
        self.postMessage({
          type: 'ERROR',
          error: 'Engine not initialized',
        } satisfies WorkerMessage);
        return;
      }
      const { query, limit } = message.payload;
      const suggestions = engine.suggest(query, limit);
      self.postMessage({
        type: 'SUGGESTIONS',
        payload: suggestions,
      } satisfies WorkerMessage);
      break;
    }
  }
};
