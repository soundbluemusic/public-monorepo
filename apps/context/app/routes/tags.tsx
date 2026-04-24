/**
 * @fileoverview 모든 태그 목록 페이지 (영어)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import {
  buildTagsRouteHead,
  type TagsLoaderData,
  TagsPageContent,
  tagsRouteLoader,
} from '@/components/pages/TagsPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/tags')({
  loader: tagsRouteLoader,
  head: dynamicHeadFactoryEn<TagsLoaderData>(buildTagsRouteHead, APP_CONFIG.baseUrl),
  component: function TagsPage() {
    const { tags, totalCount } = Route.useLoaderData();
    return <TagsPageContent tags={tags} totalCount={totalCount} />;
  },
});
