import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import type { Category } from '@/data/types';
import type { MeaningEntry } from '@/data/types';
import { type Language, useI18n } from '@/i18n';
import { studyRecords } from '@/lib/db';
import { useEffect, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link, useLoaderData } from 'react-router';

const getPronunciation = (entry: MeaningEntry, locale: Language): string | undefined => {
  switch (locale) {
    case 'en':
      return entry.romanization;
    case 'ko':
      return entry.pronunciation;
  }
};

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 */
export async function loader() {
  // 오늘의 단어 계산 (빌드 시점)
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const randomIndex = dayOfYear % meaningEntries.length;
  const dailyWord = meaningEntries[randomIndex];

  // 카테고리별 엔트리 수 계산
  const categoryCounts: Record<string, number> = {};
  for (const cat of categories) {
    categoryCounts[cat.id] = meaningEntries.filter((e) => e.categoryId === cat.id).length;
  }

  return {
    dailyWord,
    categories,
    categoryCounts,
    totalEntries: meaningEntries.length,
  };
}

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');

  if (isKorean) {
    return [
      { title: 'Context - 한국어 사전' },
      { name: 'description', content: '한국어 학습자를 위한 의미 사전' },
    ];
  }

  return [
    { title: 'Context - Korean Dictionary' },
    { name: 'description', content: 'Meaning dictionary for Korean learners' },
  ];
};

export default function HomePage() {
  const {
    dailyWord,
    categories: cats,
    categoryCounts,
    totalEntries,
  } = useLoaderData<{
    dailyWord: MeaningEntry;
    categories: Category[];
    categoryCounts: Record<string, number>;
    totalEntries: number;
  }>();
  const { locale, t, localePath } = useI18n();
  const [overallProgress, setOverallProgress] = useState({ studied: 0, total: 0, percentage: 0 });
  const [categoryProgress, setCategoryProgress] = useState<
    Record<string, { studied: number; total: number; percentage: number }>
  >({});

  // Load progress data (클라이언트 전용 - IndexedDB)
  useEffect(() => {
    async function loadProgress() {
      const overall = await studyRecords.getOverallProgress(totalEntries);
      setOverallProgress(overall);

      const catProgress: Record<string, { studied: number; total: number; percentage: number }> =
        {};
      for (const cat of cats) {
        const progress = await studyRecords.getCategoryProgress(cat.id, categoryCounts[cat.id]);
        catProgress[cat.id] = progress;
      }
      setCategoryProgress(catProgress);
    }
    loadProgress();
  }, [cats, categoryCounts, totalEntries]);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('heroTitle')}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('heroSubtitle')}</p>
      </div>

      {/* Overall Progress */}
      {overallProgress.studied > 0 && (
        <div
          className="mb-8 p-4 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {locale === 'ko' ? '📈 내 학습 현황' : '📈 My Progress'}
            </h2>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {overallProgress.studied}/{overallProgress.total} {locale === 'ko' ? '단어' : 'words'}
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${overallProgress.percentage}%`,
                backgroundColor: 'var(--accent-primary)',
              }}
            />
          </div>
        </div>
      )}

      {/* Daily Word */}
      {dailyWord && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            {locale === 'ko' ? '⭐ 오늘의 단어' : '⭐ Word of the Day'}
          </h2>
          <Link
            to={localePath(`/entry/${dailyWord.id}`)}
            className="block p-6 rounded-xl transition-all hover:shadow-lg"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '2px solid var(--accent-primary)',
            }}
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {dailyWord.korean}
              </h3>
              <p className="text-lg mb-3" style={{ color: 'var(--text-tertiary)' }}>
                {getPronunciation(dailyWord, locale)}
              </p>
              <p className="text-xl" style={{ color: 'var(--accent-primary)' }}>
                {dailyWord.translations[locale].word}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Categories Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {locale === 'ko' ? '📚 카테고리별 학습' : '📚 Learn by Category'}
          </h2>
          <Link
            to={localePath('/browse')}
            className="text-sm"
            style={{ color: 'var(--accent-primary)' }}
          >
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
                className="p-4 rounded-xl transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {category.name[locale]}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {progress.studied}/{count} {locale === 'ko' ? '단어' : 'words'}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                {progress.studied > 0 && (
                  <div
                    className="w-full h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${progress.percentage}%`,
                        backgroundColor: 'var(--accent-primary)',
                      }}
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
