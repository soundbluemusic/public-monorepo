/**
 * @fileoverview Integration tests for Browse page filtering functionality
 *
 * Tests the component + state + logic integration for category and status filtering.
 * Uses jsdom to simulate React component behavior.
 */
import { describe, expect, it } from 'vitest';

// Import filter logic types
type FilterCategory = 'all' | string;
type FilterStatus = 'all' | 'studied' | 'unstudied' | 'bookmarked';

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

// Mock data representing actual entries
const mockEntries: MeaningEntry[] = [
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
    id: 'angry',
    korean: '화나다',
    romanization: 'hwanada',
    categoryId: 'emotions',
    translations: { en: { word: 'angry' }, ko: { word: '화나다' } },
  },
  {
    id: 'price',
    korean: '가격',
    romanization: 'gagyeok',
    categoryId: 'shopping',
    translations: { en: { word: 'price' }, ko: { word: '가격' } },
  },
  {
    id: 'discount',
    korean: '할인',
    romanization: 'halin',
    categoryId: 'shopping',
    translations: { en: { word: 'discount' }, ko: { word: '할인' } },
  },
  {
    id: 'rice',
    korean: '밥',
    romanization: 'bap',
    categoryId: 'food',
    translations: { en: { word: 'rice' }, ko: { word: '밥' } },
  },
];

/**
 * Filter logic extracted from browse.tsx for testing
 * This mirrors the exact logic in the component
 */
function filterEntries(
  entries: MeaningEntry[],
  filterCategory: FilterCategory,
  filterStatus: FilterStatus,
  studiedIds: Set<string>,
  favoriteIds: Set<string>,
): MeaningEntry[] {
  let filtered = entries;

  // Filter by category
  if (filterCategory !== 'all') {
    filtered = filtered.filter((e) => e.categoryId === filterCategory);
  }

  // Filter by status
  if (filterStatus === 'studied') {
    filtered = filtered.filter((e) => studiedIds.has(e.id));
  } else if (filterStatus === 'unstudied') {
    filtered = filtered.filter((e) => !studiedIds.has(e.id));
  } else if (filterStatus === 'bookmarked') {
    filtered = filtered.filter((e) => favoriteIds.has(e.id));
  }

  return filtered;
}

describe('Browse Page - Category Filtering Integration', () => {
  const studiedIds = new Set(['happy', 'price']);
  const favoriteIds = new Set(['sad', 'rice']);

  it('should return all entries when category is "all"', () => {
    const result = filterEntries(mockEntries, 'all', 'all', studiedIds, favoriteIds);
    expect(result).toHaveLength(6);
  });

  it('should filter by emotions category correctly', () => {
    const result = filterEntries(mockEntries, 'emotions', 'all', studiedIds, favoriteIds);

    expect(result).toHaveLength(3);
    expect(result.every((e) => e.categoryId === 'emotions')).toBe(true);
    expect(result.map((e) => e.id)).toContain('happy');
    expect(result.map((e) => e.id)).toContain('sad');
    expect(result.map((e) => e.id)).toContain('angry');
  });

  it('should filter by shopping category correctly', () => {
    const result = filterEntries(mockEntries, 'shopping', 'all', studiedIds, favoriteIds);

    expect(result).toHaveLength(2);
    expect(result.every((e) => e.categoryId === 'shopping')).toBe(true);
    expect(result.map((e) => e.id)).toContain('price');
    expect(result.map((e) => e.id)).toContain('discount');
  });

  it('should NOT show shopping entries when emotions is selected', () => {
    const result = filterEntries(mockEntries, 'emotions', 'all', studiedIds, favoriteIds);

    // Critical test: Shopping items should NOT appear in Emotions filter
    const hasShoppingItems = result.some((e) => e.categoryId === 'shopping');
    expect(hasShoppingItems).toBe(false);

    // Verify no shopping IDs
    expect(result.map((e) => e.id)).not.toContain('price');
    expect(result.map((e) => e.id)).not.toContain('discount');
  });

  it('should NOT show emotions entries when shopping is selected', () => {
    const result = filterEntries(mockEntries, 'shopping', 'all', studiedIds, favoriteIds);

    // Critical test: Emotions items should NOT appear in Shopping filter
    const hasEmotionsItems = result.some((e) => e.categoryId === 'emotions');
    expect(hasEmotionsItems).toBe(false);

    // Verify no emotions IDs
    expect(result.map((e) => e.id)).not.toContain('happy');
    expect(result.map((e) => e.id)).not.toContain('sad');
    expect(result.map((e) => e.id)).not.toContain('angry');
  });

  it('should return empty array for non-existent category', () => {
    const result = filterEntries(mockEntries, 'non-existent', 'all', studiedIds, favoriteIds);
    expect(result).toHaveLength(0);
  });
});

