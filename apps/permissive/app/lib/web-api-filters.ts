import { LIMITS } from '@soundblue/core/validation';
import type { WebAPI } from '../data/web-apis';

export function filterWebApis(apis: readonly WebAPI[], query: string): WebAPI[] {
  const normalizedQuery = query.trim().toLowerCase().slice(0, LIMITS.SEARCH_LENGTH);
  if (!normalizedQuery) return [...apis];

  return apis.filter(
    (api) =>
      api.name.toLowerCase().includes(normalizedQuery) ||
      api.description.toLowerCase().includes(normalizedQuery) ||
      api.descriptionKo.includes(normalizedQuery),
  );
}
