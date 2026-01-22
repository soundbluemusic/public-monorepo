/**
 * @fileoverview D1 서버 함수들 - TanStack Start createServerFn 사용
 * @environment server-only
 *
 * 이 모듈은 서버에서만 실행되며, Cloudflare Workers의 D1 바인딩에 접근합니다.
 */

// cloudflare:workers는 Cloudflare Workers 런타임에서만 사용 가능
import { env } from 'cloudflare:workers';
import { createServerFn } from '@tanstack/react-start';
import type { LocaleEntry } from '../data/types';
import { getEntryByIdFromD1, getEntryCounts as getEntryCountsFromD1 } from './d1';

/**
 * 서버에서 D1 데이터베이스에 접근 (cloudflare:workers env 사용)
 */
function getD1Database(): D1Database | null {
  try {
    return (env as { DB?: D1Database }).DB ?? null;
  } catch (error) {
    console.error('[D1Server] Failed to access Cloudflare env:', error);
    return null;
  }
}

/**
 * Entry를 D1에서 로드하는 서버 함수
 */
export const fetchEntryFromD1 = createServerFn().handler(
  // @ts-expect-error - TanStack Start createServerFn handler type incompatibility
  async (opts: { data: { entryId: string; locale: 'en' | 'ko' } }): Promise<LocaleEntry | null> => {
    const { entryId, locale } = opts.data;
    const db = getD1Database();

    if (!db) {
      console.error('[fetchEntryFromD1] D1 database not available');
      return null;
    }

    return await getEntryByIdFromD1(db, entryId, locale);
  },
);

/**
 * 카테고리별 Entry 수를 D1에서 로드하는 서버 함수
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
