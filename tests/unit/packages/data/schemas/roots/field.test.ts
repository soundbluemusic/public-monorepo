/**
 * @fileoverview Unit tests for Roots field schemas
 */

import {
  FamousTheoremSchema,
  MathConstantSchema,
  MathFieldInfoSchema,
  MathSubfieldSchema,
  MathSymbolSchema,
  SymbolCategorySchema,
} from '@soundblue/data/schemas/roots';
import { describe, expect, it } from 'vitest';

describe('MathFieldInfoSchema', () => {
  it('should validate valid field info', () => {
    const valid = {
      id: 'algebra',
      name: { ko: '대수학', en: 'Algebra' },
      description: { ko: '대수학 설명', en: 'Algebra description' },
      icon: '🔢',
      color: '#4f46e5',
      order: 1,
    };
    expect(MathFieldInfoSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject invalid field id', () => {
    const invalid = {
      id: 'invalid-field',
      name: { ko: '대수학', en: 'Algebra' },
      description: { ko: '설명', en: 'desc' },
      icon: '🔢',
      color: '#4f46e5',
      order: 1,
    };
    expect(MathFieldInfoSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject negative order', () => {
    const invalid = {
      id: 'algebra',
      name: { ko: '대수학', en: 'Algebra' },
      description: { ko: '설명', en: 'desc' },
      icon: '🔢',
      color: '#4f46e5',
      order: -1,
    };
    expect(MathFieldInfoSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('MathSubfieldSchema', () => {
  it('should validate valid subfield', () => {
    const valid = {
      id: 'linear-equations',
      parentField: 'algebra',
      name: { ko: '일차방정식', en: 'Linear Equations' },
      description: { ko: '설명', en: 'Description' },
      order: 1,
    };
    expect(MathSubfieldSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate subfield with optional icon', () => {
    const valid = {
      id: 'linear-equations',
      parentField: 'algebra',
      name: { ko: '일차방정식', en: 'Linear Equations' },
      description: { ko: '설명', en: 'Description' },
      order: 1,
      icon: '📐',
    };
    expect(MathSubfieldSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject invalid parent field', () => {
    const invalid = {
      id: 'linear-equations',
      parentField: 'invalid',
      name: { ko: '일차방정식', en: 'Linear Equations' },
      description: { ko: '설명', en: 'Description' },
      order: 1,
    };
    expect(MathSubfieldSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('MathConstantSchema', () => {
  it('should validate valid constant', () => {
    const valid = {
      id: 'pi',
      symbol: 'π',
      name: { ko: '원주율', en: 'Pi' },
      value: '3.14159265358979...',
      latex: '\\pi',
      description: { ko: '원의 둘레와 지름의 비', en: 'Ratio of circumference to diameter' },
      relatedConcepts: ['circle', 'trigonometry'],
    };
    expect(MathConstantSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty symbol', () => {
    const invalid = {
      id: 'pi',
      symbol: '',
      name: { ko: '원주율', en: 'Pi' },
      value: '3.14',
      latex: '\\pi',
      description: { ko: '설명', en: 'desc' },
      relatedConcepts: [],
    };
    expect(MathConstantSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('SymbolCategorySchema', () => {
  it('should accept valid symbol categories', () => {
    expect(SymbolCategorySchema.safeParse('operation').success).toBe(true);
    expect(SymbolCategorySchema.safeParse('set').success).toBe(true);
    expect(SymbolCategorySchema.safeParse('logic').success).toBe(true);
    expect(SymbolCategorySchema.safeParse('calculus').success).toBe(true);
    expect(SymbolCategorySchema.safeParse('greek').success).toBe(true);
    expect(SymbolCategorySchema.safeParse('relation').success).toBe(true);
  });

  it('should reject invalid categories', () => {
    expect(SymbolCategorySchema.safeParse('invalid').success).toBe(false);
  });
});

describe('MathSymbolSchema', () => {
  it('should validate valid math symbol', () => {
    const valid = {
      id: 'plus',
      symbol: '+',
      category: 'operation',
      name: { ko: '덧셈', en: 'Plus' },
      latex: '+',
      usage: 'a + b',
      relatedConcepts: ['addition'],
    };
    expect(MathSymbolSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject invalid category', () => {
    const invalid = {
      id: 'plus',
      symbol: '+',
      category: 'invalid',
      name: { ko: '덧셈', en: 'Plus' },
      latex: '+',
      usage: 'a + b',
      relatedConcepts: [],
    };
    expect(MathSymbolSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('FamousTheoremSchema', () => {
  it('should validate valid theorem', () => {
    const valid = {
      id: 'pythagorean-theorem',
      name: { ko: '피타고라스 정리', en: 'Pythagorean Theorem' },
      statement: {
        ko: '직각삼각형에서 빗변의 제곱은 다른 두 변의 제곱의 합과 같다',
        en: 'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides',
      },
      latex: 'a^2 + b^2 = c^2',
      field: 'geometry',
      prover: 'Pythagoras',
      year: '570-495 BC',
      significance: 'Foundation of Euclidean geometry',
      relatedConcepts: ['right-triangle', 'distance-formula'],
    };
    expect(FamousTheoremSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate theorem without optional fields', () => {
    const valid = {
      id: 'fermat-last',
      name: { ko: '페르마의 마지막 정리', en: "Fermat's Last Theorem" },
      statement: { ko: '정리 내용', en: 'Theorem statement' },
      field: 'number-theory',
      significance: 'Major achievement in number theory',
      relatedConcepts: [],
    };
    expect(FamousTheoremSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty significance', () => {
    const invalid = {
      id: 'test',
      name: { ko: '테스트', en: 'Test' },
      statement: { ko: '내용', en: 'content' },
      field: 'algebra',
      significance: '',
      relatedConcepts: [],
    };
    expect(FamousTheoremSchema.safeParse(invalid).success).toBe(false);
  });
});
