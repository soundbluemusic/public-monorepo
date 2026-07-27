import {
  filterConcepts,
  searchConcepts,
} from '../../../../apps/roots/app/lib/concept-filters';
import type { LightConcept } from '../../../../apps/roots/app/data/concepts';
import { describe, expect, it } from 'vitest';

const concepts: LightConcept[] = [
  {
    id: 'addition',
    name: { en: 'Addition', ko: '덧셈' },
    field: 'foundations',
    subfield: 'arithmetic',
    difficulty: 1,
    def: { en: 'Combining quantities', ko: '수량을 합치는 연산' },
    tags: ['arithmetic', 'sum'],
  },
  {
    id: 'group',
    name: { en: 'Group', ko: '군' },
    field: 'algebra',
    subfield: 'abstract-algebra',
    difficulty: 4,
    def: { en: 'A set with a binary operation', ko: '이항 연산을 가진 집합' },
    tags: ['algebra', 'structure'],
  },
];

describe('filterConcepts', () => {
  it('filters by query in either locale', () => {
    expect(filterConcepts(concepts, { query: 'combining' }).map(({ id }) => id)).toEqual([
      'addition',
    ]);
    expect(filterConcepts(concepts, { query: '이항' }).map(({ id }) => id)).toEqual(['group']);
  });

  it('combines field and query filters', () => {
    expect(
      filterConcepts(concepts, { field: 'algebra', query: 'group' }).map(({ id }) => id),
    ).toEqual(['group']);
    expect(filterConcepts(concepts, { field: 'foundations', query: 'group' })).toEqual([]);
  });
});

describe('searchConcepts', () => {
  it('requires two characters and respects locale text', () => {
    expect(searchConcepts(concepts, 'a', 'en')).toEqual([]);
    expect(searchConcepts(concepts, '덧셈', 'ko').map(({ id }) => id)).toEqual(['addition']);
  });

  it('matches alternate locale names and tags', () => {
    expect(searchConcepts(concepts, 'group', 'ko').map(({ id }) => id)).toEqual(['group']);
    expect(searchConcepts(concepts, 'sum', 'en').map(({ id }) => id)).toEqual(['addition']);
  });

  it('honors the result limit without mutating input', () => {
    const original = [...concepts];
    expect(searchConcepts(concepts, 'a', 'en', 1)).toEqual([]);
    expect(searchConcepts(concepts, 'al', 'en', 1)).toHaveLength(1);
    expect(concepts).toEqual(original);
  });
});
