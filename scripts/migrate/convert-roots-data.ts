/**
 * Roots 데이터 변환 스크립트
 *
 * TypeScript 데이터 파일을 JSON으로 변환
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const CONCEPTS_DIR = join(ROOT, 'apps/roots/app/data/concepts');
const OUTPUT_DIR = join(ROOT, 'data/roots/concepts');

// 변환할 파일 목록 (index.ts 제외)
const conceptFiles = [
  'abstractAlgebra',
  'algebra',
  'algebraicGeometry',
  'algebraicTopology',
  'analysis',
  'applied',
  'calculusVariations',
  'categoryTheory',
  'combinatoricsAdvanced',
  'complexAnalysis',
  'computerScience',
  'constants',
  'cryptography',
  'differentialGeometry',
  'discrete',
  'dynamicalSystemsAdvanced',
  'dynamics',
  'engineering',
  'finance',
  'foundations',
  'functionalAnalysis',
  'gameTheory',
  'geometry',
  'graphTheoryAdvanced',
  'harmonicAnalysis',
  'homologicalAlgebra',
  'informationTheory',
  'lieTheory',
  'linearAlgebra',
  'logic',
  'logicAdvanced',
  'measureTheory',
  'music',
  'numberTheory',
  'numerical',
  'numericalLinearAlgebra',
  'operationsResearch',
  'optimization',
  'pde',
  'physics',
  'probability',
  'representationTheory',
  'setTheory',
  'statistics',
  'stochasticProcesses',
  'symbols',
  'tensorAnalysis',
  'theorems',
  'topology',
  'trigonometry',
];

async function convertFile(fileName: string): Promise<number> {
  try {
    const modulePath = join(CONCEPTS_DIR, `${fileName}.ts`);
    const module = await import(modulePath);

    // 다양한 export 이름 처리
    const exportNames = Object.keys(module).filter((k) => k !== 'default');
    const conceptsKey = exportNames.find(
      (k) => Array.isArray(module[k]) && k.toLowerCase().includes('concept'),
    );

    if (!conceptsKey) {
      console.warn(`  ⚠ No concepts array found in ${fileName}.ts`);
      return 0;
    }

    const concepts = module[conceptsKey];
    const outputPath = join(OUTPUT_DIR, `${fileName}.json`);

    writeFileSync(outputPath, JSON.stringify(concepts, null, 2));
    console.log(`  ✓ ${fileName}.ts → ${fileName}.json (${concepts.length} concepts)`);

    return concepts.length;
  } catch (error) {
    console.error(`  ✗ Failed to convert ${fileName}:`, error);
    return 0;
  }
}

async function main() {
  console.log('🔄 Roots 데이터 변환 시작...\n');

  // 출력 디렉토리 생성
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let totalConcepts = 0;
  let successCount = 0;

  for (const file of conceptFiles) {
    const count = await convertFile(file);
    if (count > 0) {
      totalConcepts += count;
      successCount++;
    }
  }

  console.log(`\n✅ 변환 완료: ${successCount}/${conceptFiles.length} 파일`);
  console.log(`📊 총 ${totalConcepts}개 개념`);
}

main().catch(console.error);
