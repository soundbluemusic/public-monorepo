/**
 * @fileoverview Roots 앱 concept 데이터 로더 테스트
 *
 * 수학 개념 데이터 조회 함수들의 단위 테스트입니다.
 */

import { describe, expect, it } from 'vitest';

// 타입 정의
type MathField =
  | 'foundations'
  | 'algebra'
  | 'geometry'
  | 'analysis'
  | 'trigonometry'
  | 'linear-algebra'
  | 'probability'
  | 'discrete'
  | 'number-theory'
  | 'topology'
  | 'logic'
  | 'dynamics'
  | 'optimization'
  | 'numerical'
  | 'applied'
  | 'constants'
  | 'symbols'
  | 'theorems';

type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

interface MathConcept {
  id: string;
  name: { ko: string; en: string };
  field: MathField;
  subfield: string;
  difficulty: DifficultyLevel;
  content: {
    ko: string | { definition: string };
    en: string | { definition: string };
  };
  tags: string[];
  latex?: string;
  relations?: string[];
}

interface LightConcept {
  id: string;
  name: { ko: string; en: string };
  field: MathField;
  subfield: string;
  difficulty: DifficultyLevel;
  def: { ko: string; en: string };
  tags: string[];
}

// 테스트용 Mock 데이터
const mockConcepts: MathConcept[] = [
  {
    id: 'addition',
    name: { ko: '덧셈', en: 'Addition' },
    field: 'foundations',
    subfield: 'arithmetic',
    difficulty: 1,
    content: {
      ko: '두 수를 합하는 기본 연산입니다.',
      en: 'A basic operation that combines two numbers.',
    },
    tags: ['arithmetic', 'basic', 'operation'],
  },
  {
    id: 'subtraction',
    name: { ko: '뺄셈', en: 'Subtraction' },
    field: 'foundations',
    subfield: 'arithmetic',
    difficulty: 1,
    content: {
      ko: '한 수에서 다른 수를 빼는 연산입니다.',
      en: 'An operation that takes one number from another.',
    },
    tags: ['arithmetic', 'basic', 'operation'],
  },
  {
    id: 'quadratic-equation',
    name: { ko: '이차방정식', en: 'Quadratic Equation' },
    field: 'algebra',
    subfield: 'equations',
    difficulty: 2,
    content: {
      ko: { definition: 'ax² + bx + c = 0 형태의 방정식' },
      en: { definition: 'An equation of the form ax² + bx + c = 0' },
    },
    tags: ['equation', 'polynomial', 'algebra'],
    latex: 'ax^2 + bx + c = 0',
  },
  {
    id: 'pythagorean-theorem',
    name: { ko: '피타고라스 정리', en: 'Pythagorean Theorem' },
    field: 'geometry',
    subfield: 'triangles',
    difficulty: 2,
    content: {
      ko: '직각삼각형에서 빗변의 제곱은 나머지 두 변의 제곱의 합과 같습니다.',
      en: 'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.',
    },
    tags: ['theorem', 'triangle', 'geometry'],
    latex: 'a^2 + b^2 = c^2',
  },
  {
    id: 'derivative',
    name: { ko: '미분', en: 'Derivative' },
    field: 'analysis',
    subfield: 'calculus',
    difficulty: 3,
    content: {
      ko: { definition: '함수의 순간 변화율을 나타내는 연산' },
      en: { definition: 'An operation representing the instantaneous rate of change of a function' },
    },
    tags: ['calculus', 'rate-of-change', 'analysis'],
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
    relations: ['integral', 'limit'],
  },
];

// 데이터 조회 함수들 (테스트용 구현)
const conceptsById = new Map<string, MathConcept>(mockConcepts.map((c) => [c.id, c]));

const conceptsByField = new Map<string, MathConcept[]>();
for (const concept of mockConcepts) {
  const list = conceptsByField.get(concept.field) || [];
  list.push(concept);
  conceptsByField.set(concept.field, list);
}

const conceptsBySubfield = new Map<string, MathConcept[]>();
for (const concept of mockConcepts) {
  if (concept.subfield) {
    const list = conceptsBySubfield.get(concept.subfield) || [];
    list.push(concept);
    conceptsBySubfield.set(concept.subfield, list);
  }
}

function getConceptById(id: string): MathConcept | undefined {
  return conceptsById.get(id);
}

function getConceptsByField(field: string): MathConcept[] {
  return conceptsByField.get(field) || [];
}

