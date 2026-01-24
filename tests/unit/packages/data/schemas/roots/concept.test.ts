/**
 * @fileoverview Unit tests for Roots concept schemas
 */

import {
  ChartDataPointSchema,
  ChartDataSchema,
  ChartDatasetSchema,
  ConceptContentSchema,
  ConceptRelationsSchema,
  DifficultyLevelSchema,
  ExampleSchema,
  FormulaSchema,
  LanguageSchema,
  MathConceptSchema,
  MathFieldSchema,
  VariableSchema,
  VisualizationSchema,
} from '@soundblue/data/schemas/roots';
import { describe, expect, it } from 'vitest';

describe('LanguageSchema', () => {
  it('should accept valid languages', () => {
    expect(LanguageSchema.safeParse('ko').success).toBe(true);
    expect(LanguageSchema.safeParse('en').success).toBe(true);
  });

  it('should reject invalid languages', () => {
    expect(LanguageSchema.safeParse('ja').success).toBe(false);
    expect(LanguageSchema.safeParse('').success).toBe(false);
  });
});

describe('DifficultyLevelSchema', () => {
  it('should accept valid difficulty levels 1-5', () => {
    expect(DifficultyLevelSchema.safeParse(1).success).toBe(true);
    expect(DifficultyLevelSchema.safeParse(2).success).toBe(true);
    expect(DifficultyLevelSchema.safeParse(3).success).toBe(true);
    expect(DifficultyLevelSchema.safeParse(4).success).toBe(true);
    expect(DifficultyLevelSchema.safeParse(5).success).toBe(true);
  });

  it('should reject invalid difficulty levels', () => {
    expect(DifficultyLevelSchema.safeParse(0).success).toBe(false);
    expect(DifficultyLevelSchema.safeParse(6).success).toBe(false);
    expect(DifficultyLevelSchema.safeParse(-1).success).toBe(false);
    expect(DifficultyLevelSchema.safeParse('1').success).toBe(false);
  });
});

describe('MathFieldSchema', () => {
  it('should accept valid math fields', () => {
    expect(MathFieldSchema.safeParse('algebra').success).toBe(true);
    expect(MathFieldSchema.safeParse('geometry').success).toBe(true);
    expect(MathFieldSchema.safeParse('calculus-of-variations').success).toBe(true);
    expect(MathFieldSchema.safeParse('applied-music').success).toBe(true);
  });

  it('should reject invalid math fields', () => {
    expect(MathFieldSchema.safeParse('invalid-field').success).toBe(false);
    expect(MathFieldSchema.safeParse('').success).toBe(false);
  });
});

