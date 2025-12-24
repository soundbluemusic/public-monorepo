/**
 * @fileoverview Permissive 앱 검색 인덱스 생성 스크립트
 *
 * 빌드 시점에 libraries와 web-apis 데이터에서 검색용 JSON 인덱스를 생성합니다.
 * Web Worker에서 Fuse.js와 함께 사용됩니다.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// 데이터 import
import { libraries } from '../app/data/libraries.js';
import { webApis } from '../app/data/web-apis.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '../public');
const OUTPUT_PATH = join(PUBLIC_DIR, 'search-index.json');

interface SearchIndexItem {
  id: string;
  type: 'library' | 'api';
  name: { en: string; ko: string };
  description: { en: string; ko: string };
  field: string;
  tags: string[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateSearchIndex() {
  const searchIndex: SearchIndexItem[] = [];

  // Libraries
  for (const lib of libraries) {
    searchIndex.push({
      id: `lib-${slugify(lib.name)}`,
      type: 'library',
      name: {
        en: lib.name,
        ko: lib.name,
      },
      description: {
        en: lib.description,
        ko: lib.descriptionKo,
      },
      field: lib.category,
      tags: lib.tags || [],
    });
  }

  // Web APIs
  for (const api of webApis) {
    searchIndex.push({
      id: `api-${slugify(api.name)}`,
      type: 'api',
      name: {
        en: api.name,
        ko: api.name,
      },
      description: {
        en: api.description,
        ko: api.descriptionKo,
      },
      field: api.category,
      tags: [],
    });
  }

  console.log(
    `Generating search index for ${libraries.length} libraries + ${webApis.length} APIs...`,
  );

  // public 디렉토리가 없으면 생성
  mkdirSync(PUBLIC_DIR, { recursive: true });

  // JSON 파일 생성 (formatted for biome)
  const jsonContent = JSON.stringify(searchIndex, null, 2);
  writeFileSync(OUTPUT_PATH, `${jsonContent}\n`, 'utf-8');

  const sizeKB = (Buffer.byteLength(jsonContent) / 1024).toFixed(1);
  console.log(`✓ Generated search-index.json (${sizeKB} KB, ${searchIndex.length} items)`);
}

generateSearchIndex();
