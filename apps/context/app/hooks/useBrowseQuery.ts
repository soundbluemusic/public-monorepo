/**
 * Browse Query Hooks
 *
 * TanStack Query를 사용한 Browse 데이터 로딩 훅입니다.
 * 청크 기반 데이터 로딩과 카테고리별 로딩을 지원합니다.
 */

import { queryKeys, useQuery } from '@soundblue/features/query';
import { z } from 'zod';
import type { LightEntry } from '@/data/entries';

/** Zod schema for runtime validation */
const LightEntrySchema = z.object({
  id: z.string(),
  korean: z.string(),
  romanization: z.string(),
  categoryId: z.string(),
  word: z.object({
    ko: z.string(),
    en: z.string(),
  }),
});

const LightEntryArraySchema = z.array(LightEntrySchema);

const ChunkFileSchema = z.object({
  chunkIndex: z.number(),
  entries: LightEntryArraySchema,
  hasMore: z.boolean(),
});

export type SortOption = 'alphabetical' | 'category' | 'recent';

/**
 * 청크 데이터 가져오기 함수
 */
async function fetchChunk(sortType: SortOption, chunkIndex: number): Promise<LightEntry[]> {
  const response = await fetch(`/data/browse/${sortType}/chunk-${chunkIndex}.json`);
  if (!response.ok) {
    console.error(`Failed to fetch chunk: ${sortType}/${chunkIndex}`);
    return [];
  }

  const data = await response.json();
  const parsed = ChunkFileSchema.parse(data);
  return parsed.entries;
}

/**
 * 카테고리별 데이터 가져오기 함수
 */
async function fetchByCategory(categoryId: string): Promise<LightEntry[]> {
  const response = await fetch(`/data/by-category/${categoryId}.json`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return LightEntryArraySchema.parse(data);
}

/**
 * 청크 데이터 Query 훅
 *
 * @param sortType - 정렬 방식
 * @param chunkIndex - 청크 인덱스
 * @param enabled - 쿼리 활성화 여부
 */
export function useBrowseChunk(sortType: SortOption, chunkIndex: number, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.browse.chunk(sortType, chunkIndex),
    queryFn: () => fetchChunk(sortType, chunkIndex),
    enabled,
    staleTime: 10 * 60 * 1000, // 10분 캐시
    gcTime: 30 * 60 * 1000, // 30분 GC
  });
}

/**
 * 카테고리별 데이터 Query 훅
 *
 * @param categoryId - 카테고리 ID
 * @param enabled - 쿼리 활성화 여부
 */
export function useBrowseByCategory(categoryId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.browse.byCategory(categoryId),
    queryFn: () => fetchByCategory(categoryId),
    enabled: enabled && categoryId !== 'all',
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
