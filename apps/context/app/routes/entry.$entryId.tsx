import { Layout } from '@/components/Layout';
import { LinkedExample } from '@/components/LinkedExample';
import { meaningEntries } from '@/data/entries';
import type { MeaningEntry } from '@/data/types';
import { useI18n } from '@/i18n';
import { favorites, studyRecords } from '@/lib/db';
import styles from '@/styles/app.module.scss';
import { Bookmark, BookmarkCheck, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLoaderData, useParams } from 'react-router';

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 */
export async function loader({ params }: { params: { entryId: string } }) {
  const entry = meaningEntries.find((e) => e.id === params.entryId);
  return { entry: entry || null };
}

export function meta() {
  return [{ title: 'Entry - Context' }];
}

export default function EntryPage() {
  const { entry } = useLoaderData<{ entry: MeaningEntry | null }>();
  const { entryId } = useParams();
  const { locale, t, localePath } = useI18n();
  const [isStudied, setIsStudied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Load study and favorite status
  useEffect(() => {
    async function loadStatus() {
      if (!entryId) return;
      const studied = await studyRecords.isStudied(entryId);
      const fav = await favorites.isFavorite(entryId);
      setIsStudied(studied);
      setIsFavorite(fav);
    }
    loadStatus();
  }, [entryId]);

  const handleMarkAsStudied = async () => {
    if (!entryId) return;
    await studyRecords.markAsStudied(entryId);
    setIsStudied(true);
  };

  const handleToggleFavorite = async () => {
    if (!entryId) return;
    const newState = await favorites.toggle(entryId);
    setIsFavorite(newState);
  };

  if (!entry) {
    return (
      <Layout>
        <div className={styles.emptyState}>
          <p className={styles.textSecondary}>{t('entryNotFound')}</p>
          <Link to={localePath('/')} className={`${styles.link} ${styles.mt4}`}>
            {t('backToList')}
          </Link>
        </div>
      </Layout>
    );
  }

  const translation = entry.translations[locale];

  return (
    <Layout>
      <article>
        <header className={styles.sectionLarge}>
          <div className={`${styles.flexBetween} ${styles.flexGap4} ${styles.mb4}`}>
            <div className={styles.flex1}>
              <h1 className={`${styles.text3xl} ${styles.fontBold} ${styles.mb2}`}>
                {entry.korean}
              </h1>
              <p className={`${styles.textLg} ${styles.textTertiary}`}>{entry.romanization}</p>
            </div>

            {/* Action buttons */}
            <div className={`${styles.flexStart} ${styles.flexGap2}`}>
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={isFavorite ? styles.iconButtonActive : styles.iconButton}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>
            </div>
          </div>

          {/* Study status */}
          {isStudied ? (
            <div className={styles.studiedIndicator}>
              <div className={styles.checkMark}>
                <Check size={14} style={{ color: 'white' }} />
              </div>
              <span className={`${styles.textSm} ${styles.textPrimary}`}>
                {locale === 'ko' ? '학습 완료' : 'Studied'}
              </span>
            </div>
          ) : (
            <button type="button" onClick={handleMarkAsStudied} className={styles.buttonPrimary}>
              <Check size={18} />
              <span>{locale === 'ko' ? '학습 완료로 표시' : 'Mark as Studied'}</span>
            </button>
          )}
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('translation')}</h2>
          <p className={styles.textSecondary}>{translation.word}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('explanation')}</h2>
          <p className={styles.textSecondary}>{translation.explanation}</p>
        </section>

        {translation.examples && (
          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${styles.mb3}`}>{t('examples')}</h2>
            <div className={styles.spaceY3}>
              {(['beginner', 'intermediate', 'advanced', 'master'] as const).map((level) => {
                const example = translation.examples?.[level];
                if (!example) return null;
                return (
                  <div key={level} className={styles.card}>
                    <span className={`${styles.badge} ${styles.mb2}`}>{t(level)}</span>
                    <div className={styles.textSecondary}>
                      <LinkedExample text={example} currentEntryId={entry.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className={styles.mt8}>
          <Link to={localePath('/browse')} className={styles.linkBack}>
            ← {t('backToList')}
          </Link>
        </div>
      </article>
    </Layout>
  );
}
