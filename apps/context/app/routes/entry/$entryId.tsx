/**
 * @fileoverview Entry 페이지 - 영어 버전 (SSR + D1)
 *
 * 외국인 한국어 학습자를 위한 영어 버전입니다.
 * - 발음 가이드 강조
 * - 학습 팁 제공
 * - 영어 중심 설명
 */

import { toast } from '@soundblue/features/toast';
import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import {
  type BreadcrumbItem,
  generateBreadcrumbSchema,
  generateDefinedTermSchema,
} from '@soundblue/seo/structured-data';
import { FeedbackButton, ShareButton } from '@soundblue/ui/components';
import { cn } from '@soundblue/ui/utils';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { Bookmark, BookmarkCheck, Check } from 'lucide-react';
import {
  ColorSwatch,
  EntryDialogueDisplay,
  getColorCodeByName,
  HomonymSection,
  isColorEntry,
  LearningTips,
  LinkedExample,
  PronunciationGuide,
} from '@/components/entry';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import { getCategoryById } from '@/data/categories';
import type { LocaleEntry } from '@/data/types';
import { fetchEntryFromD1 } from '@/services/d1-server';
import { useUserDataStore } from '@/stores/user-data-store';

type LoaderData = { entry: LocaleEntry; englishColorName?: string };

export const Route = createFileRoute('/entry/$entryId')({
  loader: async ({ params }) => {
    const entry = await fetchEntryFromD1({ data: { entryId: params.entryId, locale: 'en' } });

    if (!entry) {
      throw notFound();
    }

    return { entry } as LoaderData;
  },
  head: dynamicHeadFactoryEn<LoaderData>(
    (data) => {
      if (!data?.entry) {
        return {
          ko: { title: 'Not Found | Context' },
          en: { title: 'Not Found | Context' },
        };
      }
      const { entry } = data;
      const category = getCategoryById(entry.categoryId);
      // 영어 버전: 학습자 중심 메타 태그
      return {
        ko: {
          title: `${entry.korean} - ${entry.translation.word} | Context`,
          description: `${entry.korean} (${entry.romanization}): ${entry.translation.explanation}`,
          keywords: [
            entry.korean,
            `${entry.korean} 뜻`,
            entry.translation.word,
            category?.name.ko || entry.categoryId,
          ],
        },
        en: {
          title: `${entry.korean} (${entry.romanization}) - ${entry.translation.word} | Context Korean Dictionary`,
          description: `Learn Korean word "${entry.korean}" (${entry.romanization}). Means "${entry.translation.word}" in English. ${entry.translation.explanation}`,
          keywords: [
            entry.korean,
            `${entry.korean} meaning`,
            `${entry.korean} pronunciation`,
            `how to say ${entry.translation.word} in Korean`,
            entry.translation.word,
            category?.name.en || entry.categoryId,
            'Korean dictionary',
            'learn Korean',
            'Korean vocabulary',
          ],
        },
      };
    },
    'https://context.soundbluemusic.com',
    (data) => `/entry/${data.entry.id}`,
  ),
  component: EntryPage,
});

