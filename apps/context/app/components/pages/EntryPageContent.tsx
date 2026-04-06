/**
 * @fileoverview Entry 페이지 공유 컴포넌트 (SSR + D1)
 *
 * 영어/한국어 라우트 파일에서 공통으로 사용하는 UI 컴포넌트입니다.
 * useI18n()을 통해 locale에 따라 자동으로 번역된 텍스트를 표시합니다.
 *
 * - 영어: 발음 가이드, 학습 팁, 영어 부제목, ShareButton, TagList
 * - 한국어: 난이도 배지, 로마자 표기, 간결한 UI
 */

import { toast } from '@soundblue/features/toast';
import {
  type BreadcrumbItem,
  generateBreadcrumbSchema,
  generateDefinedTermSchema,
} from '@soundblue/seo/structured-data';
import { FeedbackButton, ShareButton, TagList } from '@soundblue/ui/components';
import { cn } from '@soundblue/ui/utils';
import { Link } from '@tanstack/react-router';
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
import { useI18n } from '@/i18n';
import { useUserDataStore } from '@/stores/user-data-store';

interface EntryPageContentProps {
  entry: LocaleEntry;
  englishColorName?: string;
}

export function EntryPageContent({ entry, englishColorName }: EntryPageContentProps) {
  const { t, locale, localePath, isKorean } = useI18n();

  const isFavorite = useUserDataStore((state) =>
    state.favorites.some((f) => f.entryId === entry.id),
  );
  const isStudied = useUserDataStore((state) =>
    state.studyRecords.some((r) => r.entryId === entry.id),
  );
  const toggleFavorite = useUserDataStore((state) => state.toggleFavorite);
  const markAsStudiedAction = useUserDataStore((state) => state.markAsStudied);

  const handleMarkAsStudied = () => {
    markAsStudiedAction(entry.id);
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
  const categoryName = category?.name[locale] || entry.categoryId;

  // JSON-LD 구조화 데이터
  const { baseUrl } = APP_CONFIG;
  const entryPath = localePath(`/entry/${entry.id}`);
  const categoryPath = localePath(`/category/${entry.categoryId}`);
  const homePath = localePath('/');

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: t('home'), url: `${baseUrl}${homePath}` },
    {
      name: categoryName,
      url: `${baseUrl}${categoryPath}`,
    },
    { name: entry.korean, url: `${baseUrl}${entryPath}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const definedTermSchema = generateDefinedTermSchema({
    name: entry.korean,
    description: isKorean
      ? entry.translation.explanation
      : `${entry.translation.word} - ${entry.translation.explanation}`,
    termCode: entry.romanization,
    inDefinedTermSet: isKorean ? '한국어 어휘' : 'Korean Vocabulary',
    url: `${baseUrl}${entryPath}`,
    inLanguage: locale,
    educationalLevel: entry.difficulty,
  });

  // 예문 레벨 키
  const levelKeys = ['beginner', 'intermediate', 'advanced', 'master'] as const;

  return (
    <Layout>
      {/* JSON-LD Structured Data - content is generated from trusted entry metadata */}
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
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1
                className={cn(
                  'text-3xl font-bold text-(--text-primary)',
                  isKorean ? 'mb-2' : 'mb-1',
                )}
              >
                {entry.korean}
              </h1>

              {/* English: subtitle with translation word */}
              {!isKorean && (
                <>
                  <p className="text-xl text-(--accent-primary) font-medium mb-2">
                    &ldquo;{translation.word}&rdquo;
                  </p>
                  <p className="text-sm text-(--text-tertiary) mb-3">
                    {t('koreanWordFor')} {translation.word}
                  </p>
                </>
              )}

              {/* Korean: romanization shown small */}
              {isKorean && (
                <p className="text-sm text-(--text-tertiary) mb-3">{entry.romanization}</p>
              )}

              {isKorean ? (
                /* Korean: category + difficulty badge inline */
                <div className="flex items-center gap-2 flex-wrap">
                  {category && (
                    <Link
                      to={`${localePath('/category/$categoryId')}` as string}
                      params={{ categoryId: entry.categoryId }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-(--bg-elevated) text-(--text-secondary) border border-(--border-primary) hover:bg-(--bg-tertiary) transition-colors"
                    >
                      {category.icon && <span>{category.icon}</span>}
                      <span>{categoryName}</span>
                    </Link>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      entry.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                        : entry.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                    }`}
                  >
                    {t(entry.difficulty)}
                  </span>
                </div>
              ) : (
                /* English: category below heading */
                category && (
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
                      <p className="text-sm text-(--text-tertiary) pl-1">
                        {category.description.en}
                      </p>
                    )}
                  </div>
                )
              )}

              {/* Korean: category description below */}
              {isKorean && category?.description?.ko && (
                <p className="text-sm text-(--text-tertiary) mt-2">{category.description.ko}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* ShareButton: English only */}
              {!isKorean && (
                <ShareButton
                  url={`${APP_CONFIG.baseUrl}/entry/${entry.id}`}
                  title={`${entry.korean} - ${translation.word}`}
                  description={translation.explanation}
                  variant="outline"
                  iconOnly
                  size="md"
                />
              )}
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={cn(
                  'min-h-10 min-w-10 flex items-center justify-center rounded-lg transition-colors border',
                  isFavorite
                    ? 'bg-(--accent-primary) text-white border-(--accent-primary)'
                    : 'bg-(--bg-elevated) text-(--text-secondary) border-(--border-primary) hover:bg-(--bg-tertiary)',
                )}
                aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
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
              <span className="text-sm text-(--text-primary)">{t('studied')}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleMarkAsStudied}
              className="min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
            >
              <Check size={18} />
              <span>{t('markAsStudied')}</span>
            </button>
          )}
        </header>

        {/* English only: Pronunciation Guide (top placement) */}
        {!isKorean && (
          <section className="mb-6">
            <PronunciationGuide
              korean={entry.korean}
              romanization={entry.romanization}
              pronunciation={entry.pronunciation}
            />
          </section>
        )}

        {/* Color Swatch - colors category only */}
        {isColorEntry(entry.categoryId) &&
          (() => {
            const colorCode = getColorCodeByName(colorName);
            return colorCode ? (
              <section className="mb-6">
                <h2 className="text-lg font-semibold text-(--text-primary) mb-3">
                  {t('colorPreview')}
                </h2>
                <ColorSwatch colorCode={colorCode} colorName={translation.word} />
              </section>
            ) : null;
          })()}

        {/* Translation / Meaning */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-2">
            {t('englishTranslation')}
          </h2>
          <p className="text-xl text-(--text-secondary) font-medium">{translation.word}</p>
        </section>

        {/* Meaning & Usage / Explanation */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-2">
            {t('meaningAndUsage')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">{translation.explanation}</p>
        </section>

        {/* English only: Learning Tips */}
        {!isKorean && (
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
        )}

        {/* Example Sentences */}
        {translation.examples && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-(--text-primary) mb-3">
              {t('exampleSentences')}
            </h2>
            <div className="space-y-3">
              {levelKeys.map((level) => {
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

        {/* Dialogue Example Section */}
        <section className="mb-6">
          <EntryDialogueDisplay dialogue={entry.dialogue} />
        </section>

        {/* Homonym Section - Similar Words */}
        <HomonymSection korean={entry.korean} currentId={entry.id} className="mb-6" />

        {/* Tags - English only */}
        {!isKorean && entry.tags && entry.tags.length > 0 && (
          <section className="mb-6">
            <TagList
              tags={entry.tags}
              label={`${t('tags')}:`}
              getTagHref={(tag) => localePath(`/tag/${encodeURIComponent(tag)}`)}
            />
          </section>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
          <Link
            to={localePath('/browse')}
            className="inline-block text-sm text-(--accent-primary) hover:underline"
          >
            {t('backToDictionary')}
          </Link>
        </div>

        {/* Feedback Section - review needed */}
        <div className="mt-8 pt-8 border-t border-(--border-primary)">
          <FeedbackButton
            contentId={entry.id}
            question={t('needReview')}
            positiveLabel={t('yesReviewLater')}
            negativeLabel={t('noGotIt')}
            thankYouMessage={t('reviewConfirmed')}
            variant="default"
            onFeedback={(type) => {
              if (type === 'positive') {
                useUserDataStore.getState().addToReview(entry.id);
                toast({ message: t('toast.addedToReview'), type: 'success' });
              } else if (type === 'negative') {
                useUserDataStore.getState().removeFromReview(entry.id);
              }
            }}
          />
        </div>
      </article>
    </Layout>
  );
}
