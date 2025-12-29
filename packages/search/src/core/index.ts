/**
 * @soundblue/search - Core
 */

export { SearchEngine } from './engine';
export type {
  SearchableItem,
  SearchConfig,
  SearchResult,
  WorkerMessage,
  WorkerMessageType,
} from './types';
export {
  createSearchHandler,
  filterBySearch,
  highlightMatch,
  sanitizeSearchQuery,
} from './utils';
