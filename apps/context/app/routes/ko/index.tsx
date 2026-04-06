/**
 * @fileoverview 홈페이지 (한국어 버전)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { IndexPageContent } from '@/components/pages/IndexPageContent';
import { categories as allCategories } from '@/data/categories';
import type { Category, LocaleEntry } from '@/data/types';
import { fetchDailyWordFromD1, fetchEntryCountsFromD1 } from '@/services/d1-server';

interface LoaderData {
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalEntries: number;
  dbError: boolean;
  dailyWord: LocaleEntry | null;
}

export const Route = createFileRoute('/ko/')({
  loader: async (): Promise<LoaderData> => {
    const categoryCounts: Record<string, number> = {};
    let totalEntries = 0;
    let dbError = false;

    try {
      const countsMap = await fetchEntryCountsFromD1();
      for (const [categoryId, count] of countsMap) {
        categoryCounts[categoryId] = count;
        totalEntries += count;
      }
    } catch (error) {
      console.error('[HomePageKo] fetchEntryCountsFromD1 failed:', error);
    }

    if (totalEntries === 0) {
      dbError = true;
      for (const cat of allCategories) {
        categoryCounts[cat.id] = 0;
      }
    }

    let dailyWord: LocaleEntry | null = null;
    try {
      dailyWord = await fetchDailyWordFromD1({ data: { locale: 'ko' } });
    } catch (error) {
      console.error('[HomePageKo] fetchDailyWordFromD1 failed:', error);
    }

    return {
      categories: allCategories,
      categoryCounts,
      totalEntries,
      dbError,
      dailyWord,
    };
  },
  head: headFactory(
    {
      ko: {
        title: 'Context - 한국어 사전',
        description: '한국어 학습자를 위한 의미 사전',
        keywords: ['한국어 사전', '한국어 학습', '한국어 뜻', '한국어 예문', '한국어 단어'],
      },
      en: {
        title: 'Context - Korean Dictionary',
        description: 'Meaning dictionary for Korean learners',
        keywords: [
          'Korean dictionary',
          'learn Korean',
          'Korean meaning',
          'Korean words',
          'Korean vocabulary',
        ],
      },
    },
    'https://context.soundbluemusic.com',
  ),
  component: HomePageKo,
});

function HomePageKo() {
  const loaderData = Route.useLoaderData();
  return <IndexPageContent {...loaderData} />;
}
