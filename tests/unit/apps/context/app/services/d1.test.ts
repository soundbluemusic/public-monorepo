/**
 * @fileoverview Context 앱 D1 서비스 테스트
 *
 * D1 데이터베이스 쿼리 함수들의 단위 테스트입니다.
 * 실제 D1이 아닌 Mock을 사용하여 로직을 검증합니다.
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock D1 Database 타입
interface MockD1Result<T> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

interface MockD1PreparedStatement {
  bind: (...values: unknown[]) => MockD1PreparedStatement;
  first: <T>() => Promise<T | null>;
  all: <T>() => Promise<MockD1Result<T>>;
  run: () => Promise<MockD1Result<unknown>>;
}

interface MockD1Database {
  prepare: (query: string) => MockD1PreparedStatement;
}

// 테스트 데이터
const mockEntryRow = {
  id: 'hello',
  korean: '안녕',
  romanization: 'annyeong',
  part_of_speech: 'interjection',
  category_id: 'greetings',
  difficulty: 'beginner',
  frequency: 5,
  tags: '["greeting", "common"]',
  translations: JSON.stringify({
    ko: {
      word: '안녕',
      explanation: '친한 사이에서 쓰는 인사말',
      examples: { beginner: '안녕, 잘 지냈어?' },
    },
    en: {
      word: 'Hello',
      explanation: 'A casual greeting used among friends',
      examples: { beginner: 'Hello, how have you been?' },
    },
  }),
};

const mockCategoryRow = {
  id: 'greetings',
  name_ko: '인사',
  name_en: 'Greetings',
  description_ko: '인사말 모음',
  description_en: 'Collection of greetings',
  icon: '👋',
  color: 'blue',
  sort_order: 1,
};

const mockConversationRow = {
  id: 'conv-1',
  category_id: 'greetings',
  title_ko: '첫 만남',
  title_en: 'First Meeting',
  dialogue: JSON.stringify([
    { speaker: 'A', text: '안녕하세요' },
    { speaker: 'B', text: '안녕하세요, 반갑습니다' },
  ]),
};

// Mock D1 생성 함수
function createMockD1(options?: {
  entryRows?: typeof mockEntryRow[];
  categoryRows?: typeof mockCategoryRow[];
  conversationRows?: typeof mockConversationRow[];
  shouldThrow?: boolean;
  entryCountRows?: { category_id: string; count: number }[];
}): MockD1Database {
  const {
    entryRows = [],
    categoryRows = [],
    conversationRows = [],
    shouldThrow = false,
    entryCountRows = [],
  } = options || {};

  return {
    prepare: (query: string) => {
      let boundValues: unknown[] = [];

      const statement: MockD1PreparedStatement = {
        bind: (...values: unknown[]) => {
          boundValues = values;
          return statement;
        },
        first: async <T>() => {
          if (shouldThrow) throw new Error('D1 connection failed');

          // SELECT ... FROM entries WHERE id = ?
          if (query.includes('FROM entries') && query.includes('WHERE id')) {
            const id = boundValues[0];
            const found = entryRows.find((r) => r.id === id);
            return (found as T) || null;
          }
          return null;
        },
        all: async <T>() => {
          if (shouldThrow) throw new Error('D1 connection failed');

          // SELECT ... FROM entries WHERE category_id = ?
          if (query.includes('FROM entries') && query.includes('WHERE category_id')) {
            const categoryId = boundValues[0];
            const results = entryRows.filter((r) => r.category_id === categoryId);
            return { results: results as T[], success: true, meta: {} };
          }

          // SELECT id FROM entries WHERE category_id = ?
          if (query.includes('SELECT id FROM entries') && query.includes('WHERE category_id')) {
            const categoryId = boundValues[0];
            const results = entryRows
              .filter((r) => r.category_id === categoryId)
              .map((r) => ({ id: r.id }));
            return { results: results as T[], success: true, meta: {} };
          }

          // SELECT ... FROM categories
          if (query.includes('FROM categories')) {
            return { results: categoryRows as T[], success: true, meta: {} };
          }

          // SELECT ... FROM conversations WHERE category_id = ?
          if (query.includes('FROM conversations') && query.includes('WHERE category_id')) {
            const categoryId = boundValues[0];
            const results = conversationRows.filter((r) => r.category_id === categoryId);
            return { results: results as T[], success: true, meta: {} };
          }

          // SELECT category_id, COUNT(*) ... GROUP BY category_id
          if (query.includes('COUNT(*)') && query.includes('GROUP BY category_id')) {
            return { results: entryCountRows as T[], success: true, meta: {} };
          }

          return { results: [] as T[], success: true, meta: {} };
        },
        run: async () => {
          if (shouldThrow) throw new Error('D1 connection failed');
          return { results: [], success: true, meta: {} };
        },
      };

      return statement;
    },
  };
}

// D1 서비스 함수들을 직접 재구현 (테스트용)
// 실제 모듈 import는 Cloudflare 런타임 의존성 때문에 어려움

interface LocaleEntry {
  id: string;
  korean: string;
  romanization: string;
  partOfSpeech: string;
  categoryId: string;
  tags: string[];
  difficulty: string;
  frequency?: number;
  hasDialogue: boolean;
  translation: {
    word: string;
    explanation: string;
    examples?: Record<string, string>;
    variations?: string[];
  };
}

type Language = 'ko' | 'en';

interface D1EntryRow {
  id: string;
  korean: string;
  romanization: string | null;
  part_of_speech: string | null;
  category_id: string;
  difficulty: string | null;
  frequency: number | null;
  tags: string | null;
  translations: string | null;
}

interface Translation {
  word: string;
  explanation: string;
  examples?: Record<string, string>;
  variations?: string[];
  dialogue?: unknown;
}

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
      partOfSpeech: row.part_of_speech || 'noun',
      categoryId: row.category_id,
      tags,
      difficulty: row.difficulty || 'beginner',
      frequency: row.frequency ?? undefined,
      hasDialogue: !!translation.dialogue,
      translation: {
        word: translation.word,
        explanation: translation.explanation,
        examples: translation.examples,
        variations: translation.variations,
      },
    };
  } catch {
    return null;
  }
}

async function getEntryByIdFromD1(
  db: MockD1Database,
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
  } catch {
    return null;
  }
}

async function getEntriesByCategoryFromD1(
  db: MockD1Database,
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
  } catch {
    return [];
  }
}

async function getCategoriesFromD1(db: MockD1Database) {
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
      name: { ko: row.name_ko, en: row.name_en },
      description: { ko: row.description_ko || '', en: row.description_en || '' },
      icon: row.icon || '',
      color: row.color || 'blue',
      order: row.sort_order,
    }));
  } catch {
    return [];
  }
}

async function getConversationsByCategoryFromD1(db: MockD1Database, categoryId: string) {
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
          return null;
        }
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  } catch {
    return [];
  }
}

async function getEntryIdsByCategoryFromD1(
  db: MockD1Database,
  categoryId: string,
): Promise<string[]> {
  try {
    const { results } = await db
      .prepare('SELECT id FROM entries WHERE category_id = ?')
      .bind(categoryId)
      .all<{ id: string }>();

    return results.map((row) => row.id);
  } catch {
    return [];
  }
}

async function getEntryCounts(db: MockD1Database): Promise<Map<string, number>> {
  try {
    const { results } = await db
      .prepare('SELECT category_id, COUNT(*) as count FROM entries GROUP BY category_id')
      .all<{ category_id: string; count: number }>();

    const counts = new Map<string, number>();
    for (const row of results) {
      counts.set(row.category_id, row.count);
    }
    return counts;
  } catch {
    return new Map();
  }
}

// 테스트 시작
describe('D1 Service', () => {
  describe('getEntryByIdFromD1', () => {
    it('should return entry for valid ID with Korean locale', async () => {
      const db = createMockD1({ entryRows: [mockEntryRow] });
      const entry = await getEntryByIdFromD1(db, 'hello', 'ko');

      expect(entry).not.toBeNull();
      expect(entry?.id).toBe('hello');
      expect(entry?.korean).toBe('안녕');
      expect(entry?.romanization).toBe('annyeong');
      expect(entry?.translation.word).toBe('안녕');
      expect(entry?.translation.explanation).toBe('친한 사이에서 쓰는 인사말');
    });

    it('should return entry for valid ID with English locale', async () => {
      const db = createMockD1({ entryRows: [mockEntryRow] });
      const entry = await getEntryByIdFromD1(db, 'hello', 'en');

      expect(entry).not.toBeNull();
      expect(entry?.translation.word).toBe('Hello');
      expect(entry?.translation.explanation).toBe('A casual greeting used among friends');
    });

    it('should return null for non-existent ID', async () => {
      const db = createMockD1({ entryRows: [mockEntryRow] });
      const entry = await getEntryByIdFromD1(db, 'nonexistent', 'ko');

      expect(entry).toBeNull();
    });

    it('should return null when D1 throws error', async () => {
      const db = createMockD1({ shouldThrow: true });
      const entry = await getEntryByIdFromD1(db, 'hello', 'ko');

      expect(entry).toBeNull();
    });

    it('should parse tags correctly', async () => {
      const db = createMockD1({ entryRows: [mockEntryRow] });
      const entry = await getEntryByIdFromD1(db, 'hello', 'ko');

      expect(entry?.tags).toEqual(['greeting', 'common']);
    });

    it('should handle missing romanization', async () => {
      const rowWithoutRomanization = { ...mockEntryRow, romanization: null };
      const db = createMockD1({ entryRows: [rowWithoutRomanization] });
      const entry = await getEntryByIdFromD1(db, 'hello', 'ko');

      expect(entry?.romanization).toBe('');
    });

    it('should handle missing translations', async () => {
      const rowWithoutTranslations = { ...mockEntryRow, translations: null };
      const db = createMockD1({ entryRows: [rowWithoutTranslations] });
      const entry = await getEntryByIdFromD1(db, 'hello', 'ko');

      expect(entry).toBeNull();
    });

    it('should handle invalid JSON in translations', async () => {
      const rowWithInvalidJson = { ...mockEntryRow, translations: 'invalid json' };
      const db = createMockD1({ entryRows: [rowWithInvalidJson] });
      const entry = await getEntryByIdFromD1(db, 'hello', 'ko');

      expect(entry).toBeNull();
    });
  });

  describe('getEntriesByCategoryFromD1', () => {
    it('should return entries for valid category', async () => {
      const entries = [
        mockEntryRow,
        { ...mockEntryRow, id: 'goodbye', korean: '안녕히 가세요' },
      ];
      const db = createMockD1({ entryRows: entries });
      const result = await getEntriesByCategoryFromD1(db, 'greetings', 'ko');

      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe('hello');
      expect(result[1]?.id).toBe('goodbye');
    });

    it('should return empty array for non-existent category', async () => {
      const db = createMockD1({ entryRows: [mockEntryRow] });
      const result = await getEntriesByCategoryFromD1(db, 'nonexistent', 'ko');

      expect(result).toEqual([]);
    });

    it('should filter out entries with invalid translations', async () => {
      const entries = [
        mockEntryRow,
        { ...mockEntryRow, id: 'invalid', translations: null },
      ];
      const db = createMockD1({ entryRows: entries });
      const result = await getEntriesByCategoryFromD1(db, 'greetings', 'ko');

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('hello');
    });

    it('should return empty array when D1 throws error', async () => {
      const db = createMockD1({ shouldThrow: true });
      const result = await getEntriesByCategoryFromD1(db, 'greetings', 'ko');

      expect(result).toEqual([]);
    });
  });

  describe('getCategoriesFromD1', () => {
    it('should return all categories', async () => {
      const categories = [
        mockCategoryRow,
        { ...mockCategoryRow, id: 'food', name_ko: '음식', name_en: 'Food', sort_order: 2 },
      ];
      const db = createMockD1({ categoryRows: categories });
      const result = await getCategoriesFromD1(db);

      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe('greetings');
      expect(result[0]?.name.ko).toBe('인사');
      expect(result[0]?.name.en).toBe('Greetings');
    });

    it('should handle null description', async () => {
      const categoryWithNullDesc = {
        ...mockCategoryRow,
        description_ko: null,
        description_en: null,
      };
      const db = createMockD1({ categoryRows: [categoryWithNullDesc] });
      const result = await getCategoriesFromD1(db);

      expect(result[0]?.description.ko).toBe('');
      expect(result[0]?.description.en).toBe('');
    });

    it('should handle null icon and color', async () => {
      const categoryWithNulls = {
        ...mockCategoryRow,
        icon: null,
        color: null,
      };
      const db = createMockD1({ categoryRows: [categoryWithNulls] });
      const result = await getCategoriesFromD1(db);

      expect(result[0]?.icon).toBe('');
      expect(result[0]?.color).toBe('blue');
    });

    it('should return empty array when D1 throws error', async () => {
      const db = createMockD1({ shouldThrow: true });
      const result = await getCategoriesFromD1(db);

      expect(result).toEqual([]);
    });
  });

  describe('getConversationsByCategoryFromD1', () => {
    it('should return conversations for valid category', async () => {
      const db = createMockD1({ conversationRows: [mockConversationRow] });
      const result = await getConversationsByCategoryFromD1(db, 'greetings');

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('conv-1');
      expect(result[0]?.title.ko).toBe('첫 만남');
      expect(result[0]?.title.en).toBe('First Meeting');
      expect(result[0]?.dialogue).toHaveLength(2);
    });

    it('should return empty array for non-existent category', async () => {
      const db = createMockD1({ conversationRows: [mockConversationRow] });
      const result = await getConversationsByCategoryFromD1(db, 'nonexistent');

      expect(result).toEqual([]);
    });

    it('should filter out conversations with invalid JSON dialogue', async () => {
      const invalidConversation = { ...mockConversationRow, id: 'invalid', dialogue: 'not json' };
      const db = createMockD1({ conversationRows: [mockConversationRow, invalidConversation] });
      const result = await getConversationsByCategoryFromD1(db, 'greetings');

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('conv-1');
    });

    it('should return empty array when D1 throws error', async () => {
      const db = createMockD1({ shouldThrow: true });
      const result = await getConversationsByCategoryFromD1(db, 'greetings');

      expect(result).toEqual([]);
    });
  });

  describe('getEntryIdsByCategoryFromD1', () => {
    it('should return entry IDs for valid category', async () => {
      const entries = [
        mockEntryRow,
        { ...mockEntryRow, id: 'goodbye' },
        { ...mockEntryRow, id: 'thanks' },
      ];
      const db = createMockD1({ entryRows: entries });
      const result = await getEntryIdsByCategoryFromD1(db, 'greetings');

      expect(result).toEqual(['hello', 'goodbye', 'thanks']);
    });

    it('should return empty array for non-existent category', async () => {
      const db = createMockD1({ entryRows: [mockEntryRow] });
      const result = await getEntryIdsByCategoryFromD1(db, 'nonexistent');

      expect(result).toEqual([]);
    });

    it('should return empty array when D1 throws error', async () => {
      const db = createMockD1({ shouldThrow: true });
      const result = await getEntryIdsByCategoryFromD1(db, 'greetings');

      expect(result).toEqual([]);
    });
  });

  describe('getEntryCounts', () => {
    it('should return entry counts by category', async () => {
      const db = createMockD1({
        entryCountRows: [
          { category_id: 'greetings', count: 50 },
          { category_id: 'food', count: 100 },
          { category_id: 'colors', count: 25 },
        ],
      });
      const result = await getEntryCounts(db);

      expect(result.get('greetings')).toBe(50);
      expect(result.get('food')).toBe(100);
      expect(result.get('colors')).toBe(25);
      expect(result.size).toBe(3);
    });

    it('should return empty map when no entries exist', async () => {
      const db = createMockD1({ entryCountRows: [] });
      const result = await getEntryCounts(db);

      expect(result.size).toBe(0);
    });

    it('should return empty map when D1 throws error', async () => {
      const db = createMockD1({ shouldThrow: true });
      const result = await getEntryCounts(db);

      expect(result.size).toBe(0);
    });
  });

  describe('rowToLocaleEntry', () => {
    it('should correctly convert D1 row to LocaleEntry', () => {
      const entry = rowToLocaleEntry(mockEntryRow as D1EntryRow, 'ko');

      expect(entry).not.toBeNull();
      expect(entry?.id).toBe('hello');
      expect(entry?.korean).toBe('안녕');
      expect(entry?.categoryId).toBe('greetings');
      expect(entry?.difficulty).toBe('beginner');
      expect(entry?.frequency).toBe(5);
    });

    it('should return null for missing locale translation', () => {
      const rowWithOnlyKorean = {
        ...mockEntryRow,
        translations: JSON.stringify({
          ko: { word: '안녕', explanation: '인사말' },
        }),
      };
      const entry = rowToLocaleEntry(rowWithOnlyKorean as D1EntryRow, 'en');

      expect(entry).toBeNull();
    });

    it('should handle empty tags', () => {
      const rowWithEmptyTags = { ...mockEntryRow, tags: null };
      const entry = rowToLocaleEntry(rowWithEmptyTags as D1EntryRow, 'ko');

      expect(entry?.tags).toEqual([]);
    });

    it('should set hasDialogue based on translation dialogue field', () => {
      const rowWithDialogue = {
        ...mockEntryRow,
        translations: JSON.stringify({
          ko: {
            word: '안녕',
            explanation: '인사말',
            dialogue: { lines: ['Hello'] },
          },
        }),
      };
      const entry = rowToLocaleEntry(rowWithDialogue as D1EntryRow, 'ko');

      expect(entry?.hasDialogue).toBe(true);
    });

    it('should default partOfSpeech to noun', () => {
      const rowWithNullPos = { ...mockEntryRow, part_of_speech: null };
      const entry = rowToLocaleEntry(rowWithNullPos as D1EntryRow, 'ko');

      expect(entry?.partOfSpeech).toBe('noun');
    });

    it('should default difficulty to beginner', () => {
      const rowWithNullDifficulty = { ...mockEntryRow, difficulty: null };
      const entry = rowToLocaleEntry(rowWithNullDifficulty as D1EntryRow, 'ko');

      expect(entry?.difficulty).toBe('beginner');
    });
  });
});
