import { BookmarkCheck, Calendar, FolderOpen, TrendingUp, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import { Layout } from '@/components/layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import { useI18n } from '@/i18n';
import { favorites, studyRecords } from '@/lib/db';

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
  const { locale, localePath } = useI18n();
  const [studiedIds, setStudiedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [categoryProgress, setCategoryProgress] = useState<
    Record<string, { studied: number; total: number }>
  >({});

  useEffect(() => {
    async function loadData() {
      const studied = await studyRecords.getStudiedEntryIds();
      setStudiedIds(studied);

      const favs = await favorites.getAll();
      setFavoriteIds(favs.map((f) => f.entryId));

      const catProgress: Record<string, { studied: number; total: number }> = {};
      for (const cat of categories) {
        const entries = meaningEntries.filter((e) => e.categoryId === cat.id);
        const studiedInCat = studied.filter((id) => id.startsWith(`${cat.id}-`)).length;
        catProgress[cat.id] = { studied: studiedInCat, total: entries.length };
      }
      setCategoryProgress(catProgress);
    }
    loadData();
  }, []);

  const favoriteEntries = meaningEntries.filter((e) => favoriteIds.includes(e.id));
  const recentStudied = meaningEntries.filter((e) => studiedIds.includes(e.id)).slice(0, 10);
  const totalWords = meaningEntries.length;
  const studiedCount = studiedIds.length;
  const progressPercentage = totalWords > 0 ? (studiedCount / totalWords) * 100 : 0;

  const completedCategories = Object.values(categoryProgress).filter(
    (p) => p.studied > 0 && p.studied === p.total,
  ).length;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) flex items-center gap-2">
          <TrendingUp size={24} aria-hidden="true" />
          {locale === 'ko' ? '내 학습 현황' : 'My Learning Progress'}
        </h1>
        <p className="text-(--text-secondary)">
          {locale === 'ko'
            ? '학습한 단어와 북마크를 확인하세요'
            : 'Track your studied words and bookmarks'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {/* Total Progress */}
        <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-(--accent-primary)" />
            <h3 className="text-sm font-semibold text-(--text-primary)">
              {locale === 'ko' ? '전체 진행도' : 'Total Progress'}
            </h3>
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
              {locale === 'ko' ? '완료 카테고리' : 'Completed'}
            </h3>
          </div>
          <p className="text-2xl font-bold text-(--text-primary)">
            {completedCategories}/{categories.length}
          </p>
          <p className="text-xs text-(--text-tertiary)">
            {locale === 'ko' ? '카테고리' : 'categories'}
          </p>
        </div>

        {/* Bookmarks */}
        <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
          <div className="flex items-center gap-2 mb-2">
            <BookmarkCheck size={20} className="text-(--accent-primary)" />
            <h3 className="text-sm font-semibold text-(--text-primary)">
              {locale === 'ko' ? '북마크' : 'Bookmarks'}
            </h3>
          </div>
          <p className="text-2xl font-bold text-(--text-primary)">{favoriteIds.length}</p>
          <p className="text-xs text-(--text-tertiary)">
            {locale === 'ko' ? '저장된 단어' : 'saved words'}
          </p>
        </div>
      </div>

      {/* Category Progress */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
          <FolderOpen size={20} aria-hidden="true" />
          {locale === 'ko' ? '카테고리별 진행도' : 'Progress by Category'}
        </h2>
        <div className="space-y-3">
          {categories.map((category) => {
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
            {locale === 'ko' ? '북마크한 단어' : 'Bookmarked Words'}
          </h2>
          <div className="space-y-1">
            {favoriteEntries.slice(0, 10).map((entry) => {
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
            {locale === 'ko' ? '최근 학습한 단어' : 'Recently Studied'}
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
          <p className="text-lg mb-4">
            {locale === 'ko' ? '아직 학습한 단어가 없습니다' : 'No words studied yet'}
          </p>
          <Link
            to={localePath('/browse')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
          >
            {locale === 'ko' ? '학습 시작하기 →' : 'Start Learning →'}
          </Link>
        </div>
      )}
    </Layout>
  );
}
