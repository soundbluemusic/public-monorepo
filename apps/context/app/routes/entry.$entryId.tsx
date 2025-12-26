import { Layout } from '@/components/Layout';
import { LinkedExample } from '@/components/LinkedExample';
import { meaningEntries } from '@/data/entries';
import type { MeaningEntry } from '@/data/types';
import { useI18n } from '@/i18n';
import { favorites, studyRecords } from '@/lib/db';
import { cn } from '@soundblue/shared-react';
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
        <div className="text-center py-12 px-4 text-[var(--text-tertiary)]">
          <p className="text-[var(--text-secondary)]">{t('entryNotFound')}</p>
          <Link
            to={localePath('/')}
            className="text-[var(--accent-primary)] hover:underline mt-4 inline-block"
          >
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
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-[var(--text-primary)]">{entry.korean}</h1>
              <p className="text-lg text-[var(--text-tertiary)]">{entry.romanization}</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={cn(
                  'min-h-10 min-w-10 flex items-center justify-center rounded-lg transition-colors border',
                  isFavorite
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]',
                )}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>
            </div>
          </div>

          {/* Study status */}
          {isStudied ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--accent-primary)]">
              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--accent-primary)]">
                <Check size={14} className="text-white" />
              </div>
              <span className="text-sm text-[var(--text-primary)]">
                {locale === 'ko' ? '학습 완료' : 'Studied'}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleMarkAsStudied}
              className="min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-[var(--accent-primary)] text-white hover:brightness-110 active:scale-[0.98]"
            >
              <Check size={18} />
              <span>{locale === 'ko' ? '학습 완료로 표시' : 'Mark as Studied'}</span>
            </button>
          )}
        </header>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {t('translation')}
          </h2>
          <p className="text-[var(--text-secondary)]">{translation.word}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {t('explanation')}
          </h2>
          <p className="text-[var(--text-secondary)]">{translation.explanation}</p>
        </section>

        {translation.examples && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              {t('examples')}
            </h2>
            <div className="space-y-3">
              {(['beginner', 'intermediate', 'advanced', 'master'] as const).map((level) => {
                const example = translation.examples?.[level];
                if (!example) return null;
                return (
                  <div
                    key={level}
                    className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]"
                  >
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-primary)] text-white mb-2">
                      {t(level)}
                    </span>
                    <div className="text-[var(--text-secondary)]">
                      <LinkedExample text={example} currentEntryId={entry.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-8">
          <Link
            to={localePath('/browse')}
            className="inline-block text-sm text-[var(--accent-primary)] hover:underline"
          >
            ← {t('backToList')}
          </Link>
        </div>
      </article>
    </Layout>
  );
}
