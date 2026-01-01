import { toast } from '@soundblue/features/toast';
import { cn } from '@soundblue/ui/utils';
import { Bookmark, BookmarkCheck, Check } from 'lucide-react';
import { Link, useLoaderData } from 'react-router';
import { LinkedExample } from '@/components/LinkedExample';
import { Layout } from '@/components/layout';
import type { MeaningEntry } from '@/data/types';
import { useI18n } from '@/i18n';
import { useUserDataStore } from '@/stores/user-data-store';

/**
 * Entry 페이지 (Full SSG 모드)
 *
 * ## SSG 빌드 시
 * - loader에서 entryId로 데이터 조회
 * - 빌드 시 모든 entry 페이지에 대해 .data 파일 생성
 *
 * ## 런타임
 * - useLoaderData로 프리렌더된 데이터 사용
 * - 추가 fetch 불필요
 */

/**
 * Loader: SSG 빌드 시 데이터 로드
 */
export async function loader({ params }: { params: { entryId: string } }) {
  const { getEntryById } = await import('@/data/entries');
  const entry = getEntryById(params.entryId);
  return { entry: entry || null };
}

export function meta() {
  return [{ title: 'Entry - Context' }];
}

export default function EntryPage() {
  const { entry } = useLoaderData<{ entry: MeaningEntry | null }>();
  const { locale, t, localePath } = useI18n();

  // Zustand store - sync state (no useEffect needed)
  const isFavorite = useUserDataStore((state) => (entry?.id ? state.isFavorite(entry.id) : false));
  const isStudied = useUserDataStore((state) => (entry?.id ? state.isStudied(entry.id) : false));
  const toggleFavorite = useUserDataStore((state) => state.toggleFavorite);
  const markAsStudied = useUserDataStore((state) => state.markAsStudied);

  const handleMarkAsStudied = () => {
    if (!entry?.id) return;
    markAsStudied(entry.id);
    toast({
      message: locale === 'ko' ? '학습 완료로 표시되었습니다' : 'Marked as studied',
      type: 'success',
    });
  };

  const handleToggleFavorite = () => {
    if (!entry?.id) return;
    const newState = toggleFavorite(entry.id);
    toast({
      message: newState
        ? locale === 'ko'
          ? '즐겨찾기에 추가되었습니다'
          : 'Added to favorites'
        : locale === 'ko'
          ? '즐겨찾기에서 제거되었습니다'
          : 'Removed from favorites',
      type: 'success',
    });
  };

  // 에러 또는 없는 엔트리
  if (!entry) {
    return (
      <Layout>
        <div className="text-center py-12 px-4 text-(--text-tertiary)">
          <p className="text-(--text-secondary)">{t('entryNotFound')}</p>
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
      <article className="pt-6">
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
