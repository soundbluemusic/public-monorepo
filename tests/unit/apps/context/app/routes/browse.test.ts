/**
 * @fileoverview Unit tests for Browse page filter and sort logic
 *
 * Tests the pure filter and sort functions used in browse.tsx
 * These tests ensure the filtering logic works correctly at the function level.
 */
import { describe, expect, it } from 'vitest';

// Types matching browse.tsx
type FilterCategory = 'all' | string;
type FilterStatus = 'all' | 'studied' | 'unstudied' | 'bookmarked';
type SortOption = 'alphabetical' | 'category' | 'recent';

interface MeaningEntry {
  id: string;
  korean: string;
  romanization: string;
  categoryId: string;
  translations: {
    en: { word: string };
    ko: { word: string };
  };
}

// Test data
const testEntries: MeaningEntry[] = [
  {
    id: 'happy',
    korean: '행복하다',
    romanization: 'haengbokhada',
    categoryId: 'emotions',
    translations: { en: { word: 'happy' }, ko: { word: '행복하다' } },
  },
  {
    id: 'sad',
    korean: '슬프다',
    romanization: 'seulpeuda',
    categoryId: 'emotions',
    translations: { en: { word: 'sad' }, ko: { word: '슬프다' } },
  },
  {
    id: 'price',
    korean: '가격',
    romanization: 'gagyeok',
    categoryId: 'shopping',
    translations: { en: { word: 'price' }, ko: { word: '가격' } },
  },
  {
    id: 'rice',
    korean: '밥',
    romanization: 'bap',
    categoryId: 'food',
    translations: { en: { word: 'rice' }, ko: { word: '밥' } },
  },
  {
    id: 'hello',
    korean: '안녕',
    romanization: 'annyeong',
    categoryId: 'greetings',
    translations: { en: { word: 'hello' }, ko: { word: '안녕' } },
  },
];

/**
 * Category filter function (mirrors browse.tsx logic)
 */
function filterByCategory(entries: MeaningEntry[], category: FilterCategory): MeaningEntry[] {
  if (category === 'all') {
    return entries;
  }
  return entries.filter((e) => e.categoryId === category);
}

/**
 * Status filter function (mirrors browse.tsx logic)
 */
function filterByStatus(
  entries: MeaningEntry[],
  status: FilterStatus,
  studiedIds: Set<string>,
  favoriteIds: Set<string>,
): MeaningEntry[] {
  if (status === 'all') {
    return entries;
  }
  if (status === 'studied') {
    return entries.filter((e) => studiedIds.has(e.id));
  }
  if (status === 'unstudied') {
    return entries.filter((e) => !studiedIds.has(e.id));
  }
  if (status === 'bookmarked') {
    return entries.filter((e) => favoriteIds.has(e.id));
  }
  return entries;
}

/**
 * Sort function (mirrors browse.tsx logic)
 */
function sortEntries(entries: MeaningEntry[], sortBy: SortOption): MeaningEntry[] {
  const sorted = [...entries];

  if (sortBy === 'alphabetical') {
    sorted.sort((a, b) => a.korean.localeCompare(b.korean, 'ko'));
  } else if (sortBy === 'category') {
    sorted.sort((a, b) => {
      if (a.categoryId === b.categoryId) {
        return a.korean.localeCompare(b.korean, 'ko');
      }
      return a.categoryId.localeCompare(b.categoryId);
    });
  } else if (sortBy === 'recent') {
    sorted.reverse();
  }

  return sorted;
}

describe('filterByCategory', () => {
  it('should return all entries when category is "all"', () => {
    const result = filterByCategory(testEntries, 'all');
    expect(result).toHaveLength(5);
  });

  it('should filter by emotions category', () => {
    const result = filterByCategory(testEntries, 'emotions');
    expect(result).toHaveLength(2);
    expect(result.every((e) => e.categoryId === 'emotions')).toBe(true);
  });

  it('should filter by shopping category', () => {
    const result = filterByCategory(testEntries, 'shopping');
    expect(result).toHaveLength(1);
    expect(result[0]?.categoryId).toBe('shopping');
  });

  it('should filter by food category', () => {
    const result = filterByCategory(testEntries, 'food');
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('rice');
  });

  it('should return empty array for non-existent category', () => {
    const result = filterByCategory(testEntries, 'non-existent');
    expect(result).toHaveLength(0);
  });

  it('should NOT include shopping in emotions filter', () => {
    const result = filterByCategory(testEntries, 'emotions');
    const hasShoppingItems = result.some((e) => e.categoryId === 'shopping');
    expect(hasShoppingItems).toBe(false);
  });

  it('should NOT include emotions in shopping filter', () => {
    const result = filterByCategory(testEntries, 'shopping');
    const hasEmotionsItems = result.some((e) => e.categoryId === 'emotions');
    expect(hasEmotionsItems).toBe(false);
  });

  it('should handle empty entries array', () => {
    const result = filterByCategory([], 'emotions');
    expect(result).toHaveLength(0);
  });
});

