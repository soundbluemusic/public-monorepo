/**
 * @fileoverview 찾아보기 페이지 - 영어 버전 (TanStack Start + Query Hydration)
 */

import { dehydrate, HydrationBoundary, QueryClient, queryKeys } from '@soundblue/features/query';
import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { type BrowseMetadata, BrowsePageContent } from '@/components/pages/BrowsePageContent';
import { APP_CONFIG } from '@/config';
import { BROWSE_CHUNK_SIZE } from '@/constants';
import { categories } from '@/data/categories';
import { jsonEntriesCount, loadLightEntriesChunkForSSR } from '@/data/entries';

interface LoaderData {
  dehydratedState: ReturnType<typeof dehydrate>;
  meta: BrowseMetadata;
  categories: typeof categories;
}

export const Route = createFileRoute('/browse')({
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
  head: headFactory(
    {
      ko: { title: '찾아보기 - Context', description: '모든 한국어 단어 찾아보기 및 필터링' },
      en: { title: 'Browse - Context', description: 'Browse and filter all Korean words' },
    },
    APP_CONFIG.baseUrl,
  ),
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
