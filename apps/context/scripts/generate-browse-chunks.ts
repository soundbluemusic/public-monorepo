/**
 * Browse 청크 데이터 생성 스크립트
 *
 * by-category/*.json 파일들에서 모든 엔트리를 읽어서
 * alphabetical/category/recent 청크를 생성합니다.
 *
 * 실행: tsx apps/context/scripts/generate-browse-chunks.ts
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface LightEntry {
  id: string;
  korean: string;
  romanization: string;
  categoryId: string;
  word: {
    ko: string;
    en: string;
  };
}

interface ChunkFile {
  chunkIndex: number;
  entries: LightEntry[];
  hasMore: boolean;
}

const CHUNK_SIZE = 1000;
const BY_CATEGORY_DIR = join(__dirname, '../public/data/by-category');
const BROWSE_DIR = join(__dirname, '../public/data/browse');

function loadAllEntries(): LightEntry[] {
  const files = readdirSync(BY_CATEGORY_DIR).filter(
    (f) => f.endsWith('.json') && f !== 'meta.json',
  );
  const allEntries: LightEntry[] = [];

  for (const file of files) {
    const content = readFileSync(join(BY_CATEGORY_DIR, file), 'utf-8');
    const entries: LightEntry[] = JSON.parse(content);
    allEntries.push(...entries);
  }

  return allEntries;
}

function sortAlphabetically(entries: LightEntry[]): LightEntry[] {
  return [...entries].sort((a, b) => a.korean.localeCompare(b.korean, 'ko'));
}

function sortByCategory(entries: LightEntry[]): LightEntry[] {
  return [...entries].sort((a, b) => {
    const catCompare = a.categoryId.localeCompare(b.categoryId);
    if (catCompare !== 0) return catCompare;
    return a.korean.localeCompare(b.korean, 'ko');
  });
}

function createChunks(entries: LightEntry[]): ChunkFile[] {
  const chunks: ChunkFile[] = [];
  const totalChunks = Math.ceil(entries.length / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, entries.length);
    chunks.push({
      chunkIndex: i,
      entries: entries.slice(start, end),
      hasMore: i < totalChunks - 1,
    });
  }

  return chunks;
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function writeChunks(sortType: string, chunks: ChunkFile[]): void {
  const dir = join(BROWSE_DIR, sortType);
  ensureDir(dir);

  for (const chunk of chunks) {
    const filePath = join(dir, `chunk-${chunk.chunkIndex}.json`);
    writeFileSync(filePath, JSON.stringify(chunk));
  }

  // meta.json도 생성
  const metaPath = join(dir, 'meta.json');
  writeFileSync(
    metaPath,
    JSON.stringify({
      totalChunks: chunks.length,
      totalEntries: chunks.reduce((sum, c) => sum + c.entries.length, 0),
      chunkSize: CHUNK_SIZE,
    }),
  );

  console.log(
    `  ${sortType}: ${chunks.length} chunks, ${chunks.reduce((sum, c) => sum + c.entries.length, 0)} entries`,
  );
}

function main(): void {
  console.log('📦 Generating browse chunks...\n');

  // 모든 엔트리 로드
  const allEntries = loadAllEntries();
  console.log(`Loaded ${allEntries.length} entries from ${BY_CATEGORY_DIR}\n`);

  // alphabetical 청크 생성
  const alphabeticalEntries = sortAlphabetically(allEntries);
  const alphabeticalChunks = createChunks(alphabeticalEntries);
  writeChunks('alphabetical', alphabeticalChunks);

  // category 청크 생성
  const categoryEntries = sortByCategory(allEntries);
  const categoryChunks = createChunks(categoryEntries);
  writeChunks('category', categoryChunks);

  // recent 청크 (alphabetical과 동일 - 날짜 정보 없음)
  writeChunks('recent', alphabeticalChunks);

  // 루트 meta.json 업데이트
  const rootMetaPath = join(BROWSE_DIR, 'meta.json');
  writeFileSync(
    rootMetaPath,
    JSON.stringify(
      {
        totalEntries: allEntries.length,
        chunkSize: CHUNK_SIZE,
        totalChunks: alphabeticalChunks.length,
        sortTypes: ['alphabetical', 'category', 'recent'],
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  console.log(`\n✅ Browse chunks generated successfully!`);
  console.log(
    `   Root meta.json updated: ${allEntries.length} entries, ${alphabeticalChunks.length} chunks`,
  );
}

main();
