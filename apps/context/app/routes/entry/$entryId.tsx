/**
 * @fileoverview Entry 페이지 - 영어 버전 (SSR + D1)
 *
 * 영어 라우트 래퍼. UI는 EntryPageContent에서 렌더링합니다.
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { EntryPageContent } from '@/components/pages/EntryPageContent';
import { getCategoryById } from '@/data/categories';
import type { LocaleEntry } from '@/data/types';
import { fetchEntryFromD1 } from '@/services/d1-server';

type LoaderData = { entry: LocaleEntry };

export const Route = createFileRoute('/entry/$entryId')({
  loader: async ({ params }) => {
    const entry = await fetchEntryFromD1({ data: { entryId: params.entryId, locale: 'en' } });

    if (!entry) {
      throw notFound();
    }

    return { entry } as LoaderData;
  },
  head: dynamicHeadFactoryEn<LoaderData>(
    (data) => {
      if (!data?.entry) {
        return {
          ko: { title: 'Not Found | Context' },
          en: { title: 'Not Found | Context' },
        };
      }
      const { entry } = data;
      const category = getCategoryById(entry.categoryId);
      return {
        ko: {
          title: `${entry.korean} - ${entry.translation.word} | Context`,
          description: `${entry.korean} (${entry.romanization}): ${entry.translation.explanation}`,
          keywords: [
            entry.korean,
            `${entry.korean} 뜻`,
            entry.translation.word,
            category?.name.ko || entry.categoryId,
          ],
        },
        en: {
          title: `${entry.korean} (${entry.romanization}) - ${entry.translation.word} | Context Korean Dictionary`,
          description: `Learn Korean word "${entry.korean}" (${entry.romanization}). Means "${entry.translation.word}" in English. ${entry.translation.explanation}`,
          keywords: [
            entry.korean,
            `${entry.korean} meaning`,
            `${entry.korean} pronunciation`,
            `how to say ${entry.translation.word} in Korean`,
            entry.translation.word,
            category?.name.en || entry.categoryId,
            'Korean dictionary',
            'learn Korean',
            'Korean vocabulary',
          ],
        },
      };
    },
    'https://context.soundbluemusic.com',
    (data) => `/entry/${data.entry.id}`,
  ),
  component: function EntryPage() {
    const { entry } = Route.useLoaderData();
    return <EntryPageContent entry={entry} />;
  },
});
