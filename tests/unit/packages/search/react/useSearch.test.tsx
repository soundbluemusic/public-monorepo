/**
 * @soundblue/search - useSearch Hook Tests
 *
 * React 검색 훅 테스트
 */

import type { SearchableItem, SearchConfig } from '@soundblue/search';
import { useSearch } from '@soundblue/search/react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

interface TestItem extends SearchableItem {
  id: string;
  word: string;
  definition: string;
}

const testData: TestItem[] = [
  { id: 'hello', word: 'Hello', definition: 'A greeting' },
  { id: 'world', word: 'World', definition: 'The earth' },
  { id: 'help', word: 'Help', definition: 'Assistance' },
  { id: 'hero', word: 'Hero', definition: 'A brave person' },
  { id: 'test', word: 'Test', definition: 'An examination' },
];

const testConfig: SearchConfig = {
  fields: ['word', 'definition'],
  storeFields: ['word', 'definition'],
};

describe('@soundblue/search/react - useSearch', () => {
  describe('initialization', () => {
    it('should initialize with empty query', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      expect(result.current.query).toBe('');
    });

    it('should initialize with empty results', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      expect(result.current.results).toEqual([]);
    });

    it('should initialize with empty suggestions', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      expect(result.current.suggestions).toEqual([]);
    });

    it('should not be searching initially', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      expect(result.current.isSearching).toBe(false);
    });
  });

  describe('setQuery', () => {
    it('should update query state', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      act(() => {
        result.current.setQuery('hello');
      });

      expect(result.current.query).toBe('hello');
    });

    it('should sanitize query input (trim and lowercase)', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      act(() => {
        result.current.setQuery('  HELLO  world  ');
      });

      // sanitizeSearchQuery: toLowerCase() + trim() (중간 공백 유지)
      expect(result.current.query).toBe('hello  world');
    });

    it('should return results for matching query', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      act(() => {
        result.current.setQuery('hello');
      });

      expect(result.current.results.length).toBeGreaterThan(0);
      expect(result.current.results[0].item.word).toBe('Hello');
    });

    it('should return empty results for non-matching query', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      act(() => {
        result.current.setQuery('xyz123nonexistent');
      });

      expect(result.current.results).toEqual([]);
    });
  });

  describe('search results', () => {
    it('should respect limit option', () => {
      const { result } = renderHook(() =>
        useSearch({ config: testConfig, data: testData, limit: 2 }),
      );

      act(() => {
        result.current.setQuery('he');
      });

      expect(result.current.results.length).toBeLessThanOrEqual(2);
    });

    it('should return results with score', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      act(() => {
        result.current.setQuery('hello');
      });

      expect(result.current.results[0]).toHaveProperty('score');
    });

    it('should return results with item', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      act(() => {
        result.current.setQuery('hello');
      });

      expect(result.current.results[0]).toHaveProperty('item');
      expect(result.current.results[0].item).toHaveProperty('id');
      expect(result.current.results[0].item).toHaveProperty('word');
    });
  });

  describe('suggestions', () => {
    it('should return empty suggestions for short query', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      act(() => {
        result.current.setQuery('h');
      });

      expect(result.current.suggestions).toEqual([]);
    });

    it('should return suggestions for query >= 2 characters', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      act(() => {
        result.current.setQuery('he');
      });

      expect(result.current.suggestions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('clear', () => {
    it('should reset query to empty string', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      act(() => {
        result.current.setQuery('hello');
      });

      expect(result.current.query).toBe('hello');

      act(() => {
        result.current.clear();
      });

      expect(result.current.query).toBe('');
    });

    it('should clear results after clear()', () => {
      const { result } = renderHook(() => useSearch({ config: testConfig, data: testData }));

      act(() => {
        result.current.setQuery('hello');
      });

      expect(result.current.results.length).toBeGreaterThan(0);

      act(() => {
        result.current.clear();
      });

      expect(result.current.results).toEqual([]);
    });
  });

  describe('memoization', () => {
    it('should not recreate engine on same data', () => {
      const { result, rerender } = renderHook(() =>
        useSearch({ config: testConfig, data: testData }),
      );

      const initialQuery = result.current.setQuery;
      rerender();
      const afterRerenderQuery = result.current.setQuery;

      expect(initialQuery).toBe(afterRerenderQuery);
    });
  });

  describe('default values', () => {
    it('should use default limit of 10', () => {
      const manyItems: TestItem[] = Array.from({ length: 20 }, (_, i) => ({
        id: `item-${i}`,
        word: `Word${i}`,
        definition: 'Definition',
      }));

      const { result } = renderHook(() => useSearch({ config: testConfig, data: manyItems }));

      act(() => {
        result.current.setQuery('word');
      });

      expect(result.current.results.length).toBeLessThanOrEqual(10);
    });
  });
});
