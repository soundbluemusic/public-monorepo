/**
 * @fileoverview 태그별 엔트리 목록 페이지 (영어)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import {
  buildTagRouteHead,
  type TagLoaderData,
  TagPageContent,
  tagCanonicalPath,
  tagRouteLoader,
} from '@/components/pages/TagPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/tag/$tagId')({
  loader: tagRouteLoader,
  head: dynamicHeadFactoryEn<TagLoaderData>(
    buildTagRouteHead,
    APP_CONFIG.baseUrl,
    tagCanonicalPath,
  ),
  component: function TagPage() {
    const { tag, entries, relatedTags } = Route.useLoaderData();
    return <TagPageContent tag={tag} entries={entries} relatedTags={relatedTags} />;
  },
});
