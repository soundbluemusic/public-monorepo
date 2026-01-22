/**
 * @fileoverview Entry 페이지 - 한국어 버전 (SSR + D1)
 */

import { toast } from '@soundblue/features/toast';
import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import {
  type BreadcrumbItem,
  generateBreadcrumbSchema,
  generateDefinedTermSchema,
} from '@soundblue/seo/structured-data';
import { cn } from '@soundblue/ui/utils';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { Bookmark, BookmarkCheck, Check } from 'lucide-react';
import {
  ColorSwatch,
  EntryDialogueDisplay,
  getColorCodeByName,
  HomonymSection,
  isColorEntry,
  LinkedExample,
} from '../../../components/entry';
import { Layout } from '../../../components/layout';
import { APP_CONFIG } from '../../../config';
import { getCategoryById } from '../../../data/categories';
import type { LocaleEntry } from '../../../data/types';
import { useI18n } from '../../../i18n';
import { fetchEntryFromD1 } from '../../../services/d1-server';
import { useUserDataStore } from '../../../stores/user-data-store';

type LoaderData = { entry: LocaleEntry; englishColorName?: string };

export const Route = createFileRoute('/ko/entry/$entryId')({
  loader: async ({ params }) => {
    // TanStack Start: createServerFn을 통해 D1에서 데이터 로드
    // @ts-expect-error - TanStack Start createServerFn type incompatibility
    const entry = await fetchEntryFromD1({ data: { entryId: params.entryId, locale: 'ko' } });

    if (!entry) {
      throw notFound();
    }

    // colors 카테고리의 경우 영어 색상명도 함께 로드 (색상 표시용)
    let englishColorName: string | undefined;
    if (entry.categoryId === 'colors') {
      // @ts-expect-error - TanStack Start createServerFn type incompatibility
      const enEntry = await fetchEntryFromD1({ data: { entryId: params.entryId, locale: 'en' } });
      englishColorName = enEntry?.translation.word;
    }

    return { entry, englishColorName } as LoaderData;
  },
  head: dynamicHeadFactoryKo<LoaderData>(
    (data) => {
      if (!data?.entry) {
        return {
          ko: { title: '찾을 수 없음 | Context' },
          en: { title: 'Not Found | Context' },
        };
      }
      const { entry } = data;
      const category = getCategoryById(entry.categoryId);
      return {
        ko: {
          title: `${entry.korean} - ${entry.translation.word} | Context`,
          description: `${entry.korean} (${entry.romanization}): ${entry.translation.explanation}`,
          keywords: [
            entry.korean,
            `${entry.korean} 뜻`,
            `${entry.korean} 의미`,
            entry.translation.word,
            category?.name.ko || entry.categoryId,
            '한국어 사전',
            '한국어 학습',
          ],
        },
        en: {
          title: `${entry.korean} - ${entry.translation.word} | Context`,
          description: `${entry.korean} (${entry.romanization}): ${entry.translation.explanation}`,
          keywords: [
            entry.korean,
            `${entry.korean} meaning`,
            entry.translation.word,
            category?.name.en || entry.categoryId,
            'Korean dictionary',
            'learn Korean',
          ],
        },
      };
    },
    'https://context.soundbluemusic.com',
    (data) => `/entry/${data.entry.id}`,
  ),
  component: EntryPageKo,
});

function EntryPageKo() {
  const { entry, englishColorName } = Route.useLoaderData();
  const { locale, t, localePath } = useI18n();

  const isFavorite = useUserDataStore((state) =>
    state.favorites.some((f) => f.entryId === entry.id),
  );
  const isStudied = useUserDataStore((state) =>
    state.studyRecords.some((r) => r.entryId === entry.id),
  );
  const toggleFavorite = useUserDataStore((state) => state.toggleFavorite);
  const markAsStudied = useUserDataStore((state) => state.markAsStudied);

  const handleMarkAsStudied = () => {
    markAsStudied(entry.id);
    toast({
      message: t('toast.markedAsStudied'),
      type: 'success',
    });
  };

  const handleToggleFavorite = () => {
    const newState = toggleFavorite(entry.id);
    toast({
      message: newState ? t('toast.addedToFavorites') : t('toast.removedFromFavorites'),
      type: 'success',
    });
  };

  const translation = entry.translation;
  const colorName = englishColorName || translation.word;
  const category = getCategoryById(entry.categoryId);
  const categoryName = category?.name[locale] || category?.name.en || entry.categoryId;

  // JSON-LD 구조화 데이터
  const { baseUrl } = APP_CONFIG;
  const localePrefix = '/ko';

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: '홈', url: `${baseUrl}${localePrefix}` },
    {
      name: categoryName,
      url: `${baseUrl}${localePrefix}/category/${entry.categoryId}`,
    },
    { name: entry.korean, url: `${baseUrl}${localePrefix}/entry/${entry.id}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const definedTermSchema = generateDefinedTermSchema({
    name: entry.korean,
    description: `${entry.translation.word} - ${entry.translation.explanation}`,
    termCode: entry.romanization,
    inDefinedTermSet: 'Korean Vocabulary',
    url: `${baseUrl}${localePrefix}/entry/${entry.id}`,
    inLanguage: locale,
    educationalLevel: entry.difficulty,
  });

  return (
    <Layout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />

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
                aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
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
              <span className="text-sm text-(--text-primary)">학습 완료</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleMarkAsStudied}
              className="min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
            >
              <Check size={18} />
              <span>학습 완료로 표시</span>
            </button>
          )}
        </header>

        {/* Color Swatch - colors 카테고리만 표시 */}
        {isColorEntry(entry.categoryId) &&
          (() => {
            const colorCode = getColorCodeByName(colorName);
            return colorCode ? (
              <section className="mb-6">
                <h2 className="text-lg font-semibold text-(--text-primary) mb-3">색상 미리보기</h2>
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
