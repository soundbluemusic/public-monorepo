/**
 * @fileoverview JSON 파일에서 엔트리 데이터 로드
 *
 * 빌드 시점에 JSON 파일들을 TypeScript 모듈로 변환합니다.
 * 이 스크립트는 src/data/entries/*.json 파일을 읽어서
 * src/data/generated/entries.ts 파일을 생성합니다.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENTRIES_DIR = join(__dirname, '../src/data/entries');
const OUTPUT_FILE = join(__dirname, '../src/data/generated/entries.ts');

interface JsonEntry {
  id: string;
  korean: string;
  romanization: string;
  pronunciation?: string;
  hanja?: string;
  partOfSpeech: string;
  categoryId: string;
  difficulty: string;
  frequency?: string;
  tags: string[];
  translations: {
    ko: {
      word: string;
      explanation: string;
      examples?: string[];
      variations?: {
        formal?: string[];
        casual?: string[];
        short?: string[];
      };
    };
    en: {
      word: string;
      explanation: string;
      examples?: string[];
      variations?: {
        formal?: string[];
        casual?: string[];
        short?: string[];
      };
    };
  };
}

function loadJsonEntries(): JsonEntry[] {
  if (!existsSync(ENTRIES_DIR)) {
    console.warn(`Entries directory not found: ${ENTRIES_DIR}`);
    return [];
  }

  const files = readdirSync(ENTRIES_DIR).filter((f) => f.endsWith('.json'));
  const entries: JsonEntry[] = [];

  for (const file of files) {
    const filePath = join(ENTRIES_DIR, file);
    try {
      const content = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      if (Array.isArray(data)) {
        entries.push(...data);
      } else {
        entries.push(data);
      }

      console.log(`  ✓ ${file} (${Array.isArray(data) ? data.length : 1} entries)`);
    } catch (error) {
      console.error(`  ✗ Failed to load ${filePath}:`, error);
    }
  }

  return entries;
}

function validateEntries(entries: JsonEntry[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const entry of entries) {
    // 중복 ID 검사
    if (ids.has(entry.id)) {
      errors.push(`Duplicate ID: ${entry.id}`);
    }
    ids.add(entry.id);

    // 필수 필드 검사
    const requiredFields = [
      'id',
      'korean',
      'romanization',
      'partOfSpeech',
      'categoryId',
      'difficulty',
      'tags',
      'translations',
    ];
    for (const field of requiredFields) {
      if (!(field in entry)) {
        errors.push(`[${entry.id}] Missing required field: ${field}`);
      }
    }

    // translations 검사
    if (entry.translations) {
      if (!entry.translations.ko || !entry.translations.en) {
        errors.push(`[${entry.id}] Missing translation for ko or en`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

function generateTypeScriptFile(entries: JsonEntry[]): string {
  return `/**
 * @fileoverview 자동 생성된 엔트리 데이터
 *
 * 이 파일은 scripts/load-entries.ts에 의해 자동 생성됩니다.
 * 직접 수정하지 마세요. 대신 src/data/entries/*.json 파일을 수정하세요.
 *
 * @generated
 * @date ${new Date().toISOString()}
 */
import type { MeaningEntry } from '../types';

export const jsonEntries: MeaningEntry[] = ${JSON.stringify(entries, null, 2)} as const;

export const jsonEntriesCount = ${entries.length};
`;
}

async function main() {
  console.log('📦 Loading JSON entries...\n');

  const entries = loadJsonEntries();

  if (entries.length === 0) {
    console.log('\n⚠️  No JSON entries found. Using legacy entries only.\n');
    // 빈 파일 생성
    const outputDir = dirname(OUTPUT_FILE);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    writeFileSync(
      OUTPUT_FILE,
      `/**
 * @fileoverview 자동 생성된 엔트리 데이터 (빈 파일)
 * @generated
 */
import type { MeaningEntry } from '../types';

export const jsonEntries: MeaningEntry[] = [];
export const jsonEntriesCount = 0;
`,
    );
    return;
  }

  // 유효성 검사
  console.log('\n🔍 Validating entries...');
  const validation = validateEntries(entries);

  if (!validation.valid) {
    console.error('\n❌ Validation errors:');
    for (const error of validation.errors) {
      console.error(`   - ${error}`);
    }
    process.exit(1);
  }
  console.log('   ✓ All entries valid\n');

  // TypeScript 파일 생성
  const outputDir = dirname(OUTPUT_FILE);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const tsContent = generateTypeScriptFile(entries);
  writeFileSync(OUTPUT_FILE, tsContent);

  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`   ${entries.length} entries from JSON files\n`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
