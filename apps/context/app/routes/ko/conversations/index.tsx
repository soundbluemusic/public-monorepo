/**
 * @fileoverview 대화 예문 인덱스 페이지 - 한국어 버전 (TanStack Start)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { ConversationsIndexContent } from '@/components/pages/ConversationsIndexContent';
import { APP_CONFIG } from '@/config';
import { getCategoryById } from '@/data/categories';
import { getCategoriesWithConversations, getConversationsByCategory } from '@/data/conversations';
import type { Category } from '@/data/types';

interface LoaderData {
  categoriesWithCount: { category: Category; count: number }[];
}

export const Route = createFileRoute('/ko/conversations/')({
  loader: async (): Promise<LoaderData> => {
    const categoryIds = getCategoriesWithConversations();
    const categoriesWithCount = categoryIds
      .map((id) => {
        const category = getCategoryById(id);
        const conversations = getConversationsByCategory(id);
        return category ? { category, count: conversations.length } : null;
      })
      .filter((item): item is { category: Category; count: number } => item !== null)
      .sort((a, b) => a.category.order - b.category.order);

    return { categoriesWithCount };
  },
  head: headFactory(
    {
      ko: {
        title: '대화 예문 | Context',
        description: '일상 상황별 한국어 대화 예문으로 자연스러운 한국어를 배워보세요',
      },
      en: {
        title: 'Conversations | Context',
        description: 'Learn natural Korean with conversation examples for everyday situations',
      },
    },
    APP_CONFIG.baseUrl,
  ),
  component: ConversationsIndexPage,
});

function ConversationsIndexPage() {
  const loaderData = Route.useLoaderData();
  return <ConversationsIndexContent {...loaderData} />;
}
