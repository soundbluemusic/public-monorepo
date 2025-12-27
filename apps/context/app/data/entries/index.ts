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

// JSON에서 생성된 엔트리 (prebuild 스크립트에서 생성됨)
import { jsonEntries } from '../generated/entries';
import type { Language, MeaningEntry } from '../types';

// 모든 엔트리 (JSON에서 로드됨)
export const meaningEntries: MeaningEntry[] = jsonEntries;

// ============================================================================
// Pre-computed Maps for O(1) lookup (빌드 시 1회 계산, 조회 시 O(1))
// ============================================================================

/** ID → Entry 맵 (O(1) 조회용) */
export const entriesById = new Map<string, MeaningEntry>(meaningEntries.map((e) => [e.id, e]));

/** CategoryID → Entry[] 맵 (O(1) 조회용) */
export const entriesByCategory = new Map<string, MeaningEntry[]>();
for (const entry of meaningEntries) {
  const list = entriesByCategory.get(entry.categoryId) || [];
  list.push(entry);
  entriesByCategory.set(entry.categoryId, list);
}

/**
 * ID로 엔트리 조회 (O(1))
 */
export function getEntryById(id: string): MeaningEntry | undefined {
  return entriesById.get(id);
}

/**
 * 카테고리 ID로 엔트리 필터링 (O(1))
 */
export function getEntriesByCategory(categoryId: string): MeaningEntry[] {
  return entriesByCategory.get(categoryId) || [];
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

export type { EntryInput, EntryMap } from './helpers';
// Re-export helper for new entries
export { createCategory } from './helpers';
