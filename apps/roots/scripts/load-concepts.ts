/**
 * JSON 개념 데이터 로더
 *
 * data/roots/concepts/*.json → app/data/generated/concepts.ts
 *
 * SSoT (Single Source of Truth)를 JSON으로 통일하여:
 * 1. 빌드 시간 단축 (TS 컴파일 불필요)
 * 2. Turborepo 캐시 효율 향상
 * 3. 데이터 관리 일관성
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const dataRoot = join(projectRoot, '..', '..', '..', 'data', 'roots');
const outputDir = join(projectRoot, 'app', 'data', 'generated');

interface ConceptFile {
  filename: string;
  concepts: unknown[];
}

async function loadConceptsFromJson(): Promise<ConceptFile[]> {
  const conceptsDir = join(dataRoot, 'concepts');
  const files = readdirSync(conceptsDir).filter((f) => f.endsWith('.json'));

  const results: ConceptFile[] = [];

  for (const file of files) {
    const filePath = join(conceptsDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const concepts = JSON.parse(content);
    results.push({
      filename: basename(file, '.json'),
      concepts,
    });
  }

  return results;
}

function generateTypeScriptCode(conceptFiles: ConceptFile[]): string {
  const totalConcepts = conceptFiles.reduce((sum, f) => sum + f.concepts.length, 0);

  const imports = `/**
 * @fileoverview 자동 생성된 개념 데이터
 * @generated from data/roots/concepts/*.json
 * @conceptCount ${totalConcepts}
 *
 * 이 파일을 직접 수정하지 마세요.
 * 수정이 필요하면 data/roots/concepts/*.json을 편집하고
 * \`pnpm prebuild\`를 실행하세요.
 */
import type { MathConcept } from '../types';
`;

  const conceptArrays = conceptFiles
    .map((f) => {
      const varName = `${f.filename}Concepts`;
      const jsonStr = JSON.stringify(f.concepts, null, 2);
      return `export const ${varName}: MathConcept[] = ${jsonStr};`;
    })
    .join('\n\n');

  const allConceptsArray = conceptFiles.map((f) => `...${f.filename}Concepts`).join(',\n  ');

  const allConcepts = `
/** 모든 개념 배열 (${totalConcepts}개) */
export const allConcepts: MathConcept[] = [
  ${allConceptsArray},
];
`;

  return `${imports}\n${conceptArrays}\n${allConcepts}`;
}

async function main(): Promise<void> {
  console.log('📚 Loading concepts from JSON...');
  const startTime = Date.now();

  const conceptFiles = await loadConceptsFromJson();
  const totalConcepts = conceptFiles.reduce((sum, f) => sum + f.concepts.length, 0);

  console.log(`   Found ${conceptFiles.length} files with ${totalConcepts} concepts`);

  // 출력 디렉토리 생성
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // TypeScript 코드 생성
  const code = generateTypeScriptCode(conceptFiles);
  const outputPath = join(outputDir, 'concepts.ts');
  writeFileSync(outputPath, code, 'utf-8');

  const duration = Date.now() - startTime;
  console.log(`✅ Generated ${outputPath}`);
  console.log(`   Duration: ${duration}ms`);
}

main().catch((err) => {
  console.error('Failed to load concepts:', err);
  process.exit(1);
});
