/**
 * @fileoverview Tests for chunk utility functions
 */

import { chunkArray, splitIntoGroups } from '@soundblue/core/utils';
import { describe, expect, it } from 'vitest';

describe('chunkArray', () => {
  it('should split array into chunks of specified size', () => {
    const result = chunkArray([1, 2, 3, 4, 5, 6, 7], 3);
    expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it('should handle exact division', () => {
    const result = chunkArray([1, 2, 3, 4, 5, 6], 2);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it('should handle empty array', () => {
    const result = chunkArray([], 3);
    expect(result).toEqual([]);
  });

  it('should handle chunk size larger than array', () => {
    const result = chunkArray([1, 2], 5);
    expect(result).toEqual([[1, 2]]);
  });

  it('should handle chunk size of 1', () => {
    const result = chunkArray([1, 2, 3], 1);
    expect(result).toEqual([[1], [2], [3]]);
  });

  it('should throw error for non-positive chunk size', () => {
    expect(() => chunkArray([1, 2, 3], 0)).toThrow('Chunk size must be positive');
    expect(() => chunkArray([1, 2, 3], -1)).toThrow('Chunk size must be positive');
  });

  it('should work with strings', () => {
    const result = chunkArray(['a', 'b', 'c', 'd'], 2);
    expect(result).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('should work with objects', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = chunkArray(items, 2);
    expect(result).toEqual([[{ id: 1 }, { id: 2 }], [{ id: 3 }]]);
  });

  // Edge cases
  it('should handle array with null/undefined elements', () => {
    const result = chunkArray([1, null, undefined, 4], 2);
    expect(result).toEqual([[1, null], [undefined, 4]]);
  });

  it('should handle Infinity as chunk size (returns single chunk)', () => {
    const result = chunkArray([1, 2, 3, 4, 5], Infinity);
    expect(result).toEqual([[1, 2, 3, 4, 5]]);
  });

  it('should handle very large chunk size', () => {
    const result = chunkArray([1, 2, 3], Number.MAX_SAFE_INTEGER);
    expect(result).toEqual([[1, 2, 3]]);
  });

  it('should handle decimal chunk size', () => {
    // 2.9 is treated as 2.9 in loop increment (i += 2.9)
    // Iteration: i=0, i=2.9, i=5.8 (stops at 5.8 > 5)
    // slice(0, 2.9) → [1, 2], slice(2.9, 5.8) → [3, 4, 5]
    const result = chunkArray([1, 2, 3, 4, 5], 2.9);
    expect(result).toHaveLength(2);
    expect(result).toEqual([[1, 2], [3, 4, 5]]);
  });

  it('should handle NaN chunk size (creates single empty chunk)', () => {
    // NaN <= 0 is false, so no throw
    // Loop: i=0, i=0+NaN=NaN, NaN < 3 is false → exits after one iteration
    // slice(0, NaN) → slice(0, 0) → []
    const result = chunkArray([1, 2, 3], NaN);
    expect(result).toEqual([[]]);
  });

  it('should handle sparse arrays', () => {
    // eslint-disable-next-line no-sparse-arrays
    const sparseArray = [1, , 3, , 5];
    const result = chunkArray(sparseArray, 2);
    expect(result).toHaveLength(3);
  });
});

describe('splitIntoGroups', () => {
  it('should split array into specified number of groups', () => {
    const result = splitIntoGroups([1, 2, 3, 4, 5, 6], 3);
    expect(result).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
  });

  it('should handle uneven distribution', () => {
    const result = splitIntoGroups([1, 2, 3, 4, 5], 3);
    expect(result).toEqual([[1, 4], [2, 5], [3]]);
  });

  it('should handle empty array', () => {
    const result = splitIntoGroups([], 3);
    expect(result).toEqual([]);
  });

  it('should handle more groups than items', () => {
    const result = splitIntoGroups([1, 2], 5);
    expect(result).toEqual([[1], [2]]);
  });

  it('should handle single group', () => {
    const result = splitIntoGroups([1, 2, 3], 1);
    expect(result).toEqual([[1, 2, 3]]);
  });

  it('should throw error for non-positive number of groups', () => {
    expect(() => splitIntoGroups([1, 2, 3], 0)).toThrow('Number of groups must be positive');
    expect(() => splitIntoGroups([1, 2, 3], -1)).toThrow('Number of groups must be positive');
  });
});
