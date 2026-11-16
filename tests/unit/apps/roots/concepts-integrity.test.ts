import { describe, expect, it } from 'vitest';
import {
  allConcepts,
  conceptsByField,
  getConceptById,
  lightConceptsByField,
} from '../../../../apps/roots/app/data/concepts';
import { filterConcepts } from '../../../../apps/roots/app/lib/concept-filters';
import { fields } from '../../../../apps/roots/app/data/fields';

describe('Roots concept integrity', () => {
  it('lists each route once and uses the same content as its detail page', () => {
    expect(new Set(allConcepts.map(({ id }) => id)).size).toBe(allConcepts.length);
    for (const concept of allConcepts) expect(getConceptById(concept.id)).toBe(concept);
  });
  it('keeps every original field membership in the browse lists without duplicate routes', () => {
    for (const [field, concepts] of conceptsByField) {
      const browseConcepts = lightConceptsByField.get(field) ?? [];
      expect(browseConcepts.map(({ id }) => id)).toEqual(concepts.map(({ id }) => id));
      expect(new Set(browseConcepts.map(({ id }) => id)).size).toBe(browseConcepts.length);
    }
  });

  it('finds shared concepts in their original fields in either language', () => {
    const foundations = lightConceptsByField.get('foundations') ?? [];
    for (const query of ['prime', '소수']) {
      expect(filterConcepts(foundations, { query }).map(({ id }) => id)).toContain(
        'prime-numbers',
      );
    }
  });

  it('places every concept in at least one visible field', () => {
    const visibleIds = new Set(
      fields.flatMap(({ id }) => (conceptsByField.get(id) ?? []).map((concept) => concept.id)),
    );
    expect(allConcepts.filter(({ id }) => !visibleIds.has(id)).map(({ id }) => id)).toEqual([]);
    expect(conceptsByField.get('algebra')?.map(({ id }) => id)).toContain('group-theory');
    expect(conceptsByField.get('probability')?.map(({ id }) => id)).toContain('confidence-interval');
  });
});
