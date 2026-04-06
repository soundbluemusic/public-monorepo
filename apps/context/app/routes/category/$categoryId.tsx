/**
 * @fileoverview 카테고리 페이지 - 영어 버전 (TanStack Start)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { CategoryPageContent } from '@/components/pages/CategoryPageContent';
import { APP_CONFIG } from '@/config';
import { PAGE_SIZE } from '@/constants';
import { getCategoryById } from '@/data/categories';
import type { Category, LocaleEntry } from '@/data/types';
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
    const rawPage = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);

    let result = await fetchEntriesByCategoryPaginated({
      data: { categoryId: params.categoryId, locale: 'en', page: rawPage, pageSize: PAGE_SIZE },
    });

    const totalPages = Math.ceil(result.totalCount / PAGE_SIZE);
    const page = Math.min(rawPage, Math.max(1, totalPages));

    // 요청 페이지가 범위 초과 시 마지막 페이지 데이터 재조회
    if (page !== rawPage && totalPages > 0) {
      result = await fetchEntriesByCategoryPaginated({
        data: { categoryId: params.categoryId, locale: 'en', page, pageSize: PAGE_SIZE },
      });
    }

    return {
      category,
      entries: result.entries,
      currentPage: page,
      totalCount: result.totalCount,
      totalPages,
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
  const loaderData = Route.useLoaderData();
  return <CategoryPageContent {...loaderData} />;
}
