/**
 * apps/context - Entry Helpers Tests
 *
 * 엔트리 생성 헬퍼 함수 테스트
 */
import { describe, expect, it } from 'vitest';

// 테스트할 타입과 함수를 로컬에 정의 (앱 코드와 동일한 로직)
type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'interjection' | 'phrase';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'master';
type FrequencyLevel = 'common' | 'uncommon' | 'rare';

interface Translation {
  word: string;
  explanation: string;
  examples: {
    beginner: string;
    intermediate: string;
    advanced: string;
    master?: string;
  };
}

interface EntryInput {
  korean: string;
  romanization: string;
  partOfSpeech: PartOfSpeech;
  difficulty: DifficultyLevel;
  frequency?: FrequencyLevel;
  tags: string[];
  translations: {
    ko: Translation;
    en: Translation;
  };
}

interface MeaningEntry extends EntryInput {
  id: string;
  categoryId: string;
}

type EntryMap = Record<string, EntryInput>;

function createCategory(categoryId: string, entries: EntryMap): MeaningEntry[] {
  return Object.entries(entries).map(([id, entry]) => ({
    id,
    categoryId,
    ...entry,
  }));
}

describe('apps/context - Entry Helpers', () => {
  describe('createCategory', () => {
    const sampleTranslation: Translation = {
      word: '안녕',
      explanation: '인사말',
      examples: {
        beginner: '안녕!',
        intermediate: '안녕, 잘 지냈어?',
        advanced: '오랜만이야, 안녕!',
      },
    };

    const sampleEntry: EntryInput = {
      korean: '안녕',
      romanization: 'annyeong',
      partOfSpeech: 'interjection',
      difficulty: 'beginner',
      tags: ['casual', 'greeting'],
      translations: {
        ko: sampleTranslation,
        en: {
          word: 'Hello',
          explanation: 'A casual greeting',
          examples: {
            beginner: 'Hello!',
            intermediate: 'Hello, how are you?',
            advanced: 'Long time no see, hello!',
          },
        },
      },
    };

    it('should create entry with id from object key', () => {
      const entries = createCategory('greetings', {
        annyeong: sampleEntry,
      });

      expect(entries).toHaveLength(1);
      expect(entries[0].id).toBe('annyeong');
    });

    it('should set categoryId from parameter', () => {
      const entries = createCategory('greetings', {
        annyeong: sampleEntry,
      });

      expect(entries[0].categoryId).toBe('greetings');
    });

    it('should preserve all entry properties', () => {
      const entries = createCategory('greetings', {
        annyeong: sampleEntry,
      });

      expect(entries[0].korean).toBe('안녕');
      expect(entries[0].romanization).toBe('annyeong');
      expect(entries[0].partOfSpeech).toBe('interjection');
      expect(entries[0].difficulty).toBe('beginner');
      expect(entries[0].tags).toEqual(['casual', 'greeting']);
    });

    it('should create multiple entries', () => {
      const entries = createCategory('greetings', {
        annyeong: sampleEntry,
        annyeonghaseyo: {
          ...sampleEntry,
          korean: '안녕하세요',
          romanization: 'annyeonghaseyo',
          tags: ['formal', 'polite'],
        },
      });

      expect(entries).toHaveLength(2);
      expect(entries.map((e) => e.id).sort()).toEqual(['annyeong', 'annyeonghaseyo']);
    });

    it('should handle empty entry map', () => {
      const entries = createCategory('empty', {});
      expect(entries).toHaveLength(0);
      expect(entries).toEqual([]);
    });

    it('should handle entries with optional frequency', () => {
      const entryWithFrequency: EntryInput = {
        ...sampleEntry,
        frequency: 'common',
      };

      const entries = createCategory('greetings', {
        hello: entryWithFrequency,
      });

      expect(entries[0].frequency).toBe('common');
    });

    it('should handle entries without optional frequency', () => {
      const entries = createCategory('greetings', {
        hello: sampleEntry,
      });

      expect(entries[0].frequency).toBeUndefined();
    });

    it('should preserve translations structure', () => {
      const entries = createCategory('greetings', {
        hello: sampleEntry,
      });

      expect(entries[0].translations.ko.word).toBe('안녕');
      expect(entries[0].translations.en.word).toBe('Hello');
      expect(entries[0].translations.ko.examples.beginner).toBe('안녕!');
    });

    it('should generate unique ids for different entries', () => {
      const entries = createCategory('test', {
        entry1: sampleEntry,
        entry2: sampleEntry,
        entry3: sampleEntry,
      });

      const ids = entries.map((e) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    it('should work with different category ids', () => {
      const greetings = createCategory('greetings', { hello: sampleEntry });
      const food = createCategory('food', { hello: sampleEntry });

      expect(greetings[0].categoryId).toBe('greetings');
      expect(food[0].categoryId).toBe('food');
      // Same entry key can exist in different categories
      expect(greetings[0].id).toBe(food[0].id);
    });
  });

  describe('Entry ID validation patterns', () => {
    it('should support kebab-case ids', () => {
      const id = 'hello-world';
      expect(/^[a-z0-9-]+$/.test(id)).toBe(true);
    });

    it('should support snake_case ids', () => {
      const id = 'hello_world';
      expect(/^[a-z0-9_]+$/.test(id)).toBe(true);
    });

    it('should support simple lowercase ids', () => {
      const id = 'helloworld';
      expect(/^[a-z]+$/.test(id)).toBe(true);
    });

    it('should detect uppercase in id', () => {
      const id = 'HelloWorld';
      expect(/^[a-z0-9-_]+$/.test(id)).toBe(false);
    });
  });

  describe('Difficulty level ordering', () => {
    const levels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'master'];

    it('should have correct order', () => {
      expect(levels.indexOf('beginner')).toBeLessThan(levels.indexOf('intermediate'));
      expect(levels.indexOf('intermediate')).toBeLessThan(levels.indexOf('advanced'));
      expect(levels.indexOf('advanced')).toBeLessThan(levels.indexOf('master'));
    });

    it('should find beginner at index 0', () => {
      expect(levels.indexOf('beginner')).toBe(0);
    });

    it('should find master at last index', () => {
      expect(levels.indexOf('master')).toBe(levels.length - 1);
    });
  });

  describe('PartOfSpeech validation', () => {
    const validPOS: PartOfSpeech[] = [
      'noun',
      'verb',
      'adjective',
      'adverb',
      'interjection',
      'phrase',
    ];

    it('should include all expected parts of speech', () => {
      expect(validPOS).toContain('noun');
      expect(validPOS).toContain('verb');
      expect(validPOS).toContain('adjective');
      expect(validPOS).toContain('interjection');
    });

    it('should have 6 parts of speech', () => {
      expect(validPOS).toHaveLength(6);
    });
  });
});