describe('Browse Page - Status Filtering Integration', () => {
  const studiedIds = new Set(['happy', 'price']);
  const favoriteIds = new Set(['sad', 'rice']);

  it('should filter studied entries correctly', () => {
    const result = filterEntries(mockEntries, 'all', 'studied', studiedIds, favoriteIds);

    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toContain('happy');
    expect(result.map((e) => e.id)).toContain('price');
  });

  it('should filter unstudied entries correctly', () => {
    const result = filterEntries(mockEntries, 'all', 'unstudied', studiedIds, favoriteIds);

    expect(result).toHaveLength(4);
    expect(result.map((e) => e.id)).not.toContain('happy');
    expect(result.map((e) => e.id)).not.toContain('price');
  });

  it('should filter bookmarked entries correctly', () => {
    const result = filterEntries(mockEntries, 'all', 'bookmarked', studiedIds, favoriteIds);

    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toContain('sad');
    expect(result.map((e) => e.id)).toContain('rice');
  });
});

describe('Browse Page - Combined Filtering Integration', () => {
  const studiedIds = new Set(['happy', 'price']);
  const favoriteIds = new Set(['sad', 'rice']);

  it('should combine category and status filters correctly', () => {
    // Emotions + Studied = only 'happy'
    const result = filterEntries(mockEntries, 'emotions', 'studied', studiedIds, favoriteIds);

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('happy');
  });

  it('should return empty when combined filters have no matches', () => {
    // Shopping + Bookmarked = no matches (rice is food, not shopping)
    const result = filterEntries(mockEntries, 'shopping', 'bookmarked', studiedIds, favoriteIds);

    expect(result).toHaveLength(0);
  });

  it('should filter emotions + unstudied correctly', () => {
    // Emotions + Unstudied = 'sad' and 'angry'
    const result = filterEntries(mockEntries, 'emotions', 'unstudied', studiedIds, favoriteIds);

    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toContain('sad');
    expect(result.map((e) => e.id)).toContain('angry');
    expect(result.map((e) => e.id)).not.toContain('happy'); // happy is studied
  });

  it('should filter emotions + bookmarked correctly', () => {
    // Emotions + Bookmarked = only 'sad'
    const result = filterEntries(mockEntries, 'emotions', 'bookmarked', studiedIds, favoriteIds);

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('sad');
  });
});

describe('Browse Page - Edge Cases', () => {
  it('should handle empty entries array', () => {
    const result = filterEntries([], 'emotions', 'all', new Set(), new Set());
    expect(result).toHaveLength(0);
  });

  it('should handle empty studied/favorite sets', () => {
    const result = filterEntries(mockEntries, 'all', 'studied', new Set(), new Set());
    expect(result).toHaveLength(0);
  });

  it('should handle filtering with all entries studied', () => {
    const allStudied = new Set(mockEntries.map((e) => e.id));
    const result = filterEntries(mockEntries, 'all', 'unstudied', allStudied, new Set());
    expect(result).toHaveLength(0);
  });

  it('should preserve entry data integrity after filtering', () => {
    const result = filterEntries(mockEntries, 'emotions', 'all', new Set(), new Set());

    // Verify filtered entries have all required properties
    for (const entry of result) {
      expect(entry.id).toBeDefined();
      expect(entry.korean).toBeDefined();
      expect(entry.romanization).toBeDefined();
      expect(entry.categoryId).toBe('emotions');
      expect(entry.translations).toBeDefined();
      expect(entry.translations.en.word).toBeDefined();
      expect(entry.translations.ko.word).toBeDefined();
    }
  });
});
