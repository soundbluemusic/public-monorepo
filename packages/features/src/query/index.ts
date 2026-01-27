/**
 * TanStack Query 모듈
 *
 * @example
 * ```ts
 * import { QueryProvider, queryKeys, getQueryClient } from '@soundblue/features/query';
 * ```
 */

// TanStack Query 타입/훅 re-export (편의성)
export {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
export { createQueryClient, getQueryClient } from './client';
export { type QueryKeys, queryKeys } from './keys';
export { QueryProvider } from './provider';
