/**
 * @fileoverview 찾아보기 페이지 - 한국어 버전 (TanStack Start + TanStack Query Hydration)
 */

import { dehydrate, HydrationBoundary, QueryClient, queryKeys } from '@soundblue/features/query';
import { headFactory } from '@soundblue/seo/meta';
import type { DehydratedState } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  type BrowseMetadata,
  BrowsePageContent,
  browseMeta,
} from '@/components/pages/BrowsePageContent';
import { APP_CONFIG } from '@/config';
import { BROWSE_CHUNK_SIZE } from '@/constants';
import { categories } from '@/data/categories';
import { jsonEntriesCount, loadLightEntriesChunkForSSR } from '@/data/entries';

interface LoaderData {
  dehydratedState: DehydratedState;
  meta: BrowseMetadata;
  categories: typeof categories;
}

export const Route = createFileRoute('/ko/browse')({
  loader: async (): Promise<LoaderData> => {
    const queryClient = new QueryClient();

    // SSR에서만 첫 청크를 Query 캐시에 prefetch
    if (typeof window === 'undefined') {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.browse.chunk('alphabetical', 0),
        queryFn: () => loadLightEntriesChunkForSSR('alphabetical', 0),
      });
    }

    const meta: BrowseMetadata = {
      totalEntries: jsonEntriesCount,
      chunkSize: BROWSE_CHUNK_SIZE,
      totalChunks: Math.ceil(jsonEntriesCount / BROWSE_CHUNK_SIZE),
      sortTypes: ['alphabetical', 'category', 'recent'],
      generatedAt: new Date().toISOString(),
    };

    return {
      dehydratedState: dehydrate(queryClient),
      meta,
      categories,
    };
  },
  head: headFactory(browseMeta, APP_CONFIG.baseUrl),
  component: BrowsePage,
});

function BrowsePage() {
  const { dehydratedState, meta, categories: cats } = Route.useLoaderData();

  return (
    <HydrationBoundary state={dehydratedState}>
      <BrowsePageContent meta={meta} categories={cats} />
    </HydrationBoundary>
  );
}
