/**
 * @fileoverview 다운로드 페이지 - 영어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import {
  DownloadPageContent,
  type DownloadStats,
  downloadMeta,
} from '@/components/pages/DownloadPageContent';
import { APP_CONFIG } from '@/config';
import { categories } from '@/data/categories';
import { conversations } from '@/data/conversations';
import { jsonEntriesCount } from '@/data/entries';

interface LoaderData {
  stats: DownloadStats;
}

export const Route = createFileRoute('/download')({
  loader: async (): Promise<LoaderData> => {
    return {
      stats: {
        totalEntries: jsonEntriesCount,
        totalCategories: categories.length,
        totalConversations: conversations.length,
      },
    };
  },
  head: headFactory(downloadMeta, APP_CONFIG.baseUrl),
  component: DownloadPage,
});

function DownloadPage() {
  const { stats } = Route.useLoaderData();
  return <DownloadPageContent stats={stats} />;
}
