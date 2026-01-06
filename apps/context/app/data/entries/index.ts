/**
 * @fileoverview 엔트리 통합 모듈 (번들 최적화 버전)
 *
 * ## 번들 최적화
 * - 전체 MeaningEntry 데이터는 번들에서 제거됨 (50MB → 0)
 * - 개별 entry 조회: 카테고리별 청크에서 동적 로드
 * - browse 페이지: lightEntries만 사용 (~1MB)
 *
 * ## 데이터 추가 방법
 * 1. `src/data/entries/*.json` 파일에 데이터 추가
 * 2. `pnpm load-entries` 실행 (빌드 시 자동 실행됨)
 *
 * @example
 * ```ts
 * import { lightEntries, getEntryById } from '@/data/entries';
 *
 * // browse 페이지: 경량 데이터 사용
 * const entries = lightEntries;
 *
 * // entry 페이지: SSG loader에서 동적 로드
 * const entry = await getEntryById('annyeong');
 * ```
 */

// JSON에서 생성된 경량 엔트리 (prebuild 스크립트에서 생성됨)
import { jsonEntriesCount, type LightEntry, lightEntries } from '../generated/entries';
import { entryToCategory } from '../generated/entry-index';
import type { Language, MeaningEntry } from '../types';

// Re-export 경량 버전
export { lightEntries, type LightEntry, jsonEntriesCount };

// ============================================================================
// 카테고리별 청크 캐시 (런타임에서 재사용)
// ============================================================================

/** 카테고리 → 전체 Entry 배열 캐시 */
const categoryCache = new Map<string, MeaningEntry[]>();

/**
 * 카테고리별 전체 데이터 로드 (캐시됨)
 * SSG 빌드 시: Node.js fs로 JSON 파일 읽기
 * 런타임 시: fetch로 JSON 파일 요청
 */
async function loadCategoryFull(categoryId: string): Promise<MeaningEntry[]> {
  // 캐시 확인
  const cached = categoryCache.get(categoryId);
  if (cached) return cached;

  try {
    // SSG 빌드 시 (Node.js 환경)
    if (typeof window === 'undefined') {
      const { readFileSync } = await import('node:fs');
      const { join } = await import('node:path');

      // process.cwd()는 apps/context에서 실행되므로 public/ 직접 참조
      const filePath = join(process.cwd(), `public/data/by-category-full/${categoryId}.json`);
      const content = readFileSync(filePath, 'utf-8');
      const entries: MeaningEntry[] = JSON.parse(content);
      categoryCache.set(categoryId, entries);
      return entries;
    }

    // 브라우저 런타임 (클라이언트 사이드 네비게이션)
    const response = await fetch(`/data/by-category-full/${categoryId}.json`);
    if (!response.ok) {
      console.warn(`Failed to load category: ${categoryId}`);
      return [];
    }
    const entries: MeaningEntry[] = await response.json();
    categoryCache.set(categoryId, entries);
    return entries;
  } catch (error) {
    console.error(`Error loading category ${categoryId}:`, error);
    return [];
  }
}

// ============================================================================
// Entry 조회 함수 (비동기 - 카테고리 청크에서 로드)
// ============================================================================

/**
 * ID로 엔트리 조회 (비동기)
 * 카테고리 청크에서 동적 로드 후 캐시
 */
export async function getEntryById(id: string): Promise<MeaningEntry | undefined> {
  const categoryId = entryToCategory[id];
  if (!categoryId) {
    console.warn(`Entry not found in index: ${id}`);
    return undefined;
  }

  const entries = await loadCategoryFull(categoryId);
  return entries.find((e) => e.id === id);
}

/**
 * 카테고리 ID로 엔트리 필터링 (비동기)
 */
export async function getEntriesByCategory(categoryId: string): Promise<MeaningEntry[]> {
  return loadCategoryFull(categoryId);
}

// ============================================================================
// 경량 버전 (LightEntry) - browse 페이지 최적화용
// ============================================================================

/** 경량 버전 정렬 배열 */
export const lightEntriesSortedAlphabetically: LightEntry[] = [...lightEntries].sort((a, b) =>
  a.korean.localeCompare(b.korean, 'ko'),
);
export const lightEntriesSortedByCategory: LightEntry[] = [...lightEntries].sort((a, b) => {
  if (a.categoryId === b.categoryId) {
    return a.korean.localeCompare(b.korean, 'ko');
  }
  return a.categoryId.localeCompare(b.categoryId);
});
export const lightEntriesSortedRecent: LightEntry[] = [...lightEntries].reverse();

/** ID → 정렬 인덱스 (필터링 후 정렬 유지용) */
export const alphabeticalIndex = new Map<string, number>(
  lightEntriesSortedAlphabetically.map((e, i) => [e.id, i]),
);
export const categoryIndex = new Map<string, number>(
  lightEntriesSortedByCategory.map((e, i) => [e.id, i]),
);
export const recentIndex = new Map<string, number>(
  lightEntriesSortedRecent.map((e, i) => [e.id, i]),
);

// ============================================================================
// 검색 (경량 데이터 기반)
// ============================================================================

/**
 * 검색 쿼리로 엔트리 찾기 (경량 데이터 기반)
 */
export function searchLightEntries(query: string, locale: Language = 'ko'): LightEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return lightEntries.filter((entry) => {
    return (
      entry.korean.toLowerCase().includes(q) ||
      entry.romanization.toLowerCase().includes(q) ||
      entry.word[locale].toLowerCase().includes(q)
    );
  });
}

/**
 * 추천 엔트리 (홈페이지용) - 경량 버전
 */
export function getFeaturedLightEntries(count = 6): LightEntry[] {
  // 첫 N개 반환 (정렬은 이미 알파벳순)
  return lightEntriesSortedAlphabetically.slice(0, count);
}

// ============================================================================
// Deprecated: 동기 함수들 (하위 호환성)
// ============================================================================

/**
 * @deprecated Use getEntryById (async) instead
 * 동기 조회는 더 이상 지원하지 않습니다.
 */
export function getEntryByIdSync(_id: string): MeaningEntry | undefined {
  console.warn('getEntryByIdSync is deprecated. Use getEntryById (async) instead.');
  return undefined;
}

export type { EntryInput, EntryMap } from './helpers';
export { createCategory } from './helpers';
