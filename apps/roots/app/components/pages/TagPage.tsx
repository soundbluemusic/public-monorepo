/**
 * @fileoverview 공유 TagPage 컴포넌트 + 라우트 헬퍼
 *
 * en/ko 라우트 쌍이 공유하는 loader / head builder / canonical 생성기 + UI 컴포넌트입니다.
 * relatedTags의 href는 렌더링 시점에 `useI18n().localePath` 로 생성하므로 loader는 locale-agnostic.
 */

import { TagCloud } from '@soundblue/ui/components';
import { Link, notFound } from '@tanstack/react-router';
import { Tags } from 'lucide-react';
import { allTags, conceptsByTag, totalTagCount } from '../../data/concepts';
import type { MathConcept } from '../../data/types';
import { useI18n } from '../../i18n';
import { Layout } from '../layout/Layout';
import { DifficultyBadge } from '../ui/DifficultyBadge';

/** `/tags` 라우트 쌍이 공유하는 SEO 메타 (태그 목록 페이지). */
export const tagsMeta = {
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
};

/** re-export: tags 라우트 쌍이 `allTags`/`totalTagCount`를 참조 (단일 진입점) */
export { allTags, totalTagCount };

export interface TagRelatedInfo {
  tag: string;
  count: number;
}

export type TagLoaderData = {
  tag: string;
  concepts: MathConcept[];
  relatedTags: TagRelatedInfo[];
};

/** `tag/$tagId` 라우트 쌍이 공유하는 loader. */
export async function tagRouteLoader({
  params,
}: {
  params: { tagId: string };
}): Promise<TagLoaderData> {
  const tag = decodeURIComponent(params.tagId);
  const concepts = conceptsByTag.get(tag);

  if (!concepts || concepts.length === 0) {
    throw notFound();
  }

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
    .map(([t, count]) => ({ tag: t, count }));

  return { tag, concepts, relatedTags };
}

/** `dynamicHeadFactoryEn/Ko`에 전달되는 head builder. */
export function buildTagRouteHead(data: TagLoaderData | undefined) {
  if (!data?.tag) {
    return {
      ko: { title: '찾을 수 없음 | Roots' },
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
}

/** canonical URL 생성기 (en/ko 쌍이 공유). */
export function tagCanonicalPath(data: TagLoaderData): string {
  return `/tag/${encodeURIComponent(data.tag)}`;
}

export interface TagPageProps {
  tag: string;
  concepts: MathConcept[];
  relatedTags: TagRelatedInfo[];
}

export function TagPage({ tag, concepts, relatedTags }: TagPageProps) {
  const { locale, localePath } = useI18n();

  const relatedTagsWithHref = relatedTags.map((t) => ({
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
            <h1 className="text-3xl font-bold text-(--text-primary)">#{tag}</h1>
          </div>
          <p className="text-(--text-secondary)">
            {locale === 'ko'
              ? `${concepts.length}개의 개념`
              : `${concepts.length} concept${concepts.length > 1 ? 's' : ''}`}
          </p>
        </header>

        {/* Related Tags */}
        {relatedTagsWithHref.length > 0 && (
          <section className="mb-8">
            <TagCloud
              tags={relatedTagsWithHref}
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
