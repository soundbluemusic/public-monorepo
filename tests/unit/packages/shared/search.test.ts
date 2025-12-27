/**
 * @fileoverview Unit tests for search utilities
 */

import {
  LIMITS,
  createSearchHandler,
  filterBySearch,
  sanitizeSearchQuery,
} from '@soundblue/shared';
import { describe, expect, it } from 'vitest';

describe('sanitizeSearchQuery', () => {
  it('should trim and lowercase the query', () => {
    expect(sanitizeSearchQuery('  Hello World  ')).toBe('hello world');
  });

  it('should handle empty string', () => {
    expect(sanitizeSearchQuery('')).toBe('');
  });

  it('should handle whitespace-only string', () => {
    expect(sanitizeSearchQuery('   ')).toBe('');
  });

  it('should limit length to LIMITS.SEARCH_LENGTH', () => {
    const longQuery = 'a'.repeat(LIMITS.SEARCH_LENGTH + 50);
    const result = sanitizeSearchQuery(longQuery);
    expect(result.length).toBe(LIMITS.SEARCH_LENGTH);
  });

  it('should handle special characters', () => {
    expect(sanitizeSearchQuery('Hello@#$%World')).toBe('hello@#$%world');
  });

  it('should handle Korean characters', () => {
    expect(sanitizeSearchQuery('안녕하세요')).toBe('안녕하세요');
  });

  it('should handle mixed case', () => {
    expect(sanitizeSearchQuery('HeLLo WoRLd')).toBe('hello world');
  });

  it('should handle numbers', () => {
    expect(sanitizeSearchQuery('Test123')).toBe('test123');
  });

  // Edge cases
  it('should handle null as empty string (type coercion)', () => {
    // @ts-expect-error Testing edge case
    expect(sanitizeSearchQuery(null)).toBe('');
  });

  it('should handle undefined as empty string (type coercion)', () => {
    // @ts-expect-error Testing edge case
    expect(sanitizeSearchQuery(undefined)).toBe('');
  });
});

describe('filterBySearch', () => {
  const testItems = [
    { id: 1, name: 'Apple', category: 'fruit', tags: ['red', 'healthy'] },
    { id: 2, name: 'Banana', category: 'fruit', tags: ['yellow', 'healthy'] },
    { id: 3, name: 'Carrot', category: 'vegetable', tags: ['orange', 'healthy'] },
    { id: 4, name: 'Date', category: 'fruit', tags: ['brown', 'sweet'] },
  ];

  it('should filter items by name', () => {
    const result = filterBySearch(testItems, 'apple', (item) => [item.name]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Apple');
  });

  it('should be case-insensitive', () => {
    const result = filterBySearch(testItems, 'APPLE', (item) => [item.name]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Apple');
  });

  it('should filter by multiple fields', () => {
    const result = filterBySearch(testItems, 'fruit', (item) => [item.name, item.category]);
    expect(result).toHaveLength(3); // Apple, Banana, Date
  });

  it('should filter by tags', () => {
    const result = filterBySearch(testItems, 'yellow', (item) => [...item.tags]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Banana');
  });

  it('should return all items for empty query', () => {
    const result = filterBySearch(testItems, '', (item) => [item.name]);
    expect(result).toHaveLength(4);
  });

  it('should return all items for whitespace-only query', () => {
    const result = filterBySearch(testItems, '   ', (item) => [item.name]);
    expect(result).toHaveLength(4);
  });

  it('should return empty array when no matches', () => {
    const result = filterBySearch(testItems, 'xyz', (item) => [item.name]);
    expect(result).toHaveLength(0);
  });

  it('should handle partial matches', () => {
    const result = filterBySearch(testItems, 'app', (item) => [item.name]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Apple');
  });

  it('should handle empty array', () => {
    const result = filterBySearch([], 'test', (item) => [item.name]);
    expect(result).toHaveLength(0);
  });

  // Edge cases
  it('should handle items with empty searchable text', () => {
    const items = [{ id: 1, name: '' }];
    const result = filterBySearch(items, 'test', (item) => [item.name]);
    expect(result).toHaveLength(0);
  });

  it('should handle getSearchableText returning empty array', () => {
    const result = filterBySearch(testItems, 'test', () => []);
    expect(result).toHaveLength(0);
  });

  it('should handle special characters in query', () => {
    const items = [{ id: 1, name: 'test@example.com' }];
    const result = filterBySearch(items, '@example', (item) => [item.name]);
    expect(result).toHaveLength(1);
  });
});

describe('createSearchHandler', () => {
  it('should create a debounced search handler', () => {
    let capturedQuery = '';
    const handler = createSearchHandler((query) => {
      capturedQuery = query;
    }, 100);

    handler('test query');

    // Query should not be captured immediately
    expect(capturedQuery).toBe('');
  });

  it('should sanitize the query', async () => {
    let capturedQuery = '';
    const handler = createSearchHandler((query) => {
      capturedQuery = query;
    }, 50);

    handler('  TEST QUERY  ');

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(capturedQuery).toBe('test query');
  });

  it('should debounce multiple calls', async () => {
    let callCount = 0;
    let lastQuery = '';
    const handler = createSearchHandler((query) => {
      callCount++;
      lastQuery = query;
    }, 50);

    handler('query1');
    handler('query2');
    handler('query3');

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should only be called once with the last query
    expect(callCount).toBe(1);
    expect(lastQuery).toBe('query3');
  });

  it('should use default delay of 300ms', async () => {
    let capturedQuery = '';
    const handler = createSearchHandler((query) => {
      capturedQuery = query;
    });

    handler('test');

    // Before default delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(capturedQuery).toBe('');

    // After default delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(capturedQuery).toBe('test');
  });

  it('should handle rapid successive calls', async () => {
    let callCount = 0;
    const handler = createSearchHandler(() => {
      callCount++;
    }, 50);

    // Rapid calls
    for (let i = 0; i < 10; i++) {
      handler(`query${i}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should only be called once
    expect(callCount).toBe(1);
  });

  // Edge cases
  it('should handle empty query', async () => {
    let capturedQuery = 'initial';
    const handler = createSearchHandler((query) => {
      capturedQuery = query;
    }, 50);

    handler('');

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(capturedQuery).toBe('');
  });

  it('should handle very long query', async () => {
    let capturedQuery = '';
    const handler = createSearchHandler((query) => {
      capturedQuery = query;
    }, 50);

    const longQuery = 'a'.repeat(LIMITS.SEARCH_LENGTH + 100);
    handler(longQuery);

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should be trimmed to SEARCH_LENGTH
    expect(capturedQuery.length).toBe(LIMITS.SEARCH_LENGTH);
  });
});
