import { metaFactory } from '@soundblue/i18n';
import { ProgressBar } from '@soundblue/ui/primitives';
import { FolderOpen, Sparkles, TrendingUp } from 'lucide-react';
import { Link, useLoaderData } from 'react-router';
import { Layout } from '@/components/layout';
import { categories as allCategories } from '@/data/categories';
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
 * 홈페이지 데이터 로더
 *
 * loader: SSG 빌드 시 실행 - 정적 데이터만 포함
 * clientLoader: 런타임에 실행 - 동적 데이터(오늘의 단어) 추가
 */

interface StaticLoaderData {
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalEntries: number;
}

interface LoaderData extends StaticLoaderData {
  dailyWord: MeaningEntry | null;
}

/**
 * loader: SSG 빌드 시 실행
 * 정적 데이터(카테고리, 엔트리 수)를 HTML에 포함
 */
export async function loader(): Promise<StaticLoaderData> {
  const { lightEntries } = await import('@/data/entries');

  // 카테고리별 엔트리 수 계산
  const categoryCounts: Record<string, number> = {};
  for (const cat of allCategories) {
    categoryCounts[cat.id] = lightEntries.filter((e) => e.categoryId === cat.id).length;
  }

  return {
    categories: allCategories,
    categoryCounts,
    totalEntries: lightEntries.length,
  };
}

/**
 * clientLoader: 클라이언트에서 실행
 * 동적 데이터(오늘의 단어)를 추가
 */
export async function clientLoader({
  serverLoader,
}: {
  serverLoader: () => Promise<StaticLoaderData>;
}): Promise<LoaderData> {
  // SSG 빌드 데이터 가져오기 (있으면)
  let staticData: StaticLoaderData;
  try {
    staticData = await serverLoader();
  } catch {
    // Pages 빌드에서 loader가 없는 경우 직접 로드
    const { lightEntries } = await import('@/data/entries');
    const categoryCounts: Record<string, number> = {};
    for (const cat of allCategories) {
      categoryCounts[cat.id] = lightEntries.filter((e) => e.categoryId === cat.id).length;
    }
    staticData = {
      categories: allCategories,
      categoryCounts,
      totalEntries: lightEntries.length,
    };
  }

  const { lightEntries, getEntryById } = await import('@/data/entries');

  // 오늘의 단어 계산 (런타임)
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const randomIndex = dayOfYear % lightEntries.length;
  const dailyWordLight = lightEntries[randomIndex];

  // 전체 entry 데이터 로드 (카테고리 청크에서)
  const dailyWord = dailyWordLight ? ((await getEntryById(dailyWordLight.id)) ?? null) : null;

  return {
    ...staticData,
    dailyWord,
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
  const { dailyWord, categories: cats, categoryCounts, totalEntries } = useLoaderData<LoaderData>();
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
