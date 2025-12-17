/**
 * @fileoverview 엔트리 통합 모듈
 *
 * 카테고리별로 분리된 엔트리들을 하나로 합쳐서 export합니다.
 * 기존 entries.ts에서 점진적으로 마이그레이션 중입니다.
 *
 * @example
 * ```ts
 * import { meaningEntries, getEntryById } from '@/data/entries';
 * ```
 */
import type { MeaningEntry, Language } from "../types";

// 카테고리별 엔트리 import (새로운 방식)
// import greetings from './greetings';
// import emotions from './emotions';
// ... 추가될 예정

// 기존 entries.ts에서 임시 import (마이그레이션 완료 전까지)
import { meaningEntries as legacyEntries } from "../entries.legacy";

// 새로운 방식으로 추가된 엔트리들
const newEntries: MeaningEntry[] = [
  // 여기에 createCategory로 만든 엔트리들이 추가됨
  // ...greetings,
  // ...emotions,
];

// 모든 엔트리 합치기 (레거시 + 새 엔트리)
export const meaningEntries: MeaningEntry[] = [
  ...legacyEntries,
  ...newEntries,
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
export function searchEntries(query: string, locale: Language = "ko"): MeaningEntry[] {
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
export function getFeaturedEntries(count: number = 6): MeaningEntry[] {
  return meaningEntries
    .filter((e) => e.difficulty === "beginner" && e.frequency === "common")
    .slice(0, count);
}

/**
 * 난이도별 엔트리
 */
export function getEntriesByDifficulty(difficulty: MeaningEntry["difficulty"]): MeaningEntry[] {
  return meaningEntries.filter((e) => e.difficulty === difficulty);
}

// Re-export helper for new entries
export { createCategory } from "./helpers";
export type { EntryInput, EntryMap } from "./helpers";
