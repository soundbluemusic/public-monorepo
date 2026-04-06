/**
 * @fileoverview 모든 태그 목록 페이지 (한국어)
 */

import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { TagsPageContent } from '@/components/pages/TagsPageContent';
import type { TagWithCount } from '@/services/d1';
import { fetchAllTagsFromD1 } from '@/services/d1-server';

type LoaderData = {
  tags: TagWithCount[];
  totalCount: number;
};

export const Route = createFileRoute('/ko/tags')({
  loader: async () => {
    const tags = await fetchAllTagsFromD1();
    return { tags, totalCount: tags.length };
  },
  head: dynamicHeadFactoryKo<LoaderData>((data) => {
    const count = data?.totalCount || 0;
    return {
      ko: {
        title: '태그 목록 | Context',
        description: `${count}개의 태그로 한국어 단어 탐색하기`,
        keywords: ['한국어 태그', '태그 목록', '한국어 단어', 'Korean tags'],
      },
      en: {
        title: 'All Tags | Context Korean Dictionary',
        description: `Browse ${count} tags to explore Korean vocabulary`,
        keywords: ['Korean tags', 'tag list', 'Korean vocabulary', 'learn Korean'],
      },
    };
  }, 'https://context.soundbluemusic.com'),
  component: function TagsPage() {
    const { tags, totalCount } = Route.useLoaderData();
    return <TagsPageContent tags={tags} totalCount={totalCount} />;
  },
});