describe('filterByStatus', () => {
  const studiedIds = new Set(['happy', 'price']);
  const favoriteIds = new Set(['sad', 'rice']);

  it('should return all entries when status is "all"', () => {
    const result = filterByStatus(testEntries, 'all', studiedIds, favoriteIds);
    expect(result).toHaveLength(5);
  });

  it('should filter studied entries', () => {
    const result = filterByStatus(testEntries, 'studied', studiedIds, favoriteIds);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id).sort()).toEqual(['happy', 'price']);
  });

  it('should filter unstudied entries', () => {
    const result = filterByStatus(testEntries, 'unstudied', studiedIds, favoriteIds);
    expect(result).toHaveLength(3);
    expect(result.map((e) => e.id)).not.toContain('happy');
    expect(result.map((e) => e.id)).not.toContain('price');
  });

  it('should filter bookmarked entries', () => {
    const result = filterByStatus(testEntries, 'bookmarked', studiedIds, favoriteIds);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id).sort()).toEqual(['rice', 'sad']);
  });

  it('should handle empty sets', () => {
    const result = filterByStatus(testEntries, 'studied', new Set(), new Set());
    expect(result).toHaveLength(0);
  });

  it('should handle all entries being studied', () => {
    const allStudied = new Set(testEntries.map((e) => e.id));
    const result = filterByStatus(testEntries, 'unstudied', allStudied, new Set());
    expect(result).toHaveLength(0);
  });
});

describe('sortEntries', () => {
  it('should sort alphabetically by Korean', () => {
    const result = sortEntries(testEntries, 'alphabetical');

    // Korean alphabetical order: 가격, 밥, 슬프다, 안녕, 행복하다
    expect(result[0]?.korean).toBe('가격');
    expect(result[4]?.korean).toBe('행복하다');
  });

  it('should sort by category', () => {
    const result = sortEntries(testEntries, 'category');

    // Categories sorted: emotions, food, greetings, shopping
    const categories = result.map((e) => e.categoryId);
    expect(categories[0]).toBe('emotions');
  });

  it('should reverse for recent sort', () => {
    const result = sortEntries(testEntries, 'recent');
    expect(result[0]?.id).toBe('hello'); // Last item becomes first
    expect(result[4]?.id).toBe('happy'); // First item becomes last
  });

  it('should not mutate original array', () => {
    const original = [...testEntries];
    sortEntries(testEntries, 'alphabetical');
    expect(testEntries).toEqual(original);
  });

  it('should handle empty array', () => {
    const result = sortEntries([], 'alphabetical');
    expect(result).toHaveLength(0);
  });

  it('should handle single item', () => {
    const single = [testEntries[0]!];
    const result = sortEntries(single, 'alphabetical');
    expect(result).toHaveLength(1);
  });
});

describe('Combined filter and sort', () => {
  const studiedIds = new Set(['happy']);
  const favoriteIds = new Set(['sad']);

  it('should filter then sort correctly', () => {
    // Filter by emotions first
    let result = filterByCategory(testEntries, 'emotions');
    expect(result).toHaveLength(2);

    // Then filter by studied
    result = filterByStatus(result, 'studied', studiedIds, favoriteIds);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('happy');
  });

  it('should apply multiple filters in sequence', () => {
    // Category -> Status -> Sort
    let result = filterByCategory(testEntries, 'emotions');
    result = filterByStatus(result, 'unstudied', studiedIds, favoriteIds);
    result = sortEntries(result, 'alphabetical');

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('sad');
  });
});

describe('URL parameter validation', () => {
  const validCategories = ['all', 'emotions', 'shopping', 'food', 'greetings'];
  const validStatuses = ['all', 'studied', 'unstudied', 'bookmarked'];
  const validSorts = ['alphabetical', 'category', 'recent'];

  it('should accept valid category values', () => {
    for (const category of validCategories) {
      const result = filterByCategory(testEntries, category);
      expect(Array.isArray(result)).toBe(true);
    }
  });

  it('should accept valid status values', () => {
    for (const status of validStatuses) {
      const result = filterByStatus(testEntries, status as FilterStatus, new Set(), new Set());
      expect(Array.isArray(result)).toBe(true);
    }
  });

  it('should accept valid sort values', () => {
    for (const sort of validSorts) {
      const result = sortEntries(testEntries, sort as SortOption);
      expect(Array.isArray(result)).toBe(true);
    }
  });
});
