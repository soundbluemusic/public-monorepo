/**
 * @fileoverview 대화 예문 카테고리 페이지 - 한국어 버전 (TanStack Start)
 */

import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import {
  buildConversationDetailRouteHead,
  ConversationDetailContent,
  type ConversationDetailLoaderData,
  conversationDetailCanonicalPath,
  conversationDetailRouteLoader,
} from '@/components/pages/ConversationDetailContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/ko/conversations/$categoryId')({
  loader: conversationDetailRouteLoader,
  head: dynamicHeadFactoryKo<ConversationDetailLoaderData>(
    buildConversationDetailRouteHead,
    APP_CONFIG.baseUrl,
    conversationDetailCanonicalPath,
  ),
  component: ConversationsCategoryPage,
});

function ConversationsCategoryPage() {
  const loaderData = Route.useLoaderData();
  return <ConversationDetailContent {...loaderData} />;
}
