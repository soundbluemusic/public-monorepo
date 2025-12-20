/**
 * @fileoverview 빌드 시점에 검색용 경량 JSON 생성
 *
 * 전체 개념 데이터에서 검색에 필요한 최소 정보만 추출하여
 * /public/search-index.json 파일로 생성합니다.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// 개념 데이터 import
import { allConcepts } from '../app/data/concepts/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '../public/search-index.json');
const CONCEPTS_OUTPUT_PATH = join(__dirname, '../public/concepts.json');
const CONCEPT_NAMES_PATH = join(__dirname, '../public/concept-names.json');

interface SearchIndexItem {
  id: string;
  name: { ko: string; en: string };
  field: string;
  subfield: string;
  difficulty: number;
  tags: string[];
  // 검색용 정의 (짧게)
  def: { ko: string; en: string };
}

function generateSearchIndex() {
  console.log(`Generating search index for ${allConcepts.length} concepts...`);

  const searchIndex: SearchIndexItem[] = allConcepts.map((concept) => ({
    id: concept.id,
    name: concept.name,
    field: concept.field,
    subfield: concept.subfield,
    difficulty: concept.difficulty,
    tags: concept.tags,
    def: {
      ko: (concept.content.ko?.definition ?? concept.content.en?.definition ?? '').slice(0, 100),
      en: (concept.content.en?.definition ?? concept.content.ko?.definition ?? '').slice(0, 100),
    },
  }));

  // public 디렉토리가 없으면 생성
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

  // JSON 파일 생성
  writeFileSync(OUTPUT_PATH, JSON.stringify(searchIndex), 'utf-8');

  const sizeKB = (Buffer.byteLength(JSON.stringify(searchIndex)) / 1024).toFixed(1);
  console.log(`✓ Generated search-index.json (${sizeKB} KB, ${searchIndex.length} items)`);

  // 전체 개념 데이터도 JSON으로 생성 (페이지 렌더링용)
  writeFileSync(CONCEPTS_OUTPUT_PATH, JSON.stringify(allConcepts), 'utf-8');
  const conceptsSizeKB = (Buffer.byteLength(JSON.stringify(allConcepts)) / 1024).toFixed(1);
  console.log(`✓ Generated concepts.json (${conceptsSizeKB} KB, ${allConcepts.length} items)`);

  // 개념 이름만 담은 경량 맵 생성 (RelationLinks용)
  const conceptNames: Record<string, { ko: string; en: string }> = {};
  for (const concept of allConcepts) {
    conceptNames[concept.id] = concept.name;
  }
  writeFileSync(CONCEPT_NAMES_PATH, JSON.stringify(conceptNames), 'utf-8');
  const namesSizeKB = (Buffer.byteLength(JSON.stringify(conceptNames)) / 1024).toFixed(1);
  console.log(
    `✓ Generated concept-names.json (${namesSizeKB} KB, ${Object.keys(conceptNames).length} items)`,
  );
}

generateSearchIndex();
