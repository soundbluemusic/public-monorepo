/**
 * @fileoverview 카테고리 페이지 - 영어 버전 (TanStack Start)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { type BreadcrumbItem, generateBreadcrumbSchema } from '@soundblue/seo/structured-data';
import { useAutoAnimate } from '@soundblue/ui/hooks';
import { Pagination } from '@soundblue/ui/patterns';
import { ProgressBar } from '@soundblue/ui/primitives';
import { createFileRoute, notFound, useRouterState } from '@tanstack/react-router';
import { useCallback } from 'react';
import { EntryListItem } from '@/components/entry/EntryListItem';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import { PAGE_SIZE } from '@/constants';
import { getCategoryById } from '@/data/categories';
import type { Category, LocaleEntry } from '@/data/types';
import { useStudyData } from '@/hooks';
import { useI18n } from '@/i18n';
import { fetchEntriesByCategoryPaginated } from '@/services/d1-server';

interface LoaderData {
  category: Category;
  entries: LocaleEntry[];
  currentPage: number;
  totalCount: number;
  totalPages: number;
}

export const Route = createFileRoute('/category/$categoryId')({
  loader: async ({ params, location }): Promise<LoaderData> => {
    const category = getCategoryById(params.categoryId);

    if (!category) {
      throw notFound();
    }

    const searchParams = new URLSearchParams(location.search);
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);

    const { entries, totalCount } = await fetchEntriesByCategoryPaginated({
      data: { categoryId: params.categoryId, locale: 'en', page, pageSize: PAGE_SIZE },
    });

    return {
      category,
      entries,
      currentPage: page,
      totalCount,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
    };
  },
  head: dynamicHeadFactoryEn<LoaderData>(
    (data) => {
      if (!data?.category) {
        return {
          ko: { title: 'Not Found | Context' },
          en: { title: 'Not Found | Context' },
        };
      }
      const { category, totalCount } = data;
      return {
        ko: {
          title: `${category.name.ko} | Context`,
          description: `${category.name.ko} 카테고리의 ${totalCount}개 한국어 단어 학습`,
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
          description: `Learn ${totalCount} Korean words in the ${category.name.en} category`,
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
    (data) => `/category/${data.category.id}`,
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category, entries, currentPage, totalCount, totalPages } = Route.useLoaderData();
  const { locale, t, localePath } = useI18n();
  const routerState = useRouterState();

  const { studiedIds } = useStudyData({ totalEntries: totalCount });
  const [listRef] = useAutoAnimate<HTMLDivElement>();

  const studiedCount = entries.filter((e) => studiedIds.has(e.id)).length;

  const { baseUrl } = APP_CONFIG;
  const localePrefix = locale === 'ko' ? '/ko' : '';

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: locale === 'ko' ? '홈' : 'Home', url: `${baseUrl}${localePrefix}` },
    { name: category.name[locale], url: `${baseUrl}${localePrefix}/category/${category.id}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(routerState.location.search);
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', String(page));
      }
      const search = params.toString();
      const newUrl = search
        ? `${routerState.location.pathname}?${search}`
        : routerState.location.pathname;
      window.location.href = newUrl;
    },
    [routerState.location.search, routerState.location.pathname],
  );

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
            {studiedCount}/{totalCount} {locale === 'ko' ? '단어 학습함' : 'words studied'}
          </p>

          {studiedCount > 0 && (
            <ProgressBar value={studiedCount} max={totalCount} className="mt-3" />
          )}
        </div>

        {totalPages > 1 && (
          <p className="mb-4 text-sm text-(--text-tertiary)">
            {t('browsePageOf')
              .replace('{current}', String(currentPage))
              .replace('{total}', String(totalPages))}
          </p>
        )}

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

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            labels={{
              navLabel: t('pageNavigation'),
              previousPage: t('previousPage'),
              nextPage: t('nextPage'),
            }}
          />
        )}
      </div>
    </Layout>
  );
}
