/**
 * @fileoverview 태그별 개념 목록 페이지 (한국어)
 */

import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import { TagCloud } from '@soundblue/ui/components';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { Tags } from 'lucide-react';
import { Layout } from '../../../components/layout/Layout';
import { DifficultyBadge } from '../../../components/ui/DifficultyBadge';
import { conceptsByTag } from '../../../data/concepts';
import type { MathConcept } from '../../../data/types';
import { useI18n } from '../../../i18n';

type LoaderData = {
  tag: string;
  concepts: MathConcept[];
  relatedTags: { tag: string; count: number; href: string }[];
};

export const Route = createFileRoute('/ko/tag/$tagId')({
  loader: async ({ params }) => {
    const tag = decodeURIComponent(params.tagId);
    const concepts = conceptsByTag.get(tag);

    if (!concepts || concepts.length === 0) {
      throw notFound();
    }

    // 관련 태그 찾기 (같은 개념들이 가진 다른 태그)
    const relatedTagCounts = new Map<string, number>();
    for (const concept of concepts) {
      for (const t of concept.tags) {
        if (t !== tag) {
          relatedTagCounts.set(t, (relatedTagCounts.get(t) || 0) + 1);
        }
      }
    }

    const relatedTags = Array.from(relatedTagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([t, count]) => ({
        tag: t,
        count,
        href: `/ko/tag/${encodeURIComponent(t)}`,
      }));

    return { tag, concepts, relatedTags };
  },
  head: dynamicHeadFactoryKo<LoaderData>(
    (data) => {
      if (!data?.tag) {
        return {
          ko: { title: 'Not Found | Roots' },
          en: { title: 'Not Found | Roots' },
        };
      }
      const { tag, concepts } = data;
      return {
        ko: {
          title: `#${tag} 태그 | Roots`,
          description: `"${tag}" 태그가 붙은 ${concepts.length}개의 수학 개념`,
          keywords: [tag, '수학 태그', '수학 개념', 'math tag'],
        },
        en: {
          title: `#${tag} Tag | Roots`,
          description: `${concepts.length} math concepts tagged with "${tag}"`,
          keywords: [tag, 'math tag', 'math concepts', 'mathematics'],
        },
      };
    },
    'https://roots.soundbluemusic.com',
    (data) => `/ko/tag/${encodeURIComponent(data.tag)}`,
  ),
  component: TagPage,
});

function TagPage() {
  const { tag, concepts, relatedTags } = Route.useLoaderData();
  const { locale, localePath } = useI18n();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Tags className="size-8 text-(--accent-primary)" />
            <h1 className="text-3xl font-bold text-(--text-primary)">#{tag}</h1>
          </div>
          <p className="text-(--text-secondary)">
            {locale === 'ko'
              ? `${concepts.length}개의 개념`
              : `${concepts.length} concept${concepts.length > 1 ? 's' : ''}`}
          </p>
        </header>

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <section className="mb-8">
            <TagCloud
              tags={relatedTags}
              title={locale === 'ko' ? '관련 태그' : 'Related Tags'}
              showCounts
              size="sm"
            />
          </section>
        )}

        {/* Concept List */}
        <section>
          <h2 className="text-xl font-semibold text-(--text-primary) mb-4">
            {locale === 'ko' ? '개념 목록' : 'Concepts'}
          </h2>
          <div className="grid gap-3">
            {concepts.map((concept) => (
              <Link
                key={concept.id}
                to={localePath(`/concept/${concept.id}`)}
                className="block p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) hover:border-(--accent-primary) transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-(--text-primary) truncate">
                      {concept.name[locale] || concept.name.en}
                    </h3>
                    <p className="text-sm text-(--text-secondary) mt-1 line-clamp-2">
                      {typeof concept.content[locale] === 'string'
                        ? concept.content[locale]
                        : concept.content[locale]?.definition ||
                          (typeof concept.content.en === 'string'
                            ? concept.content.en
                            : concept.content.en?.definition)}
                    </p>
                  </div>
                  <DifficultyBadge level={concept.difficulty} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Back to Tags */}
        <div className="mt-8 pt-8 border-t border-(--border-primary)">
          <Link
            to={localePath('/tags')}
            className="inline-flex items-center gap-2 text-(--accent-primary) hover:underline"
          >
            <Tags className="size-4" />
            {locale === 'ko' ? '모든 태그 보기' : 'View all tags'}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
