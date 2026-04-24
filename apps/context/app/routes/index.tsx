/**
 * @fileoverview 홈페이지 (영어 버전)
 */

import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { homeMeta, IndexPageContent } from '@/components/pages/IndexPageContent';
import { APP_CONFIG } from '@/config';
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

export const Route = createFileRoute('/')({
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
      console.error('[HomePage] fetchEntryCountsFromD1 failed:', error);
    }

    if (totalEntries === 0) {
      dbError = true;
      for (const cat of allCategories) {
        categoryCounts[cat.id] = 0;
      }
    }

    let dailyWord: LocaleEntry | null = null;
    try {
      dailyWord = await fetchDailyWordFromD1({ data: { locale: 'en' } });
    } catch (error) {
      console.error('[HomePage] fetchDailyWordFromD1 failed:', error);
    }

    return {
      categories: allCategories,
      categoryCounts,
      totalEntries,
      dbError,
      dailyWord,
    };
  },
  head: headFactory(homeMeta, APP_CONFIG.baseUrl),
  component: HomePage,
});

function HomePage() {
  const loaderData = Route.useLoaderData();
  return <IndexPageContent {...loaderData} />;
}
