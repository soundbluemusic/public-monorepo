import type { D1Database } from '@cloudflare/workers-types';
import { logD1Error } from './shared';

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
            title: { ko: row.title_ko, en: row.title_en },
            dialogue: JSON.parse(row.dialogue),
          };
        } catch {
          console.error(`[D1] Failed to parse dialogue for conversation ${row.id}`);
          return null;
        }
      })
      .filter(
        (conversation): conversation is NonNullable<typeof conversation> => conversation !== null,
      );
  } catch (error) {
    logD1Error(`getConversationsByCategory(${categoryId})`, error);
    return [];
  }
}
