/**
 * @fileoverview D1 서버 함수들 - TanStack Start createServerFn 사용
 * @environment server-only
 *
 * 이 모듈은 서버에서만 실행되며, Cloudflare Workers의 D1 바인딩에 접근합니다.
 *
 * TanStack Start 공식 패턴:
 * - createServerFn({ method: 'POST' }) - POST 메서드 지정 (데이터 전송용)
 * - .inputValidator() - 입력 타입 검증
 * - .handler() - 실제 처리 로직
 */

import { createServerFn } from '@tanstack/react-start';
import type { LocaleEntry } from '../data/types';
import {
  getAllTagsFromD1,
  getCategoriesFromD1,
  getEntriesByCategoryFromD1,
  getEntriesByTagFromD1,
  getEntryByIdFromD1,
  getEntryCounts as getEntryCountsFromD1,
  getEntryIdsByCategoryFromD1,
  getHomonymsByKoreanFromD1,
  type HomonymEntryFromD1,
  type TagWithCount,
} from './d1';

/**
 * 서버에서 D1 데이터베이스에 접근 (cloudflare:workers env 사용)
 * 주의: 이 import는 빌드 시점에 external로 처리되어 런타임에서만 resolve됩니다.
 */
function getD1Database(): D1Database | null {
  try {
    // Dynamic import to defer resolution to runtime
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { env } = require('cloudflare:workers') as { env: { DB?: D1Database } };
    return env.DB ?? null;
  } catch (error) {
    console.error('[D1Server] Failed to access Cloudflare env:', error);
    return null;
  }
}

/** Entry 조회 입력 타입 */
type FetchEntryInput = { entryId: string; locale: 'en' | 'ko' };

/** 카테고리별 Entry ID 조회 입력 타입 */
type FetchEntryIdsByCategoryInput = { categoryId: string };

/**
 * Entry를 D1에서 로드하는 서버 함수
 *
 * @example
 * const entry = await fetchEntryFromD1({ data: { entryId: 'hello', locale: 'ko' } });
 */
export const fetchEntryFromD1 = createServerFn({ method: 'POST' })
  .inputValidator((data: FetchEntryInput) => data)
  .handler(async ({ data }): Promise<LocaleEntry | null> => {
    const { entryId, locale } = data;
    const db = getD1Database();

    if (!db) {
      console.error('[fetchEntryFromD1] D1 database not available');
      return null;
    }

    return await getEntryByIdFromD1(db, entryId, locale);
  });

/**
 * 카테고리별 Entry 수를 D1에서 로드하는 서버 함수
 *
 * @example
 * const counts = await fetchEntryCountsFromD1();
 */
export const fetchEntryCountsFromD1 = createServerFn().handler(
  async (): Promise<Map<string, number>> => {
    const db = getD1Database();

    if (!db) {
      console.error('[fetchEntryCountsFromD1] D1 database not available');
      return new Map();
    }

    return await getEntryCountsFromD1(db);
  },
);

/**
 * 모든 카테고리를 D1에서 로드하는 서버 함수 (사이트맵용)
 *
 * @example
 * const categories = await fetchCategoriesFromD1();
 */
export const fetchCategoriesFromD1 = createServerFn().handler(async () => {
  const db = getD1Database();

  if (!db) {
    console.error('[fetchCategoriesFromD1] D1 database not available');
    return [];
  }

  return await getCategoriesFromD1(db);
});

/**
 * 카테고리별 Entry ID 목록을 D1에서 로드하는 서버 함수 (사이트맵용)
 *
 * @example
 * const ids = await fetchEntryIdsByCategoryFromD1({ data: { categoryId: 'greetings' } });
 */
export const fetchEntryIdsByCategoryFromD1 = createServerFn({ method: 'POST' })
  .inputValidator((data: FetchEntryIdsByCategoryInput) => data)
  .handler(async ({ data }): Promise<string[]> => {
    const { categoryId } = data;
    const db = getD1Database();

    if (!db) {
      console.error('[fetchEntryIdsByCategoryFromD1] D1 database not available');
      return [];
    }

    return await getEntryIdsByCategoryFromD1(db, categoryId);
  });

/** 카테고리별 Entry 조회 입력 타입 */
type FetchEntriesByCategoryInput = { categoryId: string; locale: 'en' | 'ko' };

/**
 * 카테고리별 Entry 목록을 D1에서 로드하는 서버 함수
 *
 * @example
 * const entries = await fetchEntriesByCategoryFromD1({ data: { categoryId: 'greetings', locale: 'ko' } });
 */
export const fetchEntriesByCategoryFromD1 = createServerFn({ method: 'POST' })
  .inputValidator((data: FetchEntriesByCategoryInput) => data)
  .handler(async ({ data }): Promise<LocaleEntry[]> => {
    const { categoryId, locale } = data;
    const db = getD1Database();

    if (!db) {
      console.error('[fetchEntriesByCategoryFromD1] D1 database not available');
      return [];
    }

    return await getEntriesByCategoryFromD1(db, categoryId, locale);
  });

/** 동음이의어 조회 입력 타입 */
type FetchHomonymsInput = { korean: string };

/**
 * 동음이의어(같은 한글, 다른 ID)를 D1에서 로드하는 서버 함수
 *
 * @example
 * const homonyms = await fetchHomonyms({ data: { korean: '안녕' } });
 */
export const fetchHomonyms = createServerFn({ method: 'POST' })
  .inputValidator((data: FetchHomonymsInput) => data)
  .handler(async ({ data }): Promise<HomonymEntryFromD1[]> => {
    const { korean } = data;
    const db = getD1Database();

    if (!db) {
      console.error('[fetchHomonyms] D1 database not available');
      return [];
    }

    return await getHomonymsByKoreanFromD1(db, korean);
  });

// ============================================================================
// 태그 관련 서버 함수
// ============================================================================

/** 태그별 Entry 조회 입력 타입 */
type FetchEntriesByTagInput = { tag: string; locale: 'en' | 'ko' };

/**
 * 태그별 Entry 목록을 D1에서 로드하는 서버 함수
 */
export const fetchEntriesByTagFromD1 = createServerFn({ method: 'POST' })
  .inputValidator((data: FetchEntriesByTagInput) => data)
  .handler(async ({ data }): Promise<LocaleEntry[]> => {
    const { tag, locale } = data;
    const db = getD1Database();

    if (!db) {
      console.error('[fetchEntriesByTagFromD1] D1 database not available');
      return [];
    }

    return await getEntriesByTagFromD1(db, tag, locale);
  });

/**
 * 모든 태그와 개수를 D1에서 로드하는 서버 함수
 */
export const fetchAllTagsFromD1 = createServerFn().handler(async (): Promise<TagWithCount[]> => {
  const db = getD1Database();

  if (!db) {
    console.error('[fetchAllTagsFromD1] D1 database not available');
    return [];
  }

  return await getAllTagsFromD1(db);
});
