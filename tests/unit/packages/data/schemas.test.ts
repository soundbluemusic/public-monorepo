/**
 * @soundblue/data - Schemas Tests
 *
 * Zod 스키마 검증 테스트
 */

import {
  DifficultySchema,
  EntrySchema,
  ExamplesSchema,
  FrequencySchema,
  LocalizedTextSchema,
  PartOfSpeechSchema,
  PronunciationSchema,
  TranslationContentSchema,
} from '@soundblue/data/schemas/context';
import { describe, expect, it } from 'vitest';

describe('@soundblue/data/schemas', () => {
  describe('LocalizedTextSchema', () => {
    it('should validate correct localized text', () => {
      const valid = { ko: '안녕하세요', en: 'Hello' };
      expect(() => LocalizedTextSchema.parse(valid)).not.toThrow();
    });

    it('should reject empty strings', () => {
      const invalid = { ko: '', en: 'Hello' };
      expect(() => LocalizedTextSchema.parse(invalid)).toThrow();
    });

    it('should reject missing fields', () => {
      const invalid = { ko: '안녕하세요' };
      expect(() => LocalizedTextSchema.parse(invalid)).toThrow();
    });
  });

  describe('PartOfSpeechSchema', () => {
    it('should validate all valid parts of speech', () => {
      const validValues = [
        'noun',
        'verb',
        'adjective',
        'adverb',
        'pronoun',
        'particle',
        'interjection',
        'conjunction',
        'determiner',
        'numeral',
        'suffix',
        'prefix',
        'phrase',
        'expression',
      ];

      for (const value of validValues) {
        expect(() => PartOfSpeechSchema.parse(value)).not.toThrow();
      }
    });

    it('should reject invalid part of speech', () => {
      expect(() => PartOfSpeechSchema.parse('unknown')).toThrow();
    });
  });

  describe('DifficultySchema', () => {
    it('should validate all difficulty levels', () => {
      const validValues = ['beginner', 'intermediate', 'advanced', 'master'];

      for (const value of validValues) {
        expect(() => DifficultySchema.parse(value)).not.toThrow();
      }
    });

    it('should reject invalid difficulty', () => {
      expect(() => DifficultySchema.parse('expert')).toThrow();
    });
  });

  describe('FrequencySchema', () => {
    it('should validate all frequency levels', () => {
      const validValues = ['common', 'uncommon', 'rare'];

      for (const value of validValues) {
        expect(() => FrequencySchema.parse(value)).not.toThrow();
      }
    });

    it('should reject invalid frequency', () => {
      expect(() => FrequencySchema.parse('very_common')).toThrow();
    });
  });

  describe('PronunciationSchema', () => {
    it('should validate pronunciation with korean only', () => {
      const valid = { korean: '안녕하세요' };
      expect(() => PronunciationSchema.parse(valid)).not.toThrow();
    });

    it('should validate pronunciation with IPA', () => {
      const valid = { korean: '안녕하세요', ipa: '[annjʌŋhaseyo]' };
      expect(() => PronunciationSchema.parse(valid)).not.toThrow();
    });

    it('should reject empty korean', () => {
      const invalid = { korean: '' };
      expect(() => PronunciationSchema.parse(invalid)).toThrow();
    });
  });

  describe('ExamplesSchema', () => {
    it('should validate complete examples', () => {
      const valid = {
        beginner: '안녕하세요.',
        intermediate: '오늘 날씨가 좋네요.',
        advanced: '이 문제에 대해 심도 있게 논의해 봅시다.',
      };
      expect(() => ExamplesSchema.parse(valid)).not.toThrow();
    });

    it('should validate examples with master level', () => {
      const valid = {
        beginner: '안녕하세요.',
        intermediate: '오늘 날씨가 좋네요.',
        advanced: '이 문제에 대해 심도 있게 논의해 봅시다.',
        master: '그 사안의 다면적 측면을 고려할 때...',
      };
      expect(() => ExamplesSchema.parse(valid)).not.toThrow();
    });

    it('should reject missing required levels', () => {
      const invalid = {
        beginner: '안녕하세요.',
        intermediate: '오늘 날씨가 좋네요.',
        // missing advanced
      };
      expect(() => ExamplesSchema.parse(invalid)).toThrow();
    });
  });

  describe('TranslationContentSchema', () => {
    it('should validate complete translation content', () => {
      const valid = {
        word: 'Hello',
        explanation: 'A common greeting',
        examples: {
          beginner: 'Hello!',
          intermediate: 'Hello, how are you?',
          advanced: 'Hello, I hope this message finds you well.',
        },
      };
      expect(() => TranslationContentSchema.parse(valid)).not.toThrow();
    });

    it('should validate translation content with variations', () => {
      const valid = {
        word: 'Hello',
        explanation: 'A common greeting',
        examples: {
          beginner: 'Hello!',
          intermediate: 'Hello, how are you?',
          advanced: 'Hello, I hope this message finds you well.',
        },
        variations: {
          formal: ['Good day', 'Greetings'],
          casual: ['Hi', 'Hey'],
        },
      };
      expect(() => TranslationContentSchema.parse(valid)).not.toThrow();
    });
  });

  describe('EntrySchema', () => {
    const validEntry = {
      id: 'hello',
      korean: '안녕하세요',
      romanization: 'annyeonghaseyo',
      partOfSpeech: 'interjection',
      categoryId: 'greetings',
      difficulty: 'beginner',
      frequency: 'common',
      tags: ['formal', 'polite'],
      translations: {
        ko: {
          word: '안녕하세요',
          explanation: '상대방에게 인사할 때 사용하는 표현',
          examples: {
            beginner: '안녕하세요!',
            intermediate: '안녕하세요, 잘 지내셨어요?',
            advanced: '안녕하세요, 오랜만에 뵙겠습니다.',
          },
        },
        en: {
          word: 'Hello',
          explanation: 'A polite greeting expression',
          examples: {
            beginner: 'Hello!',
            intermediate: 'Hello, how are you?',
            advanced: 'Hello, it has been a while since we last met.',
          },
        },
      },
      pronunciation: {
        korean: '안녕하세요',
        ipa: '[annjʌŋhaseyo]',
      },
    };

    it('should validate a complete entry', () => {
      expect(() => EntrySchema.parse(validEntry)).not.toThrow();
    });

    it('should reject entry with missing id', () => {
      const { id: _, ...invalid } = validEntry;
      expect(() => EntrySchema.parse(invalid)).toThrow();
    });

    it('should reject entry with empty korean', () => {
      const invalid = { ...validEntry, korean: '' };
      expect(() => EntrySchema.parse(invalid)).toThrow();
    });

    it('should reject entry with invalid partOfSpeech', () => {
      const invalid = { ...validEntry, partOfSpeech: 'invalid' };
      expect(() => EntrySchema.parse(invalid)).toThrow();
    });

    it('should reject entry with empty tags array is allowed', () => {
      const valid = { ...validEntry, tags: [] };
      expect(() => EntrySchema.parse(valid)).not.toThrow();
    });

    it('should reject entry with id exceeding max length', () => {
      const invalid = { ...validEntry, id: 'a'.repeat(101) };
      expect(() => EntrySchema.parse(invalid)).toThrow();
    });
  });
});
