/**
 * @fileoverview Tests for SearchEngine class
 */

import { SearchEngine } from '@soundblue/search/core';
import { describe, expect, it } from 'vitest';

interface TestItem {
  id: string;
  title: string;
  content: string;
}

const testConfig = {
  fields: ['title', 'content'],
  storeFields: ['id', 'title', 'content'],
  searchOptions: {
    boost: { title: 2 },
    fuzzy: 0.2,
    prefix: true,
  },
};

const testItems: TestItem[] = [
  { id: '1', title: 'Hello World', content: 'This is a test document' },
  { id: '2', title: 'Goodbye Moon', content: 'Another test item' },
  { id: '3', title: 'TypeScript Guide', content: 'Learn TypeScript programming' },
  { id: '4', title: 'React Tutorial', content: 'Building UIs with React' },
];

describe('SearchEngine', () => {
  it('should create an engine with config', () => {
    const engine = new SearchEngine<TestItem>(testConfig);
    expect(engine).toBeDefined();
    expect(engine.documentCount).toBe(0);
  });

  describe('addAll', () => {
    it('should add multiple items to the index', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      engine.addAll(testItems);
      expect(engine.documentCount).toBe(4);
    });
  });

  describe('add', () => {
    it('should add a single item to the index', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      engine.add(testItems[0]!);
      expect(engine.documentCount).toBe(1);
    });
  });

  describe('search', () => {
    it('should find matching documents', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      engine.addAll(testItems);

      const results = engine.search('hello');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]?.id).toBe('1');
    });

    it('should return empty array for no matches', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      engine.addAll(testItems);

      const results = engine.search('xyz123nonexistent');
      expect(results).toHaveLength(0);
    });

    it('should limit results when limit is provided', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      engine.addAll(testItems);

      const results = engine.search('test', 1);
      expect(results).toHaveLength(1);
    });

    it('should search in content field', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      engine.addAll(testItems);

      const results = engine.search('programming');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should support prefix matching', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      engine.addAll(testItems);

      const results = engine.search('typ');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should boost title matches', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      engine.add({ id: 'a', title: 'React', content: 'Not about React' });
      engine.add({ id: 'b', title: 'Other', content: 'React is mentioned here' });

      const results = engine.search('react');
      // Title match should score higher
      expect(results[0]?.id).toBe('a');
    });
  });

  describe('suggest', () => {
    it('should return autocomplete suggestions', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      engine.addAll(testItems);

      const suggestions = engine.suggest('hel');
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should limit suggestions', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      engine.addAll(testItems);

      const suggestions = engine.suggest('t', 2);
      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    it('should use default limit of 5', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      // Add more items to have more potential suggestions
      for (let i = 0; i < 10; i++) {
        engine.add({ id: `test-${i}`, title: `Test${i}`, content: `Testing ${i}` });
      }

      const suggestions = engine.suggest('test');
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });
  });

  describe('clear', () => {
    it('should remove all documents', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      engine.addAll(testItems);
      expect(engine.documentCount).toBe(4);

      engine.clear();
      expect(engine.documentCount).toBe(0);
    });
  });

  describe('exportIndex / loadIndex', () => {
    it('should export and reimport index', () => {
      const engine1 = new SearchEngine<TestItem>(testConfig);
      engine1.addAll(testItems);

      const exported = engine1.exportIndex();
      expect(typeof exported).toBe('string');

      const engine2 = new SearchEngine<TestItem>(testConfig);
      engine2.loadIndex(exported);

      const results = engine2.search('hello');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('documentCount', () => {
    it('should return the number of indexed documents', () => {
      const engine = new SearchEngine<TestItem>(testConfig);
      expect(engine.documentCount).toBe(0);

      engine.add(testItems[0]!);
      expect(engine.documentCount).toBe(1);

      engine.addAll(testItems.slice(1));
      expect(engine.documentCount).toBe(4);
    });
  });
});
