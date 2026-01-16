import { toast } from '@soundblue/features/toast';
import { dynamicMetaFactory, getLocaleFromPath } from '@soundblue/i18n';
import { cn } from '@soundblue/ui/utils';
import { Bookmark, BookmarkCheck, Check } from 'lucide-react';
import { Link, useLoaderData } from 'react-router';
import {
  ColorSwatch,
  EntryDialogueDisplay,
  getColorCodeByName,
  HomonymSection,
  isColorEntry,
  LinkedExample,
} from '@/components/entry';
import { Layout } from '@/components/layout';
import type { LocaleEntry } from '@/data/types';
import { useI18n } from '@/i18n';
import { getEntryByIdFromD1 } from '@/services/d1';
import { useUserDataStore } from '@/stores/user-data-store';

/**
 * Entry 페이지 - SSR + D1 버전
 *
 * 이 파일은 SSR 모드에서 사용됩니다.
 * Cloudflare D1에서 실시간으로 데이터를 조회합니다.
 *
 * URL 패턴:
 * - /entry/:entryId     → 영어
 * - /ko/entry/:entryId  → 한국어
 *
 * ⚠️ 중요: params.locale은 routes.ts 정의 방식 때문에 항상 undefined입니다.
 * 반드시 request.url에서 locale을 추출해야 합니다.
 */

interface LoaderParams {
  entryId: string;
}

interface LoaderData {
  entry: LocaleEntry | null;
  englishColorName?: string;
}

/**
 * loader: SSR 런타임에서 실행
 * Cloudflare D1에서 엔트리 데이터를 조회합니다.
 *
 * @param params - URL 파라미터 (entryId)
 * @param request - HTTP Request 객체
 * @param context - Cloudflare context (D1 바인딩 포함)
 */
export async function loader({
  params,
  request,
  context,
}: {
  params: LoaderParams;
  request: Request;
  context: { cloudflare: { env: CloudflareEnv } };
}): Promise<LoaderData> {
  const db = context.cloudflare.env.DB;

  // URL pathname에서 locale 추출 (params.locale은 항상 undefined)
  const url = new URL(request.url);
  const locale = getLocaleFromPath(url.pathname);

  const entry = await getEntryByIdFromD1(db, params.entryId, locale);

  // colors 카테고리의 경우 영어 색상명도 함께 로드 (색상 표시용)
  let englishColorName: string | undefined;
  if (locale === 'ko' && entry?.categoryId === 'colors') {
    const enEntry = await getEntryByIdFromD1(db, params.entryId, 'en');
    englishColorName = enEntry?.translation.word;
  }

  return { entry: entry || null, englishColorName };
}

/**
 * clientLoader: 클라이언트 네비게이션 시 실행
 * SSR 데이터가 있으면 사용, 없으면 서버에 요청
 */
export async function clientLoader({
  params,
  serverLoader,
}: {
  params: LoaderParams;
  serverLoader: () => Promise<LoaderData>;
}): Promise<LoaderData> {
  return serverLoader();
}

// Hydration fallback
export function HydrateFallback() {
  return null;
}

export const meta = dynamicMetaFactory((data: { entry: LocaleEntry | null }) => {
  if (!data?.entry) {
    return {
      ko: { title: '단어를 찾을 수 없습니다 | Context' },
      en: { title: 'Entry Not Found | Context' },
    };
  }
  const { entry } = data;
  return {
    ko: {
      title: `${entry.korean} - ${entry.translation.word} | Context`,
      description: `${entry.korean} (${entry.romanization}): ${entry.translation.explanation}`,
    },
    en: {
      title: `${entry.korean} - ${entry.translation.word} | Context`,
      description: `${entry.korean} (${entry.romanization}): ${entry.translation.explanation}`,
    },
  };
}, 'https://context.soundbluemusic.com');

export default function EntryPage() {
  const { entry, englishColorName } = useLoaderData<{
    entry: LocaleEntry | null;
    englishColorName?: string;
  }>();
  const { locale, t, localePath } = useI18n();

  const isFavorite = useUserDataStore((state) =>
    entry?.id ? state.favorites.some((f) => f.entryId === entry.id) : false,
  );
  const isStudied = useUserDataStore((state) =>
    entry?.id ? state.studyRecords.some((r) => r.entryId === entry.id) : false,
  );
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

  const translation = entry.translation;

  // 색상 코드: 한국어 페이지는 영어 색상명 사용, 영어 페이지는 translation.word 사용
  const colorName = englishColorName || translation.word;

  return (
    <Layout>
      <article className="pt-6">
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-(--text-primary)">{entry.korean}</h1>
              <p className="text-lg text-(--text-tertiary)">{entry.romanization}</p>
            </div>

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

        {/* Color Swatch - colors 카테고리만 표시 */}
        {isColorEntry(entry.categoryId) &&
          (() => {
            const colorCode = getColorCodeByName(colorName);
            return colorCode ? (
              <section className="mb-6">
                <h2 className="text-lg font-semibold text-(--text-primary) mb-3">
                  {locale === 'ko' ? '색상 미리보기' : 'Color Preview'}
                </h2>
                <ColorSwatch colorCode={colorCode} colorName={translation.word} />
              </section>
            ) : null;
          })()}

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

        {/* Dialogue Example Section (lazy-loaded) */}
        <section className="mb-6">
          <EntryDialogueDisplay entryId={entry.id} hasDialogue={entry.hasDialogue} />
        </section>

        {/* Homonym Section - 같은 발음, 다른 의미 */}
        <HomonymSection korean={entry.korean} currentId={entry.id} className="mb-6" />

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
