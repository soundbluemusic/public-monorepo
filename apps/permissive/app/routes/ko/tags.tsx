/**
 * @fileoverview 모든 태그 목록 페이지 (한국어)
 */

import { headFactoryKo } from '@soundblue/seo/meta';
import { Breadcrumb, TagCloud } from '@soundblue/ui/components';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Tags } from 'lucide-react';
import DocsLayout from '../../components/layout/DocsLayout';
import { allLibraryTags, totalLibraryTagCount } from '../../data/libraries';

export const Route = createFileRoute('/ko/tags')({
  head: headFactoryKo(
    {
      ko: {
        title: '태그 목록 | Permissive',
        description: `${totalLibraryTagCount}개의 태그로 라이브러리 탐색하기`,
        keywords: ['라이브러리 태그', '태그 목록', '오픈소스', 'library tags'],
      },
      en: {
        title: 'All Tags | Permissive',
        description: `Browse ${totalLibraryTagCount} tags to explore libraries`,
        keywords: ['library tags', 'tag list', 'open source', 'free libraries'],
      },
    },
    'https://permissive.soundbluemusic.com',
  ),
  component: TagsPage,
});

function TagsPage() {
  const tagsWithHref = allLibraryTags.map((t) => ({
    ...t,
    href: `/ko/tag/${encodeURIComponent(t.tag)}`,
  }));

  return (
    <DocsLayout>
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
            {totalLibraryTagCount}개의 태그로 라이브러리를 탐색하세요
          </p>
        </header>

        {/* Tag Cloud */}
        <section className="mb-8">
          <TagCloud tags={tagsWithHref} variant="cloud" showCounts size="default" sortByCount />
        </section>

        {/* Stats */}
        <section className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
          <h2 className="font-medium text-(--text-primary) mb-2">통계</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-(--text-secondary)">총 태그 수</span>
              <p className="font-semibold text-(--text-primary)">{totalLibraryTagCount}</p>
            </div>
            <div>
              <span className="text-(--text-secondary)">가장 많은 태그</span>
              <p className="font-semibold text-(--text-primary)">
                #{allLibraryTags[0]?.tag} ({allLibraryTags[0]?.count})
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
