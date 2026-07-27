import { LIMITS } from '@soundblue/core/validation';
import type { Library } from '../data/libraries';

export interface LibraryFilterOptions {
  category?: string;
  query?: string;
}

export function filterLibraries(
  libraries: readonly Library[],
  { category, query }: LibraryFilterOptions,
): Library[] {
  const normalizedQuery = query?.trim().toLowerCase().slice(0, LIMITS.SEARCH_LENGTH) ?? '';

  return libraries.filter((library) => {
    const matchesCategory = !category || library.categories.includes(category);
    const matchesSearch =
      !normalizedQuery ||
      library.name.toLowerCase().includes(normalizedQuery) ||
      library.description.toLowerCase().includes(normalizedQuery) ||
      library.descriptionKo.includes(normalizedQuery) ||
      library.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesSearch;
  });
}
