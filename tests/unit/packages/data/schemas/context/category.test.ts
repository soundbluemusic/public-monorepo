/**
 * @fileoverview Unit tests for Context category schemas
 */

import {
  CategorySchema,
  ConversationSchema,
  DialogueLineSchema,
} from '@soundblue/data/schemas/context';
import { describe, expect, it } from 'vitest';

describe('CategorySchema', () => {
  it('should validate valid category', () => {
    const valid = {
      id: 'greetings',
      name: { ko: '인사', en: 'Greetings' },
    };
    expect(CategorySchema.safeParse(valid).success).toBe(true);
  });

  it('should validate category with all optional fields', () => {
    const valid = {
      id: 'greetings',
      name: { ko: '인사', en: 'Greetings' },
      description: { ko: '인사말 모음', en: 'Collection of greetings' },
      icon: '👋',
      order: 1,
    };
    expect(CategorySchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty id', () => {
    const invalid = {
      id: '',
      name: { ko: '인사', en: 'Greetings' },
    };
    expect(CategorySchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject id longer than 100 characters', () => {
    const invalid = {
      id: 'a'.repeat(101),
      name: { ko: '인사', en: 'Greetings' },
    };
    expect(CategorySchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject negative order', () => {
    const invalid = {
      id: 'greetings',
      name: { ko: '인사', en: 'Greetings' },
      order: -1,
    };
    expect(CategorySchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject non-integer order', () => {
    const invalid = {
      id: 'greetings',
      name: { ko: '인사', en: 'Greetings' },
      order: 1.5,
    };
    expect(CategorySchema.safeParse(invalid).success).toBe(false);
  });
});

describe('DialogueLineSchema (Category)', () => {
  it('should validate valid dialogue line', () => {
    const valid = {
      speaker: 'Teacher',
      ko: '안녕하세요, 학생들!',
      en: 'Hello, students!',
    };
    expect(DialogueLineSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty speaker', () => {
    const invalid = {
      speaker: '',
      ko: '안녕',
      en: 'Hello',
    };
    expect(DialogueLineSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject empty ko text', () => {
    const invalid = {
      speaker: 'A',
      ko: '',
      en: 'Hello',
    };
    expect(DialogueLineSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject empty en text', () => {
    const invalid = {
      speaker: 'A',
      ko: '안녕',
      en: '',
    };
    expect(DialogueLineSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('ConversationSchema', () => {
  it('should validate valid conversation', () => {
    const valid = {
      id: 'greeting-1',
      categoryId: 'greetings',
      title: { ko: '인사 대화', en: 'Greeting Conversation' },
      dialogue: [
        { speaker: 'A', ko: '안녕하세요!', en: 'Hello!' },
        { speaker: 'B', ko: '안녕하세요!', en: 'Hello!' },
      ],
    };
    expect(ConversationSchema.safeParse(valid).success).toBe(true);
  });

  it('should require at least 1 dialogue line', () => {
    const invalid = {
      id: 'greeting-1',
      categoryId: 'greetings',
      title: { ko: '인사 대화', en: 'Greeting Conversation' },
      dialogue: [],
    };
    expect(ConversationSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject empty id', () => {
    const invalid = {
      id: '',
      categoryId: 'greetings',
      title: { ko: '제목', en: 'Title' },
      dialogue: [{ speaker: 'A', ko: '안녕', en: 'Hi' }],
    };
    expect(ConversationSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject id longer than 100 characters', () => {
    const invalid = {
      id: 'a'.repeat(101),
      categoryId: 'greetings',
      title: { ko: '제목', en: 'Title' },
      dialogue: [{ speaker: 'A', ko: '안녕', en: 'Hi' }],
    };
    expect(ConversationSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject empty categoryId', () => {
    const invalid = {
      id: 'greeting-1',
      categoryId: '',
      title: { ko: '제목', en: 'Title' },
      dialogue: [{ speaker: 'A', ko: '안녕', en: 'Hi' }],
    };
    expect(ConversationSchema.safeParse(invalid).success).toBe(false);
  });

  it('should validate conversation with many speakers', () => {
    const valid = {
      id: 'multi-speaker',
      categoryId: 'advanced',
      title: { ko: '다중 대화', en: 'Multi-speaker Dialogue' },
      dialogue: [
        { speaker: 'Teacher', ko: '오늘은 무엇을 배울까요?', en: 'What shall we learn today?' },
        { speaker: 'Student 1', ko: '수학이요!', en: 'Math!' },
        { speaker: 'Student 2', ko: '과학이요!', en: 'Science!' },
        { speaker: 'Teacher', ko: '둘 다 좋네요!', en: 'Both are great!' },
      ],
    };
    expect(ConversationSchema.safeParse(valid).success).toBe(true);
  });
});
