/**
 * @fileoverview 모든 태그 목록 페이지 (한국어)
 */

import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import { Breadcrumb, TagCloud } from '@soundblue/ui/components';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Tags } from 'lucide-react';
import { Layout } from '@/components/layout';
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
  component: TagsPage,
});

function TagsPage() {
  const { tags, totalCount } = Route.useLoaderData();

  const tagsWithHref = tags.map((t) => ({
    ...t,
    href: `/ko/tag/${encodeURIComponent(t.tag)}`,
  }));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: '태그' }]}
          showHome
          homeLabel="홈"
          homePath="/ko"
          LinkComponent={Link}
          className="mb-6"
        />

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Tags className="size-8 text-(--accent-primary)" />
            <h1 className="text-3xl font-bold text-(--text-primary)">모든 태그</h1>
          </div>
          <p className="text-(--text-secondary)">
            {totalCount}개의 태그로 한국어 단어를 탐색하세요
          </p>
        </header>

        {/* Tag Cloud */}
        <section className="mb-8">
          <TagCloud tags={tagsWithHref} variant="cloud" showCounts size="default" sortByCount />
        </section>

        {/* Stats */}
        {tags.length > 0 && (
          <section className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
            <h2 className="font-medium text-(--text-primary) mb-2">통계</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-(--text-secondary)">총 태그 수</span>
                <p className="font-semibold text-(--text-primary)">{totalCount}</p>
              </div>
              <div>
                <span className="text-(--text-secondary)">가장 많은 태그</span>
                <p className="font-semibold text-(--text-primary)">
                  #{tags[0]?.tag} ({tags[0]?.count})
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