describe('VariableSchema', () => {
  it('should validate valid variable', () => {
    const valid = { symbol: 'x', meaning: 'unknown value' };
    expect(VariableSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty symbol', () => {
    const invalid = { symbol: '', meaning: 'unknown value' };
    expect(VariableSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject empty meaning', () => {
    const invalid = { symbol: 'x', meaning: '' };
    expect(VariableSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('FormulaSchema', () => {
  it('should validate valid formula', () => {
    const valid = {
      latex: 'x^2 + y^2 = r^2',
      description: 'Circle equation',
    };
    expect(FormulaSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate formula with variables', () => {
    const valid = {
      latex: 'E = mc^2',
      description: 'Energy-mass equivalence',
      variables: [
        { symbol: 'E', meaning: 'energy' },
        { symbol: 'm', meaning: 'mass' },
        { symbol: 'c', meaning: 'speed of light' },
      ],
    };
    expect(FormulaSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty latex', () => {
    const invalid = { latex: '', description: 'desc' };
    expect(FormulaSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('ExampleSchema', () => {
  it('should validate valid example', () => {
    const valid = { problem: 'Solve x + 2 = 5', solution: 'x = 3' };
    expect(ExampleSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate example with optional fields', () => {
    const valid = {
      problem: 'Solve x + 2 = 5',
      solution: 'x = 3',
      latex: 'x = 3',
      difficulty: 1,
    };
    expect(ExampleSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty problem', () => {
    const invalid = { problem: '', solution: 'x = 3' };
    expect(ExampleSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('ChartDataPointSchema', () => {
  it('should validate valid data point', () => {
    const valid = { x: 0, y: 1 };
    expect(ChartDataPointSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate data point with label', () => {
    const valid = { x: 0, y: 1, label: 'Origin' };
    expect(ChartDataPointSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject non-number values', () => {
    const invalid = { x: '0', y: 1 };
    expect(ChartDataPointSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('ChartDatasetSchema', () => {
  it('should validate dataset with data points', () => {
    const valid = {
      label: 'sin(x)',
      data: [
        { x: 0, y: 0 },
        { x: 1, y: 0.84 },
      ],
    };
    expect(ChartDatasetSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate dataset with number array', () => {
    const valid = {
      label: 'Linear',
      data: [1, 2, 3, 4, 5],
    };
    expect(ChartDatasetSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate dataset with styling options', () => {
    const valid = {
      label: 'Curve',
      data: [1, 2, 3],
      borderColor: '#ff0000',
      backgroundColor: '#ff000020',
      fill: true,
    };
    expect(ChartDatasetSchema.safeParse(valid).success).toBe(true);
  });
});

describe('ChartDataSchema', () => {
  it('should validate valid chart data', () => {
    const valid = {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [{ label: 'Data', data: [1, 2, 3] }],
    };
    expect(ChartDataSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate chart data without labels', () => {
    const valid = {
      datasets: [{ label: 'Data', data: [1, 2, 3] }],
    };
    expect(ChartDataSchema.safeParse(valid).success).toBe(true);
  });
});

describe('VisualizationSchema', () => {
  it('should validate valid visualization', () => {
    const valid = {
      type: 'graph',
      description: 'A sine wave graph',
    };
    expect(VisualizationSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate visualization with data', () => {
    const valid = {
      type: 'diagram',
      description: 'Unit circle',
      data: {
        datasets: [{ label: 'Circle', data: [{ x: 1, y: 0 }] }],
      },
    };
    expect(VisualizationSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate visualization with external URL', () => {
    const valid = {
      type: 'interactive',
      description: 'Interactive demo',
      externalUrl: 'https://example.com/demo',
    };
    expect(VisualizationSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject invalid visualization type', () => {
    const invalid = {
      type: 'invalid',
      description: 'desc',
    };
    expect(VisualizationSchema.safeParse(invalid).success).toBe(false);
  });
});

describe('ConceptContentSchema', () => {
  it('should validate valid concept content', () => {
    const valid = {
      definition: 'A mathematical concept',
      examples: ['Example 1', 'Example 2'],
    };
    expect(ConceptContentSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate content with formulas', () => {
    const valid = {
      definition: 'Circle definition',
      formulas: ['x^2 + y^2 = r^2'],
      examples: ['Find the area of a circle'],
    };
    expect(ConceptContentSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate content with complex examples', () => {
    const valid = {
      definition: 'Definition',
      examples: [
        { problem: 'Problem', solution: 'Solution' },
        'Simple example',
      ],
    };
    expect(ConceptContentSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate content with history', () => {
    const valid = {
      definition: 'Definition',
      examples: ['Example'],
      history: {
        discoveredBy: 'Euclid',
        year: '300 BC',
        background: 'Ancient Greece',
      },
    };
    expect(ConceptContentSchema.safeParse(valid).success).toBe(true);
  });
});

describe('ConceptRelationsSchema', () => {
  it('should validate valid relations', () => {
    const valid = {
      prerequisites: ['algebra', 'basic-math'],
      nextTopics: ['calculus'],
      related: ['geometry'],
    };
    expect(ConceptRelationsSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate relations with applications', () => {
    const valid = {
      prerequisites: [],
      nextTopics: [],
      related: [],
      applications: ['physics', 'engineering'],
    };
    expect(ConceptRelationsSchema.safeParse(valid).success).toBe(true);
  });
});

describe('MathConceptSchema', () => {
  it('should validate valid math concept', () => {
    const valid = {
      id: 'addition',
      name: { ko: '덧셈', en: 'Addition' },
      field: 'foundations',
      subfield: 'basic-operations',
      difficulty: 1,
      content: {
        ko: 'Definition in Korean',
        en: 'Definition in English',
      },
      relations: {
        prerequisites: [],
        nextTopics: ['subtraction'],
        related: ['multiplication'],
      },
      tags: ['basic', 'arithmetic'],
    };
    expect(MathConceptSchema.safeParse(valid).success).toBe(true);
  });

  it('should validate concept with complex content', () => {
    const valid = {
      id: 'pythagorean-theorem',
      name: { ko: '피타고라스 정리', en: 'Pythagorean Theorem' },
      field: 'geometry',
      subfield: 'triangles',
      difficulty: 2,
      content: {
        ko: {
          definition: '직각삼각형에서 빗변의 제곱은 다른 두 변의 제곱의 합과 같다',
          examples: [{ problem: '문제', solution: '풀이' }],
        },
        en: {
          definition:
            'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides',
          examples: ['Example'],
        },
      },
      latex: 'a^2 + b^2 = c^2',
      relations: {
        prerequisites: ['triangle-basics'],
        nextTopics: ['distance-formula'],
        related: ['right-triangles'],
      },
      tags: ['theorem', 'geometry'],
    };
    expect(MathConceptSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject concept with invalid id', () => {
    const invalid = {
      id: '', // empty id
      name: { ko: '덧셈', en: 'Addition' },
      field: 'foundations',
      subfield: 'basic',
      difficulty: 1,
      content: { ko: 'def', en: 'def' },
      relations: { prerequisites: [], nextTopics: [], related: [] },
      tags: [],
    };
    expect(MathConceptSchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject concept with invalid field', () => {
    const invalid = {
      id: 'test',
      name: { ko: '테스트', en: 'Test' },
      field: 'invalid-field', // invalid
      subfield: 'basic',
      difficulty: 1,
      content: { ko: 'def', en: 'def' },
      relations: { prerequisites: [], nextTopics: [], related: [] },
      tags: [],
    };
    expect(MathConceptSchema.safeParse(invalid).success).toBe(false);
  });
});
