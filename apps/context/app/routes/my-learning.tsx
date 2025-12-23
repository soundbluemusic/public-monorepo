import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import { useI18n } from '@/i18n';
import { favorites, studyRecords } from '@/lib/db';
import { BookmarkCheck, Calendar, TrendingUp, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';

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
        <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {locale === 'ko' ? '📊 내 학습 현황' : '📊 My Learning Progress'}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ko'
            ? '학습한 단어와 북마크를 확인하세요'
            : 'Track your studied words and bookmarks'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {/* Total Progress */}
        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {locale === 'ko' ? '전체 진행도' : 'Total Progress'}
            </h3>
          </div>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {studiedCount}/{totalWords}
          </p>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: 'var(--accent-primary)',
              }}
            />
          </div>
        </div>

        {/* Completed Categories */}
        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {locale === 'ko' ? '완료 카테고리' : 'Completed'}
            </h3>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {completedCategories}/{categories.length}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {locale === 'ko' ? '카테고리' : 'categories'}
          </p>
        </div>

        {/* Bookmarks */}
        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <BookmarkCheck size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {locale === 'ko' ? '북마크' : 'Bookmarks'}
            </h3>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {favoriteIds.length}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {locale === 'ko' ? '저장된 단어' : 'saved words'}
          </p>
        </div>
      </div>

      {/* Category Progress */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {locale === 'ko' ? '📚 카테고리별 진행도' : '📚 Progress by Category'}
        </h2>
        <div className="space-y-3">
          {categories.map((category) => {
            const progress = categoryProgress[category.id] || { studied: 0, total: 0 };
            const percentage = progress.total > 0 ? (progress.studied / progress.total) * 100 : 0;

            return (
              <Link
                key={category.id}
                to={localePath(`/category/${category.id}`)}
                className="block p-4 rounded-xl transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {category.name[locale]}
                    </span>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {progress.studied}/{progress.total}
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: 'var(--accent-primary)',
                    }}
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
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {locale === 'ko' ? '⭐ 북마크한 단어' : '⭐ Bookmarked Words'}
          </h2>
          <div className="space-y-1">
            {favoriteEntries.slice(0, 10).map((entry) => {
              const translation = entry.translations[locale];
              return (
                <Link
                  key={entry.id}
                  to={localePath(`/entry/${entry.id}`)}
                  className="flex items-baseline justify-between py-3 -mx-2 px-2 rounded transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ borderBottom: '1px solid var(--border-primary)' }}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                      {entry.korean}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      {entry.romanization}
                    </span>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {translation.word}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Studied Words */}
      {recentStudied.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
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
                  className="flex items-baseline justify-between py-3 -mx-2 px-2 rounded transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ borderBottom: '1px solid var(--border-primary)' }}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                      {entry.korean}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      {entry.romanization}
                    </span>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {translation.word}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {studiedCount === 0 && favoriteIds.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
            {locale === 'ko' ? '아직 학습한 단어가 없습니다' : 'No words studied yet'}
          </p>
          <Link
            to={localePath('/browse')}
            className="inline-block px-6 py-3 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
            }}
          >
            {locale === 'ko' ? '학습 시작하기 →' : 'Start Learning →'}
          </Link>
        </div>
      )}
    </Layout>
  );
}
