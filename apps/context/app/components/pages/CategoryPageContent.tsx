/**
 * @fileoverview Category 페이지 공유 컴포넌트 + 라우트 헬퍼 (loader / head builder / canonical)
 */

import { type BreadcrumbItem, generateBreadcrumbSchema } from '@soundblue/seo/structured-data';
import { useAutoAnimate } from '@soundblue/ui/hooks';
import { Pagination } from '@soundblue/ui/patterns';
import { ProgressBar } from '@soundblue/ui/primitives';
import { notFound, useNavigate, useRouterState } from '@tanstack/react-router';
import { useCallback } from 'react';
import { EntryListItem } from '@/components/entry/EntryListItem';
import { Layout } from '@/components/layout';
import { PAGE_SIZE } from '@/constants';
import { getCategoryById } from '@/data/categories';
import type { Category, LocaleEntry } from '@/data/types';
import { fetchEntriesByCategoryPaginated } from '@/services/d1-server';

export interface CategoryLoaderData {
  category: Category;
  entries: LocaleEntry[];
  currentPage: number;
  totalCount: number;
  totalPages: number;
}

/** `category/$categoryId` 라우트 쌍이 공유하는 loader. locale은 pathname으로 감지. */
export async function categoryRouteLoader({
  params,
  location,
}: {
  params: { categoryId: string };
  location: { pathname: string; search: Record<string, unknown> };
}): Promise<CategoryLoaderData> {
  const category = getCategoryById(params.categoryId);

  if (!category) {
    throw notFound();
  }

  const locale = location.pathname.startsWith('/ko') ? 'ko' : 'en';
  const pageValue = location.search.page;
  const pageStr = typeof pageValue === 'string' ? pageValue : '1';
  const rawPage = Math.max(1, Number.parseInt(pageStr, 10) || 1);

  let result = await fetchEntriesByCategoryPaginated({
    data: { categoryId: params.categoryId, locale, page: rawPage, pageSize: PAGE_SIZE },
  });

  const totalPages = Math.ceil(result.totalCount / PAGE_SIZE);
  const page = Math.min(rawPage, Math.max(1, totalPages));

  if (page !== rawPage && totalPages > 0) {
    result = await fetchEntriesByCategoryPaginated({
      data: { categoryId: params.categoryId, locale, page, pageSize: PAGE_SIZE },
    });
  }

  return {
    category,
    entries: result.entries,
    currentPage: page,
    totalCount: result.totalCount,
    totalPages,
  };
}

/** `dynamicHeadFactoryEn/Ko`에 전달되는 head builder. */
export function buildCategoryRouteHead(data: CategoryLoaderData | undefined) {
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
}

/** canonical path — `dynamicHeadFactoryKo`가 `/ko`를 자동 prefix 하므로 locale-agnostic. */
export function categoryCanonicalPath(data: CategoryLoaderData): string {
  return `/category/${data.category.id}`;
}

import { APP_CONFIG } from '@/config';
import { useStudyData } from '@/hooks';
import { useI18n } from '@/i18n';

interface CategoryPageContentProps {
  category: Category;
  entries: LocaleEntry[];
  currentPage: number;
  totalCount: number;
  totalPages: number;
}

export function CategoryPageContent({
  category,
  entries,
  currentPage,
  totalCount,
  totalPages,
}: CategoryPageContentProps) {
  const { locale, t, localePath } = useI18n();
  const routerState = useRouterState();
  const navigate = useNavigate();

  const { studiedIds } = useStudyData({ totalEntries: totalCount });
  const [listRef] = useAutoAnimate<HTMLDivElement>();

  const studiedCount = entries.filter((e) => studiedIds.has(e.id)).length;

  const { baseUrl } = APP_CONFIG;

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: t('home'), url: `${baseUrl}${localePath('/')}` },
    { name: category.name[locale], url: `${baseUrl}${localePath(`/category/${category.id}`)}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const handlePageChange = useCallback(
    (page: number) => {
      // SPA 라우팅으로 페이지 전환 — 전체 새로고침 없이 search 객체 갱신
      // 기존 search params를 유지하면서 page만 변경 (page === 1이면 제거)
      navigate({
        to: routerState.location.pathname,
        search: (prev) => {
          const next = { ...(prev as Record<string, unknown>) };
          if (page === 1) {
            delete next.page;
          } else {
            next.page = String(page);
          }
          return next;
        },
      });
      // 페이지 전환 시 콘텐츠 영역 최상단으로 스크롤 (스크롤 위치 보존 방지)
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [navigate, routerState.location.pathname],
  );

  return (
    <Layout>
      {/* JSON-LD - content is generated from trusted category metadata */}
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
            {studiedCount}/{totalCount} {t('wordsStudied')}
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
