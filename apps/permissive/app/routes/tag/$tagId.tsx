/**
 * @fileoverview 태그별 라이브러리 목록 페이지 (영어)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { Breadcrumb, TagCloud } from '@soundblue/ui/components';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { Star, Tags } from 'lucide-react';
import DocsLayout from '../../components/layout/DocsLayout';
import { getLibrariesByTag, getLibrarySlug, type Library } from '../../data/libraries';
import { useI18n } from '../../i18n';

type LoaderData = {
  tag: string;
  libraries: Library[];
  relatedTags: { tag: string; count: number; href: string }[];
};

export const Route = createFileRoute('/tag/$tagId')({
  loader: async ({ params }) => {
    const tag = decodeURIComponent(params.tagId);
    const libraries = getLibrariesByTag(tag);

    if (libraries.length === 0) {
      throw notFound();
    }

    // 관련 태그 찾기 (같은 라이브러리들이 가진 다른 태그)
    const relatedTagCounts = new Map<string, number>();
    for (const lib of libraries) {
      for (const t of lib.tags || []) {
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

    return { tag, libraries, relatedTags };
  },
  head: dynamicHeadFactoryEn<LoaderData>((data) => {
    if (!data?.tag) {
      return {
        ko: { title: 'Not Found - Permissive' },
        en: { title: 'Not Found - Permissive' },
      };
    }
    const { tag, libraries } = data;
    return {
      ko: {
        title: `#${tag} 태그 | Permissive`,
        description: `"${tag}" 태그가 붙은 ${libraries.length}개의 라이브러리`,
        keywords: [tag, '라이브러리 태그', '오픈소스', 'library tag'],
      },
      en: {
        title: `#${tag} Tag | Permissive`,
        description: `${libraries.length} libraries tagged with "${tag}"`,
        keywords: [tag, 'library tag', 'open source', 'free libraries'],
      },
    };
  }, 'https://permissive.soundbluemusic.com'),
  component: TagPage,
});

function TagPage() {
  const { tag, libraries, relatedTags } = Route.useLoaderData();
  const { localePath } = useI18n();

  return (
    <DocsLayout>
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
            {libraries.length} {libraries.length === 1 ? 'library' : 'libraries'}
          </p>
        </header>

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <section className="mb-8">
            <TagCloud tags={relatedTags} title="Related Tags" showCounts size="sm" />
          </section>
        )}

        {/* Library List */}
        <section>
          <h2 className="text-xl font-semibold text-(--text-primary) mb-4">Libraries</h2>
          <div className="grid gap-3">
            {libraries.map((lib) => (
              <Link
                key={lib.name}
                to={localePath(`/library/${getLibrarySlug(lib.name)}`)}
                className="block p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) hover:border-(--accent-primary) transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-(--text-primary) truncate">{lib.name}</h3>
                    <p className="text-sm text-(--text-secondary) mt-1 line-clamp-2">
                      {lib.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-(--text-secondary) text-sm">
                    <Star size={14} className="fill-current text-yellow-500" />
                    <span>{lib.stars}</span>
                  </div>
                </div>
              </Link>
            ))}
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
    </DocsLayout>
  );
}
