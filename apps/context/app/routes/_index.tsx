import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import type { Category } from '@/data/types';
import type { MeaningEntry } from '@/data/types';
import { type Language, useI18n } from '@/i18n';
import { studyRecords } from '@/lib/db';
import styles from '@/styles/app.module.scss';
import { FolderOpen, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link, useLoaderData } from 'react-router';

const getPronunciation = (entry: MeaningEntry, locale: Language): string | undefined => {
  switch (locale) {
    case 'en':
      return entry.romanization;
    case 'ko':
      return entry.pronunciation?.korean;
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
      <div className={styles.sectionLarge}>
        <h1 className={styles.pageTitle}>{t('heroTitle')}</h1>
        <p className={styles.textSecondary}>{t('heroSubtitle')}</p>
      </div>

      {/* Overall Progress */}
      {overallProgress.studied > 0 && (
        <div className={`${styles.card} ${styles.sectionLarge}`}>
          <div className={`${styles.flexBetween} ${styles.mb2}`}>
            <h2 className={styles.sectionTitleSmall}>
              <TrendingUp size={18} aria-hidden="true" style={{ marginRight: '0.5rem' }} />
              {locale === 'ko' ? '내 학습 현황' : 'My Progress'}
            </h2>
            <span className={`${styles.textSm} ${styles.textSecondary}`}>
              {overallProgress.studied}/{overallProgress.total} {locale === 'ko' ? '단어' : 'words'}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${overallProgress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Daily Word */}
      {dailyWord && (
        <div className={styles.sectionLarge}>
          <h2 className={styles.sectionTitle}>
            <Sparkles size={20} aria-hidden="true" style={{ marginRight: '0.5rem' }} />
            {locale === 'ko' ? '오늘의 단어' : 'Word of the Day'}
          </h2>
          <Link to={localePath(`/entry/${dailyWord.id}`)} className={styles.cardAccent}>
            <div className={styles.textCenter}>
              <h3 className={`${styles.text3xl} ${styles.fontBold} ${styles.mb2}`}>
                {dailyWord.korean}
              </h3>
              <p className={`${styles.textLg} ${styles.textTertiary} ${styles.mb3}`}>
                {getPronunciation(dailyWord, locale)}
              </p>
              <p className={`${styles.textXl} ${styles.textAccent}`}>
                {dailyWord.translations[locale].word}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Categories Grid */}
      <div className={styles.sectionLarge}>
        <div className={`${styles.flexBetween} ${styles.mb4}`}>
          <h2 className={styles.sectionTitle}>
            <FolderOpen size={20} aria-hidden="true" style={{ marginRight: '0.5rem' }} />
            {locale === 'ko' ? '카테고리별 학습' : 'Learn by Category'}
          </h2>
          <Link to={localePath('/browse')} className={`${styles.textSm} ${styles.textAccent}`}>
            {t('viewAll')} →
          </Link>
        </div>

        <div className={`${styles.grid} ${styles.gridCols2}`}>
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
                className={styles.cardHover}
              >
                <div className={`${styles.flexStart} ${styles.flexGap3} ${styles.mb3}`}>
                  <span className={styles.text2xl}>{category.icon}</span>
                  <div className={styles.flex1}>
                    <h3 className={`${styles.fontSemibold} ${styles.textPrimary}`}>
                      {category.name[locale]}
                    </h3>
                    <p className={`${styles.textXs} ${styles.textTertiary}`}>
                      {progress.studied}/{count} {locale === 'ko' ? '단어' : 'words'}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                {progress.studied > 0 && (
                  <div className={styles.progressBarSmall}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${progress.percentage}%` }}
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
