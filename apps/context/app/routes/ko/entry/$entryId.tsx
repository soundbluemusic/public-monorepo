/**
 * @fileoverview Entry 페이지 - 한국어 버전 (SSR + D1)
 *
 * 한국어 사용자를 위한 간결한 버전입니다.
 * - 발음 가이드 없음 (모국어 화자에게 불필요)
 * - 학습 팁 없음 (모국어 화자에게 불필요)
 * - 한국어 중심 간결한 UI
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
import { fetchEntryFromD1 } from '../../../services/d1-server';
import { useUserDataStore } from '../../../stores/user-data-store';

type LoaderData = { entry: LocaleEntry; englishColorName?: string };

export const Route = createFileRoute('/ko/entry/$entryId')({
  loader: async ({ params }) => {
    const entry = await fetchEntryFromD1({ data: { entryId: params.entryId, locale: 'ko' } });

    if (!entry) {
      throw notFound();
    }

    // colors 카테고리의 경우 영어 색상명도 함께 로드 (색상 표시용)
    let englishColorName: string | undefined;
    if (entry.categoryId === 'colors') {
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
      // 한국어 버전: 간결한 메타 태그
      return {
        ko: {
          title: `${entry.korean} | Context 한국어 사전`,
          description: `${entry.korean}: ${entry.translation.explanation}`,
          keywords: [
            entry.korean,
            `${entry.korean} 뜻`,
            `${entry.korean} 의미`,
            category?.name.ko || entry.categoryId,
            '한국어 사전',
          ],
        },
        en: {
          title: `${entry.korean} - ${entry.translation.word} | Context`,
          description: `${entry.korean} (${entry.romanization}): ${entry.translation.explanation}`,
          keywords: [entry.korean, entry.translation.word, category?.name.en || entry.categoryId],
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
      message: '학습 완료로 표시되었습니다!',
      type: 'success',
    });
  };

  const handleToggleFavorite = () => {
    const newState = toggleFavorite(entry.id);
    toast({
      message: newState ? '즐겨찾기에 추가되었습니다!' : '즐겨찾기에서 제거되었습니다',
      type: 'success',
    });
  };

  const translation = entry.translation;
  const colorName = englishColorName || translation.word;
  const category = getCategoryById(entry.categoryId);
  const categoryName = category?.name.ko || entry.categoryId;

  // JSON-LD 구조화 데이터
  const { baseUrl } = APP_CONFIG;

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: '홈', url: `${baseUrl}/ko` },
    {
      name: categoryName,
      url: `${baseUrl}/ko/category/${entry.categoryId}`,
    },
    { name: entry.korean, url: `${baseUrl}/ko/entry/${entry.id}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const definedTermSchema = generateDefinedTermSchema({
    name: entry.korean,
    description: entry.translation.explanation,
    termCode: entry.romanization,
    inDefinedTermSet: '한국어 어휘',
    url: `${baseUrl}/ko/entry/${entry.id}`,
    inLanguage: 'ko',
    educationalLevel: entry.difficulty,
  });

  // 난이도 한글 레이블
  const difficultyLabels = {
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급',
  };

  // 예문 레벨 한글 레이블
  const levelLabels = {
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급',
    master: '마스터',
  };

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
        {/* Header - 한국어 사용자 중심 간결한 UI */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-(--text-primary)">{entry.korean}</h1>
              {/* 한국어 버전: 로마자는 작게 표시 */}
              <p className="text-sm text-(--text-tertiary) mb-3">{entry.romanization}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {category && (
                  <Link
                    to="/ko/category/$categoryId"
                    params={{ categoryId: entry.categoryId }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-(--bg-elevated) text-(--text-secondary) border border-(--border-primary) hover:bg-(--bg-tertiary) transition-colors"
                  >
                    {category.icon && <span>{category.icon}</span>}
                    <span>{categoryName}</span>
                  </Link>
                )}
                {/* 난이도 배지 */}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    entry.difficulty === 'beginner'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                      : entry.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                  }`}
                >
                  {difficultyLabels[entry.difficulty]}
                </span>
              </div>
              {/* 카테고리 설명 */}
              {category?.description?.ko && (
                <p className="text-sm text-(--text-tertiary) mt-2">{category.description.ko}</p>
              )}
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
                <h2 className="text-lg font-semibold text-(--text-primary) mb-3">색상</h2>
                <ColorSwatch colorCode={colorCode} colorName={translation.word} />
              </section>
            ) : null;
          })()}

        {/* 뜻 */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-2">뜻</h2>
          <p className="text-xl text-(--text-secondary) font-medium">{translation.word}</p>
        </section>

        {/* 설명 */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-2">설명</h2>
          <p className="text-(--text-secondary)">{translation.explanation}</p>
        </section>

        {/* 예문 */}
        {translation.examples && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-(--text-primary) mb-3">예문</h2>
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

        {/* 대화 예시 */}
        <section className="mb-6">
          <EntryDialogueDisplay dialogue={entry.dialogue} />
        </section>

        {/* 동음이의어 */}
        <HomonymSection korean={entry.korean} currentId={entry.id} className="mb-6" />

        <div className="mt-8">
          <Link
            to="/ko/browse"
            className="inline-block text-sm text-(--accent-primary) hover:underline"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>
      </article>
    </Layout>
  );
}
