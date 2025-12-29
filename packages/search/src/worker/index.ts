/**
 * @soundblue/search - Worker
 *
 * Web Worker 기반 검색
 */

// Worker 파일 경로를 export (사용처에서 new Worker()로 생성)
export const SEARCH_WORKER_PATH = new URL('./search.worker.ts', import.meta.url);
