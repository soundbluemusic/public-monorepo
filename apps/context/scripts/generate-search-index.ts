/**
 * @fileoverview Context 앱 검색 인덱스 생성 스크립트
 *
 * 빌드 시점에 meaningEntries에서 검색용 JSON 인덱스를 생성합니다.
 * Web Worker에서 Fuse.js와 함께 사용됩니다.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// 엔트리 데이터 import (load-entries.ts 실행 후 생성됨)
import { meaningEntries } from '../app/data/entries/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '../public');
const OUTPUT_PATH = join(PUBLIC_DIR, 'search-index.json');

interface SearchIndexItem {
  id: string;
  type: 'entry';
  name: { en: string; ko: string };
  description: { en: string; ko: string };
  field: string;
  tags: string[];
}

function generateSearchIndex() {
  console.log(`Generating search index for ${meaningEntries.length} entries...`);

  const searchIndex: SearchIndexItem[] = meaningEntries.map((entry) => ({
    id: entry.id,
    type: 'entry' as const,
    name: {
      ko: entry.korean,
      en: entry.translations.en.word,
    },
    description: {
      ko: entry.translations.ko.explanation.slice(0, 100),
      en: entry.translations.en.explanation.slice(0, 100),
    },
    field: entry.categoryId,
    tags: [...entry.tags, entry.romanization],
  }));

  // public 디렉토리가 없으면 생성
  mkdirSync(PUBLIC_DIR, { recursive: true });

  // JSON 파일 생성 (formatted for biome)
  const jsonContent = JSON.stringify(searchIndex, null, 2);
  writeFileSync(OUTPUT_PATH, `${jsonContent}\n`, 'utf-8');

  const sizeKB = (Buffer.byteLength(jsonContent) / 1024).toFixed(1);
  console.log(`✓ Generated search-index.json (${sizeKB} KB, ${searchIndex.length} items)`);
}

generateSearchIndex();
