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

  // ============================================================================
  // Single pass: Build all data structures at once (O(n) instead of O(4n))
  // ============================================================================
  const searchIndex: SearchIndexItem[] = [];
  const conceptsByField = new Map<string, typeof allConcepts>();
  const conceptIdToField: Record<string, string> = {};
  const conceptNames: Record<string, { ko: string; en: string }> = {};

  for (const concept of allConcepts) {
    // Build search index item
    searchIndex.push({
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
    });

    // Group by field
    const fieldList = conceptsByField.get(concept.field) || [];
    fieldList.push(concept);
    conceptsByField.set(concept.field, fieldList);

    // ID → field mapping
    conceptIdToField[concept.id] = concept.field;

    // ID → name mapping
    conceptNames[concept.id] = concept.name;
  }

  // ============================================================================
  // Write files (cache JSON strings to avoid duplicate stringify)
  // ============================================================================
  mkdirSync(PUBLIC_DIR, { recursive: true });
  mkdirSync(CONCEPTS_DIR, { recursive: true });

  // Search index
  const searchIndexJson = JSON.stringify(searchIndex);
  writeFileSync(OUTPUT_PATH, searchIndexJson, 'utf-8');
  console.log(
    `✓ Generated search-index.json (${(Buffer.byteLength(searchIndexJson) / 1024).toFixed(1)} KB, ${searchIndex.length} items)`,
  );

  // Field-based files
  console.log('\nGenerating field-based concept files...');
  const fieldStats: Record<string, { count: number; sizeKB: string }> = {};

  for (const [field, concepts] of conceptsByField.entries()) {
    const fieldPath = join(CONCEPTS_DIR, `${field}.json`);
    const fieldJson = JSON.stringify(concepts);
    writeFileSync(fieldPath, fieldJson, 'utf-8');

    const fieldSizeKB = (Buffer.byteLength(fieldJson) / 1024).toFixed(1);
    fieldStats[field] = { count: concepts.length, sizeKB: fieldSizeKB };
    console.log(`  ✓ ${field}.json (${fieldSizeKB} KB, ${concepts.length} concepts)`);
  }

  // Concepts index
  const conceptsIndex = {
    fields: Array.from(conceptsByField.keys()),
    stats: fieldStats,
    totalConcepts: allConcepts.length,
    conceptIdToField,
    generatedAt: new Date().toISOString(),
  };
  const conceptsIndexJson = JSON.stringify(conceptsIndex, null, 2);
  writeFileSync(CONCEPTS_INDEX_PATH, conceptsIndexJson, 'utf-8');
  console.log(
    `\n✓ Generated concepts/index.json (${(Buffer.byteLength(conceptsIndexJson) / 1024).toFixed(1)} KB, ${conceptsByField.size} fields)`,
  );

  // Concept names
  const conceptNamesJson = JSON.stringify(conceptNames);
  writeFileSync(CONCEPT_NAMES_PATH, conceptNamesJson, 'utf-8');
  console.log(
    `✓ Generated concept-names.json (${(Buffer.byteLength(conceptNamesJson) / 1024).toFixed(1)} KB, ${Object.keys(conceptNames).length} items)`,
  );
}

generateSearchIndex();
