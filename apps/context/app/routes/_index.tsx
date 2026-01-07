import { metaFactory } from '@soundblue/i18n';
import { ProgressBar } from '@soundblue/ui/primitives';
import { FolderOpen, Sparkles, TrendingUp } from 'lucide-react';
import { Link, useLoaderData } from 'react-router';
import { Layout } from '@/components/layout';
import { categories } from '@/data/categories';
import type { Category, MeaningEntry } from '@/data/types';
import { useStudyData } from '@/hooks';
import { type Language, useI18n } from '@/i18n';

const getPronunciation = (entry: MeaningEntry, locale: Language): string | undefined => {
  switch (locale) {
    case 'en':
      return entry.romanization;
    case 'ko':
      return entry.pronunciation?.korean;
  }
};

/**
 * clientLoader: 클라이언트에서 데이터 로드
 * Pages 빌드에서는 loader 대신 clientLoader 사용
 */
export async function clientLoader() {
  const { lightEntries, getEntryById } = await import('@/data/entries');

  // 오늘의 단어 계산 (빌드 시점)
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const randomIndex = dayOfYear % lightEntries.length;
  const dailyWordLight = lightEntries[randomIndex];

  // 전체 entry 데이터 로드 (카테고리 청크에서)
  const dailyWord = dailyWordLight ? await getEntryById(dailyWordLight.id) : null;

  // 카테고리별 엔트리 수 계산 (lightEntries 기반)
  const categoryCounts: Record<string, number> = {};
  for (const cat of categories) {
    categoryCounts[cat.id] = lightEntries.filter((e) => e.categoryId === cat.id).length;
  }

  return {
    dailyWord,
    categories,
    categoryCounts,
    totalEntries: lightEntries.length,
  };
}

export const meta = metaFactory(
  {
    ko: { title: 'Context - 한국어 사전', description: '한국어 학습자를 위한 의미 사전' },
    en: {
      title: 'Context - Korean Dictionary',
      description: 'Meaning dictionary for Korean learners',
    },
  },
  'https://context.soundbluemusic.com',
);

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

  // Study data from custom hook
  const { overallProgress, categoryProgress } = useStudyData({
    totalEntries,
    categories: cats,
    categoryCounts,
  });

  return (
    <Layout>
      {/* Hero Section - CSS 애니메이션으로 TBT 최적화 */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-2">
          {t('heroTitle')}
        </h1>
        <p className="text-(--text-secondary)">{t('heroSubtitle')}</p>
      </div>

      {/* Overall Progress - CLS 방지: 조건부 렌더링 대신 CSS visibility 사용 */}
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
                {dailyWord.translations[locale].word}
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

                {/* Progress bar - CLS 방지: 항상 렌더링하되 조건부 표시 */}
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
