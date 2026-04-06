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
import { z } from 'zod';
import type { LocaleEntry } from '../data/types';
import {
  getAllTagsFromD1,
  getCategoriesFromD1,
  getEntriesByCategoryFromD1,
  getEntriesByCategoryPaginatedFromD1,
  getEntriesByTagFromD1,
  getEntryByIdFromD1,
  getEntryCounts as getEntryCountsFromD1,
  getEntryIdsByCategoryFromD1,
  getHomonymsByKoreanFromD1,
  type HomonymEntryFromD1,
  type PaginatedEntries,
  type TagWithCount,
} from './d1';
import { type D1EntryRow, rowToLocaleEntry } from './entry-converter';

// ============================================================================
// 커스텀 에러
// ============================================================================

/** D1 데이터베이스 접근 불가 시 발생하는 에러 */
export class D1UnavailableError extends Error {
  constructor(message = 'D1 database is not available') {
    super(message);
    this.name = 'D1UnavailableError';
  }
}

/**
 * 서버에서 D1 데이터베이스에 접근 (cloudflare:workers env 사용)
 * 주의: 이 import는 빌드 시점에 external로 처리되어 런타임에서만 resolve됩니다.
 * @throws {D1UnavailableError} D1 바인딩에 접근할 수 없을 때
 */
