/**
 * @fileoverview 압축 무결성 검증 스크립트
 *
 * 원본 데이터와 압축→복원 데이터를 비교하여 100% 무손실인지 확인합니다.
 *
 * @usage pnpm verify-compression
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORIGINAL_DIR = join(__dirname, '../public/data/by-category-full');
const COMPRESSED_DIR = join(__dirname, '../public/data/compressed');

// expand-entry.ts의 로직을 인라인으로 포함 (import 문제 방지)

/** 품사 역매핑 */
const POS_REVERSE: string[] = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'particle',
  'interjection',
  'conjunction',
  'determiner',
  'numeral',
  'suffix',
  'prefix',
  'phrase',
  'expression',
];

/** 난이도 역매핑 */
const DIFFICULTY_REVERSE: string[] = ['beginner', 'intermediate', 'advanced', 'master'];

/** 빈도 역매핑 */
const FREQUENCY_REVERSE: string[] = ['common', 'frequent', 'occasional', 'uncommon', 'rare'];

interface CompactEntry {
  i: string;
  k: string;
  r: string;
  p?: [string, string?];
  s?: number;
  d?: number;
  f?: number;
  g?: string[];
  h?: 1;
  t: {
    w: string;
    x: string;
    e?: (string | null)[];
    v?: (string[] | null)[];
  };
}

interface CompressedFile {
  m: { v: number; c: string; n: number };
  e: CompactEntry[];
}

interface OriginalEntry {
  id: string;
  korean: string;
  romanization: string;
  pronunciation?: { korean: string; ipa?: string };
  partOfSpeech: string;
  categoryId: string;
  difficulty: string;
  frequency?: string;
  tags: string[];
  hasDialogue?: boolean;
  translation: {
    word: string;
    explanation: string;
    examples?: {
      beginner: string;
      intermediate: string;
      advanced: string;
      master?: string;
    };
    variations?: {
      formal?: string[];
      casual?: string[];
      short?: string[];
    };
  };
}

function expandEntry(compact: CompactEntry, categoryId: string): OriginalEntry {
  const entry: OriginalEntry = {
    id: compact.i,
    korean: compact.k,
    romanization: compact.r,
    partOfSpeech: POS_REVERSE[compact.s ?? 0] ?? 'noun',
    categoryId: categoryId,
    difficulty: DIFFICULTY_REVERSE[compact.d ?? 0] ?? 'beginner',
    tags: compact.g ?? [],
    translation: {
      word: compact.t.w,
      explanation: compact.t.x,
    },
  };

  if (compact.p) {
    entry.pronunciation = {
      korean: compact.p[0],
      ...(compact.p[1] ? { ipa: compact.p[1] } : {}),
    };
  }

  // frequency
  entry.frequency = FREQUENCY_REVERSE[compact.f ?? 0] ?? 'common';

  if (compact.h === 1) {
    entry.hasDialogue = true;
  }

  // examples
  if (compact.t.e && compact.t.e.length > 0) {
    entry.translation.examples = {
      beginner: compact.t.e[0] ?? '',
      intermediate: compact.t.e[1] ?? '',
      advanced: compact.t.e[2] ?? '',
      master: compact.t.e[3] ?? '',
    };
  }

  // variations
  if (compact.t.v && compact.t.v.length > 0) {
    const variations: OriginalEntry['translation']['variations'] = {};
    if (compact.t.v[0]) variations.formal = compact.t.v[0];
    if (compact.t.v[1]) variations.casual = compact.t.v[1];
    if (compact.t.v[2]) variations.short = compact.t.v[2];
    if (Object.keys(variations).length > 0) {
      entry.translation.variations = variations;
    }
  }

  return entry;
}

