/**
 * @fileoverview Entry 페이지 - 한국어 버전 (SSR + D1)
 *
 * 한국어 라우트 래퍼. UI는 EntryPageContent에서 렌더링합니다.
 */

import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { EntryPageContent } from '@/components/pages/EntryPageContent';
import { getCategoryById } from '@/data/categories';
import type { LocaleEntry } from '@/data/types';
import { fetchEntryFromD1 } from '@/services/d1-server';

type LoaderData = { entry: LocaleEntry; englishColorName?: string };

export const Route = createFileRoute('/ko/entry/$entryId')({
  loader: async ({ params }) => {
    const entry = await fetchEntryFromD1({ data: { entryId: params.entryId, locale: 'ko' } });

    if (!entry) {
      throw notFound();
    }

    // colors 카테고리의 경우 영어 색상명도 함께 로드 (색상 표시용)
    let englishColorName: string | undefined;
    if (entry.categoryId === 'colors') {
      const enEntry = await fetchEntryFromD1({ data: { entryId: params.entryId, locale: 'en' } });
      englishColorName = enEntry?.translation.word;
    }

    return { entry, englishColorName } as LoaderData;
  },
  head: dynamicHeadFactoryKo<LoaderData>(
    (data) => {
      if (!data?.entry) {
        return {
          ko: { title: '찾을 수 없음 | Context' },
          en: { title: 'Not Found | Context' },
        };
      }
      const { entry } = data;
      const category = getCategoryById(entry.categoryId);
      return {
        ko: {
          title: `${entry.korean} | Context 한국어 사전`,
          description: `${entry.korean}: ${entry.translation.explanation}`,
          keywords: [
            entry.korean,
            `${entry.korean} 뜻`,
            `${entry.korean} 의미`,
            category?.name.ko || entry.categoryId,
            '한국어 사전',
          ],
        },
        en: {
          title: `${entry.korean} - ${entry.translation.word} | Context`,
          description: `${entry.korean} (${entry.romanization}): ${entry.translation.explanation}`,
          keywords: [entry.korean, entry.translation.word, category?.name.en || entry.categoryId],
        },
      };
    },
    'https://context.soundbluemusic.com',
    (data) => `/entry/${data.entry.id}`,
  ),
  component: function EntryPageKo() {
    const { entry, englishColorName } = Route.useLoaderData();
    return <EntryPageContent entry={entry} englishColorName={englishColorName} />;
  },
});
