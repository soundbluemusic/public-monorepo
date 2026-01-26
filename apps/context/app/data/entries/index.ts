/**
 * @fileoverview 엔트리 통합 모듈 (번들 최적화 v2)
 *
 * ## 번들 최적화 v2
 * - lightEntries가 번들에서 제거됨 (2.2MB → 0)
 * - SSR loader에서 JSON 파일을 직접 읽어서 HTML에 주입
 * - 클라이언트는 SSR 데이터 또는 fetch로 청크 로드
 *
 * ## 데이터 추가 방법
 * 1. `src/data/entries/*.json` 파일에 데이터 추가
 * 2. `pnpm load-entries` 실행 (빌드 시 자동 실행됨)
 *
 * @example
 * ```ts
 * // SSR loader에서 (Node.js)
 * const entries = await loadLightEntriesForSSR();
 *
 * // 클라이언트에서 (fetch)
 * const entries = await loadLightEntriesChunk('alphabetical', 0);
 * ```
 */

import { type CompressedFile, expandCompressedFile } from '../expand-entry';
// JSON에서 생성된 메타데이터만 import (배열은 제거됨)
import { jsonEntriesCount, type LightEntry } from '../generated/entries';
import { entryToCategory } from '../generated/entry-index';
import type { Language, LocaleEntry, MeaningEntry } from '../types';

// Re-export 타입과 카운트
export { type LightEntry, jsonEntriesCount };

/**
 * @deprecated lightEntries는 더 이상 번들에 포함되지 않습니다.
 * SSR loader에서 loadLightEntriesForSSR()을 사용하세요.
 */
export const lightEntries: LightEntry[] = [];

// ============================================================================
// 카테고리별 청크 캐시 (런타임에서 재사용)
// ============================================================================

/** 카테고리+locale → LocaleEntry 배열 캐시 */
const localeCategoryCache = new Map<string, LocaleEntry[]>();

/**
 * 카테고리별 locale 분리 데이터 로드 (캐시됨)
 * 서버 사이드: Node.js fs로 JSON 파일 읽기
 * 클라이언트: fetch로 JSON 파일 요청
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
    // 서버 사이드 (Node.js 환경)
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
    // colors 카테고리 전용 필드
    ...(enEntry.colorCode && { colorCode: enEntry.colorCode }),
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
        // colors 카테고리 전용 필드
        ...(enEntry.colorCode && { colorCode: enEntry.colorCode }),
      } as MeaningEntry;
    })
    .filter((e): e is MeaningEntry => e !== null);
}

// ============================================================================
// SSR용 데이터 로더 (Node.js 환경에서만 실행)
// ============================================================================

/** LightEntry 청크 캐시 */
let lightEntriesCache: LightEntry[] | null = null;

/**
 * SSR loader에서 사용: JSON 파일에서 lightEntries 로드
 * Node.js 환경에서만 동작, 브라우저에서는 빈 배열 반환
 *
 * 모든 청크 파일을 읽어서 전체 lightEntries 배열 반환
 */
export async function loadLightEntriesForSSR(): Promise<LightEntry[]> {
  // 캐시 확인
  if (lightEntriesCache) return lightEntriesCache;

  // Node.js 환경 확인
  if (typeof window !== 'undefined') {
    console.warn('loadLightEntriesForSSR should only be called in SSR context');
    return [];
  }

  try {
    const { readFileSync, readdirSync } = await import('node:fs');
    const { join } = await import('node:path');

    // alphabetical 청크 디렉토리에서 모든 청크 로드
    const chunkDir = join(process.cwd(), 'public/data/browse/alphabetical');
    const files = readdirSync(chunkDir).filter(
      (f) => f.startsWith('chunk-') && f.endsWith('.json'),
    );

    // 청크 번호순 정렬
    files.sort((a, b) => {
      const numA = Number.parseInt(a.match(/chunk-(\d+)/)?.[1] || '0', 10);
      const numB = Number.parseInt(b.match(/chunk-(\d+)/)?.[1] || '0', 10);
      return numA - numB;
    });

    // 모든 청크에서 entries 추출
    const allEntries: LightEntry[] = [];
    for (const file of files) {
      const filePath = join(chunkDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const chunk = JSON.parse(content) as { chunkIndex: number; entries: LightEntry[] };
      allEntries.push(...chunk.entries);
    }

    lightEntriesCache = allEntries;
    return lightEntriesCache;
  } catch (error) {
    console.error('Failed to load lightEntries for SSR:', error);
    return [];
  }
}

/**
 * SSR loader에서 사용: 정렬된 첫 청크 로드
 * @param sortType - 정렬 타입 ('alphabetical' | 'category' | 'recent')
 * @param chunkIndex - 청크 인덱스 (기본 0)
 */
export async function loadLightEntriesChunkForSSR(
  sortType: 'alphabetical' | 'category' | 'recent' = 'alphabetical',
  chunkIndex = 0,
): Promise<LightEntry[]> {
  if (typeof window !== 'undefined') {
    console.warn('loadLightEntriesChunkForSSR should only be called in SSR context');
    return [];
  }

  try {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');

    const filePath = join(process.cwd(), `public/data/browse/${sortType}/chunk-${chunkIndex}.json`);
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as { entries: LightEntry[] };
    return data.entries;
  } catch (error) {
    console.error(`Failed to load chunk ${sortType}/${chunkIndex}:`, error);
    return [];
  }
}

// ============================================================================
// 경량 버전 (LightEntry) - browse 페이지 최적화용
// ============================================================================

/**
 * @deprecated 정적 배열은 더 이상 사용하지 않습니다.
 * SSR loader에서 loadLightEntriesChunkForSSR()을 사용하세요.
 */
export const lightEntriesSortedAlphabetically: LightEntry[] = [];
export const lightEntriesSortedByCategory: LightEntry[] = [];
export const lightEntriesSortedRecent: LightEntry[] = [];

/**
 * @deprecated 정적 인덱스는 더 이상 사용하지 않습니다.
 */
export const alphabeticalIndex = new Map<string, number>();
export const categoryIndex = new Map<string, number>();
export const recentIndex = new Map<string, number>();

// ============================================================================
// 검색 (MiniSearch 인덱스 사용 권장)
// ============================================================================

/**
 * @deprecated MiniSearch 인덱스를 사용하세요 (/data/search-index.json)
 */
export function searchLightEntries(_query: string, _locale: Language = 'ko'): LightEntry[] {
  console.warn('searchLightEntries is deprecated. Use MiniSearch index instead.');
  return [];
}

/**
 * @deprecated SSR loader에서 직접 로드하세요
 */
export function getFeaturedLightEntries(_count = 6): LightEntry[] {
  console.warn('getFeaturedLightEntries is deprecated. Use loadLightEntriesChunkForSSR instead.');
  return [];
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

// ============================================================================
// 다의어 (Homonym) - 같은 korean을 가진 다른 의미의 단어들
// ============================================================================

export {
  getHomonyms,
  type HomonymEntry,
  homonymIndex,
  homonymStats,
  isHomonym,
} from '../generated/homonyms';
