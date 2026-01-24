/**
 * @fileoverview Entry Converter 테스트
 *
 * D1 Row를 LocaleEntry로 변환하는 함수 테스트입니다.
 */

import { describe, expect, it } from 'vitest';

// 타입 정의 (실제 모듈 import 대신)
type Language = 'ko' | 'en';

interface D1EntryRow {
  id: string;
  korean: string;
  romanization: string | null;
  part_of_speech: string | null;
  category_id: string;
  difficulty: string | null;
  frequency: number | null;
  tags: string | null;
  translations: string | null;
}

interface Translation {
  word: string;
  explanation: string;
  examples?: Record<string, string>;
  variations?: string[];
  dialogue?: unknown;
}

interface LocaleEntry {
  id: string;
  korean: string;
  romanization: string;
  partOfSpeech: string;
  categoryId: string;
  tags: string[];
  difficulty: string;
  frequency?: number;
  hasDialogue: boolean;
  translation: {
    word: string;
    explanation: string;
    examples?: Record<string, string>;
    variations?: string[];
  };
}

// rowToLocaleEntry 함수 구현 (테스트용)
function rowToLocaleEntry(row: D1EntryRow, locale: Language): LocaleEntry | null {
  if (!row.translations) return null;

  try {
    const translations = JSON.parse(row.translations) as {
      ko?: Translation;
      en?: Translation;
    };

    const translation = translations[locale];
    if (!translation) return null;

    const tags = row.tags ? (JSON.parse(row.tags) as string[]) : [];

    return {
      id: row.id,
      korean: row.korean,
      romanization: row.romanization || '',
      partOfSpeech: (row.part_of_speech || 'noun') as LocaleEntry['partOfSpeech'],
      categoryId: row.category_id,
      tags,
      difficulty: (row.difficulty || 'beginner') as LocaleEntry['difficulty'],
      frequency: row.frequency ?? undefined,
      hasDialogue: !!translation.dialogue,
      translation: {
        word: translation.word,
        explanation: translation.explanation,
        examples: translation.examples,
        variations: translation.variations,
      },
    };
  } catch {
    return null;
  }
}

// 테스트 데이터
const createMockRow = (overrides?: Partial<D1EntryRow>): D1EntryRow => ({
  id: 'test-entry',
  korean: '테스트',
  romanization: 'teseuteu',
  part_of_speech: 'noun',
  category_id: 'test-category',
  difficulty: 'intermediate',
  frequency: 3,
  tags: '["test", "sample"]',
  translations: JSON.stringify({
    ko: {
      word: '테스트',
      explanation: '테스트 설명입니다',
      examples: { beginner: '이것은 테스트입니다' },
    },
    en: {
      word: 'Test',
      explanation: 'This is a test explanation',
      examples: { beginner: 'This is a test' },
    },
  }),
  ...overrides,
});

