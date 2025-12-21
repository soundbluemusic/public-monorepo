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
const PUBLIC_DIR = join(__dirname, '../public');
const CONCEPTS_DIR = join(PUBLIC_DIR, 'concepts');
const OUTPUT_PATH = join(PUBLIC_DIR, 'search-index.json');
const CONCEPTS_INDEX_PATH = join(CONCEPTS_DIR, 'index.json');
const CONCEPT_NAMES_PATH = join(PUBLIC_DIR, 'concept-names.json');

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

function getDefinition(content: string | { definition: string } | undefined): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  return content.definition ?? '';
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
      ko: (getDefinition(concept.content.ko) || getDefinition(concept.content.en)).slice(0, 100),
      en: (getDefinition(concept.content.en) || getDefinition(concept.content.ko)).slice(0, 100),
    },
  }));

  // public 디렉토리가 없으면 생성
  mkdirSync(PUBLIC_DIR, { recursive: true });
  mkdirSync(CONCEPTS_DIR, { recursive: true });

  // JSON 파일 생성
  writeFileSync(OUTPUT_PATH, JSON.stringify(searchIndex), 'utf-8');

  const sizeKB = (Buffer.byteLength(JSON.stringify(searchIndex)) / 1024).toFixed(1);
  console.log(`✓ Generated search-index.json (${sizeKB} KB, ${searchIndex.length} items)`);

  // 필드별로 개념 그룹화
  const conceptsByField = new Map<string, typeof allConcepts>();
  for (const concept of allConcepts) {
    const field = concept.field;
    if (!conceptsByField.has(field)) {
      conceptsByField.set(field, []);
    }
    const fieldConcepts = conceptsByField.get(field);
    if (fieldConcepts) {
      fieldConcepts.push(concept);
    }
  }

  // 각 필드를 별도 JSON 파일로 저장
  console.log('\nGenerating field-based concept files...');
  const fieldStats: Record<string, { count: number; sizeKB: string }> = {};

  for (const [field, concepts] of conceptsByField.entries()) {
    const fieldPath = join(CONCEPTS_DIR, `${field}.json`);
    const fieldData = JSON.stringify(concepts);
    writeFileSync(fieldPath, fieldData, 'utf-8');

    const fieldSizeKB = (Buffer.byteLength(fieldData) / 1024).toFixed(1);
    fieldStats[field] = { count: concepts.length, sizeKB: fieldSizeKB };
    console.log(`  ✓ ${field}.json (${fieldSizeKB} KB, ${concepts.length} concepts)`);
  }

  // 개념 ID → 필드 매핑 생성 (빠른 필드 조회용)
  const conceptIdToField: Record<string, string> = {};
  for (const concept of allConcepts) {
    conceptIdToField[concept.id] = concept.field;
  }

  // 필드 인덱스 파일 생성 (메타데이터)
  const conceptsIndex = {
    fields: Array.from(conceptsByField.keys()),
    stats: fieldStats,
    totalConcepts: allConcepts.length,
    conceptIdToField, // 개념 ID → 필드 매핑 추가
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(CONCEPTS_INDEX_PATH, JSON.stringify(conceptsIndex, null, 2), 'utf-8');
  const indexSizeKB = (Buffer.byteLength(JSON.stringify(conceptsIndex)) / 1024).toFixed(1);
  console.log(
    `\n✓ Generated concepts/index.json (${indexSizeKB} KB, ${conceptsByField.size} fields)`,
  );

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
