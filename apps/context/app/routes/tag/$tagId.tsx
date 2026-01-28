/**
 * @fileoverview 태그별 엔트리 목록 페이지 (영어)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { Breadcrumb, TagCloud } from '@soundblue/ui/components';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { Tags } from 'lucide-react';
import { Layout } from '@/components/layout';
import { getCategoryById } from '@/data/categories';
import type { LocaleEntry } from '@/data/types';
import { useI18n } from '@/i18n';
import { fetchEntriesByTagFromD1 } from '@/services/d1-server';

type LoaderData = {
  tag: string;
  entries: LocaleEntry[];
  relatedTags: { tag: string; count: number; href: string }[];
};

export const Route = createFileRoute('/tag/$tagId')({
  loader: async ({ params }) => {
    const tag = decodeURIComponent(params.tagId);
    const entries = await fetchEntriesByTagFromD1({ data: { tag, locale: 'en' } });

    if (entries.length === 0) {
      throw notFound();
    }

    // 관련 태그 찾기 (같은 엔트리들이 가진 다른 태그)
    const relatedTagCounts = new Map<string, number>();
    for (const entry of entries) {
      for (const t of entry.tags || []) {
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
        href: `/tag/${encodeURIComponent(t)}`,
      }));

    return { tag, entries, relatedTags };
  },
  head: dynamicHeadFactoryEn<LoaderData>((data) => {
    if (!data?.tag) {
      return {
        ko: { title: 'Not Found | Context' },
        en: { title: 'Not Found | Context' },
      };
    }
    const { tag, entries } = data;
    return {
      ko: {
        title: `#${tag} 태그 | Context`,
        description: `"${tag}" 태그가 붙은 ${entries.length}개의 한국어 단어`,
        keywords: [tag, '한국어 단어', '한국어 태그', 'Korean vocabulary'],
      },
      en: {
        title: `#${tag} Tag | Context Korean Dictionary`,
        description: `${entries.length} Korean words tagged with "${tag}"`,
        keywords: [tag, 'Korean vocabulary', 'Korean tag', 'learn Korean'],
      },
    };
  }, 'https://context.soundbluemusic.com'),
  component: TagPage,
});

function TagPage() {
  const { tag, entries, relatedTags } = Route.useLoaderData();
  const { localePath } = useI18n();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Tags', href: '/tags' }, { label: `#${tag}` }]}
          showHome
          homeLabel="Home"
          homePath="/"
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
            {entries.length} {entries.length === 1 ? 'word' : 'words'}
          </p>
        </header>

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <section className="mb-8">
            <TagCloud tags={relatedTags} title="Related Tags" showCounts size="sm" />
          </section>
        )}

        {/* Entry List */}
        <section>
          <h2 className="text-xl font-semibold text-(--text-primary) mb-4">Words</h2>
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
                        {category.icon} {category.name.en}
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
            to="/tags"
            className="inline-flex items-center gap-2 text-(--accent-primary) hover:underline"
          >
            <Tags className="size-4" />
            View all tags
          </Link>
        </div>
      </div>
    </Layout>
  );
}
