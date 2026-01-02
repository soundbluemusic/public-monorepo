/**
 * Search Utilities
 *
 * This module provides core search functionality for the @soundblue/search package.
 * All functions are pure and environment-agnostic (work in both Node.js and browser).
 *
 * @module @soundblue/search/core/utils
 * @see {@link https://github.com/soundbluemusic/public-monorepo/tree/main/packages/search | Package Documentation}
 */

/**
 * Maximum length for search queries.
 * Prevents excessive memory usage and ensures consistent behavior.
 * Matches LIMITS.SEARCH_LENGTH from @soundblue/core/validation.
 *
 * @constant {number}
 */
const SEARCH_LENGTH = 100;

/**
 * Sanitizes a search query for safe and consistent searching.
 *
 * Performs the following transformations:
 * 1. Handles null/undefined by converting to empty string
 * 2. Converts to lowercase for case-insensitive matching
 * 3. Trims leading and trailing whitespace
 * 4. Truncates to maximum length (100 characters)
 *
 * @param query - The raw search query string to sanitize
 * @returns The sanitized query string, safe for use in search operations
 *
 * @example Basic usage
 * ```typescript
 * sanitizeSearchQuery('  Hello World  ');
 * // Returns: 'hello world'
 * ```
 *
 * @example Handles null/undefined
 * ```typescript
 * sanitizeSearchQuery(null as unknown as string);
 * // Returns: ''
 * ```
 *
 * @example Korean text (preserved as-is)
 * ```typescript
 * sanitizeSearchQuery('안녕하세요');
 * // Returns: '안녕하세요'
 * ```
 *
 * @example Long query truncation
 * ```typescript
 * sanitizeSearchQuery('a'.repeat(150));
 * // Returns: 'a'.repeat(100) (truncated to 100 chars)
 * ```
 */
export function sanitizeSearchQuery(query: string): string {
  const safeQuery = query ?? '';
  return safeQuery.toLowerCase().trim().slice(0, SEARCH_LENGTH);
}

