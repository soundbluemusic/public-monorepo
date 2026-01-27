/**
 * Context App Hooks
 *
 * @example
 * ```ts
 * import { useEntry, usePrefetchEntry, useHomonyms, useStudyData, useIsActiveRoute } from '@/hooks';
 * ```
 */

export { type SortOption, useBrowseByCategory, useBrowseChunk } from './useBrowseQuery';
// Query Hooks (TanStack Query)
export { useEntry, usePrefetchEntry } from './useEntry';
export { clearChunkCache, preloadChunk, useEntryLoader } from './useEntryLoader';
export { useHomonyms } from './useHomonyms';
// Navigation Hooks
export { useIsActiveRoute } from './useIsActiveRoute';
// Data Hooks
export { type ProgressData, type UseStudyDataResult, useStudyData } from './useStudyData';
