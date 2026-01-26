/**
 * 청크 기반 라우트 생성
 *
 * 100만 페이지 규모 확장을 위해 라우트를 청크 단위로 분할합니다.
 * 각 청크는 독립적으로 빌드되어 메모리 사용량을 줄입니다.
 *
 * 메모리 계산:
 * - 100만 라우트 × 2 (한영) = 200만 경로
 * - 평균 30자 × 200만 = ~60MB 문자열 배열
 * - 청크당 5만개 = ~3MB (안전한 범위)
 *
 * @example
 * ```bash
 * # 청크 0 빌드 (0-49,999)
 * BUILD_TARGET=chunked CHUNK_INDEX=0 CHUNK_SIZE=50000 pnpm build:context
 *
 * # 청크 1 빌드 (50,000-99,999)
 * BUILD_TARGET=chunked CHUNK_INDEX=1 CHUNK_SIZE=50000 pnpm build:context
 * ```
 */

import { generateI18nRoutes } from '@soundblue/i18n';

/** 기본 청크 크기 (50K 라우트) */
export const DEFAULT_CHUNK_SIZE = 50000;

/**
 * 엔트리 ID 목록을 가져옵니다.
 * 이 함수는 빌드 시점에만 호출됩니다.
 */
async function getAllEntryIds(): Promise<string[]> {
  const { entryIndex } = await import('./generated/entry-index.js');
  return Object.keys(entryIndex);
}

/**
 * 총 청크 수를 계산합니다.
 *
 * @param chunkSize - 청크당 엔트리 수
 * @returns 총 청크 수
 */
export async function getTotalChunks(chunkSize: number = DEFAULT_CHUNK_SIZE): Promise<number> {
  const entryIds = await getAllEntryIds();
  return Math.ceil(entryIds.length / chunkSize);
}

/**
 * 특정 청크의 라우트를 생성합니다.
 *
 * @param chunkIndex - 청크 인덱스 (0부터 시작)
 * @param chunkSize - 청크당 엔트리 수
 * @returns 해당 청크의 라우트 배열 (한영 모두 포함)
 */
export async function getRouteChunk(
  chunkIndex: number,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
): Promise<string[]> {
  const entryIds = await getAllEntryIds();

  const start = chunkIndex * chunkSize;
  const end = Math.min(start + chunkSize, entryIds.length);

  // 범위 초과 시 빈 배열 반환
  if (start >= entryIds.length) {
    console.log(
      `[chunk:${chunkIndex}] No entries in this range (start=${start}, total=${entryIds.length})`,
    );
    return [];
  }

  const chunkIds = entryIds.slice(start, end);

  // 한영 라우트 생성
  const routes = generateI18nRoutes(chunkIds, (id) => `/entry/${id}`);

  console.log(
    `[chunk:${chunkIndex}] Generated ${routes.length} routes (entries ${start}-${end - 1} of ${entryIds.length})`,
  );

  return routes;
}

/**
 * 청크 메타데이터를 반환합니다.
 */
export async function getChunkMetadata(chunkSize: number = DEFAULT_CHUNK_SIZE): Promise<{
  totalEntries: number;
  totalChunks: number;
  chunkSize: number;
  routesPerChunk: number; // 한영 포함
}> {
  const entryIds = await getAllEntryIds();
  const totalChunks = Math.ceil(entryIds.length / chunkSize);

  return {
    totalEntries: entryIds.length,
    totalChunks,
    chunkSize,
    routesPerChunk: chunkSize * 2, // 한영 각각
  };
}
