/**
 * @fileoverview 카테고리 페이지 - 한국어 버전 (TanStack Start)
 */

import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import { type BreadcrumbItem, generateBreadcrumbSchema } from '@soundblue/seo/structured-data';
import { useAutoAnimate } from '@soundblue/ui/hooks';
import { ProgressBar } from '@soundblue/ui/primitives';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { EntryListItem } from '@/components/entry/EntryListItem';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import { getCategoryById } from '@/data/categories';
import type { Category, LocaleEntry } from '@/data/types';
import { useStudyData } from '@/hooks';
import { useI18n } from '@/i18n';
import { fetchEntriesByCategoryFromD1 } from '@/services/d1-server';

interface LoaderData {
  category: Category;
  entries: LocaleEntry[];
}

export const Route = createFileRoute('/ko/category/$categoryId')({
  loader: async ({ params }): Promise<LoaderData> => {
    const category = getCategoryById(params.categoryId);

    if (!category) {
      throw notFound();
    }

    // D1에서 엔트리 로드 (한국어 페이지이므로 locale: 'ko')
    const entries = await fetchEntriesByCategoryFromD1({
      data: { categoryId: params.categoryId, locale: 'ko' },
    });
    return { category, entries };
  },
  head: dynamicHeadFactoryKo<LoaderData>(
    (data) => {
      if (!data?.category) {
        return {
          ko: { title: 'Not Found | Context' },
          en: { title: 'Not Found | Context' },
        };
      }
      const { category, entries } = data;
      return {
        ko: {
          title: `${category.name.ko} | Context`,
          description: `${category.name.ko} 카테고리의 ${entries.length}개 한국어 단어 학습`,
          keywords: [
            category.name.ko,
            `${category.name.ko} 단어`,
            '한국어 단어 목록',
            '한국어 학습',
            '한국어 어휘',
          ],
        },
        en: {
          title: `${category.name.en} | Context`,
          description: `Learn ${entries.length} Korean words in the ${category.name.en} category`,
          keywords: [
            category.name.en,
            `${category.name.en} words`,
            'Korean vocabulary list',
            'learn Korean',
            'Korean words',
          ],
        },
      };
    },
    APP_CONFIG.baseUrl,
    (data) => `/ko/category/${data.category.id}`,
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category, entries } = Route.useLoaderData();
  const { locale, t, localePath } = useI18n();

  const { studiedIds } = useStudyData({ totalEntries: entries.length });
  const [listRef] = useAutoAnimate<HTMLDivElement>();

  const studiedCount = entries.filter((e) => studiedIds.has(e.id)).length;

  const { baseUrl } = APP_CONFIG;
  const localePrefix = locale === 'ko' ? '/ko' : '';

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: locale === 'ko' ? '홈' : 'Home', url: `${baseUrl}${localePrefix}` },
    { name: category.name[locale], url: `${baseUrl}${localePrefix}/category/${category.id}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <Layout>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="pt-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{category.icon}</span>
            <h1 className="text-2xl font-semibold text-(--text-primary)">
              {category.name[locale]}
            </h1>
          </div>
          <p className="text-(--text-secondary)">
            {studiedCount}/{entries.length} {locale === 'ko' ? '단어 학습함' : 'words studied'}
          </p>

          {studiedCount > 0 && (
            <ProgressBar value={studiedCount} max={entries.length} className="mt-3" />
          )}
        </div>

        <div ref={listRef} className="space-y-1">
          {entries.map((entry) => {
            const isStudied = studiedIds.has(entry.id);

            return (
              <EntryListItem
                key={entry.id}
                entryId={entry.id}
                korean={entry.korean}
                romanization={entry.romanization}
                translation={entry.translation.word}
                isStudied={isStudied}
                locale={locale}
                localePath={localePath}
              />
            );
          })}
        </div>

        {entries.length === 0 && (
          <p className="text-center py-12 px-4 text-(--text-tertiary)">{t('noCategoryWords')}</p>
        )}
      </div>
    </Layout>
  );
}
