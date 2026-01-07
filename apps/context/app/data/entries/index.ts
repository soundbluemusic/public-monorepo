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

import { type CompressedFile, expandCompressedFile } from '../expand-entry';
// JSON에서 생성된 경량 엔트리 (prebuild 스크립트에서 생성됨)
import { jsonEntriesCount, type LightEntry, lightEntries } from '../generated/entries';
import { entryToCategory } from '../generated/entry-index';
import type { Language, LocaleEntry, MeaningEntry } from '../types';

// Re-export 경량 버전
export { lightEntries, type LightEntry, jsonEntriesCount };

// ============================================================================
// 카테고리별 청크 캐시 (런타임에서 재사용)
// ============================================================================

/** 카테고리+locale → LocaleEntry 배열 캐시 */
const localeCategoryCache = new Map<string, LocaleEntry[]>();

/**
 * 카테고리별 locale 분리 데이터 로드 (캐시됨)
 * SSG 빌드 시: Node.js fs로 JSON 파일 읽기
 * 런타임 시: fetch로 JSON 파일 요청
 *
 * @param categoryId - 카테고리 ID
 * @param locale - 언어 코드 ('en' | 'ko')
 * @returns LocaleEntry 배열 (단일 locale 번역만 포함)
 */
async function loadCategoryByLocale(categoryId: string, locale: Language): Promise<LocaleEntry[]> {
  const cacheKey = `${locale}:${categoryId}`;

  // 캐시 확인
  const cached = localeCategoryCache.get(cacheKey);
  if (cached) return cached;

  try {
    // SSG 빌드 시 (Node.js 환경)
    if (typeof window === 'undefined') {
      const { readFileSync } = await import('node:fs');
      const { join } = await import('node:path');

      // 압축된 데이터에서 로드 후 복원
      const filePath = join(process.cwd(), `public/data/compressed/${locale}/${categoryId}.json`);
      const content = readFileSync(filePath, 'utf-8');
      const compressed: CompressedFile = JSON.parse(content);
      const entries = expandCompressedFile(compressed);
      localeCategoryCache.set(cacheKey, entries);
      return entries;
    }

    // 브라우저 런타임 (클라이언트 사이드 네비게이션)
    const response = await fetch(`/data/compressed/${locale}/${categoryId}.json`);
    if (!response.ok) {
      console.warn(`Failed to load category: ${locale}/${categoryId}`);
      return [];
    }
    const compressed: CompressedFile = await response.json();
    const entries = expandCompressedFile(compressed);
    localeCategoryCache.set(cacheKey, entries);
    return entries;
  } catch (error) {
    console.error(`Error loading category ${locale}/${categoryId}:`, error);
    return [];
  }
}

// ============================================================================
// Entry 조회 함수 (비동기 - 카테고리 청크에서 로드)
// ============================================================================

/**
 * ID로 locale별 엔트리 조회 (비동기)
 * locale 분리된 카테고리 청크에서 동적 로드 후 캐시
 *
 * @param id - 엔트리 ID
 * @param locale - 언어 코드 ('en' | 'ko')
 * @returns LocaleEntry (단일 locale 번역만 포함) 또는 undefined
 */
export async function getEntryByIdForLocale(
  id: string,
  locale: Language,
): Promise<LocaleEntry | undefined> {
  const categoryId = entryToCategory[id];
  if (!categoryId) {
    console.warn(`Entry not found in index: ${id}`);
    return undefined;
  }

  const entries = await loadCategoryByLocale(categoryId, locale);
  return entries.find((e) => e.id === id);
}

/**
 * 카테고리 ID로 locale별 엔트리 필터링 (비동기)
 *
 * @param categoryId - 카테고리 ID
 * @param locale - 언어 코드 ('en' | 'ko')
 * @returns LocaleEntry 배열
 */
export async function getEntriesByCategoryForLocale(
  categoryId: string,
  locale: Language,
): Promise<LocaleEntry[]> {
  return loadCategoryByLocale(categoryId, locale);
}

// ============================================================================
// Legacy 함수 (하위 호환성 - 양쪽 locale 데이터 필요한 경우)
// ============================================================================

/**
 * @deprecated Use getEntryByIdForLocale instead for better performance
 * ID로 엔트리 조회 (양쪽 locale 데이터 포함)
 * 두 locale을 모두 로드해서 MeaningEntry 형태로 반환
 */
export async function getEntryById(id: string): Promise<MeaningEntry | undefined> {
  const categoryId = entryToCategory[id];
  if (!categoryId) {
    console.warn(`Entry not found in index: ${id}`);
    return undefined;
  }

  // 양쪽 locale 데이터 로드
  const [enEntries, koEntries] = await Promise.all([
    loadCategoryByLocale(categoryId, 'en'),
    loadCategoryByLocale(categoryId, 'ko'),
  ]);

  const enEntry = enEntries.find((e) => e.id === id);
  const koEntry = koEntries.find((e) => e.id === id);

  if (!enEntry || !koEntry) return undefined;

  // MeaningEntry 형태로 재구성
  return {
    id: enEntry.id,
    korean: enEntry.korean,
    romanization: enEntry.romanization,
    pronunciation: enEntry.pronunciation as MeaningEntry['pronunciation'],
    partOfSpeech: enEntry.partOfSpeech,
    categoryId: enEntry.categoryId,
    tags: enEntry.tags,
    difficulty: enEntry.difficulty,
    frequency: enEntry.frequency,
    translations: {
      en: enEntry.translation,
      ko: koEntry.translation,
    },
  };
}

/**
 * @deprecated Use getEntriesByCategoryForLocale instead for better performance
 * 카테고리 ID로 엔트리 필터링 (양쪽 locale 데이터 포함)
 */
export async function getEntriesByCategory(categoryId: string): Promise<MeaningEntry[]> {
  // 양쪽 locale 데이터 로드
  const [enEntries, koEntries] = await Promise.all([
    loadCategoryByLocale(categoryId, 'en'),
    loadCategoryByLocale(categoryId, 'ko'),
  ]);

  // ID 기반 매핑
  const koMap = new Map(koEntries.map((e) => [e.id, e]));

  return enEntries
    .map((enEntry) => {
      const koEntry = koMap.get(enEntry.id);
      if (!koEntry) return null;

      return {
        id: enEntry.id,
        korean: enEntry.korean,
        romanization: enEntry.romanization,
        pronunciation: enEntry.pronunciation as MeaningEntry['pronunciation'],
        partOfSpeech: enEntry.partOfSpeech,
        categoryId: enEntry.categoryId,
        tags: enEntry.tags,
        difficulty: enEntry.difficulty,
        frequency: enEntry.frequency,
        translations: {
          en: enEntry.translation,
          ko: koEntry.translation,
        },
      } as MeaningEntry;
    })
    .filter((e): e is MeaningEntry => e !== null);
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