function EntryPage() {
  const { entry, englishColorName } = Route.useLoaderData();

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
      message: 'Marked as studied!',
      type: 'success',
    });
  };

  const handleToggleFavorite = () => {
    const newState = toggleFavorite(entry.id);
    toast({
      message: newState ? 'Added to favorites!' : 'Removed from favorites',
      type: 'success',
    });
  };

  const translation = entry.translation;
  const colorName = englishColorName || translation.word;
  const category = getCategoryById(entry.categoryId);
  const categoryName = category?.name.en || entry.categoryId;

  // JSON-LD 구조화 데이터
  const { baseUrl } = APP_CONFIG;

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', url: baseUrl },
    {
      name: categoryName,
      url: `${baseUrl}/category/${entry.categoryId}`,
    },
    { name: entry.korean, url: `${baseUrl}/entry/${entry.id}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const definedTermSchema = generateDefinedTermSchema({
    name: entry.korean,
    description: `${entry.translation.word} - ${entry.translation.explanation}`,
    termCode: entry.romanization,
    inDefinedTermSet: 'Korean Vocabulary',
    url: `${baseUrl}/entry/${entry.id}`,
    inLanguage: 'en',
    educationalLevel: entry.difficulty,
  });

  return (
    <Layout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />

      <article className="pt-6">
        {/* Header - 영어 학습자 중심 */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1 text-(--text-primary)">{entry.korean}</h1>
              {/* 영어 버전 전용: 부제목으로 영어 의미 표시 */}
              <p className="text-xl text-(--accent-primary) font-medium mb-2">
                "{translation.word}"
              </p>
              <p className="text-sm text-(--text-tertiary) mb-3">
                Korean word for {translation.word}
              </p>
              {category && (
                <div className="space-y-2">
                  <Link
                    to="/category/$categoryId"
                    params={{ categoryId: entry.categoryId }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-(--bg-elevated) text-(--text-secondary) border border-(--border-primary) hover:bg-(--bg-tertiary) transition-colors"
                  >
                    {category.icon && <span>{category.icon}</span>}
                    <span>{categoryName}</span>
                  </Link>
                  {category.description?.en && (
                    <p className="text-sm text-(--text-tertiary) pl-1">{category.description.en}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <ShareButton
                url={`${APP_CONFIG.baseUrl}/entry/${entry.id}`}
                title={`${entry.korean} - ${translation.word}`}
                description={translation.explanation}
                variant="outline"
                iconOnly
                size="md"
              />
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
              <span className="text-sm text-(--text-primary)">Studied</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleMarkAsStudied}
              className="min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
            >
              <Check size={18} />
              <span>Mark as Studied</span>
            </button>
          )}
        </header>

        {/* 영어 버전 전용: 발음 가이드 (상단 배치) */}
        <section className="mb-6">
          <PronunciationGuide
            korean={entry.korean}
            romanization={entry.romanization}
            pronunciation={entry.pronunciation}
          />
        </section>

        {/* Color Swatch - colors 카테고리만 표시 */}
        {isColorEntry(entry.categoryId) &&
          (() => {
            const colorCode = getColorCodeByName(colorName);
            return colorCode ? (
              <section className="mb-6">
                <h2 className="text-lg font-semibold text-(--text-primary) mb-3">Color Preview</h2>
                <ColorSwatch colorCode={colorCode} colorName={translation.word} />
              </section>
            ) : null;
          })()}

        {/* English Translation - 영어 버전 강조 */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-2">English Translation</h2>
          <p className="text-xl text-(--text-secondary) font-medium">{translation.word}</p>
        </section>

        {/* Meaning & Usage - 확장된 설명 */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-2">Meaning & Usage</h2>
          <p className="text-(--text-secondary) leading-relaxed">{translation.explanation}</p>
        </section>

        {/* 영어 버전 전용: 학습 팁 */}
        <section className="mb-6">
          <LearningTips
            korean={entry.korean}
            difficulty={entry.difficulty}
            partOfSpeech={entry.partOfSpeech}
            categoryId={entry.categoryId}
            translationWord={translation.word}
            categoryDescription={category?.description?.en}
          />
        </section>

        {/* Example Sentences */}
        {translation.examples && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-(--text-primary) mb-3">Example Sentences</h2>
            <div className="space-y-3">
              {(['beginner', 'intermediate', 'advanced', 'master'] as const).map((level) => {
                const example = translation.examples?.[level];
                if (!example) return null;
                const levelLabels = {
                  beginner: 'Beginner',
                  intermediate: 'Intermediate',
                  advanced: 'Advanced',
                  master: 'Master',
                };
                return (
                  <div
                    key={level}
                    className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)"
                  >
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-(--accent-primary) text-white mb-2">
                      {levelLabels[level]}
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

        {/* Dialogue Example Section */}
        <section className="mb-6">
          <EntryDialogueDisplay dialogue={entry.dialogue} />
        </section>

        {/* Homonym Section - Similar Words */}
        <HomonymSection korean={entry.korean} currentId={entry.id} className="mb-6" />

        <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
          <Link
            to="/browse"
            className="inline-block text-sm text-(--accent-primary) hover:underline"
          >
            ← Back to Dictionary
          </Link>
        </div>

        {/* Feedback Section */}
        <div className="mt-8 pt-8 border-t border-(--border-primary)">
          <FeedbackButton
            contentId={entry.id}
            question="Was this page helpful?"
            positiveLabel="Yes"
            negativeLabel="No"
            thankYouMessage="Thanks for your feedback!"
            variant="default"
          />
        </div>
      </article>
    </Layout>
  );
}
