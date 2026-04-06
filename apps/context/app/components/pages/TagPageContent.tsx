/**
 * @fileoverview 개별 태그 페이지 공유 컴포넌트
 *
 * 영어/한국어 라우트 파일에서 공통으로 사용하는 UI 컴포넌트입니다.
 * useI18n()을 통해 locale에 따라 자동으로 번역된 텍스트를 표시합니다.
 */

import { Breadcrumb, TagCloud } from '@soundblue/ui/components';
import { Link } from '@tanstack/react-router';
import { Tags } from 'lucide-react';
import { Layout } from '@/components/layout';
import { getCategoryById } from '@/data/categories';
import type { LocaleEntry } from '@/data/types';
import { useI18n } from '@/i18n';

interface TagPageContentProps {
  tag: string;
  entries: LocaleEntry[];
  relatedTags: { tag: string; count: number }[];
}

export function TagPageContent({ tag, entries, relatedTags }: TagPageContentProps) {
  const { t, locale, localePath } = useI18n();

  const relatedTagsWithHref = relatedTags.map((rt) => ({
    ...rt,
    href: localePath(`/tag/${encodeURIComponent(rt.tag)}`),
  }));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: t('tags'), href: localePath('/tags') }, { label: `#${tag}` }]}
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
            <h1 className="text-3xl font-bold text-(--text-primary)">#{tag}</h1>
          </div>
          <p className="text-(--text-secondary)">
            {t('nWords').replace('{count}', String(entries.length))}
          </p>
        </header>

        {/* Related Tags */}
        {relatedTagsWithHref.length > 0 && (
          <section className="mb-8">
            <TagCloud tags={relatedTagsWithHref} title={t('relatedTags')} showCounts size="sm" />
          </section>
        )}

        {/* Entry List */}
        <section>
          <h2 className="text-xl font-semibold text-(--text-primary) mb-4">{t('wordList')}</h2>
          <div className="grid gap-3">
            {entries.map((entry) => {
              const category = getCategoryById(entry.categoryId);
              return (
                <Link
                  key={entry.id}
                  to={localePath(`/entry/${entry.id}`)}
                  className="block p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) hover:border-(--accent-primary) transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-(--text-primary)">{entry.korean}</h3>
                        <span className="text-sm text-(--text-tertiary)">
                          ({entry.romanization})
                        </span>
                      </div>
                      <p className="text-sm text-(--text-secondary) truncate">
                        {entry.translation.word}
                      </p>
                    </div>
                    {category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-(--bg-tertiary) text-(--text-tertiary)">
                        {category.icon} {category.name[locale]}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Back to Tags */}
        <div className="mt-8 pt-8 border-t border-(--border-primary)">
          <Link
            to={localePath('/tags')}
            className="inline-flex items-center gap-2 text-(--accent-primary) hover:underline"
          >
            <Tags className="size-4" />
            {t('viewAllTags')}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
