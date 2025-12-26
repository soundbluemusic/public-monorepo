import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import { useI18n } from '@/i18n';
import { favorites, studyRecords } from '@/lib/db';
import styles from '@/styles/pages.module.scss';
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
      <div className={styles.sectionLarge}>
        <h1 className={styles.pageTitle}>
          {locale === 'ko' ? '📊 내 학습 현황' : '📊 My Learning Progress'}
        </h1>
        <p className={styles.textSecondary}>
          {locale === 'ko'
            ? '학습한 단어와 북마크를 확인하세요'
            : 'Track your studied words and bookmarks'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className={`${styles.grid} ${styles.gridCols3} ${styles.sectionLarge}`}>
        {/* Total Progress */}
        <div className={styles.card}>
          <div className={`${styles.flexStart} ${styles.flexGap2} ${styles.mb2}`}>
            <TrendingUp size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className={styles.sectionTitleSmall}>
              {locale === 'ko' ? '전체 진행도' : 'Total Progress'}
            </h3>
          </div>
          <p className={`${styles.text2xl} ${styles.fontBold} ${styles.textPrimary} ${styles.mb1}`}>
            {studiedCount}/{totalWords}
          </p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        {/* Completed Categories */}
        <div className={styles.card}>
          <div className={`${styles.flexStart} ${styles.flexGap2} ${styles.mb2}`}>
            <Trophy size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className={styles.sectionTitleSmall}>
              {locale === 'ko' ? '완료 카테고리' : 'Completed'}
            </h3>
          </div>
          <p className={`${styles.text2xl} ${styles.fontBold} ${styles.textPrimary}`}>
            {completedCategories}/{categories.length}
          </p>
          <p className={`${styles.textXs} ${styles.textTertiary}`}>
            {locale === 'ko' ? '카테고리' : 'categories'}
          </p>
        </div>

        {/* Bookmarks */}
        <div className={styles.card}>
          <div className={`${styles.flexStart} ${styles.flexGap2} ${styles.mb2}`}>
            <BookmarkCheck size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className={styles.sectionTitleSmall}>{locale === 'ko' ? '북마크' : 'Bookmarks'}</h3>
          </div>
          <p className={`${styles.text2xl} ${styles.fontBold} ${styles.textPrimary}`}>
            {favoriteIds.length}
          </p>
          <p className={`${styles.textXs} ${styles.textTertiary}`}>
            {locale === 'ko' ? '저장된 단어' : 'saved words'}
          </p>
        </div>
      </div>

      {/* Category Progress */}
      <div className={styles.sectionLarge}>
        <h2 className={`${styles.sectionTitle} ${styles.mb4}`}>
          {locale === 'ko' ? '📚 카테고리별 진행도' : '📚 Progress by Category'}
        </h2>
        <div className={styles.spaceY3}>
          {categories.map((category) => {
            const progress = categoryProgress[category.id] || { studied: 0, total: 0 };
            const percentage = progress.total > 0 ? (progress.studied / progress.total) * 100 : 0;

            return (
              <Link
                key={category.id}
                to={localePath(`/category/${category.id}`)}
                className={styles.cardHover}
              >
                <div className={`${styles.flexBetween} ${styles.mb2}`}>
                  <div className={`${styles.flexStart} ${styles.flexGap2}`}>
                    <span className={styles.textXl}>{category.icon}</span>
                    <span className={`${styles.fontMedium} ${styles.textPrimary}`}>
                      {category.name[locale]}
                    </span>
                  </div>
                  <span className={`${styles.textSm} ${styles.textSecondary}`}>
                    {progress.studied}/{progress.total}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bookmarked Words */}
      {favoriteEntries.length > 0 && (
        <div className={styles.sectionLarge}>
          <h2 className={`${styles.sectionTitle} ${styles.mb4}`}>
            {locale === 'ko' ? '⭐ 북마크한 단어' : '⭐ Bookmarked Words'}
          </h2>
          <div className={styles.spaceY1}>
            {favoriteEntries.slice(0, 10).map((entry) => {
              const translation = entry.translations[locale];
              return (
                <Link
                  key={entry.id}
                  to={localePath(`/entry/${entry.id}`)}
                  className={styles.listItem}
                >
                  <div className={`${styles.flexStart} ${styles.flexGap3}`}>
                    <span className={styles.wordKorean}>{entry.korean}</span>
                    <span className={styles.wordRomanization}>{entry.romanization}</span>
                  </div>
                  <span className={styles.wordTranslation}>{translation.word}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Studied Words */}
      {recentStudied.length > 0 && (
        <div className={styles.sectionLarge}>
          <h2
            className={`${styles.sectionTitle} ${styles.flexStart} ${styles.flexGap2} ${styles.mb4}`}
          >
            <Calendar size={20} />
            {locale === 'ko' ? '최근 학습한 단어' : 'Recently Studied'}
          </h2>
          <div className={styles.spaceY1}>
            {recentStudied.map((entry) => {
              const translation = entry.translations[locale];
              return (
                <Link
                  key={entry.id}
                  to={localePath(`/entry/${entry.id}`)}
                  className={styles.listItem}
                >
                  <div className={`${styles.flexStart} ${styles.flexGap3}`}>
                    <span className={styles.wordKorean}>{entry.korean}</span>
                    <span className={styles.wordRomanization}>{entry.romanization}</span>
                  </div>
                  <span className={styles.wordTranslation}>{translation.word}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {studiedCount === 0 && favoriteIds.length === 0 && (
        <div className={styles.emptyState}>
          <p className={`${styles.textLg} ${styles.mb4}`}>
            {locale === 'ko' ? '아직 학습한 단어가 없습니다' : 'No words studied yet'}
          </p>
          <Link to={localePath('/browse')} className={styles.buttonPrimary}>
            {locale === 'ko' ? '학습 시작하기 →' : 'Start Learning →'}
          </Link>
        </div>
      )}
    </Layout>
  );
}
