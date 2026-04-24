/**
 * @fileoverview 카테고리 페이지 - 영어 버전 (TanStack Start)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import {
  buildCategoryRouteHead,
  type CategoryLoaderData,
  CategoryPageContent,
  categoryCanonicalPath,
  categoryRouteLoader,
} from '@/components/pages/CategoryPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/category/$categoryId')({
  loader: categoryRouteLoader,
  head: dynamicHeadFactoryEn<CategoryLoaderData>(
    buildCategoryRouteHead,
    APP_CONFIG.baseUrl,
    categoryCanonicalPath,
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const loaderData = Route.useLoaderData();
  return <CategoryPageContent {...loaderData} />;
}
