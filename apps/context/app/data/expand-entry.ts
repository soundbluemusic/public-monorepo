/**
 * @fileoverview 압축된 JSON 데이터를 원본 형태로 복원하는 함수
 *
 * compress-entries.ts에서 생성한 압축 데이터를 런타임에서 복원합니다.
 * 모든 데이터가 100% 무손실로 복원됩니다.
 *
 * ## 복원 과정
 * 1. 키 이름 복원: i → id, k → korean, etc.
 * 2. 배열 → 객체: examples[0] → examples.beginner
 * 3. enum 복원: 0 → 'noun', 1 → 'verb', etc.
 *
 * @example
 * ```ts
 * import { expandEntry, expandCompressedFile } from './expand-entry';
 *
 * // 단일 엔트리 복원
 * const entry = expandEntry(compactEntry);
 *
 * // 파일 전체 복원
 * const entries = expandCompressedFile(compressedData);
 * ```
 */
import type { LocaleEntry } from './types';

// ============================================================================
// 압축 타입 정의 (compress-entries.ts와 동일)
// ============================================================================

/** 압축된 엔트리 타입 (V2 - 기본값 생략) */
export interface CompactEntry {
  i: string; // id
  k: string; // korean
  r: string; // romanization
  p?: [string, string?]; // pronunciation: [korean, ipa?]
  s?: number; // partOfSpeech (0=noun이면 생략)
  // categoryId는 메타데이터에서 복원
  d?: number; // difficulty (0=beginner이면 생략)
  f?: number; // frequency (0=common이면 생략)
  g?: string[]; // tags (빈 배열이면 생략)
  t: CompactTranslation; // translation
}

/** 압축된 번역 타입 */
export interface CompactTranslation {
  w: string; // word
  x: string; // explanation
  e?: (string | null)[]; // examples: [beginner, intermediate, advanced, master?]
  v?: (string[] | null)[]; // variations: [formal?, casual?, short?]
}

/** 압축 파일 메타데이터 (V2) */
export interface CompressedFileMeta {
  v: number; // version
  c: string; // categoryId
  n: number; // entry count
}

/** 압축 파일 구조 */
export interface CompressedFile {
  m: CompressedFileMeta;
  e: CompactEntry[];
}

// ============================================================================
// 역매핑 (숫자 → 문자열)
// ============================================================================

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

// ============================================================================
// 복원 함수
// ============================================================================

/**
 * 단일 압축 엔트리를 원본 LocaleEntry로 복원 (V2)
 *
 * @param compact - 압축된 엔트리
 * @param categoryId - 메타데이터에서 가져온 카테고리 ID
 * @returns 복원된 LocaleEntry
 */
export function expandEntry(compact: CompactEntry, categoryId: string): LocaleEntry {
  const entry: LocaleEntry = {
    id: compact.i,
    korean: compact.k,
    romanization: compact.r,
    // 기본값: noun(0), beginner(0)
    partOfSpeech: POS_REVERSE[compact.s ?? 0] as LocaleEntry['partOfSpeech'],
    categoryId: categoryId, // 메타데이터에서 복원
    difficulty: DIFFICULTY_REVERSE[compact.d ?? 0] as LocaleEntry['difficulty'],
    tags: compact.g ?? [], // 생략되었으면 빈 배열
    translation: expandTranslation(compact.t),
  };

  // 선택적 필드 복원
  if (compact.p) {
    entry.pronunciation = {
      korean: compact.p[0],
      ...(compact.p[1] ? { ipa: compact.p[1] } : {}),
    };
  }

  // frequency: 생략되었으면 common(0)
  if (compact.f !== undefined && compact.f !== 0) {
    entry.frequency = FREQUENCY_REVERSE[compact.f] as LocaleEntry['frequency'];
  } else {
    entry.frequency = 'common';
  }

  // dialogue는 압축 데이터에 포함되지 않음 (D1에서만 로드)

  return entry;
}

/**
 * 압축된 번역을 원본 형태로 복원
 *
 * @param compact - 압축된 번역
 * @returns 복원된 번역 객체
 */
function expandTranslation(compact: CompactTranslation): LocaleEntry['translation'] {
  const translation: LocaleEntry['translation'] = {
    word: compact.w,
    explanation: compact.x,
  };

  // examples 복원: 배열 → 객체
  if (compact.e && compact.e.length > 0) {
    translation.examples = {
      beginner: compact.e[0] ?? '',
      intermediate: compact.e[1] ?? '',
      advanced: compact.e[2] ?? '',
      master: compact.e[3] ?? '',
    };
  }

  // variations 복원: 배열 → 객체
  if (compact.v && compact.v.length > 0) {
    const variations: LocaleEntry['translation']['variations'] = {};

    if (compact.v[0]) {
      variations.formal = compact.v[0];
    }
    if (compact.v[1]) {
      variations.casual = compact.v[1];
    }
    if (compact.v[2]) {
      variations.short = compact.v[2];
    }

    if (Object.keys(variations).length > 0) {
      translation.variations = variations;
    }
  }

  return translation;
}

/**
 * 압축 파일 전체를 복원 (V2)
 *
 * @param compressed - 압축된 파일 데이터
 * @returns 복원된 LocaleEntry 배열
 */
export function expandCompressedFile(compressed: CompressedFile): LocaleEntry[] {
  const categoryId = compressed.m.c;
  return compressed.e.map((entry) => expandEntry(entry, categoryId));
}

/**
 * JSON 문자열에서 직접 복원 (fetch 결과용)
 *
 * @param json - 압축된 JSON 문자열
 * @returns 복원된 LocaleEntry 배열
 */
export function expandFromJson(json: string): LocaleEntry[] {
  const compressed: CompressedFile = JSON.parse(json);
  return expandCompressedFile(compressed);
}

/**
 * 압축 파일인지 확인
 *
 * @param data - JSON 파싱된 데이터
 * @returns 압축 파일이면 true
 */
export function isCompressedFile(data: unknown): data is CompressedFile {
  return (
    typeof data === 'object' &&
    data !== null &&
    'm' in data &&
    'e' in data &&
    typeof (data as CompressedFile).m === 'object' &&
    Array.isArray((data as CompressedFile).e)
  );
}