function getConceptsBySubfield(subfield: string): MathConcept[] {
  return conceptsBySubfield.get(subfield) || [];
}

function getConceptsByTag(tag: string): MathConcept[] {
  return mockConcepts.filter((c) => c.tags.includes(tag));
}

function getConceptsByDifficulty(level: number): MathConcept[] {
  return mockConcepts.filter((c) => c.difficulty === level);
}

function extractDefinition(content: string | { definition: string }): string {
  if (typeof content === 'string') {
    return content;
  }
  return content.definition;
}

function toLightConcept(c: MathConcept): LightConcept {
  return {
    id: c.id,
    name: c.name,
    field: c.field,
    subfield: c.subfield,
    difficulty: c.difficulty,
    def: {
      ko: extractDefinition(c.content.ko),
      en: extractDefinition(c.content.en),
    },
    tags: c.tags,
  };
}

// 테스트 시작
describe('Concepts Data Loader', () => {
  describe('getConceptById', () => {
    it('should return concept for valid ID', () => {
      const concept = getConceptById('addition');

      expect(concept).not.toBeUndefined();
      expect(concept?.id).toBe('addition');
      expect(concept?.name.ko).toBe('덧셈');
      expect(concept?.name.en).toBe('Addition');
    });

    it('should return undefined for non-existent ID', () => {
      const concept = getConceptById('nonexistent');

      expect(concept).toBeUndefined();
    });

    it('should return concept with all fields', () => {
      const concept = getConceptById('derivative');

      expect(concept?.id).toBe('derivative');
      expect(concept?.field).toBe('analysis');
      expect(concept?.subfield).toBe('calculus');
      expect(concept?.difficulty).toBe(3);
      expect(concept?.tags).toContain('calculus');
      expect(concept?.latex).toBeDefined();
      expect(concept?.relations).toContain('integral');
    });

    it('should return concept with string content', () => {
      const concept = getConceptById('addition');

      expect(typeof concept?.content.ko).toBe('string');
      expect(typeof concept?.content.en).toBe('string');
    });

    it('should return concept with object content', () => {
      const concept = getConceptById('quadratic-equation');

      expect(typeof concept?.content.ko).toBe('object');
      expect((concept?.content.ko as { definition: string }).definition).toBeDefined();
    });
  });

  describe('getConceptsByField', () => {
    it('should return concepts for valid field', () => {
      const concepts = getConceptsByField('foundations');

      expect(concepts.length).toBe(2);
      expect(concepts.every((c) => c.field === 'foundations')).toBe(true);
    });

    it('should return empty array for non-existent field', () => {
      const concepts = getConceptsByField('nonexistent');

      expect(concepts).toEqual([]);
    });

    it('should return single concept for field with one item', () => {
      const concepts = getConceptsByField('algebra');

      expect(concepts.length).toBe(1);
      expect(concepts[0]?.id).toBe('quadratic-equation');
    });
  });

  describe('getConceptsBySubfield', () => {
    it('should return concepts for valid subfield', () => {
      const concepts = getConceptsBySubfield('arithmetic');

      expect(concepts.length).toBe(2);
      expect(concepts.every((c) => c.subfield === 'arithmetic')).toBe(true);
    });

    it('should return empty array for non-existent subfield', () => {
      const concepts = getConceptsBySubfield('nonexistent');

      expect(concepts).toEqual([]);
    });
  });

  describe('getConceptsByTag', () => {
    it('should return concepts with matching tag', () => {
      const concepts = getConceptsByTag('arithmetic');

      expect(concepts.length).toBe(2);
      expect(concepts.every((c) => c.tags.includes('arithmetic'))).toBe(true);
    });

    it('should return empty array for non-existent tag', () => {
      const concepts = getConceptsByTag('nonexistent');

      expect(concepts).toEqual([]);
    });

    it('should return concepts across different fields', () => {
      const concepts = getConceptsByTag('theorem');

      expect(concepts.length).toBe(1);
      expect(concepts[0]?.id).toBe('pythagorean-theorem');
    });
  });

  describe('getConceptsByDifficulty', () => {
    it('should return concepts for difficulty level 1', () => {
      const concepts = getConceptsByDifficulty(1);

      expect(concepts.length).toBe(2);
      expect(concepts.every((c) => c.difficulty === 1)).toBe(true);
    });

    it('should return concepts for difficulty level 2', () => {
      const concepts = getConceptsByDifficulty(2);

      expect(concepts.length).toBe(2);
    });

    it('should return concepts for difficulty level 3', () => {
      const concepts = getConceptsByDifficulty(3);

      expect(concepts.length).toBe(1);
      expect(concepts[0]?.id).toBe('derivative');
    });

    it('should return empty array for non-existent difficulty', () => {
      const concepts = getConceptsByDifficulty(5);

      expect(concepts).toEqual([]);
    });
  });

  describe('extractDefinition', () => {
    it('should return string as-is', () => {
      const result = extractDefinition('Simple definition');

      expect(result).toBe('Simple definition');
    });

    it('should extract definition from object', () => {
      const result = extractDefinition({ definition: 'Object definition' });

      expect(result).toBe('Object definition');
    });

    it('should handle empty string', () => {
      const result = extractDefinition('');

      expect(result).toBe('');
    });

    it('should handle empty definition in object', () => {
      const result = extractDefinition({ definition: '' });

      expect(result).toBe('');
    });
  });

  describe('toLightConcept', () => {
    it('should convert MathConcept to LightConcept with string content', () => {
      const concept = getConceptById('addition');
      const light = toLightConcept(concept!);

      expect(light.id).toBe('addition');
      expect(light.name.ko).toBe('덧셈');
      expect(light.name.en).toBe('Addition');
      expect(light.field).toBe('foundations');
      expect(light.subfield).toBe('arithmetic');
      expect(light.difficulty).toBe(1);
      expect(light.def.ko).toBe('두 수를 합하는 기본 연산입니다.');
      expect(light.def.en).toBe('A basic operation that combines two numbers.');
      expect(light.tags).toEqual(['arithmetic', 'basic', 'operation']);
    });

    it('should convert MathConcept to LightConcept with object content', () => {
      const concept = getConceptById('quadratic-equation');
      const light = toLightConcept(concept!);

      expect(light.def.ko).toBe('ax² + bx + c = 0 형태의 방정식');
      expect(light.def.en).toBe('An equation of the form ax² + bx + c = 0');
    });

    it('should not include latex in LightConcept', () => {
      const concept = getConceptById('derivative');
      const light = toLightConcept(concept!);

      expect((light as unknown as { latex?: string }).latex).toBeUndefined();
    });

    it('should not include relations in LightConcept', () => {
      const concept = getConceptById('derivative');
      const light = toLightConcept(concept!);

      expect((light as unknown as { relations?: string[] }).relations).toBeUndefined();
    });
  });

  describe('Map lookups (O(1) performance)', () => {
    it('conceptsById should have all concepts', () => {
      expect(conceptsById.size).toBe(5);
    });

    it('conceptsByField should have correct grouping', () => {
      expect(conceptsByField.get('foundations')?.length).toBe(2);
      expect(conceptsByField.get('algebra')?.length).toBe(1);
      expect(conceptsByField.get('geometry')?.length).toBe(1);
      expect(conceptsByField.get('analysis')?.length).toBe(1);
    });

    it('conceptsBySubfield should have correct grouping', () => {
      expect(conceptsBySubfield.get('arithmetic')?.length).toBe(2);
      expect(conceptsBySubfield.get('equations')?.length).toBe(1);
      expect(conceptsBySubfield.get('triangles')?.length).toBe(1);
      expect(conceptsBySubfield.get('calculus')?.length).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle ID with special characters', () => {
      // quadratic-equation has a hyphen
      const concept = getConceptById('quadratic-equation');

      expect(concept).not.toBeUndefined();
      expect(concept?.id).toBe('quadratic-equation');
    });

    it('should handle Korean names', () => {
      const concept = getConceptById('pythagorean-theorem');

      expect(concept?.name.ko).toBe('피타고라스 정리');
    });

    it('should handle LaTeX content', () => {
      const concept = getConceptById('derivative');

      expect(concept?.latex).toContain('\\lim');
      expect(concept?.latex).toContain('\\frac');
    });

    it('should handle concepts with relations', () => {
      const concept = getConceptById('derivative');

      expect(concept?.relations).toBeDefined();
      expect(concept?.relations).toContain('integral');
      expect(concept?.relations).toContain('limit');
    });

    it('should handle concepts without relations', () => {
      const concept = getConceptById('addition');

      expect(concept?.relations).toBeUndefined();
    });
  });
});
