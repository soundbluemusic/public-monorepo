/**
 * @fileoverview Tests for search utility functions
 */

import {
  createSearchHandler,
  filterBySearch,
  highlightMatch,
  sanitizeSearchQuery,
} from '@soundblue/search/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('sanitizeSearchQuery', () => {
  it('should lowercase the query', () => {
    expect(sanitizeSearchQuery('HELLO')).toBe('hello');
    expect(sanitizeSearchQuery('Hello World')).toBe('hello world');
  });

  it('should trim whitespace', () => {
    expect(sanitizeSearchQuery('  hello  ')).toBe('hello');
    expect(sanitizeSearchQuery('\thello\n')).toBe('hello');
  });

  it('should limit query length to 100 characters', () => {
    const longQuery = 'a'.repeat(150);
    expect(sanitizeSearchQuery(longQuery)).toHaveLength(100);
  });

  it('should handle empty string', () => {
    expect(sanitizeSearchQuery('')).toBe('');
  });

  it('should handle null/undefined-like values', () => {
    // @ts-expect-error testing null
    expect(sanitizeSearchQuery(null)).toBe('');
    // @ts-expect-error testing undefined
    expect(sanitizeSearchQuery(undefined)).toBe('');
  });
});

describe('filterBySearch', () => {
  const items = [
    { id: 1, name: 'Apple', category: 'Fruit' },
    { id: 2, name: 'Banana', category: 'Fruit' },
    { id: 3, name: 'Carrot', category: 'Vegetable' },
  ];

  const getSearchableText = (item: (typeof items)[0]) => [item.name, item.category];

  it('should filter items by matching text', () => {
    const result = filterBySearch(items, 'apple', getSearchableText);
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('Apple');
  });

  it('should be case-insensitive', () => {
    const result = filterBySearch(items, 'BANANA', getSearchableText);
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('Banana');
  });

  it('should match partial strings', () => {
    const result = filterBySearch(items, 'an', getSearchableText);
    expect(result).toHaveLength(1); // Banana
  });

  it('should match against category', () => {
    const result = filterBySearch(items, 'fruit', getSearchableText);
    expect(result).toHaveLength(2);
  });

  it('should return all items for empty query', () => {
    const result = filterBySearch(items, '', getSearchableText);
    expect(result).toHaveLength(3);
  });

  it('should return empty array when no match', () => {
    const result = filterBySearch(items, 'xyz', getSearchableText);
    expect(result).toHaveLength(0);
  });

  it('should handle empty items array', () => {
    const result = filterBySearch([], 'test', getSearchableText);
    expect(result).toHaveLength(0);
  });
});

describe('highlightMatch', () => {
  it('should wrap matched text with mark tags', () => {
    const result = highlightMatch('Hello World', 'World');
    expect(result).toBe('Hello <mark>World</mark>');
  });

  it('should be case-insensitive', () => {
    const result = highlightMatch('Hello World', 'world');
    expect(result).toBe('Hello <mark>World</mark>');
  });

  it('should highlight multiple occurrences', () => {
    const result = highlightMatch('Hello Hello', 'Hello');
    expect(result).toBe('<mark>Hello</mark> <mark>Hello</mark>');
  });

  it('should return original text for empty query', () => {
    const result = highlightMatch('Hello World', '');
    expect(result).toBe('Hello World');
  });

  it('should escape special regex characters', () => {
    const result = highlightMatch('test (value)', '(value)');
    expect(result).toBe('test <mark>(value)</mark>');
  });

  it('should handle special characters in text', () => {
    const result = highlightMatch('price: $100', '$100');
    expect(result).toBe('price: <mark>$100</mark>');
  });
});

describe('createSearchHandler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce search calls', () => {
    const callback = vi.fn();
    const handler = createSearchHandler(callback, 300);

    handler('hello');
    handler('hello world');
    handler('hello world test');

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('hello world test');
  });

  it('should use default delay of 300ms', () => {
    const callback = vi.fn();
    const handler = createSearchHandler(callback);

    handler('test');
    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalled();
  });

  it('should sanitize query before callback', () => {
    const callback = vi.fn();
    const handler = createSearchHandler(callback, 100);

    handler('  HELLO  ');
    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledWith('hello');
  });

  it('should allow custom delay', () => {
    const callback = vi.fn();
    const handler = createSearchHandler(callback, 500);

    handler('test');
    vi.advanceTimersByTime(400);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalled();
  });
});
