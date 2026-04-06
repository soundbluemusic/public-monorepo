/**
 * @fileoverview 태그별 엔트리 목록 페이지 (한국어)
 */

import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { TagPageContent } from '@/components/pages/TagPageContent';
import type { LocaleEntry } from '@/data/types';
import { fetchEntriesByTagFromD1 } from '@/services/d1-server';

type LoaderData = {
  tag: string;
  entries: LocaleEntry[];
  relatedTags: { tag: string; count: number }[];
};

export const Route = createFileRoute('/ko/tag/$tagId')({
  loader: async ({ params }) => {
    const tag = decodeURIComponent(params.tagId);
    const entries = await fetchEntriesByTagFromD1({ data: { tag, locale: 'ko' } });

    if (entries.length === 0) {
      throw notFound();
    }

    // 관련 태그 찾기
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
      .map(([t, count]) => ({ tag: t, count }));

    return { tag, entries, relatedTags };
  },
  head: dynamicHeadFactoryKo<LoaderData>((data) => {
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
  component: function TagPage() {
    const { tag, entries, relatedTags } = Route.useLoaderData();
    return <TagPageContent tag={tag} entries={entries} relatedTags={relatedTags} />;
  },
});
