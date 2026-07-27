import type { D1Database, D1PreparedStatement } from '@cloudflare/workers-types';
import { clearCache } from '../../../../../../apps/context/app/services/cache';
import {
  getAllTagsFromD1,
  getCategoriesFromD1,
  getConversationsByCategoryFromD1,
  getEntriesByCategoryFromD1,
  getEntriesByCategoryPaginatedFromD1,
  getEntriesByTagFromD1,
  getEntryByIdFromD1,
  getEntryCounts,
  getEntryIdsByCategoryFromD1,
  getHomonymsByKoreanFromD1,
} from '../../../../../../apps/context/app/services/d1';
import {
  type D1EntryRow,
  rowToLocaleEntry,
} from '../../../../../../apps/context/app/services/entry-converter';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const entryRow: D1EntryRow = {
  id: 'hello',
  korean: '안녕',
  romanization: 'annyeong',
  part_of_speech: 'interjection',
  category_id: 'greetings',
  difficulty: 'beginner',
  frequency: 5,
  tags: '["greeting","common"]',
  translations: JSON.stringify({
    ko: { word: '안녕', explanation: '친한 사이에서 쓰는 인사말' },
    en: { word: 'Hello', explanation: 'A casual greeting' },
  }),
};

const categoryRow = {
  id: 'greetings',
  name_ko: '인사',
  name_en: 'Greetings',
  description_ko: '인사말 모음',
  description_en: 'Collection of greetings',
  icon: '👋',
  color: 'blue',
  sort_order: 1,
};

const conversationRow = {
  id: 'conv-1',
  category_id: 'greetings',
  title_ko: '첫 만남',
  title_en: 'First Meeting',
  dialogue: JSON.stringify([{ speaker: 'A', text: '안녕하세요' }]),
};

interface MockOptions {
  categories?: typeof categoryRow[];
  conversations?: typeof conversationRow[];
  counts?: { category_id: string; count: number }[];
  entries?: D1EntryRow[];
  shouldThrow?: boolean;
  tags?: { tags: string }[];
}

function createMockD1({
  categories = [],
  conversations = [],
  counts = [],
  entries = [],
  shouldThrow = false,
  tags = [],
}: MockOptions = {}): D1Database {
  return {
    prepare(query: string) {
      let values: unknown[] = [];

      const statement = {
        bind(...boundValues: unknown[]) {
          values = boundValues;
          return statement;
        },
        async first<T>() {
          if (shouldThrow) throw new Error('D1 connection failed');

          if (query.includes('COUNT(*)') && query.includes('WHERE category_id')) {
            return { count: entries.filter((row) => row.category_id === values[0]).length } as T;
          }
          if (query.includes('FROM entries WHERE id = ?')) {
            return (entries.find((row) => row.id === values[0]) as T | undefined) ?? null;
          }
          return null;
        },
        async all<T>() {
          if (shouldThrow) throw new Error('D1 connection failed');

          let results: unknown[] = [];
          if (query.includes('FROM categories')) {
            results = categories;
          } else if (query.includes('FROM conversations')) {
            results = conversations.filter((row) => row.category_id === values[0]);
          } else if (query.includes('GROUP BY category_id')) {
            results = counts;
          } else if (query.includes('SELECT tags FROM entries')) {
            results = tags;
          } else if (query.includes('WHERE korean = ?')) {
            results = entries.filter((row) => row.korean === values[0]);
          } else if (query.includes('WHERE tags LIKE ?')) {
            const tag = String(values[0]).replaceAll('%"', '').replaceAll('"%', '');
            results = entries.filter((row) => row.tags?.includes(`"${tag}"`));
          } else if (query.includes('WHERE category_id = ?')) {
            results = entries.filter((row) => row.category_id === values[0]);
          }

          return { results: results as T[], success: true, meta: {} };
        },
      };

      return statement as unknown as D1PreparedStatement;
    },
  } as unknown as D1Database;
}

beforeEach(() => {
  clearCache();
  vi.restoreAllMocks();
});

