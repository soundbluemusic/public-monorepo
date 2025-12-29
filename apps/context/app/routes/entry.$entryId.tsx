import { cn, Skeleton } from '@soundblue/shared-react';
import { Bookmark, BookmarkCheck, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { LinkedExample } from '@/components/LinkedExample';
import { Layout } from '@/components/layout';
import { useEntryLoader } from '@/hooks/useEntryLoader';
import { useI18n } from '@/i18n';
import { favorites, studyRecords } from '@/lib/db';

/**
 * Entry 페이지 (100만개+ 확장성)
 *
 * ## SPA 모드 (hybrid)
 * - SSG 프리렌더 없음 → loader 없음
 * - 클라이언트에서 청크 파일 동적 fetch
 * - useEntryLoader 훅 사용
 *
 * ## Full SSG 모드 (SSG_MODE=full)
 * - react-router.config.ts에서 모든 entry 경로 프리렌더
 * - 이 경우 별도 loader 파일 사용 권장
 */

export function meta() {
  return [{ title: 'Entry - Context' }];
}

export default function EntryPage() {
  const { entryId } = useParams();
  const { locale, t, localePath } = useI18n();

  // 동적 로딩 훅 (청크에서 fetch)
  const { entry, isLoading, error } = useEntryLoader(entryId);

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

  // 로딩 상태
  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="mb-8">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="mb-6">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="mb-6">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  // 에러 또는 없는 엔트리
  if (error || !entry) {
    return (
      <Layout>
        <div className="text-center py-12 px-4 text-(--text-tertiary)">
          <p className="text-(--text-secondary)">{error ? error.message : t('entryNotFound')}</p>
          <Link
            to={localePath('/')}
            className="text-(--accent-primary) hover:underline mt-4 inline-block"
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
              <h1 className="text-3xl font-bold mb-2 text-(--text-primary)">{entry.korean}</h1>
              <p className="text-lg text-(--text-tertiary)">{entry.romanization}</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={cn(
                  'min-h-10 min-w-10 flex items-center justify-center rounded-lg transition-colors border',
                  isFavorite
                    ? 'bg-(--accent-primary) text-white border-(--accent-primary)'
                    : 'bg-(--bg-elevated) text-(--text-secondary) border-(--border-primary) hover:bg-(--bg-tertiary)',
                )}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>
            </div>
          </div>

          {/* Study status */}
          {isStudied ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--bg-elevated) border border-(--accent-primary)">
              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-(--accent-primary)">
                <Check size={14} className="text-white" />
              </div>
              <span className="text-sm text-(--text-primary)">
                {locale === 'ko' ? '학습 완료' : 'Studied'}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleMarkAsStudied}
              className="min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
            >
              <Check size={18} />
              <span>{locale === 'ko' ? '학습 완료로 표시' : 'Mark as Studied'}</span>
            </button>
          )}
        </header>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-2">{t('translation')}</h2>
          <p className="text-(--text-secondary)">{translation.word}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-2">{t('explanation')}</h2>
          <p className="text-(--text-secondary)">{translation.explanation}</p>
        </section>

        {translation.examples && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-(--text-primary) mb-3">{t('examples')}</h2>
            <div className="space-y-3">
              {(['beginner', 'intermediate', 'advanced', 'master'] as const).map((level) => {
                const example = translation.examples?.[level];
                if (!example) return null;
                return (
                  <div
                    key={level}
                    className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)"
                  >
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-(--accent-primary) text-white mb-2">
                      {t(level)}
                    </span>
                    <div className="text-(--text-secondary)">
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
            className="inline-block text-sm text-(--accent-primary) hover:underline"
          >
            ← {t('backToList')}
          </Link>
        </div>
      </article>
    </Layout>
  );
}
