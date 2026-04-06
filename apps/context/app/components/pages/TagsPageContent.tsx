/**
 * @fileoverview Tags 목록 페이지 공유 컴포넌트
 *
 * 영어/한국어 라우트 파일에서 공통으로 사용하는 UI 컴포넌트입니다.
 * useI18n()을 통해 locale에 따라 자동으로 번역된 텍스트를 표시합니다.
 */

import { Breadcrumb, TagCloud } from '@soundblue/ui/components';
import { Link } from '@tanstack/react-router';
import { Tags } from 'lucide-react';
import { Layout } from '@/components/layout';
import type { TagWithCount } from '@/services/d1';
import { useI18n } from '@/i18n';

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