describe('Context D1 production services', () => {
  it('loads and localizes an entry through the public barrel', async () => {
    const db = createMockD1({ entries: [entryRow] });

    const ko = await getEntryByIdFromD1(db, 'hello', 'ko');
    const en = await getEntryByIdFromD1(db, 'hello', 'en');

    expect(ko?.translation.word).toBe('안녕');
    expect(en?.translation.word).toBe('Hello');
    expect(ko?.tags).toEqual(['greeting', 'common']);
  });

  it('returns safe fallbacks for missing entries and D1 errors', async () => {
    expect(await getEntryByIdFromD1(createMockD1(), 'missing', 'en')).toBeNull();

    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(await getEntryByIdFromD1(createMockD1({ shouldThrow: true }), 'hello', 'en')).toBeNull();
  });

  it('loads category entries and pagination without changing ordering', async () => {
    const entries = [entryRow, { ...entryRow, id: 'goodbye', korean: '안녕히 가세요' }];
    const db = createMockD1({ entries });

    expect((await getEntriesByCategoryFromD1(db, 'greetings', 'ko')).map(({ id }) => id)).toEqual([
      'hello',
      'goodbye',
    ]);
    expect(await getEntriesByCategoryPaginatedFromD1(db, 'greetings', 'en', 1, 20)).toMatchObject({
      totalCount: 2,
      entries: [{ id: 'hello' }, { id: 'goodbye' }],
    });
    expect(await getEntryIdsByCategoryFromD1(db, 'greetings')).toEqual(['hello', 'goodbye']);
  });

  it('maps categories and preserves defaults', async () => {
    const db = createMockD1({
      categories: [
        categoryRow,
        {
          ...categoryRow,
          id: 'other',
          description_ko: null,
          description_en: null,
          icon: null,
          color: null,
        },
      ],
    });

    const result = await getCategoriesFromD1(db);
    expect(result[0]).toMatchObject({
      id: 'greetings',
      name: { ko: '인사', en: 'Greetings' },
    });
    expect(result[1]).toMatchObject({
      description: { ko: '', en: '' },
      icon: '',
      color: 'blue',
    });
  });

  it('parses conversations and skips malformed dialogue', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const db = createMockD1({
      conversations: [
        conversationRow,
        { ...conversationRow, id: 'broken', dialogue: 'not-json' },
      ],
    });

    expect(await getConversationsByCategoryFromD1(db, 'greetings')).toEqual([
      {
        id: 'conv-1',
        categoryId: 'greetings',
        title: { ko: '첫 만남', en: 'First Meeting' },
        dialogue: [{ speaker: 'A', text: '안녕하세요' }],
      },
    ]);
  });

  it('returns cached entry counts as a Map', async () => {
    const db = createMockD1({
      counts: [
        { category_id: 'greetings', count: 50 },
        { category_id: 'food', count: 100 },
      ],
    });

    expect(Array.from((await getEntryCounts(db)).entries())).toEqual([
      ['greetings', 50],
      ['food', 100],
    ]);
    expect((await getEntryCounts(createMockD1({ shouldThrow: true }))).get('food')).toBe(100);
  });

  it('maps homonyms and tolerates malformed translations', async () => {
    const db = createMockD1({
      entries: [
        entryRow,
        { ...entryRow, id: 'hello-2', translations: 'not-json' },
      ],
    });

    expect(await getHomonymsByKoreanFromD1(db, '안녕')).toEqual([
      {
        id: 'hello',
        korean: '안녕',
        romanization: 'annyeong',
        categoryId: 'greetings',
        word: { ko: '안녕', en: 'Hello' },
      },
      {
        id: 'hello-2',
        korean: '안녕',
        romanization: 'annyeong',
        categoryId: 'greetings',
        word: { ko: '', en: '' },
      },
    ]);
  });

  it('filters entries by tag and aggregates tag counts', async () => {
    const db = createMockD1({
      entries: [entryRow, { ...entryRow, id: 'other', tags: '["common"]' }],
      tags: [{ tags: '["greeting","common"]' }, { tags: '["common"]' }, { tags: 'broken' }],
    });

    expect((await getEntriesByTagFromD1(db, 'greeting', 'en')).map(({ id }) => id)).toEqual([
      'hello',
    ]);
    expect(await getAllTagsFromD1(db)).toEqual([
      { tag: 'common', count: 2 },
      { tag: 'greeting', count: 1 },
    ]);
  });
});

describe('rowToLocaleEntry', () => {
  it('converts D1 rows and applies optional defaults', () => {
    expect(
      rowToLocaleEntry(
        {
          ...entryRow,
          romanization: null,
          part_of_speech: null,
          difficulty: null,
          tags: null,
        },
        'ko',
      ),
    ).toMatchObject({
      id: 'hello',
      romanization: '',
      partOfSpeech: 'noun',
      difficulty: 'beginner',
      tags: [],
    });
  });

  it('returns null for missing or malformed locale data', () => {
    expect(rowToLocaleEntry({ ...entryRow, translations: null }, 'ko')).toBeNull();
    expect(rowToLocaleEntry({ ...entryRow, translations: 'not-json' }, 'ko')).toBeNull();
    expect(
      rowToLocaleEntry(
        {
          ...entryRow,
          translations: JSON.stringify({ ko: { word: '안녕', explanation: '인사' } }),
        },
        'en',
      ),
    ).toBeNull();
  });
});
