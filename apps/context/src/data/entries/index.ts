/**
 * @fileoverview 엔트리 통합 모듈
 *
 * JSON 파일에서 로드된 엔트리와 레거시 엔트리를 통합합니다.
 *
 * ## 데이터 추가 방법 (새로운 방식)
 *
 * 1. `src/data/entries/*.json` 파일에 데이터 추가
 * 2. `pnpm load-entries` 실행 (빌드 시 자동 실행됨)
 *
 * ## 예시: 새 단어 추가
 *
 * `src/data/entries/greetings.json`에 추가:
 * ```json
 * {
 *   "id": "new-word",
 *   "korean": "새단어",
 *   "romanization": "sae-dan-eo",
 *   "partOfSpeech": "noun",
 *   "categoryId": "greetings",
 *   "difficulty": "beginner",
 *   "tags": ["basic"],
 *   "translations": {
 *     "ko": { "word": "새단어", "explanation": "설명" },
 *     "en": { "word": "New word", "explanation": "Description" }
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * import { meaningEntries, getEntryById } from '@/data/entries';
 * ```
 */
import type { Language, MeaningEntry } from '../types';

// 레거시 엔트리 (마이그레이션 완료 시 제거 예정)
import { meaningEntries as legacyEntries } from '../entries.legacy';

// JSON에서 생성된 엔트리 (빌드 시 자동 생성)
// 파일이 없으면 빈 배열 사용 (첫 빌드 전)
let jsonEntries: MeaningEntry[] = [];
try {
  // @ts-ignore - generated file may not exist yet
  const generated = await import('../generated/entries.js');
  jsonEntries = generated.jsonEntries ?? [];
} catch {
  // 첫 빌드 전이거나 생성 파일이 없는 경우
  jsonEntries = [];
}

// JSON 엔트리의 ID 목록 (중복 제거용)
const jsonEntryIds = new Set(jsonEntries.map((e) => e.id));

// 모든 엔트리 합치기 (JSON 우선, 중복 시 JSON 사용)
export const meaningEntries: MeaningEntry[] = [
  ...jsonEntries,
  ...legacyEntries.filter((e) => !jsonEntryIds.has(e.id)),
];

/**
 * ID로 엔트리 조회
 */
export function getEntryById(id: string): MeaningEntry | undefined {
  return meaningEntries.find((e) => e.id === id);
}

/**
 * 카테고리 ID로 엔트리 필터링
 */
export function getEntriesByCategory(categoryId: string): MeaningEntry[] {
  return meaningEntries.filter((e) => e.categoryId === categoryId);
}

/**
 * 검색 쿼리로 엔트리 찾기
 */
export function searchEntries(query: string, locale: Language = 'ko'): MeaningEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return meaningEntries.filter((entry) => {
    const translation = entry.translations[locale];
    return (
      entry.korean.toLowerCase().includes(q) ||
      entry.romanization.toLowerCase().includes(q) ||
      translation.word.toLowerCase().includes(q) ||
      translation.explanation.toLowerCase().includes(q) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}

/**
 * 추천 엔트리 (홈페이지용)
 */
export function getFeaturedEntries(count = 6): MeaningEntry[] {
  return meaningEntries
    .filter((e) => e.difficulty === 'beginner' && e.frequency === 'common')
    .slice(0, count);
}

/**
 * 난이도별 엔트리
 */
export function getEntriesByDifficulty(difficulty: MeaningEntry['difficulty']): MeaningEntry[] {
  return meaningEntries.filter((e) => e.difficulty === difficulty);
}

// Re-export helper for new entries
export { createCategory } from './helpers';
export type { EntryInput, EntryMap } from './helpers';