function getD1Database(): D1Database {
  try {
    // Dynamic import to defer resolution to runtime
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { env } = require('cloudflare:workers') as { env: { DB?: D1Database } };
    if (!env.DB) {
      throw new D1UnavailableError('D1 database binding (DB) is not configured');
    }
    return env.DB;
  } catch (error) {
    if (error instanceof D1UnavailableError) {
      throw error;
    }
    throw new D1UnavailableError(
      `Failed to access Cloudflare env: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// ============================================================================
// Zod 입력 스키마
// ============================================================================

/** Entry 조회 입력 스키마 */
const FetchEntryInputSchema = z.object({
  entryId: z.string().min(1).max(200),
  locale: z.enum(['en', 'ko']),
});

/** 카테고리별 Entry ID 조회 입력 스키마 */
const FetchEntryIdsByCategoryInputSchema = z.object({
  categoryId: z.string().min(1).max(100),
});

/**
 * Entry를 D1에서 로드하는 서버 함수
 *
 * @example
 * const entry = await fetchEntryFromD1({ data: { entryId: 'hello', locale: 'ko' } });
 */
export const fetchEntryFromD1 = createServerFn({ method: 'POST' })
  .inputValidator(FetchEntryInputSchema)
  .handler(async ({ data }): Promise<LocaleEntry | null> => {
    const { entryId, locale } = data;
    const db = getD1Database();
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
  return await getCategoriesFromD1(db);
});

/**
 * 카테고리별 Entry ID 목록을 D1에서 로드하는 서버 함수 (사이트맵용)
 *
 * @example
 * const ids = await fetchEntryIdsByCategoryFromD1({ data: { categoryId: 'greetings' } });
 */
export const fetchEntryIdsByCategoryFromD1 = createServerFn({ method: 'POST' })
  .inputValidator(FetchEntryIdsByCategoryInputSchema)
  .handler(async ({ data }): Promise<string[]> => {
    const { categoryId } = data;
    const db = getD1Database();
    return await getEntryIdsByCategoryFromD1(db, categoryId);
  });

/** 카테고리별 Entry 조회 입력 스키마 */
const FetchEntriesByCategoryInputSchema = z.object({
  categoryId: z.string().min(1).max(100),
  locale: z.enum(['en', 'ko']),
});

/** 카테고리별 Entry 페이지네이션 조회 입력 스키마 */
const FetchEntriesByCategoryPaginatedInputSchema = z.object({
  categoryId: z.string().min(1).max(100),
  locale: z.enum(['en', 'ko']),
  page: z.number().int().min(1).max(10000),
  pageSize: z.number().int().min(1).max(100),
});

/**
 * 카테고리별 Entry 목록을 D1에서 로드하는 서버 함수
 *
 * @example
 * const entries = await fetchEntriesByCategoryFromD1({ data: { categoryId: 'greetings', locale: 'ko' } });
 */
export const fetchEntriesByCategoryFromD1 = createServerFn({ method: 'POST' })
  .inputValidator(FetchEntriesByCategoryInputSchema)
  .handler(async ({ data }): Promise<LocaleEntry[]> => {
    const { categoryId, locale } = data;
    const db = getD1Database();
    return await getEntriesByCategoryFromD1(db, categoryId, locale);
  });

/**
 * 카테고리별 Entry 목록을 페이지네이션하여 D1에서 로드하는 서버 함수
 */
export const fetchEntriesByCategoryPaginated = createServerFn({ method: 'POST' })
  .inputValidator(FetchEntriesByCategoryPaginatedInputSchema)
  .handler(async ({ data }): Promise<PaginatedEntries> => {
    const { categoryId, locale, page, pageSize } = data;
    const db = getD1Database();
    return await getEntriesByCategoryPaginatedFromD1(db, categoryId, locale, page, pageSize);
  });

/** 동음이의어 조회 입력 스키마 */
const FetchHomonymsInputSchema = z.object({
  korean: z.string().min(1).max(200),
});

/**
 * 동음이의어(같은 한글, 다른 ID)를 D1에서 로드하는 서버 함수
 *
 * @example
 * const homonyms = await fetchHomonyms({ data: { korean: '안녕' } });
 */
export const fetchHomonyms = createServerFn({ method: 'POST' })
  .inputValidator(FetchHomonymsInputSchema)
  .handler(async ({ data }): Promise<HomonymEntryFromD1[]> => {
    const { korean } = data;
    const db = getD1Database();
    return await getHomonymsByKoreanFromD1(db, korean);
  });

// ============================================================================
// 태그 관련 서버 함수
// ============================================================================

/** 태그별 Entry 조회 입력 스키마 */
const FetchEntriesByTagInputSchema = z.object({
  tag: z.string().min(1).max(200),
  locale: z.enum(['en', 'ko']),
});

/**
 * 태그별 Entry 목록을 D1에서 로드하는 서버 함수
 */
export const fetchEntriesByTagFromD1 = createServerFn({ method: 'POST' })
  .inputValidator(FetchEntriesByTagInputSchema)
  .handler(async ({ data }): Promise<LocaleEntry[]> => {
    const { tag, locale } = data;
    const db = getD1Database();
    return await getEntriesByTagFromD1(db, tag, locale);
  });

/**
 * 모든 태그와 개수를 D1에서 로드하는 서버 함수
 */
export const fetchAllTagsFromD1 = createServerFn().handler(async (): Promise<TagWithCount[]> => {
  const db = getD1Database();
  return await getAllTagsFromD1(db);
});

/**
 * 오늘의 단어를 D1에서 로드하는 서버 함수
 * dayOfYear를 시드로 사용하여 매일 다른 단어 선택
 */
export const fetchDailyWordFromD1 = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ locale: z.enum(['en', 'ko']) }))
  .handler(async ({ data }): Promise<LocaleEntry | null> => {
    const db = getD1Database();

    try {
      const countResult = await db
        .prepare('SELECT COUNT(*) as count FROM entries')
        .first<{ count: number }>();
      const totalCount = countResult?.count ?? 0;
      if (totalCount === 0) return null;

      const today = new Date();
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
      );
      const offset = dayOfYear % totalCount;

      const row = await db
        .prepare('SELECT * FROM entries LIMIT 1 OFFSET ?')
        .bind(offset)
        .first<D1EntryRow>();

      if (!row) return null;

      return rowToLocaleEntry(row, data.locale);
    } catch (error) {
      console.error('[fetchDailyWordFromD1] Failed:', error);
      return null;
    }
  });
