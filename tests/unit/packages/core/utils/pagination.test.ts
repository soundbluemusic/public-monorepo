/**
 * @soundblue/core - Pagination Utils Tests
 *
 * generatePageNumbers 함수 테스트
 */
import { generatePageNumbers } from '@soundblue/core/utils';
import { describe, expect, it } from 'vitest';

describe('@soundblue/core/utils - generatePageNumbers', () => {
  describe('small page counts (≤7)', () => {
    it('should return all pages for total=1', () => {
      expect(generatePageNumbers(1, 1)).toEqual([1]);
    });

    it('should return all pages for total=5', () => {
      expect(generatePageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return all pages for total=7', () => {
      expect(generatePageNumbers(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should return all pages regardless of current page', () => {
      expect(generatePageNumbers(3, 6)).toEqual([1, 2, 3, 4, 5, 6]);
      expect(generatePageNumbers(6, 6)).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('large page counts (>7)', () => {
    it('should show ellipsis at end when on page 1', () => {
      const result = generatePageNumbers(1, 20);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(2);
      expect(result).toContain('...');
      expect(result[result.length - 1]).toBe(20);
    });

    it('should show ellipsis at end when on page 2', () => {
      const result = generatePageNumbers(2, 20);
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result).toContain(3);
      expect(result).toContain('...');
      expect(result[result.length - 1]).toBe(20);
    });

    it('should show ellipsis at start when on last page', () => {
      const result = generatePageNumbers(20, 20);
      expect(result[0]).toBe(1);
      expect(result).toContain('...');
      expect(result).toContain(19);
      expect(result[result.length - 1]).toBe(20);
    });

    it('should show ellipsis on both sides when in middle', () => {
      const result = generatePageNumbers(10, 20);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe('...');
      expect(result).toContain(9);
      expect(result).toContain(10);
      expect(result).toContain(11);
      expect(result[result.length - 2]).toBe('...');
      expect(result[result.length - 1]).toBe(20);
    });

    it('should not show start ellipsis when current <= 3', () => {
      const result = generatePageNumbers(3, 20);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(2); // No ellipsis at position 1
    });

    it('should not show end ellipsis when current >= total-2', () => {
      const result = generatePageNumbers(18, 20);
      expect(result[result.length - 1]).toBe(20);
      expect(result[result.length - 2]).toBe(19);
    });
  });

  describe('edge cases', () => {
    it('should handle current=1, total=10', () => {
      const result = generatePageNumbers(1, 10);
      expect(result[0]).toBe(1);
      expect(result).toContain('...');
      expect(result[result.length - 1]).toBe(10);
    });

    it('should handle current=5, total=10', () => {
      const result = generatePageNumbers(5, 10);
      expect(result).toContain(4);
      expect(result).toContain(5);
      expect(result).toContain(6);
    });

    it('should handle total=8', () => {
      const result = generatePageNumbers(4, 8);
      expect(result).toContain(1);
      expect(result).toContain(8);
      expect(result).toContain(4);
    });

    it('should handle current at position 4 (boundary for ellipsis)', () => {
      const result = generatePageNumbers(4, 20);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe('...');
    });

    it('should handle current at position total-2 (boundary for end ellipsis)', () => {
      const result = generatePageNumbers(18, 20);
      const lastEllipsisIndex = result.lastIndexOf('...');
      expect(lastEllipsisIndex).toBeLessThan(result.length - 2);
    });
  });

  describe('structure validation', () => {
    it('should always include first page', () => {
      for (let current = 1; current <= 20; current++) {
        const result = generatePageNumbers(current, 20);
        expect(result[0]).toBe(1);
      }
    });

    it('should always include last page', () => {
      for (let current = 1; current <= 20; current++) {
        const result = generatePageNumbers(current, 20);
        expect(result[result.length - 1]).toBe(20);
      }
    });

    it('should always include current page', () => {
      for (let current = 1; current <= 20; current++) {
        const result = generatePageNumbers(current, 20);
        expect(result).toContain(current);
      }
    });

    it('should include adjacent pages to current', () => {
      const result = generatePageNumbers(10, 20);
      expect(result).toContain(9);
      expect(result).toContain(10);
      expect(result).toContain(11);
    });
  });

  describe('boundary value edge cases', () => {
    it('should handle total=0 (no pages)', () => {
      const result = generatePageNumbers(1, 0);
      expect(result).toEqual([]);
    });

    it('should handle negative total', () => {
      const result = generatePageNumbers(1, -5);
      expect(result).toEqual([]);
    });

    it('should handle current > total', () => {
      // When current page exceeds total, behavior is undefined but should not crash
      const result = generatePageNumbers(25, 20);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle current = 0', () => {
      const result = generatePageNumbers(0, 20);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBe(1);
    });

    it('should handle negative current', () => {
      const result = generatePageNumbers(-5, 20);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle decimal current page', () => {
      // JavaScript behavior: 1.5 - 1 = 0.5, Math.max(2, 0.5) = 2
      const result = generatePageNumbers(1.5, 10);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle very large page numbers', () => {
      const result = generatePageNumbers(5000, 10000);
      expect(result[0]).toBe(1);
      expect(result[result.length - 1]).toBe(10000);
      expect(result).toContain(5000);
    });

    it('should handle Infinity total (returns only first and last pages)', () => {
      // With Infinity > 7, the function uses the ellipsis logic
      // and doesn't use Array.from with Infinity length
      const result = generatePageNumbers(1, Number.POSITIVE_INFINITY);
      expect(result[0]).toBe(1);
      expect(result[result.length - 1]).toBe(Number.POSITIVE_INFINITY);
    });

    it('should handle NaN values', () => {
      const result = generatePageNumbers(Number.NaN, 10);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
