import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import type { Category, MeaningEntry } from '@/data/types';
import { useI18n } from '@/i18n';
import { studyRecords } from '@/lib/db';
import styles from '@/styles/pages.module.scss';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router';

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 */
export async function loader({ params }: { params: { categoryId: string } }) {
  const category = categories.find((c) => c.id === params.categoryId);
  const entries = meaningEntries.filter((e) => e.categoryId === params.categoryId);
  return { category: category || null, entries };
}

export function meta() {
  return [{ title: 'Category - Context' }];
}

export default function CategoryPage() {
  const { category, entries } = useLoaderData<{
    category: Category | null;
    entries: MeaningEntry[];
  }>();
  const { locale, t, localePath } = useI18n();
  const [studiedIds, setStudiedIds] = useState<Set<string>>(new Set());

  // Load studied words
  useEffect(() => {
    async function loadStudied() {
      const ids = await studyRecords.getStudiedEntryIds();
      setStudiedIds(new Set(ids));
    }
    loadStudied();
  }, []);

  if (!category) {
    return (
      <Layout>
        <div className={styles.emptyState}>
          <p className={styles.textSecondary}>{t('categoryNotFound')}</p>
          <Link to={localePath('/browse')} className={`${styles.link} ${styles.mt4}`}>
            {t('browse')}
          </Link>
        </div>
      </Layout>
    );
  }

  const studiedCount = entries.filter((e) => studiedIds.has(e.id)).length;

  return (
    <Layout>
      <div className={styles.sectionLarge}>
        <div className={`${styles.flexStart} ${styles.flexGap3} ${styles.mb2}`}>
          <span className={styles.text3xl}>{category.icon}</span>
          <h1 className={`${styles.text2xl} ${styles.fontSemibold} ${styles.textPrimary}`}>
            {category.name[locale]}
          </h1>
        </div>
        <p className={styles.textSecondary}>
          {studiedCount}/{entries.length} {locale === 'ko' ? '단어 학습함' : 'words studied'}
        </p>

        {/* Progress bar */}
        {studiedCount > 0 && (
          <div className={`${styles.progressBar} ${styles.mt3}`}>
            <div
              className={styles.progressFill}
              style={{ width: `${(studiedCount / entries.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className={styles.spaceY1}>
        {entries.map((entry) => {
          const translation = entry.translations[locale];
          const isStudied = studiedIds.has(entry.id);

          return (
            <Link key={entry.id} to={localePath(`/entry/${entry.id}`)} className={styles.listItem}>
              <div className={styles.listItemContent}>
                {/* Checkmark */}
                <div className={isStudied ? styles.checkMark : styles.checkPlaceholder}>
                  {isStudied && <Check size={14} style={{ color: 'white' }} />}
                </div>

                {/* Word info */}
                <div
                  className={`${styles.flexStart} ${styles.flexGap3} ${styles.flex1} ${styles.minW0}`}
                >
                  <span className={isStudied ? styles.wordKoreanStudied : styles.wordKorean}>
                    {entry.korean}
                  </span>
                  <span className={styles.wordRomanization}>{entry.romanization}</span>
                </div>
              </div>

              <span className={`${styles.wordTranslation} ${styles.shrink0} ${styles.ml2}`}>
                {translation.word}
              </span>
            </Link>
          );
        })}
      </div>

      {entries.length === 0 && <p className={styles.emptyState}>{t('noCategoryWords')}</p>}
    </Layout>
  );
}
