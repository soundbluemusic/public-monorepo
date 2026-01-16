/**
 * D1 데이터베이스 서비스 레이어
 *
 * SSR 모드에서 Cloudflare D1을 통해 엔트리 데이터를 조회합니다.
 * JSON 파일 기반 로딩을 대체합니다.
 */

import type { Language, LocaleEntry, Translation } from '@/data/types';

/**
 * D1 entries 테이블 row 타입
 */
interface D1EntryRow {
  id: string;
  korean: string;
  romanization: string | null;
  part_of_speech: string | null;
  category_id: string;
  difficulty: string | null;
  frequency: string | null;
  tags: string | null; // JSON array
  translations: string | null; // JSON object { ko: {...}, en: {...} }
  created_at: number | null;
}

/**
 * D1 row를 LocaleEntry로 변환
 */
function rowToLocaleEntry(row: D1EntryRow, locale: Language): LocaleEntry | null {
  if (!row.translations) return null;

  try {
    const translations = JSON.parse(row.translations) as {
      ko?: Translation;
      en?: Translation;
    };

    const translation = translations[locale];
    if (!translation) return null;

    const tags = row.tags ? (JSON.parse(row.tags) as string[]) : [];

    return {
      id: row.id,
      korean: row.korean,
      romanization: row.romanization || '',
      partOfSpeech: (row.part_of_speech || 'noun') as LocaleEntry['partOfSpeech'],
      categoryId: row.category_id,
      tags,
      difficulty: (row.difficulty || 'beginner') as LocaleEntry['difficulty'],
      frequency: row.frequency as LocaleEntry['frequency'] | undefined,
      hasDialogue: !!translation.dialogue,
      translation: {
        word: translation.word,
        explanation: translation.explanation,
        examples: translation.examples,
        variations: translation.variations,
      },
    };
  } catch (error) {
    console.error(`Failed to parse entry ${row.id}:`, error);
    return null;
  }
}

/**
 * D1에서 ID로 엔트리 조회
 */
export async function getEntryByIdFromD1(
  db: D1Database,
  id: string,
  locale: Language,
): Promise<LocaleEntry | null> {
  const row = await db.prepare('SELECT * FROM entries WHERE id = ?').bind(id).first<D1EntryRow>();

  if (!row) return null;

  return rowToLocaleEntry(row, locale);
}

/**
 * D1에서 카테고리별 엔트리 조회
 */
export async function getEntriesByCategoryFromD1(
  db: D1Database,
  categoryId: string,
  locale: Language,
): Promise<LocaleEntry[]> {
  const { results } = await db
    .prepare('SELECT * FROM entries WHERE category_id = ?')
    .bind(categoryId)
    .all<D1EntryRow>();

  return results
    .map((row: D1EntryRow) => rowToLocaleEntry(row, locale))
    .filter((entry: LocaleEntry | null): entry is LocaleEntry => entry !== null);
}

/**
 * D1에서 모든 카테고리 조회
 */
export async function getCategoriesFromD1(db: D1Database) {
  const { results } = await db.prepare('SELECT * FROM categories ORDER BY sort_order').all<{
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
}

/**
 * D1에서 대화 조회
 */
export async function getConversationsByCategoryFromD1(db: D1Database, categoryId: string) {
  const { results } = await db
    .prepare('SELECT * FROM conversations WHERE category_id = ?')
    .bind(categoryId)
    .all<{
      id: string;
      category_id: string | null;
      title_ko: string;
      title_en: string;
      dialogue: string;
    }>();

  return results.map((row) => ({
    id: row.id,
    categoryId: row.category_id || '',
    title: {
      ko: row.title_ko,
      en: row.title_en,
    },
    dialogue: JSON.parse(row.dialogue),
  }));
}

/**
 * D1에서 카테고리별 엔트리 ID 목록 조회 (사이트맵용)
 */
export async function getEntryIdsByCategoryFromD1(
  db: D1Database,
  categoryId: string,
): Promise<string[]> {
  const { results } = await db
    .prepare('SELECT id FROM entries WHERE category_id = ?')
    .bind(categoryId)
    .all<{ id: string }>();

  return results.map((row) => row.id);
}

/**
 * D1에서 모든 카테고리별 엔트리 수 조회 (사이트맵용)
 */
export async function getEntryCounts(db: D1Database): Promise<Map<string, number>> {
  const { results } = await db
    .prepare('SELECT category_id, COUNT(*) as count FROM entries GROUP BY category_id')
    .all<{ category_id: string; count: number }>();

  const counts = new Map<string, number>();
  for (const row of results) {
    counts.set(row.category_id, row.count);
  }
  return counts;
}
