/**
 * @fileoverview 무손실 JSON 압축 스크립트
 *
 * 원본 JSON 데이터를 키 축약 + 구조 최적화로 압축합니다.
 * 런타임에서 expand 함수로 원본 형태로 복원됩니다.
 *
 * ## 압축 전략
 * 1. 키 이름 축약: korean → k, romanization → r, etc.
 * 2. 객체 → 배열: examples.beginner → examples[0]
 * 3. 중복 제거: partOfSpeech, difficulty 등 파일 레벨 메타로 이동
 * 4. 선택적 필드 생략: undefined/null 값 제거
 *
 * ## 예상 절감
 * 57MB → ~12MB (약 80% 감소)
 *
 * @usage pnpm compress-entries
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = join(__dirname, '../public/data/by-category-full');
const OUTPUT_DIR = join(__dirname, '../public/data/compressed');

// ============================================================================
// 키 매핑 (원본 → 압축)
// ============================================================================

/** 엔트리 레벨 키 매핑 */
const _ENTRY_KEY_MAP = {
  id: 'i',
  korean: 'k',
  romanization: 'r',
  pronunciation: 'p',
  partOfSpeech: 's', // speech
  categoryId: 'c',
  difficulty: 'd',
  frequency: 'f',
  tags: 'g', // tags
  hasDialogue: 'h',
  translation: 't',
} as const;

/** 발음 키 매핑 */
const _PRONUNCIATION_KEY_MAP = {
  korean: 'k',
  ipa: 'i',
} as const;

/** 번역 키 매핑 */
const _TRANSLATION_KEY_MAP = {
  word: 'w',
  explanation: 'x', // explanation
  examples: 'e',
  variations: 'v',
} as const;

/** 품사 → 숫자 매핑 */
const POS_MAP: Record<string, number> = {
  noun: 0,
  verb: 1,
  adjective: 2,
  adverb: 3,
  pronoun: 4,
  particle: 5,
  interjection: 6,
  conjunction: 7,
  determiner: 8,
  numeral: 9,
  suffix: 10,
  prefix: 11,
  phrase: 12,
  expression: 13,
};

/** 난이도 → 숫자 매핑 */
const DIFFICULTY_MAP: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  master: 3,
};

/** 빈도 → 숫자 매핑 */
const FREQUENCY_MAP: Record<string, number> = {
  common: 0,
  frequent: 1,
  occasional: 2,
  uncommon: 3,
  rare: 4,
};

// ============================================================================
// 타입 정의
// ============================================================================

/** 원본 LocaleEntry 타입 */
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

/** 압축된 엔트리 타입 (V2 - 더 공격적인 압축) */
interface CompactEntry {
  i: string; // id
  k: string; // korean
  r: string; // romanization
  p?: [string, string?]; // pronunciation: [korean, ipa?]
  s?: number; // partOfSpeech (0=noun이면 생략)
  // categoryId 제거 - 파일 이름에서 추론
  d?: number; // difficulty (0=beginner이면 생략)
  f?: number; // frequency (0=common이면 생략)
  g?: string[]; // tags (빈 배열이면 생략)
  h?: 1; // hasDialogue (1 if true, omitted if false)
  t: CompactTranslation; // translation
}

/** 압축된 번역 타입 */
interface CompactTranslation {
  w: string; // word
  x: string; // explanation
  e?: (string | null)[]; // examples: [beginner, intermediate, advanced, master?]
  v?: (string[] | null)[]; // variations: [formal?, casual?, short?]
}

/** 압축 파일 메타데이터 (V2) */
interface CompressedFileMeta {
  /** 압축 버전 */
  v: number;
  /** 카테고리 ID (파일명에서 복원용) */
  c: string;
  /** 엔트리 수 */
  n: number;
}

/** 압축 파일 구조 */
interface CompressedFile {
  /** 메타데이터 */
  m: CompressedFileMeta;
  /** 엔트리 배열 */
  e: CompactEntry[];
}

// ============================================================================
// 압축 함수
// ============================================================================

/**
 * 단일 엔트리 압축 (V2 - 기본값 생략)
 */
function compressEntry(entry: OriginalEntry): CompactEntry {
  const compact: CompactEntry = {
    i: entry.id,
    k: entry.korean,
    r: entry.romanization,
    t: compressTranslation(entry.translation),
  };

  // partOfSpeech: 0(noun)이 아닐 때만 포함
  const posIndex = POS_MAP[entry.partOfSpeech] ?? 0;
  if (posIndex !== 0) {
    compact.s = posIndex;
  }

  // difficulty: 0(beginner)이 아닐 때만 포함
  const diffIndex = DIFFICULTY_MAP[entry.difficulty] ?? 0;
  if (diffIndex !== 0) {
    compact.d = diffIndex;
  }

  // tags: 빈 배열이 아닐 때만 포함
  if (entry.tags && entry.tags.length > 0) {
    compact.g = entry.tags;
  }

  // 선택적 필드 (값이 있을 때만 추가)
  if (entry.pronunciation) {
    compact.p = entry.pronunciation.ipa
      ? [entry.pronunciation.korean, entry.pronunciation.ipa]
      : [entry.pronunciation.korean];
  }

  // frequency: 0(common)이 아닐 때만 포함
  if (entry.frequency) {
    const freqIndex = FREQUENCY_MAP[entry.frequency];
    if (freqIndex !== undefined && freqIndex !== 0) {
      compact.f = freqIndex;
    }
  }

  if (entry.hasDialogue) {
    compact.h = 1;
  }

  return compact;
}

