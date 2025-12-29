/**
 * Search Utilities
 */

// Search query length limit
const SEARCH_LENGTH = 100;

/**
 * Sanitizes a search query by trimming, lowercasing, and limiting length
 */
export function sanitizeSearchQuery(query: string): string {
  const safeQuery = query ?? '';
  return safeQuery.toLowerCase().trim().slice(0, SEARCH_LENGTH);
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

/**
 * Highlights matching text with mark tags
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escapes special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