function normalizeEntry(entry: OriginalEntry): OriginalEntry {
  // 비교를 위한 정규화
  const normalized: OriginalEntry = {
    id: entry.id,
    korean: entry.korean,
    romanization: entry.romanization,
    partOfSpeech: entry.partOfSpeech,
    categoryId: entry.categoryId,
    difficulty: entry.difficulty,
    tags: entry.tags ?? [],
    translation: {
      word: entry.translation.word,
      explanation: entry.translation.explanation,
    },
  };

  if (entry.pronunciation) {
    normalized.pronunciation = {
      korean: entry.pronunciation.korean,
      ...(entry.pronunciation.ipa ? { ipa: entry.pronunciation.ipa } : {}),
    };
  }

  if (entry.frequency) {
    normalized.frequency = entry.frequency;
  } else {
    normalized.frequency = 'common';
  }

  // hasDialogue: true일 때만 포함, false나 undefined면 생략
  if (entry.hasDialogue === true) {
    normalized.hasDialogue = true;
  }

  if (entry.translation.examples) {
    normalized.translation.examples = {
      beginner: entry.translation.examples.beginner ?? '',
      intermediate: entry.translation.examples.intermediate ?? '',
      advanced: entry.translation.examples.advanced ?? '',
      master: entry.translation.examples.master ?? '',
    };
  }

  if (entry.translation.variations) {
    const v = entry.translation.variations;
    const variations: OriginalEntry['translation']['variations'] = {};
    if (v.formal) variations.formal = v.formal;
    if (v.casual) variations.casual = v.casual;
    if (v.short) variations.short = v.short;
    if (Object.keys(variations).length > 0) {
      normalized.translation.variations = variations;
    }
  }

  return normalized;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object') return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }

  if (Array.isArray(a) || Array.isArray(b)) return false;

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const aKeys = Object.keys(aObj).sort();
  const bKeys = Object.keys(bObj).sort();

  if (aKeys.length !== bKeys.length) return false;
  if (aKeys.join(',') !== bKeys.join(',')) return false;

  return aKeys.every((key) => deepEqual(aObj[key], bObj[key]));
}

async function main() {
  console.log('🔍 압축 무결성 검증 시작...\n');

  let totalEntries = 0;
  let passedEntries = 0;
  let failedEntries = 0;
  const errors: string[] = [];

  for (const locale of ['en', 'ko']) {
    const originalDir = join(ORIGINAL_DIR, locale);
    const compressedDir = join(COMPRESSED_DIR, locale);

    if (!existsSync(originalDir) || !existsSync(compressedDir)) {
      console.warn(`⚠️  ${locale}/ 디렉토리 없음, 스킵`);
      continue;
    }

    const files = readdirSync(originalDir).filter((f) => f.endsWith('.json'));
    console.log(`📁 ${locale}/ (${files.length} 파일)`);

    for (const file of files) {
      const originalPath = join(originalDir, file);
      const compressedPath = join(compressedDir, file);

      if (!existsSync(compressedPath)) {
        errors.push(`${locale}/${file}: 압축 파일 없음`);
        continue;
      }

      const originalEntries: OriginalEntry[] = JSON.parse(readFileSync(originalPath, 'utf-8'));
      const compressed: CompressedFile = JSON.parse(readFileSync(compressedPath, 'utf-8'));

      const categoryId = compressed.m.c;
      const expandedEntries = compressed.e.map((e) => expandEntry(e, categoryId));

      if (originalEntries.length !== expandedEntries.length) {
        errors.push(
          `${locale}/${file}: 엔트리 수 불일치 (${originalEntries.length} vs ${expandedEntries.length})`,
        );
        failedEntries += originalEntries.length;
        continue;
      }

      let fileErrors = 0;
      for (let i = 0; i < originalEntries.length; i++) {
        const orig = normalizeEntry(originalEntries[i]!);
        const expanded = normalizeEntry(expandedEntries[i]!);

        if (!deepEqual(orig, expanded)) {
          fileErrors++;
          if (errors.length < 10) {
            errors.push(`${locale}/${file}[${i}] (${orig.id}): 데이터 불일치`);
          }
        }
      }

      totalEntries += originalEntries.length;
      passedEntries += originalEntries.length - fileErrors;
      failedEntries += fileErrors;

      const status = fileErrors === 0 ? '✓' : '✗';
      console.log(
        `   ${status} ${file}: ${originalEntries.length}개 (${fileErrors === 0 ? 'OK' : `${fileErrors}개 오류`})`,
      );
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 검증 결과');
  console.log('='.repeat(60));
  console.log(`   총 엔트리: ${totalEntries.toLocaleString()}개`);
  console.log(`   통과: ${passedEntries.toLocaleString()}개`);
  console.log(`   실패: ${failedEntries.toLocaleString()}개`);
  console.log(`   무결성: ${((passedEntries / totalEntries) * 100).toFixed(2)}%`);
  console.log('='.repeat(60));

  if (errors.length > 0) {
    console.log('\n❌ 오류 목록:');
    for (const error of errors) {
      console.log(`   - ${error}`);
    }
    process.exit(1);
  } else {
    console.log('\n✅ 100% 무손실 압축 검증 완료!\n');
  }
}

main().catch((error) => {
  console.error('❌ 검증 실패:', error);
  process.exit(1);
});
