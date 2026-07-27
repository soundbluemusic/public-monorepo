import type { D1Database } from '@cloudflare/workers-types';
import { cacheKeys, cacheTTL, getCached, setCached } from '../cache';
import { logD1Error } from './shared';

export interface Category {
  id: string;
  name: { ko: string; en: string };
  description: { ko: string; en: string };
  icon: string;
  color: string;
  order: number;
}

export async function getCategoriesFromD1(db: D1Database): Promise<Category[]> {
  const cacheKey = cacheKeys.categories();
  const cached = getCached<Category[]>(cacheKey);
  if (cached !== null) return cached;

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

    const categories = results.map((row) => ({
      id: row.id,
      name: { ko: row.name_ko, en: row.name_en },
      description: {
        ko: row.description_ko || '',
        en: row.description_en || '',
      },
      icon: row.icon || '',
      color: row.color || 'blue',
      order: row.sort_order,
    }));

    setCached(cacheKey, categories, cacheTTL.categories);
    return categories;
  } catch (error) {
    logD1Error('getCategories', error);
    return [];
  }
}
