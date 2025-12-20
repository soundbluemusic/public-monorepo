import { LIMITS } from './constants';

/**
 * Sanitizes a search query by trimming, lowercasing, and limiting length
 */
export function sanitizeSearchQuery(query: string): string {
  return query.toLowerCase().trim().slice(0, LIMITS.SEARCH_LENGTH);
}

/**
 * Filters items by a search query
 */
export function filterBySearch<T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string[],
): T[] {
  const q = sanitizeSearchQuery(query);
  if (!q) return items;

  return items.filter((item) =>
    getSearchableText(item).some((text) => text.toLowerCase().includes(q)),
  );
}

/**
 * Creates a debounced search handler
 */
export function createSearchHandler(
  callback: (query: string) => void,
  delay = 300,
): (query: string) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (query: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(sanitizeSearchQuery(query));
    }, delay);
  };
}
