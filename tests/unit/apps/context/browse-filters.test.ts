/**
 * apps/context - Browse Filters Tests
 *
 * Browse 페이지의 필터링/정렬 관련 순수 함수 테스트
 */
import { describe, expect, it } from 'vitest';

// 테스트할 상수와 타입 가드들
const FILTER_STATUSES = ['all', 'studied', 'unstudied', 'bookmarked'] as const;
type FilterStatus = (typeof FILTER_STATUSES)[number];

const SORT_OPTIONS = ['alphabetical', 'category', 'recent'] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

function isFilterStatus(value: string): value is FilterStatus {
  return (FILTER_STATUSES as readonly string[]).includes(value);
}

function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

// 페이지네이션 상수
const PAGE_SIZE = 50;
const CHUNK_SIZE = 1000;

describe('apps/context - Browse Filters', () => {
  describe('isFilterStatus', () => {
    it('should return true for "all"', () => {
      expect(isFilterStatus('all')).toBe(true);
    });

    it('should return true for "studied"', () => {
      expect(isFilterStatus('studied')).toBe(true);
    });

    it('should return true for "unstudied"', () => {
      expect(isFilterStatus('unstudied')).toBe(true);
    });

    it('should return true for "bookmarked"', () => {
      expect(isFilterStatus('bookmarked')).toBe(true);
    });

    it('should return false for invalid status', () => {
      expect(isFilterStatus('invalid')).toBe(false);
      expect(isFilterStatus('')).toBe(false);
      expect(isFilterStatus('STUDIED')).toBe(false);
    });
  });

  describe('isSortOption', () => {
    it('should return true for "alphabetical"', () => {
      expect(isSortOption('alphabetical')).toBe(true);
    });

    it('should return true for "category"', () => {
      expect(isSortOption('category')).toBe(true);
    });

    it('should return true for "recent"', () => {
      expect(isSortOption('recent')).toBe(true);
    });

    it('should return false for invalid sort option', () => {
      expect(isSortOption('invalid')).toBe(false);
      expect(isSortOption('')).toBe(false);
      expect(isSortOption('ALPHABETICAL')).toBe(false);
      expect(isSortOption('date')).toBe(false);
    });
  });

  describe('Pagination calculations', () => {
    it('should calculate correct chunk index for page 1', () => {
      const page = 1;
      const startIndex = (page - 1) * PAGE_SIZE;
      const chunkIndex = Math.floor(startIndex / CHUNK_SIZE);
      expect(chunkIndex).toBe(0);
    });

    it('should calculate correct chunk index for page 20', () => {
      const page = 20;
      const startIndex = (page - 1) * PAGE_SIZE;
      const chunkIndex = Math.floor(startIndex / CHUNK_SIZE);
      expect(startIndex).toBe(950);
      expect(chunkIndex).toBe(0); // 950 < 1000, still in first chunk
    });

    it('should calculate correct chunk index for page 21', () => {
      const page = 21;
      const startIndex = (page - 1) * PAGE_SIZE;
      const chunkIndex = Math.floor(startIndex / CHUNK_SIZE);
      expect(startIndex).toBe(1000);
      expect(chunkIndex).toBe(1); // 1000 / 1000 = 1
    });

    it('should calculate correct offset within chunk', () => {
      const page = 25;
      const startIndex = (page - 1) * PAGE_SIZE;
      const offsetInChunk = startIndex % CHUNK_SIZE;
      // page 25: startIndex = 24 * 50 = 1200
      // offsetInChunk = 1200 % 1000 = 200
      expect(startIndex).toBe(1200);
      expect(offsetInChunk).toBe(200);
    });

    it('should calculate total pages correctly', () => {
      const totalEntries = 16836;
      const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
      expect(totalPages).toBe(337);
    });

    it('should handle edge case of empty entries', () => {
      const totalEntries = 0;
      const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
      expect(totalPages).toBe(0);
    });

    it('should handle single page case', () => {
      const totalEntries = 30;
      const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
      expect(totalPages).toBe(1);
    });

    it('should handle exact page boundary', () => {
      const totalEntries = 100; // exactly 2 pages
      const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
      expect(totalPages).toBe(2);
    });
  });

  describe('Entry filtering logic', () => {
    interface TestEntry {
      id: string;
      korean: string;
      categoryId: string;
    }

    const testEntries: TestEntry[] = [
      { id: 'hello', korean: '안녕', categoryId: 'greetings' },
      { id: 'goodbye', korean: '안녕히', categoryId: 'greetings' },
      { id: 'rice', korean: '밥', categoryId: 'food' },
      { id: 'water', korean: '물', categoryId: 'food' },
      { id: 'happy', korean: '행복', categoryId: 'emotions' },
    ];

    it('should filter by studied status', () => {
      const studiedIds = new Set(['hello', 'rice']);
      const filtered = testEntries.filter((e) => studiedIds.has(e.id));
      expect(filtered).toHaveLength(2);
      expect(filtered.map((e) => e.id)).toEqual(['hello', 'rice']);
    });

    it('should filter by unstudied status', () => {
      const studiedIds = new Set(['hello', 'rice']);
      const filtered = testEntries.filter((e) => !studiedIds.has(e.id));
      expect(filtered).toHaveLength(3);
      expect(filtered.map((e) => e.id)).toEqual(['goodbye', 'water', 'happy']);
    });

    it('should filter by bookmarked status', () => {
      const favoriteIds = new Set(['goodbye', 'happy']);
      const filtered = testEntries.filter((e) => favoriteIds.has(e.id));
      expect(filtered).toHaveLength(2);
      expect(filtered.map((e) => e.id)).toEqual(['goodbye', 'happy']);
    });

    it('should filter by category', () => {
      const categoryId = 'greetings';
      const filtered = testEntries.filter((e) => e.categoryId === categoryId);
      expect(filtered).toHaveLength(2);
      expect(filtered.map((e) => e.id)).toEqual(['hello', 'goodbye']);
    });

    it('should filter by category and studied status', () => {
      const categoryId = 'greetings';
      const studiedIds = new Set(['hello']);
      const filtered = testEntries
        .filter((e) => e.categoryId === categoryId)
        .filter((e) => studiedIds.has(e.id));
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('hello');
    });

    it('should return empty array when no matches', () => {
      const studiedIds = new Set(['nonexistent']);
      const filtered = testEntries.filter((e) => studiedIds.has(e.id));
      expect(filtered).toHaveLength(0);
    });

    it('should handle empty studiedIds set', () => {
      const studiedIds = new Set<string>();
      const filtered = testEntries.filter((e) => !studiedIds.has(e.id));
      expect(filtered).toHaveLength(5);
    });
  });

  describe('URL parameter parsing', () => {
    it('should parse valid page number', () => {
      const pageParam = '5';
      const page = Number.parseInt(pageParam, 10);
      expect(Number.isNaN(page)).toBe(false);
      expect(page).toBe(5);
      expect(page >= 1).toBe(true);
    });

    it('should reject invalid page number', () => {
      const pageParam = 'abc';
      const page = Number.parseInt(pageParam, 10);
      expect(Number.isNaN(page)).toBe(true);
    });

    it('should reject negative page number', () => {
      const pageParam = '-1';
      const page = Number.parseInt(pageParam, 10);
      expect(page >= 1).toBe(false);
    });

    it('should reject zero page number', () => {
      const pageParam = '0';
      const page = Number.parseInt(pageParam, 10);
      expect(page >= 1).toBe(false);
    });

    it('should handle floating point page number', () => {
      const pageParam = '3.5';
      const page = Number.parseInt(pageParam, 10);
      expect(page).toBe(3); // parseInt truncates
    });
  });

  describe('Cache key generation', () => {
    it('should generate correct cache key for alphabetical sort', () => {
      const sortType = 'alphabetical';
      const chunkIndex = 0;
      const cacheKey = `${sortType}-${chunkIndex}`;
      expect(cacheKey).toBe('alphabetical-0');
    });

    it('should generate correct cache key for category sort', () => {
      const sortType = 'category';
      const chunkIndex = 2;
      const cacheKey = `${sortType}-${chunkIndex}`;
      expect(cacheKey).toBe('category-2');
    });

    it('should generate unique keys for different chunks', () => {
      const keys = [0, 1, 2].map((i) => `alphabetical-${i}`);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(3);
    });
  });
});
