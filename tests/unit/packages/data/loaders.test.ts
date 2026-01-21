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

  describe('edge cases', () => {
    it('should handle empty JSON object', () => {
      const emptyObjPath = join(TEST_DIR, 'empty-obj.json');
      writeFileSync(emptyObjPath, '{}');

      const result = loadJson<Record<string, unknown>>(emptyObjPath);
      expect(result).toEqual({});
    });

    it('should handle empty JSON array', () => {
      const emptyArrPath = join(TEST_DIR, 'empty-arr.json');
      writeFileSync(emptyArrPath, '[]');

      const result = loadJson<unknown[]>(emptyArrPath);
      expect(result).toEqual([]);
    });

    it('should handle JSON with Unicode characters', () => {
      const unicodePath = join(TEST_DIR, 'unicode.json');
      writeFileSync(unicodePath, '{"korean": "한글", "emoji": "🎵"}');

      const result = loadJson<{ korean: string; emoji: string }>(unicodePath);
      expect(result.korean).toBe('한글');
      expect(result.emoji).toBe('🎵');
    });

    it('should throw for JSON with BOM (Byte Order Mark)', () => {
      const bomPath = join(TEST_DIR, 'bom.json');
      // UTF-8 BOM + valid JSON - JSON.parse does NOT handle BOM
      writeFileSync(bomPath, '\uFEFF{"key": "value"}');

      // JSON.parse throws on BOM - this documents the behavior
      expect(() => loadJson(bomPath)).toThrow();
    });

    it('should handle deeply nested JSON', () => {
      const deepPath = join(TEST_DIR, 'deep.json');
      // Create 50-level deep object
      let deepObj = { value: 'bottom' };
      for (let i = 0; i < 50; i++) {
        deepObj = { nested: deepObj } as unknown as typeof deepObj;
      }
      writeFileSync(deepPath, JSON.stringify(deepObj));

      const result = loadJson<unknown>(deepPath);
      expect(result).toBeDefined();
    });

    it('should handle large JSON arrays', () => {
      const largePath = join(TEST_DIR, 'large.json');
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        id: `item-${i}`,
        value: i,
      }));
      writeFileSync(largePath, JSON.stringify(largeArray));

      const result = loadJson<Array<{ id: string; value: number }>>(largePath);
      expect(result).toHaveLength(1000);
    });

    it('should throw for trailing comma (invalid JSON)', () => {
      const trailingPath = join(TEST_DIR, 'trailing.json');
      writeFileSync(trailingPath, '{"key": "value",}');

      expect(() => loadJson(trailingPath)).toThrow();
    });

    it('should throw for single quotes (invalid JSON)', () => {
      const singleQuotePath = join(TEST_DIR, 'single-quote.json');
      writeFileSync(singleQuotePath, "{'key': 'value'}");

      expect(() => loadJson(singleQuotePath)).toThrow();
    });

    it('should handle null value in JSON', () => {
      const nullPath = join(TEST_DIR, 'null.json');
      writeFileSync(nullPath, 'null');

      const result = loadJson<null>(nullPath);
      expect(result).toBeNull();
    });

    it('should handle loadJsonAsMap with duplicate IDs (last wins)', () => {
      const dupPath = join(TEST_DIR, 'duplicates.json');
      writeFileSync(
        dupPath,
        JSON.stringify([
          { id: 'dup', name: 'First' },
          { id: 'dup', name: 'Second' },
        ]),
      );

      const itemMap = loadJsonAsMap<{ id: string; name: string }>(dupPath);
      expect(itemMap.size).toBe(1);
      expect(itemMap.get('dup')?.name).toBe('Second');
    });
  });
});
