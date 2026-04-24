/**
 * @fileoverview 태그별 개념 목록 페이지 (영어)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import {
  buildTagRouteHead,
  type TagLoaderData,
  TagPage,
  tagCanonicalPath,
  tagRouteLoader,
} from '../../components/pages';
import { APP_CONFIG } from '../../config';

export const Route = createFileRoute('/tag/$tagId')({
  loader: tagRouteLoader,
  head: dynamicHeadFactoryEn<TagLoaderData>(
    buildTagRouteHead,
    APP_CONFIG.baseUrl,
    tagCanonicalPath,
    { trailingSlash: true },
  ),
  component: TagPageWrapper,
});

function TagPageWrapper() {
  const { tag, concepts, relatedTags } = Route.useLoaderData();
  return <TagPage tag={tag} concepts={concepts} relatedTags={relatedTags} />;
}