/**
 * Filters an array of items by matching a search query against searchable text fields.
 *
 * This is a simple substring-based filter suitable for small datasets (< 1000 items).
 * For larger datasets or advanced features (fuzzy matching, ranking), use {@link SearchEngine}.
 *
 * @typeParam T - The type of items in the array
 * @param items - The array of items to filter
 * @param query - The search query string (will be sanitized automatically)
 * @param getSearchableText - A function that extracts searchable text strings from an item
 * @returns A new array containing only items that match the query.
 *          Returns the original array if query is empty or whitespace-only.
 *
 * @example Basic filtering by name
 * ```typescript
 * const fruits = [
 *   { id: 1, name: 'Apple', color: 'red' },
 *   { id: 2, name: 'Banana', color: 'yellow' },
 *   { id: 3, name: 'Orange', color: 'orange' },
 * ];
 *
 * const result = filterBySearch(fruits, 'app', (item) => [item.name]);
 * // Returns: [{ id: 1, name: 'Apple', color: 'red' }]
 * ```
 *
 * @example Filtering by multiple fields
 * ```typescript
 * const result = filterBySearch(fruits, 'orange', (item) => [item.name, item.color]);
 * // Returns: [{ id: 3, name: 'Orange', color: 'orange' }]
 * ```
 *
 * @example Case-insensitive matching
 * ```typescript
 * const result = filterBySearch(fruits, 'APPLE', (item) => [item.name]);
 * // Returns: [{ id: 1, name: 'Apple', color: 'red' }]
 * ```
 *
 * @example Empty query returns all items
 * ```typescript
 * const result = filterBySearch(fruits, '', (item) => [item.name]);
 * // Returns: all 3 fruits
 * ```
 *
 * @see {@link sanitizeSearchQuery} for query sanitization details
 * @see {@link SearchEngine} for advanced search with fuzzy matching and ranking
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
 * Creates a debounced search handler that automatically sanitizes queries.
 *
 * This is useful for search inputs where you want to delay the search operation
 * until the user stops typing, preventing excessive API calls or re-renders.
 *
 * The returned handler:
 * - Debounces rapid calls (only the last call within the delay window executes)
 * - Automatically sanitizes the query via {@link sanitizeSearchQuery}
 * - Clears pending timeouts on new input
 *
 * @param callback - The function to call with the sanitized query after debounce
 * @param delay - The debounce delay in milliseconds (default: 300ms)
 * @returns A debounced handler function that accepts a raw query string
 *
 * @example Basic usage with React
 * ```typescript
 * function SearchInput() {
 *   const [results, setResults] = useState([]);
 *
 *   // Create stable handler (useMemo to avoid recreation)
 *   const handleSearch = useMemo(
 *     () => createSearchHandler((query) => {
 *       // This runs 300ms after the user stops typing
 *       fetchResults(query).then(setResults);
 *     }),
 *     []
 *   );
 *
 *   return <input onChange={(e) => handleSearch(e.target.value)} />;
 * }
 * ```
 *
 * @example Custom delay for instant feedback
 * ```typescript
 * // 100ms delay for faster response
 * const fastHandler = createSearchHandler((query) => {
 *   console.log('Searching for:', query);
 * }, 100);
 *
 * fastHandler('h');        // Timer starts
 * fastHandler('he');       // Timer resets
 * fastHandler('hello');    // Timer resets
 * // 100ms later: logs "Searching for: hello"
 * ```
 *
 * @example Query sanitization is automatic
 * ```typescript
 * const handler = createSearchHandler((query) => {
 *   console.log(query);
 * });
 *
 * handler('  HELLO WORLD  ');
 * // After 300ms, logs: "hello world" (trimmed and lowercased)
 * ```
 *
 * @see {@link sanitizeSearchQuery} for query sanitization details
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
 * Highlights matching portions of text by wrapping them in `<mark>` tags.
 *
 * This function performs case-insensitive matching and preserves the original
 * case of the matched text. Special regex characters in the query are escaped
 * to prevent regex injection.
 *
 * @param text - The text to search within and highlight
 * @param query - The search query to highlight (case-insensitive)
 * @returns The text with matching portions wrapped in `<mark>` tags.
 *          Returns the original text if query is empty.
 *
 * @example Basic highlighting
 * ```typescript
 * highlightMatch('Hello World', 'world');
 * // Returns: 'Hello <mark>World</mark>'
 * ```
 *
 * @example Multiple matches
 * ```typescript
 * highlightMatch('apple pie with apple', 'apple');
 * // Returns: '<mark>apple</mark> pie with <mark>apple</mark>'
 * ```
 *
 * @example Case preservation
 * ```typescript
 * highlightMatch('HELLO hello Hello', 'hello');
 * // Returns: '<mark>HELLO</mark> <mark>hello</mark> <mark>Hello</mark>'
 * ```
 *
 * @example Special characters are escaped
 * ```typescript
 * highlightMatch('price is $100', '$100');
 * // Returns: 'price is <mark>$100</mark>'
 * // ($ is escaped, not treated as regex anchor)
 * ```
 *
 * @example Empty query returns original text
 * ```typescript
 * highlightMatch('Hello World', '');
 * // Returns: 'Hello World'
 * ```
 *
 * @example Usage with React (dangerouslySetInnerHTML)
 * ```tsx
 * function SearchResult({ text, query }: { text: string; query: string }) {
 *   return (
 *     <span
 *       dangerouslySetInnerHTML={{ __html: highlightMatch(text, query) }}
 *     />
 *   );
 * }
 * ```
 *
 * @security The query is escaped using {@link escapeRegex} to prevent regex injection.
 *           However, the text is NOT sanitized for HTML. If you're rendering user-generated
 *           content, sanitize the text first or use a safe rendering method.
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escapes special regex characters in a string.
 *
 * This prevents regex injection when using user input in RegExp constructors.
 * All characters that have special meaning in regular expressions are escaped
 * with a backslash.
 *
 * Escaped characters: . * + ? ^ $ { } ( ) | [ ] \
 *
 * @param str - The string containing potential regex special characters
 * @returns The string with all regex special characters escaped
 *
 * @example
 * ```typescript
 * escapeRegex('hello.world');  // Returns: 'hello\\.world'
 * escapeRegex('$100');         // Returns: '\\$100'
 * escapeRegex('a+b=c');        // Returns: 'a\\+b=c'
 * escapeRegex('[test]');       // Returns: '\\[test\\]'
 * ```
 *
 * @internal This is a private utility function used by {@link highlightMatch}
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
