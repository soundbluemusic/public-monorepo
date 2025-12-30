import { LIMITS } from '@soundblue/core/validation';
import { Skeleton } from '@soundblue/ui/primitives';
import { BookmarkCheck, Calendar, FolderOpen, TrendingUp, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import { Layout } from '@/components/layout';
import type { categories } from '@/data/categories';
import type { MeaningEntry } from '@/data/types';
import { useI18n } from '@/i18n';
import { favorites, studyRecords } from '@/lib/db';

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
  const [entries, setEntries] = useState<MeaningEntry[]>([]);
  const [cats, setCats] = useState<typeof categories>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [studiedIds, setStudiedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [categoryProgress, setCategoryProgress] = useState<
    Record<string, { studied: number; total: number }>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 클라이언트에서 데이터 로드
      const [{ meaningEntries }, { categories: loadedCategories }] = await Promise.all([
        import('@/data/entries'),
        import('@/data/categories'),
      ]);

      setEntries(meaningEntries);
      setCats(loadedCategories);
      setTotalEntries(meaningEntries.length);

      const studied = await studyRecords.getStudiedEntryIds();
      setStudiedIds(studied);

      const favs = await favorites.getAll();
      setFavoriteIds(favs.map((f) => f.entryId));

      const catProgress: Record<string, { studied: number; total: number }> = {};
      const studiedSet = new Set(studied);
      for (const cat of loadedCategories) {
        const catEntries = meaningEntries.filter((e) => e.categoryId === cat.id);
        const studiedInCat = catEntries.filter((e) => studiedSet.has(e.id)).length;
        catProgress[cat.id] = { studied: studiedInCat, total: catEntries.length };
      }
      setCategoryProgress(catProgress);
      setIsLoading(false);
    }
    loadData();
  }, []);

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
        <div className="animate-pulse">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
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

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {/* Total Progress */}
        <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-(--accent-primary)" />
            <h3 className="text-sm font-semibold text-(--text-primary)">{t('totalProgress')}</h3>
          </div>
          <p className="text-2xl font-bold text-(--text-primary) mb-1">
            {studiedCount}/{totalWords}
          </p>
          <div className="w-full h-2 rounded-full overflow-hidden bg-(--bg-secondary)">
            <div
              className="h-full bg-(--accent-primary) transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Completed Categories */}
        <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={20} className="text-(--accent-primary)" />
            <h3 className="text-sm font-semibold text-(--text-primary)">
              {t('completedCategories')}
            </h3>
          </div>
          <p className="text-2xl font-bold text-(--text-primary)">
            {completedCategories}/{totalCategories}
          </p>
          <p className="text-xs text-(--text-tertiary)">{t('categoriesLabel')}</p>
        </div>

        {/* Bookmarks */}
        <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
          <div className="flex items-center gap-2 mb-2">
            <BookmarkCheck size={20} className="text-(--accent-primary)" />
            <h3 className="text-sm font-semibold text-(--text-primary)">{t('bookmarks')}</h3>
          </div>
          <p className="text-2xl font-bold text-(--text-primary)">{favoriteIds.length}</p>
          <p className="text-xs text-(--text-tertiary)">{t('savedWords')}</p>
        </div>
      </div>

      {/* Category Progress */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
          <FolderOpen size={20} aria-hidden="true" />
          {t('progressByCategory')}
        </h2>
        <div className="space-y-3">
          {cats.map((category) => {
            const progress = categoryProgress[category.id] || { studied: 0, total: 0 };
            const percentage = progress.total > 0 ? (progress.studied / progress.total) * 100 : 0;

            return (
              <Link
                key={category.id}
                to={localePath(`/category/${category.id}`)}
                className="block p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-(--border-focus)"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium text-(--text-primary)">
                      {category.name[locale]}
                    </span>
                  </div>
                  <span className="text-sm text-(--text-secondary)">
                    {progress.studied}/{progress.total}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-(--bg-secondary)">
                  <div
                    className="h-full bg-(--accent-primary) transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bookmarked Words */}
      {favoriteEntries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-4">
            {t('bookmarkedWords')}
          </h2>
          <div className="space-y-1">
            {favoriteEntries.slice(0, LIMITS.RECENT_ITEMS_DISPLAY).map((entry) => {
              const translation = entry.translations[locale];
              return (
                <Link
                  key={entry.id}
                  to={localePath(`/entry/${entry.id}`)}
                  className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg border-b border-(--border-primary) transition-colors no-underline hover:bg-(--bg-tertiary)"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-(--text-primary)">
                      {entry.korean}
                    </span>
                    <span className="text-sm text-(--text-tertiary)">{entry.romanization}</span>
                  </div>
                  <span className="text-sm text-(--text-secondary)">{translation.word}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Studied Words */}
      {recentStudied.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
            <Calendar size={20} />
            {t('recentlyStudied')}
          </h2>
          <div className="space-y-1">
            {recentStudied.map((entry) => {
              const translation = entry.translations[locale];
              return (
                <Link
                  key={entry.id}
                  to={localePath(`/entry/${entry.id}`)}
                  className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg border-b border-(--border-primary) transition-colors no-underline hover:bg-(--bg-tertiary)"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-(--text-primary)">
                      {entry.korean}
                    </span>
                    <span className="text-sm text-(--text-tertiary)">{entry.romanization}</span>
                  </div>
                  <span className="text-sm text-(--text-secondary)">{translation.word}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

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
