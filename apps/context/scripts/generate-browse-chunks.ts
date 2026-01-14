/**
 * Browse 페이지용 청크 JSON 생성 스크립트
 *
 * 16,836개의 lightEntries를 1000개씩 청크로 분리하여
 * /public/data/browse/ 폴더에 정적 JSON 파일로 저장합니다.
 *
 * ## 생성 파일
 * - public/data/browse/meta.json - 메타데이터 (총 개수, 청크 수, 청크 크기)
 * - public/data/browse/alphabetical/chunk-0.json ... chunk-N.json
 * - public/data/browse/category/chunk-0.json ... chunk-N.json
 * - public/data/browse/recent/chunk-0.json ... chunk-N.json
 *
 * ## 사용처
 * - ($locale).browse.tsx: 초기 로드 시 첫 청크만 로드
 * - useBrowseFilters.ts: 페이지 전환 시 필요한 청크만 fetch
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

/** 청크당 엔트리 수 */
const CHUNK_SIZE = 1000;

/** 정렬 타입 */
type SortType = 'alphabetical' | 'category' | 'recent';

interface BrowseMetadata {
  totalEntries: number;
  chunkSize: number;
  totalChunks: number;
  sortTypes: SortType[];
  generatedAt: string;
}

interface ChunkFile {
  chunkIndex: number;
  entries: unknown[];
  hasMore: boolean;
}

async function main(): Promise<void> {
  const startTime = Date.now();
  console.log('🚀 Generating browse chunks...\n');

  // 1. lightEntries 로드
  const { lightEntries } = await import('../app/data/generated/entries.js');
  console.log(`📦 Loaded ${lightEntries.length} entries`);

  // 2. 정렬된 배열 생성
  const sortedArrays: Record<SortType, typeof lightEntries> = {
    alphabetical: [...lightEntries].sort((a, b) => a.korean.localeCompare(b.korean, 'ko')),
    category: [...lightEntries].sort((a, b) => {
      if (a.categoryId === b.categoryId) {
        return a.korean.localeCompare(b.korean, 'ko');
      }
      return a.categoryId.localeCompare(b.categoryId);
    }),
    recent: [...lightEntries].reverse(),
  };

  // 3. 출력 디렉토리 생성
  const outputDir = join(PROJECT_ROOT, 'public/data/browse');
  const sortTypes: SortType[] = ['alphabetical', 'category', 'recent'];

  for (const sortType of sortTypes) {
    const sortDir = join(outputDir, sortType);
    if (!existsSync(sortDir)) {
      mkdirSync(sortDir, { recursive: true });
    }
  }

  // 4. 청크 생성
  const totalEntries = lightEntries.length;
  const totalChunks = Math.ceil(totalEntries / CHUNK_SIZE);

  console.log(`\n📊 Chunk configuration:`);
  console.log(`   - Chunk size: ${CHUNK_SIZE}`);
  console.log(`   - Total chunks per sort: ${totalChunks}`);
  console.log(`   - Sort types: ${sortTypes.join(', ')}`);

  let filesCreated = 0;

  for (const sortType of sortTypes) {
    const sortedEntries = sortedArrays[sortType];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, totalEntries);
      const chunkEntries = sortedEntries.slice(start, end);

      const chunkFile: ChunkFile = {
        chunkIndex: i,
        entries: chunkEntries,
        hasMore: end < totalEntries,
      };

      const filePath = join(outputDir, sortType, `chunk-${i}.json`);
      writeFileSync(filePath, JSON.stringify(chunkFile));
      filesCreated++;
    }

    console.log(`   ✅ ${sortType}: ${totalChunks} chunks`);
  }

  // 5. 메타데이터 생성
  const metadata: BrowseMetadata = {
    totalEntries,
    chunkSize: CHUNK_SIZE,
    totalChunks,
    sortTypes,
    generatedAt: new Date().toISOString(),
  };

  const metaPath = join(outputDir, 'meta.json');
  writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
  filesCreated++;

  // 6. 첫 페이지용 통합 파일 생성 (SSG loader용)
  // 각 정렬 타입의 첫 청크를 하나의 파일로 통합
  const initialData = {
    alphabetical: sortedArrays.alphabetical.slice(0, CHUNK_SIZE),
    category: sortedArrays.category.slice(0, CHUNK_SIZE),
    recent: sortedArrays.recent.slice(0, CHUNK_SIZE),
    meta: metadata,
  };

  const initialPath = join(outputDir, 'initial.json');
  writeFileSync(initialPath, JSON.stringify(initialData));
  filesCreated++;

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✅ Generated ${filesCreated} files in ${duration}s`);
  console.log(`   Output: ${outputDir}`);
}

main().catch((err) => {
  console.error('❌ Failed to generate browse chunks:', err);
  process.exit(1);
});
