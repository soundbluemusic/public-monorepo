/**
 * @fileoverview 홈페이지 공유 컴포넌트
 *
 * 영어/한국어 라우트 파일에서 공통으로 사용하는 UI 컴포넌트입니다.
 * useI18n()을 통해 locale에 따라 자동으로 번역된 텍스트를 표시합니다.
 */

import { generateItemListSchema, serializeSchema } from '@soundblue/seo/structured-data';
import { ProgressBar } from '@soundblue/ui/primitives';
import { Link } from '@tanstack/react-router';
import { FolderOpen, Sparkles, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import type { Category, LocaleEntry } from '@/data/types';
import { useStudyData } from '@/hooks';
import { type Language, useI18n } from '@/i18n';

const getPronunciation = (entry: LocaleEntry, locale: Language): string | undefined => {
  switch (locale) {
    case 'en':
      return entry.romanization;
    case 'ko':
      return entry.pronunciation?.korean;
  }
};

export interface IndexPageContentProps {
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalEntries: number;
  dbError: boolean;
  dailyWord: LocaleEntry | null;
}

export function IndexPageContent({
  categories: cats,
  categoryCounts,
  totalEntries,
  dbError,
  dailyWord,
}: IndexPageContentProps) {
  const { locale, t, localePath } = useI18n();
  const { baseUrl } = APP_CONFIG;
  const localePrefix = locale === 'ko' ? '/ko' : '';

  const categoryListSchema = generateItemListSchema({
    name: locale === 'ko' ? '한국어 사전 카테고리' : 'Korean Dictionary Categories',
    description:
      locale === 'ko'
        ? '52개 카테고리의 한국어 단어'
        : '52 categories of Korean vocabulary',
    url: baseUrl,
    items: cats.map((cat) => ({
      name: cat.name[locale],
      url: `${baseUrl}${localePrefix}/category/${cat.id}`,
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
      {/* JSON-LD - content is generated from trusted category metadata */}
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
          {t('dbErrorMessage')}
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
            {t('myProgress')}
          </h2>
          <span className="text-sm text-(--text-secondary)">
            {overallProgress.studied}/{overallProgress.total} {t('words')}
          </span>
        </div>
        <ProgressBar value={overallProgress.percentage} />
      </div>

      {/* Daily Word */}
      {dailyWord && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-3 flex items-center gap-2">
            <Sparkles size={20} aria-hidden="true" />
            {t('wordOfTheDay')}
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
            {t('learnByCategory')}
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
                      {progress.studied}/{count} {t('words')}
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
