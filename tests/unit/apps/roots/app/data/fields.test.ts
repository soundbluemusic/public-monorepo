/**
 * @fileoverview Roots 앱 field 데이터 로더 테스트
 *
 * 수학 분야(Field) 데이터 조회 함수들의 단위 테스트입니다.
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

interface Field {
  id: MathField;
  name: { ko: string; en: string };
  description: { ko: string; en: string };
  icon: string;
  color: string;
  conceptCount: number;
}

// Mock 데이터
const mockFields: Field[] = [
  {
    id: 'foundations',
    name: { ko: '기초', en: 'Foundations' },
    description: {
      ko: '수학의 기본 개념과 연산',
      en: 'Basic mathematical concepts and operations',
    },
    icon: '📐',
    color: 'blue',
    conceptCount: 25,
  },
  {
    id: 'algebra',
    name: { ko: '대수학', en: 'Algebra' },
    description: {
      ko: '변수와 방정식을 다루는 수학 분야',
      en: 'Branch of mathematics dealing with variables and equations',
    },
    icon: '🔢',
    color: 'purple',
    conceptCount: 45,
  },
  {
    id: 'geometry',
    name: { ko: '기하학', en: 'Geometry' },
    description: {
      ko: '도형과 공간의 성질을 연구',
      en: 'Study of shapes and properties of space',
    },
    icon: '📏',
    color: 'green',
    conceptCount: 38,
  },
  {
    id: 'analysis',
    name: { ko: '해석학', en: 'Analysis' },
    description: {
      ko: '극한, 연속, 미분, 적분을 다루는 분야',
      en: 'Field dealing with limits, continuity, derivatives, and integrals',
    },
    icon: '📈',
    color: 'red',
    conceptCount: 52,
  },
  {
    id: 'probability',
    name: { ko: '확률론', en: 'Probability' },
    description: {
      ko: '무작위 현상의 수학적 분석',
      en: 'Mathematical analysis of random phenomena',
    },
    icon: '🎲',
    color: 'orange',
    conceptCount: 30,
  },
];

// 데이터 조회 함수들 (테스트용 구현)
const fieldsById = new Map<MathField, Field>(mockFields.map((f) => [f.id, f]));

function getFieldById(id: string): Field | undefined {
  return fieldsById.get(id as MathField);
}

function getAllFields(): Field[] {
  return mockFields;
}

function getFieldsByConceptCountRange(min: number, max: number): Field[] {
  return mockFields.filter((f) => f.conceptCount >= min && f.conceptCount <= max);
}

function getFieldSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function getFieldBySlug(slug: string): Field | undefined {
  return mockFields.find((f) => getFieldSlug(f.name.en) === slug);
}

function sortFieldsByConceptCount(fields: Field[], order: 'asc' | 'desc' = 'desc'): Field[] {
  return [...fields].sort((a, b) => {
    return order === 'asc'
      ? a.conceptCount - b.conceptCount
      : b.conceptCount - a.conceptCount;
  });
}

function sortFieldsByName(fields: Field[], locale: 'ko' | 'en' = 'en'): Field[] {
  return [...fields].sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale));
}

function getTotalConceptCount(): number {
  return mockFields.reduce((sum, f) => sum + f.conceptCount, 0);
}

function getFieldStats(): { totalFields: number; totalConcepts: number; avgConceptsPerField: number } {
  const totalFields = mockFields.length;
  const totalConcepts = getTotalConceptCount();
  return {
    totalFields,
    totalConcepts,
    avgConceptsPerField: Math.round(totalConcepts / totalFields),
  };
}

// 테스트 시작
describe('Fields Data Loader', () => {
  describe('getFieldById', () => {
    it('should return field for valid ID', () => {
      const field = getFieldById('algebra');

      expect(field).not.toBeUndefined();
      expect(field?.id).toBe('algebra');
      expect(field?.name.ko).toBe('대수학');
      expect(field?.name.en).toBe('Algebra');
    });

    it('should return undefined for non-existent ID', () => {
      const field = getFieldById('nonexistent');
      expect(field).toBeUndefined();
    });

    it('should return field with all properties', () => {
      const field = getFieldById('foundations');

      expect(field?.id).toBeDefined();
      expect(field?.name).toBeDefined();
      expect(field?.description).toBeDefined();
      expect(field?.icon).toBeDefined();
      expect(field?.color).toBeDefined();
      expect(field?.conceptCount).toBeDefined();
    });
  });

  describe('getAllFields', () => {
    it('should return all fields', () => {
      const fields = getAllFields();
      expect(fields).toHaveLength(5);
    });

    it('should return array of Field objects', () => {
      const fields = getAllFields();

      for (const field of fields) {
        expect(field.id).toBeDefined();
        expect(field.name.ko).toBeDefined();
        expect(field.name.en).toBeDefined();
      }
    });
  });

  describe('getFieldsByConceptCountRange', () => {
    it('should return fields within range', () => {
      const fields = getFieldsByConceptCountRange(30, 50);

      expect(fields.length).toBeGreaterThan(0);
      for (const field of fields) {
        expect(field.conceptCount).toBeGreaterThanOrEqual(30);
        expect(field.conceptCount).toBeLessThanOrEqual(50);
      }
    });

    it('should return empty array for no matches', () => {
      const fields = getFieldsByConceptCountRange(100, 200);
      expect(fields).toEqual([]);
    });

    it('should include boundary values', () => {
      const fields = getFieldsByConceptCountRange(25, 25);
      expect(fields.some((f) => f.conceptCount === 25)).toBe(true);
    });
  });

  describe('getFieldSlug', () => {
    it('should convert field name to slug', () => {
      expect(getFieldSlug('Foundations')).toBe('foundations');
      expect(getFieldSlug('Algebra')).toBe('algebra');
      expect(getFieldSlug('Linear Algebra')).toBe('linear-algebra');
    });

    it('should handle multiple spaces', () => {
      // Multiple spaces get normalized to single hyphen
      expect(getFieldSlug('Number  Theory')).toBe('number-theory');
    });

    it('should convert to lowercase', () => {
      expect(getFieldSlug('GEOMETRY')).toBe('geometry');
    });
  });

  describe('getFieldBySlug', () => {
    it('should return field for valid slug', () => {
      const field = getFieldBySlug('algebra');

      expect(field).not.toBeUndefined();
      expect(field?.id).toBe('algebra');
    });

    it('should return undefined for non-existent slug', () => {
      const field = getFieldBySlug('nonexistent');
      expect(field).toBeUndefined();
    });
  });

  describe('sortFieldsByConceptCount', () => {
    it('should sort in descending order by default', () => {
      const sorted = sortFieldsByConceptCount(mockFields);

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i]!.conceptCount).toBeLessThanOrEqual(sorted[i - 1]!.conceptCount);
      }
    });

    it('should sort in ascending order when specified', () => {
      const sorted = sortFieldsByConceptCount(mockFields, 'asc');

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i]!.conceptCount).toBeGreaterThanOrEqual(sorted[i - 1]!.conceptCount);
      }
    });

    it('should not mutate original array', () => {
      const original = [...mockFields];
      sortFieldsByConceptCount(mockFields, 'asc');
      expect(mockFields).toEqual(original);
    });
  });

  describe('sortFieldsByName', () => {
    it('should sort by English name by default', () => {
      const sorted = sortFieldsByName(mockFields);

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i]!.name.en.localeCompare(sorted[i - 1]!.name.en)).toBeGreaterThanOrEqual(0);
      }
    });

    it('should sort by Korean name when specified', () => {
      const sorted = sortFieldsByName(mockFields, 'ko');

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i]!.name.ko.localeCompare(sorted[i - 1]!.name.ko, 'ko')).toBeGreaterThanOrEqual(0);
      }
    });

    it('should not mutate original array', () => {
      const original = [...mockFields];
      sortFieldsByName(mockFields, 'ko');
      expect(mockFields).toEqual(original);
    });
  });

  describe('getTotalConceptCount', () => {
    it('should return sum of all concept counts', () => {
      const total = getTotalConceptCount();
      const expected = 25 + 45 + 38 + 52 + 30; // Sum of mock data
      expect(total).toBe(expected);
    });
  });

  describe('getFieldStats', () => {
    it('should return correct statistics', () => {
      const stats = getFieldStats();

      expect(stats.totalFields).toBe(5);
      expect(stats.totalConcepts).toBe(190);
      expect(stats.avgConceptsPerField).toBe(38);
    });
  });

  describe('Field data integrity', () => {
    it('all fields should have valid IDs', () => {
      const validIds: MathField[] = [
        'foundations',
        'algebra',
        'geometry',
        'analysis',
        'trigonometry',
        'linear-algebra',
        'probability',
        'discrete',
        'number-theory',
        'topology',
        'logic',
        'dynamics',
        'optimization',
        'numerical',
        'applied',
        'constants',
        'symbols',
        'theorems',
      ];

      for (const field of mockFields) {
        expect(validIds).toContain(field.id);
      }
    });

    it('all fields should have bilingual names', () => {
      for (const field of mockFields) {
        expect(field.name.ko).toBeTruthy();
        expect(field.name.en).toBeTruthy();
      }
    });

    it('all fields should have bilingual descriptions', () => {
      for (const field of mockFields) {
        expect(field.description.ko).toBeTruthy();
        expect(field.description.en).toBeTruthy();
      }
    });

    it('all fields should have valid icon', () => {
      for (const field of mockFields) {
        expect(field.icon).toBeTruthy();
        // Icon should be an emoji or character
        expect(field.icon.length).toBeGreaterThan(0);
      }
    });

    it('all fields should have valid color', () => {
      const validColors = ['blue', 'purple', 'green', 'red', 'orange', 'yellow', 'pink', 'gray'];

      for (const field of mockFields) {
        expect(validColors).toContain(field.color);
      }
    });

    it('all fields should have positive concept count', () => {
      for (const field of mockFields) {
        expect(field.conceptCount).toBeGreaterThan(0);
      }
    });
  });

  describe('Map lookup performance', () => {
    it('fieldsById should have O(1) lookup', () => {
      expect(fieldsById.size).toBe(5);

      // Direct map lookup should be faster than array find
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        fieldsById.get('algebra');
      }
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100); // Should be very fast
    });
  });

  describe('edge cases', () => {
    it('should handle field ID with hyphen', () => {
      // Testing with a hypothetical field with hyphen in ID
      const testFieldsById = new Map<string, Field>([
        [
          'linear-algebra',
          {
            id: 'linear-algebra' as MathField,
            name: { ko: '선형대수학', en: 'Linear Algebra' },
            description: { ko: '설명', en: 'Description' },
            icon: '📊',
            color: 'blue',
            conceptCount: 40,
          },
        ],
      ]);

      const field = testFieldsById.get('linear-algebra');
      expect(field?.id).toBe('linear-algebra');
    });

    it('should handle Korean text in name', () => {
      const field = getFieldById('foundations');
      expect(field?.name.ko).toBe('기초');
    });

    it('should handle emoji icon', () => {
      const field = getFieldById('probability');
      expect(field?.icon).toBe('🎲');
    });
  });
});
