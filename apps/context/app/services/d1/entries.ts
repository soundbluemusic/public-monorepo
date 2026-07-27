import type { D1Database } from '@cloudflare/workers-types';
import type { Language, LocaleEntry } from '@/data/types';
import { cacheKeys, cacheTTL, getCached, setCached } from '../cache';
import { type D1EntryRow, rowToLocaleEntry } from '../entry-converter';
import { logD1Error } from './shared';

export async function getEntryByIdFromD1(
  db: D1Database,
  id: string,
  locale: Language,
): Promise<LocaleEntry | null> {
  const cacheKey = cacheKeys.entry(id, locale);
  const cached = getCached<LocaleEntry | null>(cacheKey);
  if (cached !== null) return cached;

  try {
    const row = await db
      .prepare(
        `SELECT id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations
         FROM entries WHERE id = ?`,
      )
      .bind(id)
      .first<D1EntryRow>();

    if (!row) {
      setCached(cacheKey, null, cacheTTL.entry);
      return null;
    }

    const entry = rowToLocaleEntry(row, locale);
    setCached(cacheKey, entry, cacheTTL.entry);
    return entry;
  } catch (error) {
    logD1Error(`getEntryById(${id})`, error);
    return null;
  }
}

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
      .map((row) => rowToLocaleEntry(row, locale))
      .filter((entry): entry is LocaleEntry => entry !== null);
  } catch (error) {
    logD1Error(`getEntriesByCategory(${categoryId})`, error);
    return [];
  }
}

export interface PaginatedEntries {
  entries: LocaleEntry[];
  totalCount: number;
}

export async function getEntriesByCategoryPaginatedFromD1(
  db: D1Database,
  categoryId: string,
  locale: Language,
  page: number,
  pageSize: number,
): Promise<PaginatedEntries> {
  try {
    const [countResult, entriesResult] = await Promise.all([
      db
        .prepare('SELECT COUNT(*) as count FROM entries WHERE category_id = ?')
        .bind(categoryId)
        .first<{ count: number }>(),
      db
        .prepare(
          `SELECT id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations
           FROM entries WHERE category_id = ? ORDER BY korean COLLATE NOCASE LIMIT ? OFFSET ?`,
        )
        .bind(categoryId, pageSize, (page - 1) * pageSize)
        .all<D1EntryRow>(),
    ]);

    const entries = entriesResult.results
      .map((row) => rowToLocaleEntry(row, locale))
      .filter((entry): entry is LocaleEntry => entry !== null);

    return { entries, totalCount: countResult?.count ?? 0 };
  } catch (error) {
    logD1Error(`getEntriesByCategoryPaginated(${categoryId}, page=${page})`, error);
    return { entries: [], totalCount: 0 };
  }
}

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

export async function getEntryCounts(db: D1Database): Promise<Map<string, number>> {
  const cacheKey = cacheKeys.entryCounts();
  const cached = getCached<[string, number][]>(cacheKey);
  if (cached !== null) return new Map(cached);

  try {
    const { results } = await db
      .prepare('SELECT category_id, COUNT(*) as count FROM entries GROUP BY category_id')
      .all<{ category_id: string; count: number }>();

    const counts = new Map(results.map((row) => [row.category_id, row.count]));
    setCached(cacheKey, Array.from(counts.entries()), cacheTTL.entryCounts);
    return counts;
  } catch (error) {
    logD1Error('getEntryCounts', error);
    return new Map();
  }
}

export interface HomonymEntryFromD1 {
  id: string;
  korean: string;
  romanization: string;
  categoryId: string;
  word: { ko: string; en: string };
}

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
        // 손상된 번역 데이터는 기존 동작대로 빈 값으로 노출합니다.
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
