/**
 * @soundblue/data - Loaders Tests
 *
 * JSON 로더 함수 테스트
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  loadJson,
  loadJsonAsMap,
  loadJsonDirectory,
  loadJsonDirectoryFlat,
} from '@soundblue/data/loaders';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const TEST_DIR = join(process.cwd(), 'tests/unit/packages/data/.test-fixtures');

describe('@soundblue/data/loaders', () => {
  // 테스트 픽스처 설정
  beforeAll(() => {
    if (!existsSync(TEST_DIR)) {
      mkdirSync(TEST_DIR, { recursive: true });
    }

    // 단일 JSON 파일
    writeFileSync(
      join(TEST_DIR, 'config.json'),
      JSON.stringify({ version: '1.0.0', features: ['a', 'b'] }),
    );

    // 배열 JSON 파일
    writeFileSync(
      join(TEST_DIR, 'items.json'),
      JSON.stringify([
        { id: 'item1', name: 'Item 1' },
        { id: 'item2', name: 'Item 2' },
      ]),
    );

    // 잘못된 JSON 파일
    writeFileSync(join(TEST_DIR, 'invalid.json'), 'not valid json');

    // 디렉토리 테스트용
    const subDir = join(TEST_DIR, 'categories');
    if (!existsSync(subDir)) {
      mkdirSync(subDir, { recursive: true });
    }

    writeFileSync(
      join(subDir, 'greetings.json'),
      JSON.stringify([
        { id: 'hello', word: 'Hello' },
        { id: 'bye', word: 'Bye' },
      ]),
    );

    writeFileSync(join(subDir, 'food.json'), JSON.stringify([{ id: 'rice', word: 'Rice' }]));
  });

  afterAll(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  describe('loadJson', () => {
    it('should load and parse a valid JSON file', () => {
      const config = loadJson<{ version: string; features: string[] }>(
        join(TEST_DIR, 'config.json'),
      );

      expect(config.version).toBe('1.0.0');
      expect(config.features).toEqual(['a', 'b']);
    });

    it('should throw error for non-existent file', () => {
      expect(() => loadJson(join(TEST_DIR, 'nonexistent.json'))).toThrow('File not found');
    });

    it('should throw error for invalid JSON', () => {
      expect(() => loadJson(join(TEST_DIR, 'invalid.json'))).toThrow();
    });
  });

  describe('loadJsonDirectory', () => {
    it('should load all JSON files in a directory', () => {
      const categories = loadJsonDirectory<{ id: string; word: string }[]>(
        join(TEST_DIR, 'categories'),
      );

      expect(categories).toHaveLength(2);

      const names = categories.map((c) => c.name).sort();
      expect(names).toEqual(['food', 'greetings']);
    });

    it('should include file name without extension', () => {
      const categories = loadJsonDirectory<unknown>(join(TEST_DIR, 'categories'));

      const greetings = categories.find((c) => c.name === 'greetings');
      expect(greetings).toBeDefined();
      expect(greetings?.name).toBe('greetings');
    });

    it('should throw error for non-existent directory', () => {
      expect(() => loadJsonDirectory(join(TEST_DIR, 'nonexistent'))).toThrow('Directory not found');
    });
  });

  describe('loadJsonDirectoryFlat', () => {
    it('should flatten all arrays from JSON files', () => {
      const allItems = loadJsonDirectoryFlat<{ id: string; word: string }>(
        join(TEST_DIR, 'categories'),
      );

      expect(allItems).toHaveLength(3);

      const ids = allItems.map((item) => item.id).sort();
      expect(ids).toEqual(['bye', 'hello', 'rice']);
    });
  });

  describe('loadJsonAsMap', () => {
    it('should load JSON array as Map with id keys', () => {
      const itemMap = loadJsonAsMap<{ id: string; name: string }>(join(TEST_DIR, 'items.json'));

      expect(itemMap.size).toBe(2);
      expect(itemMap.get('item1')).toEqual({ id: 'item1', name: 'Item 1' });
      expect(itemMap.get('item2')).toEqual({ id: 'item2', name: 'Item 2' });
    });

    it('should return undefined for non-existent key', () => {
      const itemMap = loadJsonAsMap<{ id: string; name: string }>(join(TEST_DIR, 'items.json'));

      expect(itemMap.get('nonexistent')).toBeUndefined();
    });

    it('should support has() check', () => {
      const itemMap = loadJsonAsMap<{ id: string; name: string }>(join(TEST_DIR, 'items.json'));

      expect(itemMap.has('item1')).toBe(true);
      expect(itemMap.has('nonexistent')).toBe(false);
    });
  });
});
