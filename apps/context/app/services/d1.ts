/**
 * D1 데이터베이스 서비스 레이어
 *
 * SSR 모드에서 Cloudflare D1을 통해 엔트리 데이터를 조회합니다.
 * JSON 파일 기반 로딩을 대체합니다.
 */

import type { Language, LocaleEntry } from '@/data/types';
import { type D1EntryRow, rowToLocaleEntry } from './entry-converter';

/** D1 쿼리 에러를 로깅하고 null/빈 배열 반환 */
function logD1Error(operation: string, error: unknown): void {
  console.error(`[D1] ${operation} failed:`, error instanceof Error ? error.message : error);
}

/**
 * D1에서 ID로 엔트리 조회
 */
export async function getEntryByIdFromD1(
  db: D1Database,
  id: string,
  locale: Language,
): Promise<LocaleEntry | null> {
  try {
    const row = await db
      .prepare(
        `SELECT id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations
         FROM entries WHERE id = ?`,
      )
      .bind(id)
      .first<D1EntryRow>();

    if (!row) return null;

    return rowToLocaleEntry(row, locale);
  } catch (error) {
    logD1Error(`getEntryById(${id})`, error);
    return null;
  }
}

/**
 * D1에서 카테고리별 엔트리 조회
 */
export async function getEntriesByCategoryFromD1(
  db: D1Database,
  categoryId: string,
  locale: Language,
): Promise<LocaleEntry[]> {
  try {
    const { results } = await db
      .prepare(
        `SELECT id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations
         FROM entries WHERE category_id = ?`,
      )
      .bind(categoryId)
      .all<D1EntryRow>();

    return results
      .map((row: D1EntryRow) => rowToLocaleEntry(row, locale))
      .filter((entry: LocaleEntry | null): entry is LocaleEntry => entry !== null);
  } catch (error) {
    logD1Error(`getEntriesByCategory(${categoryId})`, error);
    return [];
  }
}

/**
 * D1에서 모든 카테고리 조회
 */
export async function getCategoriesFromD1(db: D1Database) {
  try {
    const { results } = await db
      .prepare(
        `SELECT id, name_ko, name_en, description_ko, description_en, icon, color, sort_order
         FROM categories ORDER BY sort_order`,
      )
      .all<{
        id: string;
        name_ko: string;
        name_en: string;
        description_ko: string | null;
        description_en: string | null;
        icon: string | null;
        color: string | null;
        sort_order: number;
      }>();

    return results.map((row) => ({
      id: row.id,
      name: {
        ko: row.name_ko,
        en: row.name_en,
      },
      description: {
        ko: row.description_ko || '',
        en: row.description_en || '',
      },
      icon: row.icon || '',
      color: row.color || 'blue',
      order: row.sort_order,
    }));
  } catch (error) {
    logD1Error('getCategories', error);
    return [];
  }
}

/**
 * D1에서 대화 조회
 */
export async function getConversationsByCategoryFromD1(db: D1Database, categoryId: string) {
  try {
    const { results } = await db
      .prepare(
        `SELECT id, category_id, title_ko, title_en, dialogue
         FROM conversations WHERE category_id = ?`,
      )
      .bind(categoryId)
      .all<{
        id: string;
        category_id: string | null;
        title_ko: string;
        title_en: string;
        dialogue: string;
      }>();

    return results
      .map((row) => {
        try {
          return {
            id: row.id,
            categoryId: row.category_id || '',
            title: {
              ko: row.title_ko,
              en: row.title_en,
            },
            dialogue: JSON.parse(row.dialogue),
          };
        } catch {
          console.error(`[D1] Failed to parse dialogue for conversation ${row.id}`);
          return null;
        }
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  } catch (error) {
    logD1Error(`getConversationsByCategory(${categoryId})`, error);
    return [];
  }
}

/**
 * D1에서 카테고리별 엔트리 ID 목록 조회 (사이트맵용)
 */
export async function getEntryIdsByCategoryFromD1(
  db: D1Database,
  categoryId: string,
): Promise<string[]> {
  try {
    const { results } = await db
      .prepare('SELECT id FROM entries WHERE category_id = ?')
      .bind(categoryId)
      .all<{ id: string }>();

    return results.map((row) => row.id);
  } catch (error) {
    logD1Error(`getEntryIdsByCategory(${categoryId})`, error);
    return [];
  }
}

/**
 * D1에서 모든 카테고리별 엔트리 수 조회 (사이트맵용)
 */
export async function getEntryCounts(db: D1Database): Promise<Map<string, number>> {
  try {
    const { results } = await db
      .prepare('SELECT category_id, COUNT(*) as count FROM entries GROUP BY category_id')
      .all<{ category_id: string; count: number }>();

    const counts = new Map<string, number>();
    for (const row of results) {
      counts.set(row.category_id, row.count);
    }
    return counts;
  } catch (error) {
    logD1Error('getEntryCounts', error);
    return new Map();
  }
}

/** D1 동음이의어 결과 타입 */
export interface HomonymEntryFromD1 {
  id: string;
  korean: string;
  romanization: string;
  categoryId: string;
  word: { ko: string; en: string };
}

/**
 * D1에서 동음이의어 조회 (같은 korean, 다른 id)
 */
export async function getHomonymsByKoreanFromD1(
  db: D1Database,
  korean: string,
): Promise<HomonymEntryFromD1[]> {
  try {
    const { results } = await db
      .prepare(
        'SELECT id, korean, romanization, category_id, translations FROM entries WHERE korean = ?',
      )
      .bind(korean)
      .all<{
        id: string;
        korean: string;
        romanization: string;
        category_id: string;
        translations: string;
      }>();

    return results.map((row) => {
      let word = { ko: '', en: '' };
      try {
        const translations = JSON.parse(row.translations);
        word = {
          ko: translations.ko?.word || '',
          en: translations.en?.word || '',
        };
      } catch {
        // translations 파싱 실패 시 빈 값 사용
      }

      return {
        id: row.id,
        korean: row.korean,
        romanization: row.romanization,
        categoryId: row.category_id,
        word,
      };
    });
  } catch (error) {
    logD1Error(`getHomonymsByKorean(${korean})`, error);
    return [];
  }
}
