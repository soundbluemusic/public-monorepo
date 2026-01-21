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

  // === XSS/Security Edge Cases ===
  describe('XSS/Security edge cases', () => {
    it('should handle XSS attempt in filter status', () => {
      expect(isFilterStatus('<script>alert(1)</script>')).toBe(false);
      expect(isFilterStatus('<img onerror=alert(1) src=x>')).toBe(false);
    });

    it('should handle SQL injection attempt in filter status', () => {
      expect(isFilterStatus("' OR '1'='1")).toBe(false);
      expect(isFilterStatus('all; DROP TABLE entries;--')).toBe(false);
    });

    it('should handle prototype pollution attempt in filter status', () => {
      expect(isFilterStatus('__proto__')).toBe(false);
      expect(isFilterStatus('constructor')).toBe(false);
      expect(isFilterStatus('prototype')).toBe(false);
    });

    it('should handle XSS attempt in sort option', () => {
      expect(isSortOption('<script>alert(1)</script>')).toBe(false);
      expect(isSortOption('javascript:alert(1)')).toBe(false);
    });

    it('should handle SQL injection attempt in sort option', () => {
      expect(isSortOption("'; DELETE FROM entries; --")).toBe(false);
    });

    it('should handle prototype pollution attempt in sort option', () => {
      expect(isSortOption('__proto__')).toBe(false);
      expect(isSortOption('constructor')).toBe(false);
    });
  });

  // === Boundary Value Tests ===
  describe('Boundary value - Infinity/NaN', () => {
    it('should handle Infinity page number', () => {
      const page = Number.POSITIVE_INFINITY;
      const startIndex = (page - 1) * PAGE_SIZE;
      expect(startIndex).toBe(Number.POSITIVE_INFINITY);
      // Infinity % 1000 = NaN (special case)
      expect(Number.isNaN(startIndex % CHUNK_SIZE)).toBe(true);
    });

    it('should handle NaN page number', () => {
      const page = Number.NaN;
      const startIndex = (page - 1) * PAGE_SIZE;
      expect(Number.isNaN(startIndex)).toBe(true);
    });

    it('should handle MAX_SAFE_INTEGER page number', () => {
      const page = Number.MAX_SAFE_INTEGER;
      const startIndex = (page - 1) * PAGE_SIZE;
      // Large number but still valid
      expect(Number.isFinite(startIndex)).toBe(true);
    });

    it('should handle negative Infinity page number', () => {
      const page = Number.NEGATIVE_INFINITY;
      const startIndex = (page - 1) * PAGE_SIZE;
      expect(startIndex).toBe(Number.NEGATIVE_INFINITY);
    });

    it('should handle page number at MAX_SAFE_INTEGER boundary', () => {
      const totalEntries = Number.MAX_SAFE_INTEGER;
      const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
      expect(Number.isFinite(totalPages)).toBe(true);
    });

    it('should handle zero total entries', () => {
      const totalEntries = 0;
      const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
      expect(totalPages).toBe(0);
    });

    it('should handle negative total entries', () => {
      const totalEntries = -100;
      const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
      expect(totalPages).toBe(-2); // ceil(-2) = -2
    });
  });

  // === Unicode/Emoji Edge Cases ===
  describe('Unicode/Emoji edge cases', () => {
    it('should return false for Korean text in filter status', () => {
      expect(isFilterStatus('전체')).toBe(false);
      expect(isFilterStatus('학습완료')).toBe(false);
    });

    it('should return false for emoji in filter status', () => {
      expect(isFilterStatus('📚')).toBe(false);
      expect(isFilterStatus('✅')).toBe(false);
    });

    it('should return false for Korean text in sort option', () => {
      expect(isSortOption('가나다순')).toBe(false);
      expect(isSortOption('카테고리')).toBe(false);
    });

    it('should return false for emoji in sort option', () => {
      expect(isSortOption('🔤')).toBe(false);
      expect(isSortOption('📁')).toBe(false);
    });

    it('should handle zero-width characters', () => {
      expect(isFilterStatus('all\u200B')).toBe(false); // zero-width space
      expect(isSortOption('recent\u200B')).toBe(false);
    });

    it('should handle combining characters', () => {
      // Korean with combining marks
      expect(isFilterStatus('가\u0301')).toBe(false);
    });
  });

  // === Entry Filtering Security ===
  describe('Entry filtering - security edge cases', () => {
    interface TestEntry {
      id: string;
      korean: string;
      categoryId: string;
    }

    const testEntries: TestEntry[] = [
      { id: 'hello', korean: '안녕', categoryId: 'greetings' },
      { id: 'goodbye', korean: '안녕히', categoryId: 'greetings' },
    ];

    it('should handle XSS in entry ID for studied filter', () => {
      const maliciousId = '<script>alert(1)</script>';
      const studiedIds = new Set([maliciousId]);
      const filtered = testEntries.filter((e) => studiedIds.has(e.id));
      expect(filtered).toHaveLength(0);
    });

    it('should handle SQL injection in category filter', () => {
      const maliciousCategoryId = "'; DROP TABLE entries; --";
      const filtered = testEntries.filter((e) => e.categoryId === maliciousCategoryId);
      expect(filtered).toHaveLength(0);
    });

    it('should handle prototype pollution in entry ID', () => {
      const studiedIds = new Set(['__proto__', 'constructor']);
      const filtered = testEntries.filter((e) => studiedIds.has(e.id));
      expect(filtered).toHaveLength(0);
    });

    it('should handle emoji in category ID', () => {
      const emojiCategory = '🎉';
      const filtered = testEntries.filter((e) => e.categoryId === emojiCategory);
      expect(filtered).toHaveLength(0);
    });
  });

  // === URL Parameter Security ===
  describe('URL parameter parsing - security edge cases', () => {
    it('should handle XSS attempt in page param', () => {
      const pageParam = '<script>alert(1)</script>';
      const page = Number.parseInt(pageParam, 10);
      expect(Number.isNaN(page)).toBe(true);
    });

    it('should handle SQL injection in page param', () => {
      const pageParam = "1; DROP TABLE entries;--";
      const page = Number.parseInt(pageParam, 10);
      // parseInt stops at first non-numeric character
      expect(page).toBe(1);
    });

    it('should handle very long page param', () => {
      const pageParam = '1'.repeat(1000);
      const page = Number.parseInt(pageParam, 10);
      // JavaScript handles this as Infinity
      expect(page).toBe(Number.POSITIVE_INFINITY);
    });

    it('should handle scientific notation in page param', () => {
      const pageParam = '1e10';
      const page = Number.parseInt(pageParam, 10);
      // parseInt stops at 'e', returns 1
      expect(page).toBe(1);
    });

    it('should handle hexadecimal in page param', () => {
      const pageParam = '0x10';
      const page = Number.parseInt(pageParam, 10);
      // With radix 10, parseInt stops at 'x', returns 0
      expect(page).toBe(0);
    });

    it('should handle octal in page param', () => {
      const pageParam = '010';
      const page = Number.parseInt(pageParam, 10);
      // With radix 10, this is 10, not 8
      expect(page).toBe(10);
    });
  });
});
