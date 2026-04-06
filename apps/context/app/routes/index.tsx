/**
 * @fileoverview 홈페이지 (영어 버전)
 */

import { headFactory } from '@soundblue/seo/meta';
import { generateItemListSchema, serializeSchema } from '@soundblue/seo/structured-data';
import { ProgressBar } from '@soundblue/ui/primitives';
import { createFileRoute, Link } from '@tanstack/react-router';
import { FolderOpen, Sparkles, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout';
import { categories as allCategories } from '@/data/categories';
import type { Category, LocaleEntry } from '@/data/types';
import { useStudyData } from '@/hooks';
import { type Language, useI18n } from '@/i18n';
import { fetchDailyWordFromD1, fetchEntryCountsFromD1 } from '@/services/d1-server';

const getPronunciation = (entry: LocaleEntry, locale: Language): string | undefined => {
  switch (locale) {
    case 'en':
      return entry.romanization;
    case 'ko':
      return entry.pronunciation?.korean;
  }
};

interface LoaderData {
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalEntries: number;
  dbError: boolean;
  dailyWord: LocaleEntry | null;
}

export const Route = createFileRoute('/')({
  loader: async (): Promise<LoaderData> => {
    // TanStack Start: createServerFn을 통해 D1에서 카테고리별 엔트리 수 로드
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

    // D1에서 데이터가 없으면 dbError 플래그 설정 (하드코딩 폴백 대신)
    if (totalEntries === 0) {
      dbError = true;
      for (const cat of allCategories) {
        categoryCounts[cat.id] = 0;
      }
    }

    // 오늘의 단어를 D1에서 서버 사이드 로드
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
  component: HomePage,
});

const CONTEXT_BASE_URL = 'https://context.soundbluemusic.com';

function HomePage() {
  const { categories: cats, categoryCounts, totalEntries, dbError, dailyWord } =
    Route.useLoaderData();
  const { locale, t, localePath } = useI18n();

  const categoryListSchema = generateItemListSchema({
    name: locale === 'ko' ? '한국어 사전 카테고리' : 'Korean Dictionary Categories',
    description:
      locale === 'ko'
        ? '52개 카테고리의 한국어 단어'
        : '52 categories of Korean vocabulary',
    url: CONTEXT_BASE_URL,
    items: cats.map((cat) => ({
      name: cat.name[locale],
      url: `${CONTEXT_BASE_URL}${locale === 'ko' ? '/ko' : ''}/category/${cat.id}`,
      description: cat.description[locale],
    })),
  });

  const { overallProgress, categoryProgress } = useStudyData({
    totalEntries,
    categories: cats,
    categoryCounts,
  });

  return (
    <Layout>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: serializeSchema(categoryListSchema) }}
      />
      {/* Hero Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-2">
          {t('heroTitle')}
        </h1>
        <p className="text-(--text-secondary)">{t('heroSubtitle')}</p>
      </div>

      {/* DB Error Banner */}
      {dbError && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200" role="alert">
          {locale === 'ko'
            ? '데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
            : 'There was a problem loading data. Please try again later.'}
        </div>
      )}

      {/* Overall Progress */}
      <div
        className={`p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) mb-8 transition-opacity duration-200 ${
          overallProgress.studied > 0
            ? 'opacity-100'
            : 'opacity-0 h-0 overflow-hidden p-0 mb-0 border-0'
        }`}
        aria-hidden={overallProgress.studied === 0}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-(--text-primary) flex items-center gap-2">
            <TrendingUp size={18} aria-hidden="true" />
            {locale === 'ko' ? '내 학습 현황' : 'My Progress'}
          </h2>
          <span className="text-sm text-(--text-secondary)">
            {overallProgress.studied}/{overallProgress.total} {locale === 'ko' ? '단어' : 'words'}
          </span>
        </div>
        <ProgressBar value={overallProgress.percentage} />
      </div>

      {/* Daily Word */}
      {dailyWord && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-3 flex items-center gap-2">
            <Sparkles size={20} aria-hidden="true" />
            {locale === 'ko' ? '오늘의 단어' : 'Word of the Day'}
          </h2>
          <Link
            to={localePath(`/entry/${dailyWord.id}`)}
            className="block p-6 rounded-xl bg-(--bg-elevated) border-2 border-(--accent-primary) no-underline"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-2 text-(--text-primary)">{dailyWord.korean}</h3>
              <p className="text-lg text-(--text-tertiary) mb-3">
                {getPronunciation(dailyWord, locale)}
              </p>
              <p className="text-xl text-(--accent-primary)">
                {dailyWord.translation.word}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Categories Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-(--text-primary) flex items-center gap-2">
            <FolderOpen size={20} aria-hidden="true" />
            {locale === 'ko' ? '카테고리별 학습' : 'Learn by Category'}
          </h2>
          <Link to={localePath('/browse')} className="text-sm text-(--accent-primary)">
            {t('viewAll')} →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {cats.map((category) => {
            const count = categoryCounts[category.id];
            const progress = categoryProgress[category.id] || {
              studied: 0,
              total: count,
              percentage: 0,
            };

            return (
              <Link
                key={category.id}
                to={localePath(`/category/${category.id}`)}
                className="block p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-(--border-focus)"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-(--text-primary)">{category.name[locale]}</h3>
                    <p className="text-xs text-(--text-tertiary)">
                      {progress.studied}/{count} {locale === 'ko' ? '단어' : 'words'}
                    </p>
                  </div>
                </div>

                <div
                  className={`transition-opacity duration-150 ${progress.studied > 0 ? 'opacity-100' : 'opacity-0 h-0'}`}
                >
                  <ProgressBar value={progress.percentage} size="sm" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
