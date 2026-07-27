import type { D1Database } from '@cloudflare/workers-types';
import type { Language, LocaleEntry } from '@/data/types';
import { cacheKeys, cacheTTL, getCached, setCached } from '../cache';
import { type D1EntryRow, rowToLocaleEntry } from '../entry-converter';
import { logD1Error } from './shared';

export interface TagWithCount {
  tag: string;
  count: number;
}

export async function getEntriesByTagFromD1(
  db: D1Database,
  tag: string,
  locale: Language,
): Promise<LocaleEntry[]> {
  try {
    const searchPattern = `%"${tag}"%`;
    const { results } = await db
      .prepare(
        `SELECT id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations
         FROM entries WHERE tags LIKE ?`,
      )
      .bind(searchPattern)
      .all<D1EntryRow>();

    return results
      .map((row) => rowToLocaleEntry(row, locale))
      .filter((entry): entry is LocaleEntry => entry !== null);
  } catch (error) {
    logD1Error(`getEntriesByTag(${tag})`, error);
    return [];
  }
}

export async function getAllTagsFromD1(db: D1Database): Promise<TagWithCount[]> {
  const cacheKey = cacheKeys.tags();
  const cached = getCached<TagWithCount[]>(cacheKey);
  if (cached !== null) return cached;

  try {
    const { results } = await db
      .prepare('SELECT tags FROM entries WHERE tags IS NOT NULL AND tags != "[]"')
      .all<{ tags: string }>();
    const tagCounts = new Map<string, number>();

    for (const row of results) {
      try {
        for (const tag of JSON.parse(row.tags) as string[]) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      } catch {
        // 손상된 태그 행은 기존 동작대로 건너뜁니다.
      }
    }

    const tags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    setCached(cacheKey, tags, cacheTTL.tags);
    return tags;
  } catch (error) {
    logD1Error('getAllTags', error);
    return [];
  }
}