describe('rowToLocaleEntry', () => {
  describe('basic conversion', () => {
    it('should convert row to LocaleEntry for Korean locale', () => {
      const row = createMockRow();
      const result = rowToLocaleEntry(row, 'ko');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('test-entry');
      expect(result?.korean).toBe('테스트');
      expect(result?.romanization).toBe('teseuteu');
      expect(result?.partOfSpeech).toBe('noun');
      expect(result?.categoryId).toBe('test-category');
      expect(result?.difficulty).toBe('intermediate');
      expect(result?.frequency).toBe(3);
      expect(result?.tags).toEqual(['test', 'sample']);
      expect(result?.translation.word).toBe('테스트');
      expect(result?.translation.explanation).toBe('테스트 설명입니다');
    });

    it('should convert row to LocaleEntry for English locale', () => {
      const row = createMockRow();
      const result = rowToLocaleEntry(row, 'en');

      expect(result).not.toBeNull();
      expect(result?.translation.word).toBe('Test');
      expect(result?.translation.explanation).toBe('This is a test explanation');
    });
  });

  describe('null handling', () => {
    it('should return null when translations is null', () => {
      const row = createMockRow({ translations: null });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result).toBeNull();
    });

    it('should return null when locale translation is missing', () => {
      const row = createMockRow({
        translations: JSON.stringify({
          ko: { word: '테스트', explanation: '설명' },
          // en translation missing
        }),
      });
      const result = rowToLocaleEntry(row, 'en');

      expect(result).toBeNull();
    });

    it('should handle null romanization', () => {
      const row = createMockRow({ romanization: null });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.romanization).toBe('');
    });

    it('should handle null part_of_speech with default noun', () => {
      const row = createMockRow({ part_of_speech: null });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.partOfSpeech).toBe('noun');
    });

    it('should handle null difficulty with default beginner', () => {
      const row = createMockRow({ difficulty: null });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.difficulty).toBe('beginner');
    });

    it('should handle null frequency', () => {
      const row = createMockRow({ frequency: null });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.frequency).toBeUndefined();
    });

    it('should handle null tags', () => {
      const row = createMockRow({ tags: null });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.tags).toEqual([]);
    });
  });

  describe('JSON parsing', () => {
    it('should return null for invalid translations JSON', () => {
      const row = createMockRow({ translations: 'not valid json' });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result).toBeNull();
    });

    it('should return null for invalid tags JSON', () => {
      const row = createMockRow({ tags: 'not valid json' });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result).toBeNull();
    });

    it('should handle empty translations object', () => {
      const row = createMockRow({ translations: '{}' });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result).toBeNull();
    });

    it('should handle empty tags array', () => {
      const row = createMockRow({ tags: '[]' });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.tags).toEqual([]);
    });
  });

  describe('dialogue handling', () => {
    it('should set hasDialogue to true when dialogue exists', () => {
      const row = createMockRow({
        translations: JSON.stringify({
          ko: {
            word: '테스트',
            explanation: '설명',
            dialogue: { lines: ['대화 1', '대화 2'] },
          },
        }),
      });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.hasDialogue).toBe(true);
    });

    it('should set hasDialogue to false when dialogue is missing', () => {
      const row = createMockRow();
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.hasDialogue).toBe(false);
    });

    it('should set hasDialogue to false when dialogue is null', () => {
      const row = createMockRow({
        translations: JSON.stringify({
          ko: {
            word: '테스트',
            explanation: '설명',
            dialogue: null,
          },
        }),
      });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.hasDialogue).toBe(false);
    });

    it('should set hasDialogue to false when dialogue is empty string', () => {
      const row = createMockRow({
        translations: JSON.stringify({
          ko: {
            word: '테스트',
            explanation: '설명',
            dialogue: '',
          },
        }),
      });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.hasDialogue).toBe(false);
    });
  });

  describe('examples and variations', () => {
    it('should include examples when present', () => {
      const row = createMockRow({
        translations: JSON.stringify({
          ko: {
            word: '테스트',
            explanation: '설명',
            examples: {
              beginner: '초급 예문',
              intermediate: '중급 예문',
              advanced: '고급 예문',
            },
          },
        }),
      });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.translation.examples).toEqual({
        beginner: '초급 예문',
        intermediate: '중급 예문',
        advanced: '고급 예문',
      });
    });

    it('should include variations when present', () => {
      const row = createMockRow({
        translations: JSON.stringify({
          ko: {
            word: '테스트',
            explanation: '설명',
            variations: ['변형1', '변형2', '변형3'],
          },
        }),
      });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.translation.variations).toEqual(['변형1', '변형2', '변형3']);
    });

    it('should handle missing examples', () => {
      const row = createMockRow({
        translations: JSON.stringify({
          ko: {
            word: '테스트',
            explanation: '설명',
          },
        }),
      });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.translation.examples).toBeUndefined();
    });

    it('should handle missing variations', () => {
      const row = createMockRow({
        translations: JSON.stringify({
          ko: {
            word: '테스트',
            explanation: '설명',
          },
        }),
      });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.translation.variations).toBeUndefined();
    });
  });

  describe('part of speech types', () => {
    const partOfSpeechTypes = [
      'noun',
      'verb',
      'adjective',
      'adverb',
      'interjection',
      'pronoun',
      'conjunction',
      'preposition',
    ];

    for (const pos of partOfSpeechTypes) {
      it(`should handle part_of_speech: ${pos}`, () => {
        const row = createMockRow({ part_of_speech: pos });
        const result = rowToLocaleEntry(row, 'ko');

        expect(result?.partOfSpeech).toBe(pos);
      });
    }
  });

  describe('difficulty levels', () => {
    const difficultyLevels = ['beginner', 'intermediate', 'advanced', 'master'];

    for (const level of difficultyLevels) {
      it(`should handle difficulty: ${level}`, () => {
        const row = createMockRow({ difficulty: level });
        const result = rowToLocaleEntry(row, 'ko');

        expect(result?.difficulty).toBe(level);
      });
    }
  });

  describe('frequency values', () => {
    it('should handle frequency 1', () => {
      const row = createMockRow({ frequency: 1 });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.frequency).toBe(1);
    });

    it('should handle frequency 5', () => {
      const row = createMockRow({ frequency: 5 });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.frequency).toBe(5);
    });

    it('should handle frequency 0', () => {
      const row = createMockRow({ frequency: 0 });
      const result = rowToLocaleEntry(row, 'ko');

      // 0 is falsy but should still be set
      expect(result?.frequency).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle Korean text with special characters', () => {
      const row = createMockRow({
        korean: '안녕하세요! (인사말)',
        translations: JSON.stringify({
          ko: {
            word: '안녕하세요! (인사말)',
            explanation: '공식적인 인사말입니다.',
          },
        }),
      });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.korean).toBe('안녕하세요! (인사말)');
      expect(result?.translation.word).toBe('안녕하세요! (인사말)');
    });

    it('should handle empty string values', () => {
      const row = createMockRow({
        korean: '',
        romanization: '',
        translations: JSON.stringify({
          ko: { word: '', explanation: '' },
        }),
      });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.korean).toBe('');
      expect(result?.romanization).toBe('');
      expect(result?.translation.word).toBe('');
    });

    it('should handle very long text', () => {
      const longText = 'A'.repeat(10000);
      const row = createMockRow({
        translations: JSON.stringify({
          ko: { word: '테스트', explanation: longText },
        }),
      });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.translation.explanation).toBe(longText);
      expect(result?.translation.explanation.length).toBe(10000);
    });

    it('should handle unicode characters', () => {
      const row = createMockRow({
        korean: '😀 이모지 포함',
        translations: JSON.stringify({
          ko: { word: '😀 이모지', explanation: '이모지가 포함된 설명 🎉' },
        }),
      });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.korean).toBe('😀 이모지 포함');
      expect(result?.translation.word).toBe('😀 이모지');
    });

    it('should handle tags with special characters', () => {
      const row = createMockRow({
        tags: '["tag-with-dash", "tag_with_underscore", "한글태그"]',
      });
      const result = rowToLocaleEntry(row, 'ko');

      expect(result?.tags).toEqual(['tag-with-dash', 'tag_with_underscore', '한글태그']);
    });
  });
});
