/**
 * @fileoverview 모든 태그 목록 페이지 (한국어)
 */

import { headFactoryKo } from '@soundblue/seo/meta';
import { TagCloud } from '@soundblue/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { Tags } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { allTags, totalTagCount } from '../../data/concepts';
import { useI18n } from '../../i18n';

export const Route = createFileRoute('/ko/tags')({
  head: headFactoryKo(
    {
      ko: {
        title: '태그 목록 | Roots',
        description: `${totalTagCount}개의 태그로 수학 개념 탐색하기`,
        keywords: ['수학 태그', '태그 목록', '수학 개념', 'math tags'],
      },
      en: {
        title: 'All Tags | Roots',
        description: `Browse ${totalTagCount} tags to explore math concepts`,
        keywords: ['math tags', 'tag list', 'math concepts', 'mathematics'],
      },
    },
    'https://roots.soundbluemusic.com',
  ),
  component: TagsPage,
});

function TagsPage() {
  const { locale, localePath } = useI18n();

  const tagsWithHref = allTags.map((t) => ({
    ...t,
    href: localePath(`/tag/${encodeURIComponent(t.tag)}`),
  }));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Tags className="size-8 text-(--accent-primary)" />
            <h1 className="text-3xl font-bold text-(--text-primary)">
              {locale === 'ko' ? '모든 태그' : 'All Tags'}
            </h1>
          </div>
          <p className="text-(--text-secondary)">
            {locale === 'ko'
              ? `${totalTagCount}개의 태그로 수학 개념을 탐색하세요`
              : `Explore math concepts through ${totalTagCount} tags`}
          </p>
        </header>

        {/* Tag Cloud */}
        <section className="mb-8">
          <TagCloud tags={tagsWithHref} variant="cloud" showCounts size="default" sortByCount />
        </section>

        {/* Stats */}
        <section className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
          <h2 className="font-medium text-(--text-primary) mb-2">
            {locale === 'ko' ? '통계' : 'Statistics'}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-(--text-secondary)">
                {locale === 'ko' ? '총 태그 수' : 'Total Tags'}
              </span>
              <p className="font-semibold text-(--text-primary)">{totalTagCount}</p>
            </div>
            <div>
              <span className="text-(--text-secondary)">
                {locale === 'ko' ? '가장 많은 태그' : 'Most Used Tag'}
              </span>
              <p className="font-semibold text-(--text-primary)">
                #{allTags[0]?.tag} ({allTags[0]?.count})
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
