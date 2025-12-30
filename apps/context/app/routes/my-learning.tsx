import { LIMITS } from '@soundblue/core/validation';
import { TrendingUp } from 'lucide-react';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import { Layout } from '@/components/layout';
import {
  CategoryProgressList,
  EntryList,
  LoadingState,
  StatsCards,
  useMyLearningData,
} from '@/components/my-learning';
import { useI18n } from '@/i18n';

/**
 * My Learning 페이지
 *
 * 클라이언트 전용 페이지 - SSG prerender 시 데이터 로드하지 않음
 * 모든 데이터는 클라이언트에서 동적으로 로드
 */

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');

  if (isKorean) {
    return [
      { title: '내 학습 현황 - Context' },
      { name: 'description', content: '학습 진행도와 북마크한 단어 확인' },
    ];
  }

  return [
    { title: 'My Learning - Context' },
    { name: 'description', content: 'Track your learning progress and bookmarks' },
  ];
};

export default function MyLearningPage() {
  const { locale, t, localePath } = useI18n();
  const {
    entries,
    cats,
    totalEntries,
    studiedIds,
    favoriteIds,
    categoryProgress,
    isLoading,
    error,
  } = useMyLearningData();

  const favoriteEntries = entries.filter((e) => favoriteIds.includes(e.id));
  const recentStudied = entries
    .filter((e) => studiedIds.includes(e.id))
    .slice(0, LIMITS.RECENT_ITEMS_DISPLAY);
  const totalWords = totalEntries;
  const studiedCount = studiedIds.length;
  const progressPercentage = totalWords > 0 ? (studiedCount / totalWords) * 100 : 0;

  const completedCategories = Object.values(categoryProgress).filter(
    (p) => p.studied > 0 && p.studied === p.total,
  ).length;
  const totalCategories = cats.length;

  // 로딩 상태
  if (isLoading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Layout>
        <div className="text-center py-12 px-4">
          <p className="text-(--text-secondary) mb-4">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110"
          >
            {locale === 'ko' ? '다시 시도' : 'Try Again'}
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) flex items-center gap-2">
          <TrendingUp size={24} aria-hidden="true" />
          {t('myLearningProgress')}
        </h1>
        <p className="text-(--text-secondary)">{t('trackProgressAndBookmarks')}</p>
      </div>

      <StatsCards
        studiedCount={studiedCount}
        totalWords={totalWords}
        progressPercentage={progressPercentage}
        completedCategories={completedCategories}
        totalCategories={totalCategories}
        favoriteCount={favoriteIds.length}
        t={t}
      />

      <CategoryProgressList
        cats={cats}
        categoryProgress={categoryProgress}
        locale={locale}
        localePath={localePath}
        t={t}
      />

      <EntryList
        entries={favoriteEntries.slice(0, LIMITS.RECENT_ITEMS_DISPLAY)}
        locale={locale}
        localePath={localePath}
        title={t('bookmarkedWords')}
      />

      <EntryList
        entries={recentStudied}
        locale={locale}
        localePath={localePath}
        title={t('recentlyStudied')}
        showIcon
      />

      {/* Empty State */}
      {studiedCount === 0 && favoriteIds.length === 0 && (
        <div className="text-center py-12 px-4 text-(--text-tertiary)">
          <p className="text-lg mb-4">{t('noWordsStudiedYet')}</p>
          <Link
            to={localePath('/browse')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
          >
            {t('startLearning')}
          </Link>
        </div>
      )}
    </Layout>
  );
}
