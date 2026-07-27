import type { Language } from '@soundblue/i18n';
import type { LightConcept } from '../data/concepts';

export interface ConceptFilterOptions {
  field?: string;
  query?: string;
}

export function filterConcepts(
  concepts: readonly LightConcept[],
  { field = '', query = '' }: ConceptFilterOptions,
): LightConcept[] {
  const normalizedQuery = query.trim().toLowerCase();

  return concepts.filter((concept) => {
    const matchesQuery =
      !normalizedQuery ||
      concept.name.en.toLowerCase().includes(normalizedQuery) ||
      concept.name.ko.toLowerCase().includes(normalizedQuery) ||
      concept.def.en.toLowerCase().includes(normalizedQuery) ||
      concept.def.ko.toLowerCase().includes(normalizedQuery);
    const matchesField = !field || concept.field === field;

    return matchesQuery && matchesField;
  });
}

export function searchConcepts(
  concepts: readonly LightConcept[],
  query: string,
  locale: Language,
  limit = 30,
): LightConcept[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length < 2) return [];

  return concepts
    .filter(
      (concept) =>
        concept.name[locale].toLowerCase().includes(normalizedQuery) ||
        concept.name[locale === 'ko' ? 'en' : 'ko'].toLowerCase().includes(normalizedQuery) ||
        concept.def[locale].toLowerCase().includes(normalizedQuery) ||
        concept.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)),
    )
    .slice(0, limit);
}
