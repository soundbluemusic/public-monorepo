/**
 * 청크 기반 SSG 빌드 오케스트레이터
 *
 * 100만+ 페이지 규모의 SSG 빌드를 청크 단위로 분할하여 실행합니다.
 * 각 청크는 독립적인 빌드 프로세스로 실행되어 메모리 사용량을 최적화합니다.
 *
 * @example
 * ```bash
 * # 기본 실행 (50K 청크)
 * pnpm build:chunked
 *
 * # 커스텀 청크 크기
 * CHUNK_SIZE=100000 pnpm build:chunked
 *
 * # 특정 청크만 빌드
 * CHUNK_INDEX=0 pnpm build:chunked
 * ```
 */

import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

/** 기본 청크 크기 */
const DEFAULT_CHUNK_SIZE = 50000;

/** 메모리 제한 (MB) */
const NODE_MEMORY_LIMIT = 8192;

interface ChunkBuildResult {
  chunkIndex: number;
  success: boolean;
  duration: number;
  routeCount: number;
  error?: string;
}

/**
 * 청크 메타데이터를 가져옵니다.
 */
async function getChunkMetadata(chunkSize: number): Promise<{
  totalEntries: number;
  totalChunks: number;
  chunkSize: number;
  routesPerChunk: number;
}> {
  const { getChunkMetadata } = await import('../app/data/route-chunks.js');
  return getChunkMetadata(chunkSize);
}

/**
 * 단일 청크를 빌드합니다.
 */
function buildChunk(chunkIndex: number, chunkSize: number): ChunkBuildResult {
  const startTime = Date.now();

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔨 Building chunk ${chunkIndex}...`);
  console.log('='.repeat(60));

  try {
    execSync(
      `BUILD_TARGET=chunked CHUNK_INDEX=${chunkIndex} CHUNK_SIZE=${chunkSize} react-router build`,
      {
        cwd: projectRoot,
        stdio: 'inherit',
        env: {
          ...process.env,
          NODE_OPTIONS: `--max-old-space-size=${NODE_MEMORY_LIMIT}`,
        },
      },
    );

    const duration = Date.now() - startTime;

    return {
      chunkIndex,
      success: true,
      duration,
      routeCount: chunkSize * 2, // 한영 각각
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    return {
      chunkIndex,
      success: false,
      duration,
      routeCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 모든 청크의 빌드 결과물을 병합합니다.
 */
function mergeChunks(totalChunks: number): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log('📦 Merging chunk outputs...');
  console.log('='.repeat(60));

  const finalOutputDir = join(projectRoot, 'build', 'client');
  const chunksDir = join(projectRoot, 'build', 'chunks');

  // 청크 출력 디렉토리가 없으면 생성
  if (!existsSync(chunksDir)) {
    mkdirSync(chunksDir, { recursive: true });
  }

  // 각 청크의 entry 폴더를 병합
  for (let i = 0; i < totalChunks; i++) {
    const chunkEntryDir = join(chunksDir, `chunk-${i}`, 'entry');
    if (existsSync(chunkEntryDir)) {
      const targetDir = join(finalOutputDir, 'entry');
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }
      cpSync(chunkEntryDir, targetDir, { recursive: true });
      console.log(`   ✓ Merged chunk ${i} entries`);
    }
  }

  console.log('✅ Merge complete!');
}

/**
 * 빌드 결과 요약을 출력합니다.
 */
function printSummary(results: ChunkBuildResult[], totalDuration: number): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 Chunked Build Summary');
  console.log('='.repeat(60));

  let totalRoutes = 0;

  for (const result of results) {
    const status = result.success ? '✅' : '❌';
    const time = `${(result.duration / 1000).toFixed(1)}s`;
    console.log(`   ${status} Chunk ${result.chunkIndex}: ${result.routeCount} routes (${time})`);
    totalRoutes += result.routeCount;
  }

  console.log('-'.repeat(60));
  console.log(`   Total routes: ${totalRoutes}`);
  console.log(`   Total time: ${(totalDuration / 1000).toFixed(1)}s`);

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.log(`\n❌ ${failed.length} chunk(s) failed`);
    process.exit(1);
  } else {
    console.log('\n✅ All chunks built successfully!');
  }
}

async function main(): Promise<void> {
  const startTime = Date.now();
  const chunkSize = parseInt(process.env.CHUNK_SIZE || String(DEFAULT_CHUNK_SIZE), 10);
  const specificChunk = process.env.CHUNK_INDEX ? parseInt(process.env.CHUNK_INDEX, 10) : null;

  console.log('🚀 Starting chunked SSG build...');
  console.log(`   Chunk size: ${chunkSize}`);
  console.log(`   Memory limit: ${NODE_MEMORY_LIMIT}MB`);

  // 메타데이터 가져오기
  const metadata = await getChunkMetadata(chunkSize);

  console.log(`   Total entries: ${metadata.totalEntries}`);
  console.log(`   Total chunks: ${metadata.totalChunks}`);

  const results: ChunkBuildResult[] = [];

  if (specificChunk !== null) {
    // 특정 청크만 빌드
    console.log(`\n📌 Building only chunk ${specificChunk}`);
    const result = buildChunk(specificChunk, chunkSize);
    results.push(result);
  } else {
    // 모든 청크 순차 빌드
    for (let i = 0; i < metadata.totalChunks; i++) {
      const result = buildChunk(i, chunkSize);
      results.push(result);

      // 실패 시 중단
      if (!result.success) {
        console.error(`\n❌ Chunk ${i} failed, stopping build`);
        break;
      }
    }

    // 병합 (모든 청크 성공 시)
    const allSuccess = results.every((r) => r.success);
    if (allSuccess && metadata.totalChunks > 1) {
      mergeChunks(metadata.totalChunks);
    }
  }

  // 요약 출력
  const totalDuration = Date.now() - startTime;
  printSummary(results, totalDuration);
}

main().catch((err) => {
  console.error('Chunked build failed:', err);
  process.exit(1);
});
