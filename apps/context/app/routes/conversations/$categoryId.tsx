/**
 * @fileoverview 대화 예문 카테고리 페이지 - 영어 버전 (TanStack Start)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { ConversationDetailContent } from '@/components/pages/ConversationDetailContent';
import { APP_CONFIG } from '@/config';
import { getCategoryById } from '@/data/categories';
import { getConversationsByCategory } from '@/data/conversations';
import type { Category, Conversation } from '@/data/types';

interface LoaderData {
  category: Category;
  conversations: Conversation[];
}

export const Route = createFileRoute('/conversations/$categoryId')({
  loader: async ({ params }): Promise<LoaderData> => {
    const category = getCategoryById(params.categoryId);

    if (!category) {
      throw notFound();
    }

    const conversations = getConversationsByCategory(params.categoryId);
    return { category, conversations };
  },
  head: dynamicHeadFactoryEn<LoaderData>(
    (data) => {
      if (!data?.category) {
        return {
          ko: { title: 'Not Found | Context' },
          en: { title: 'Not Found | Context' },
        };
      }
      const { category, conversations } = data;
      return {
        ko: {
          title: `${category.name.ko} 대화 | Context`,
          description: `${category.name.ko} 상황의 ${conversations.length}개 한국어 대화 예문`,
        },
        en: {
          title: `${category.name.en} Conversations | Context`,
          description: `${conversations.length} Korean conversation examples for ${category.name.en} situations`,
        },
      };
    },
    APP_CONFIG.baseUrl,
    (data) => `/conversations/${data.category.id}`,
  ),
  component: ConversationsCategoryPage,
});

function ConversationsCategoryPage() {
  const loaderData = Route.useLoaderData();
  return <ConversationDetailContent {...loaderData} />;
}