/**
 * 번역 압축
 */
function compressTranslation(translation: OriginalEntry['translation']): CompactTranslation {
  const compact: CompactTranslation = {
    w: translation.word,
    x: translation.explanation,
  };

  // examples: 객체 → 배열
  if (translation.examples) {
    const ex = translation.examples;
    compact.e = [ex.beginner, ex.intermediate, ex.advanced, ex.master ?? null];
    // master가 null이면 배열 끝에서 제거
    while (compact.e.length > 0 && compact.e[compact.e.length - 1] === null) {
      compact.e.pop();
    }
  }

  // variations: 객체 → 배열 [formal, casual, short]
  if (translation.variations) {
    const v = translation.variations;
    const variations: (string[] | null)[] = [v.formal ?? null, v.casual ?? null, v.short ?? null];
    // 끝에서 null 제거
    while (variations.length > 0 && variations[variations.length - 1] === null) {
      variations.pop();
    }
    if (variations.length > 0) {
      compact.v = variations;
    }
  }

  return compact;
}

/**
 * 파일 압축 (V2 - categoryId 포함)
 */
function compressFile(entries: OriginalEntry[], categoryId: string): CompressedFile {
  return {
    m: {
      v: 2,
      c: categoryId,
      n: entries.length,
    },
    e: entries.map(compressEntry),
  };
}

// ============================================================================
// 메인 실행
// ============================================================================

async function main() {
  console.log('🗜️  무손실 JSON 압축 시작...\n');

  // 출력 디렉토리 생성
  const enDir = join(OUTPUT_DIR, 'en');
  const koDir = join(OUTPUT_DIR, 'ko');

  for (const dir of [OUTPUT_DIR, enDir, koDir]) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let totalEntries = 0;

  // 각 locale 처리
  for (const locale of ['en', 'ko']) {
    const sourceLocaleDir = join(SOURCE_DIR, locale);
    const outputLocaleDir = join(OUTPUT_DIR, locale);

    if (!existsSync(sourceLocaleDir)) {
      console.warn(`⚠️  ${sourceLocaleDir} 없음, 스킵`);
      continue;
    }

    const files = readdirSync(sourceLocaleDir).filter((f) => f.endsWith('.json'));
    console.log(`📁 ${locale}/ (${files.length} 파일)`);

    for (const file of files) {
      const sourcePath = join(sourceLocaleDir, file);
      const outputPath = join(outputLocaleDir, file);

      // 원본 읽기
      const originalContent = readFileSync(sourcePath, 'utf-8');
      const originalSize = Buffer.byteLength(originalContent, 'utf-8');
      const entries: OriginalEntry[] = JSON.parse(originalContent);

      // 압축 (categoryId는 파일명에서 추출)
      const categoryId = file.replace('.json', '');
      const compressed = compressFile(entries, categoryId);
      const compressedContent = JSON.stringify(compressed);
      const compressedSize = Buffer.byteLength(compressedContent, 'utf-8');

      // 저장
      writeFileSync(outputPath, compressedContent);

      // 통계
      totalOriginalSize += originalSize;
      totalCompressedSize += compressedSize;
      totalEntries += entries.length;

      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      console.log(
        `   ✓ ${file}: ${(originalSize / 1024).toFixed(1)}KB → ${(compressedSize / 1024).toFixed(1)}KB (${reduction}% 감소)`,
      );
    }
  }

  // 최종 통계
  const totalReduction = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);
  console.log('\n' + '='.repeat(60));
  console.log('📊 압축 결과');
  console.log('='.repeat(60));
  console.log(`   엔트리 수: ${totalEntries.toLocaleString()}개`);
  console.log(`   원본 크기: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   압축 크기: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   절감률: ${totalReduction}%`);
  console.log(
    `   절감량: ${((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2)} MB`,
  );
  console.log('='.repeat(60));
  console.log('\n✅ 압축 완료!\n');

  // 메타 파일 생성
  const meta = {
    version: 1,
    generatedAt: new Date().toISOString(),
    totalEntries,
    originalSize: totalOriginalSize,
    compressedSize: totalCompressedSize,
    reductionPercent: Number.parseFloat(totalReduction),
  };
  writeFileSync(join(OUTPUT_DIR, 'meta.json'), JSON.stringify(meta, null, 2));
}

main().catch((error) => {
  console.error('❌ 압축 실패:', error);
  process.exit(1);
});
