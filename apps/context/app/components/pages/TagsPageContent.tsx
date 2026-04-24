/**
 * @fileoverview Tags 목록 페이지 공유 컴포넌트 + 라우트 헬퍼
 */

import { Breadcrumb, TagCloud } from '@soundblue/ui/components';
import { Link } from '@tanstack/react-router';
import { Tags } from 'lucide-react';
import { Layout } from '@/components/layout';
import { useI18n } from '@/i18n';
import type { TagWithCount } from '@/services/d1';
import { fetchAllTagsFromD1 } from '@/services/d1-server';

export type TagsLoaderData = {
  tags: TagWithCount[];
  totalCount: number;
};

/** `tags` 라우트 쌍이 공유하는 loader. locale 무관. */
export async function tagsRouteLoader(): Promise<TagsLoaderData> {
  const tags = await fetchAllTagsFromD1();
  return { tags, totalCount: tags.length };
}

/** `dynamicHeadFactoryEn/Ko`에 전달되는 head builder. */
export function buildTagsRouteHead(data: TagsLoaderData | undefined) {
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
}

interface TagsPageContentProps {
  tags: TagWithCount[];
  totalCount: number;
}

export function TagsPageContent({ tags, totalCount }: TagsPageContentProps) {
  const { t, localePath } = useI18n();

  const tagsWithHref = tags.map((tag) => ({
    ...tag,
    href: localePath(`/tag/${encodeURIComponent(tag.tag)}`),
  }));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: t('tags') }]}
          showHome
          homeLabel={t('home')}
          homePath={localePath('/')}
          LinkComponent={Link}
          className="mb-6"
        />

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Tags className="size-8 text-(--accent-primary)" />
            <h1 className="text-3xl font-bold text-(--text-primary)">{t('allTags')}</h1>
          </div>
          <p className="text-(--text-secondary)">
            {t('exploreTagsDescription').replace('{count}', String(totalCount))}
          </p>
        </header>

        {/* Tag Cloud */}
        <section className="mb-8">
          <TagCloud tags={tagsWithHref} variant="cloud" showCounts size="default" sortByCount />
        </section>

        {/* Stats */}
        {tags.length > 0 && (
          <section className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
            <h2 className="font-medium text-(--text-primary) mb-2">{t('statistics')}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-(--text-secondary)">{t('totalTags')}</span>
                <p className="font-semibold text-(--text-primary)">{totalCount}</p>
              </div>
              <div>
                <span className="text-(--text-secondary)">{t('mostUsedTag')}</span>
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
