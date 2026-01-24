/**
 * @fileoverview Unit tests for Context entry schemas
 */

import {
  DifficultySchema,
  EntryDialogueLineSchema,
  EntryDialogueSchema,
  EntrySchema,
  ExamplesSchema,
  FrequencySchema,
  PartOfSpeechSchema,
  PronunciationSchema,
  TranslationContentSchema,
  TranslationsSchema,
  VariationsSchema,
} from '@soundblue/data/schemas/context';
import { describe, expect, it } from 'vitest';

describe('PartOfSpeechSchema', () => {
  it('should accept valid parts of speech', () => {
    const validPOS = [
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
    for (const pos of validPOS) {
      expect(PartOfSpeechSchema.safeParse(pos).success).toBe(true);
    }
  });

  it('should reject invalid parts of speech', () => {
    expect(PartOfSpeechSchema.safeParse('invalid').success).toBe(false);
    expect(PartOfSpeechSchema.safeParse('').success).toBe(false);
  });
});

describe('DifficultySchema', () => {
  it('should accept valid difficulties', () => {
    expect(DifficultySchema.safeParse('beginner').success).toBe(true);
    expect(DifficultySchema.safeParse('intermediate').success).toBe(true);
    expect(DifficultySchema.safeParse('advanced').success).toBe(true);
    expect(DifficultySchema.safeParse('master').success).toBe(true);
  });

  it('should reject invalid difficulties', () => {
    expect(DifficultySchema.safeParse('easy').success).toBe(false);
    expect(DifficultySchema.safeParse('').success).toBe(false);
  });
});

describe('FrequencySchema', () => {
  it('should accept valid frequencies', () => {
    expect(FrequencySchema.safeParse('common').success).toBe(true);
    expect(FrequencySchema.safeParse('uncommon').success).toBe(true);
    expect(FrequencySchema.safeParse('rare').success).toBe(true);
  });

  it('should reject invalid frequencies', () => {
    expect(FrequencySchema.safeParse('very-common').success).toBe(false);
    expect(FrequencySchema.safeParse('').success).toBe(false);
  });
});

describe('PronunciationSchema', () => {
  it('should validate valid pronunciation', () => {
    const valid = { korean: '안녕', ipa: '[annjʌŋ]' };
    expect(PronunciationSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate pronunciation without IPA', () => {
    const valid = { korean: '안녕' };
    expect(PronunciationSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty korean', () => {
    const invalid = { korean: '' };
    expect(PronunciationSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('ExamplesSchema', () => {
  it('should validate valid examples', () => {
    const valid = {
      beginner: '안녕하세요.',
      intermediate: '오늘 날씨가 좋네요.',
      advanced: '한국어를 배우는 것은 매우 보람 있는 경험입니다.',
    };
    expect(ExamplesSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate examples with master level', () => {
    const valid = {
      beginner: '안녕하세요.',
      intermediate: '오늘 날씨가 좋네요.',
      advanced: '복잡한 문장.',
      master: '매우 어려운 문장.',
    };
    expect(ExamplesSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty beginner example', () => {
    const invalid = {
      beginner: '',
      intermediate: '중급',
      advanced: '고급',
    };
    expect(ExamplesSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('EntryDialogueLineSchema', () => {
  it('should validate valid dialogue line', () => {
    const valid = {
      speaker: 'A',
      text: '안녕하세요!',
      romanization: 'Annyeonghaseyo!',
      translation: 'Hello!',
    };
    expect(EntryDialogueLineSchema.safeParse(valid).success).toBe(true);
  });

  it('should accept only A or B as speaker', () => {
    expect(
      EntryDialogueLineSchema.safeParse({
        speaker: 'A',
        text: 'Hi',
        romanization: 'Hi',
        translation: 'Hi',
      }).success,
    ).toBe(true);
    expect(
      EntryDialogueLineSchema.safeParse({
        speaker: 'B',
        text: 'Hi',
        romanization: 'Hi',
        translation: 'Hi',
      }).success,
    ).toBe(true);
  });

  it('should reject invalid speaker', () => {
    const invalid = {
      speaker: 'C',
      text: 'Hi',
      romanization: 'Hi',
      translation: 'Hi',
    };
    expect(EntryDialogueLineSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('EntryDialogueSchema', () => {
  it('should validate valid entry dialogue', () => {
    const valid = {
      context: '친구와 인사할 때',
      dialogue: [
        { speaker: 'A', text: '안녕!', romanization: 'Annyeong!', translation: 'Hi!' },
        { speaker: 'B', text: '안녕!', romanization: 'Annyeong!', translation: 'Hi!' },
      ],
    };
    expect(EntryDialogueSchema.safeParse(valid).success).toBe(true);
  });

  it('should require at least 2 dialogue lines', () => {
    const invalid = {
      context: '상황',
      dialogue: [{ speaker: 'A', text: 'Hi', romanization: 'Hi', translation: 'Hi' }],
    };
    expect(EntryDialogueSchema.safeParse(invalid).success).toBe(false);
  });

  it('should allow maximum 6 dialogue lines', () => {
    const valid = {
      context: '상황',
      dialogue: Array(6)
        .fill(null)
        .map((_, i) => ({
          speaker: i % 2 === 0 ? 'A' : 'B',
          text: `Line ${i}`,
          romanization: `Line ${i}`,
          translation: `Line ${i}`,
        })),
    };
    expect(EntryDialogueSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject more than 6 dialogue lines', () => {
    const invalid = {
      context: '상황',
      dialogue: Array(7)
        .fill(null)
        .map((_, i) => ({
          speaker: i % 2 === 0 ? 'A' : 'B',
          text: `Line ${i}`,
          romanization: `Line ${i}`,
          translation: `Line ${i}`,
        })),
    };
    expect(EntryDialogueSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('VariationsSchema', () => {
  it('should validate valid variations', () => {
    const valid = {
      formal: ['존댓말'],
      casual: ['반말'],
      short: ['줄임말'],
    };
    expect(VariationsSchema.safeParse(valid).success).toBe(true);
  });

  it('should allow empty object', () => {
    const valid = {};
    expect(VariationsSchema.safeParse(valid).success).toBe(true);
  });

  it('should allow partial variations', () => {
    const valid = { formal: ['존댓말'] };
    expect(VariationsSchema.safeParse(valid).success).toBe(true);
  });
});

describe('TranslationContentSchema', () => {
  it('should validate valid translation content', () => {
    const valid = {
      word: 'Hello',
      explanation: 'A greeting used when meeting someone',
      examples: {
        beginner: 'Hello!',
        intermediate: 'Hello, how are you?',
        advanced: 'Hello and welcome to our event.',
      },
    };
    expect(TranslationContentSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate with optional dialogue', () => {
    const valid = {
      word: 'Hello',
      explanation: 'Greeting',
      examples: {
        beginner: 'Hi',
        intermediate: 'Hello',
        advanced: 'Hello there',
      },
      dialogue: {
        context: 'Meeting someone',
        dialogue: [
          { speaker: 'A', text: 'Hello', romanization: 'Hello', translation: '안녕' },
          { speaker: 'B', text: 'Hi', romanization: 'Hi', translation: '안녕' },
        ],
      },
    };
    expect(TranslationContentSchema.safeParse(valid).success).toBe(true);
  });
});

describe('TranslationsSchema', () => {
  it('should validate valid translations', () => {
    const valid = {
      ko: {
        word: '안녕하세요',
        explanation: '인사말',
        examples: { beginner: '안녕', intermediate: '안녕하세요', advanced: '안녕하십니까' },
      },
      en: {
        word: 'Hello',
        explanation: 'Greeting',
        examples: { beginner: 'Hi', intermediate: 'Hello', advanced: 'Hello there' },
      },
    };
    expect(TranslationsSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject missing ko translation', () => {
    const invalid = {
      en: {
        word: 'Hello',
        explanation: 'Greeting',
        examples: { beginner: 'Hi', intermediate: 'Hello', advanced: 'Hello' },
      },
    };
    expect(TranslationsSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('EntrySchema', () => {
  const validEntry = {
    id: 'annyeong',
    korean: '안녕',
    romanization: 'annyeong',
    partOfSpeech: 'interjection',
    categoryId: 'greetings',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['informal', 'greeting'],
    translations: {
      ko: {
        word: '안녕',
        explanation: '친근한 인사말',
        examples: { beginner: '안녕!', intermediate: '안녕, 잘 지냈어?', advanced: '어, 안녕.' },
      },
      en: {
        word: 'Hello / Hi',
        explanation: 'Informal greeting',
        examples: { beginner: 'Hi!', intermediate: 'Hey, how are you?', advanced: 'Oh, hello.' },
      },
    },
    pronunciation: { korean: '안녕' },
  };

  it('should validate valid entry', () => {
    expect(EntrySchema.safeParse(validEntry).success).toBe(true);
  });

  it('should reject empty id', () => {
    const invalid = { ...validEntry, id: '' };
    expect(EntrySchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject id longer than 100 characters', () => {
    const invalid = { ...validEntry, id: 'a'.repeat(101) };
    expect(EntrySchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject invalid part of speech', () => {
    const invalid = { ...validEntry, partOfSpeech: 'invalid' };
    expect(EntrySchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject invalid difficulty', () => {
    const invalid = { ...validEntry, difficulty: 'easy' };
    expect(EntrySchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject invalid frequency', () => {
    const invalid = { ...validEntry, frequency: 'super-common' };
    expect(EntrySchema.safeParse(invalid).success).toBe(false);
  });

  it('should accept empty tags array', () => {
    const valid = { ...validEntry, tags: [] };
    expect(EntrySchema.safeParse(valid).success).toBe(true);
  });
});
