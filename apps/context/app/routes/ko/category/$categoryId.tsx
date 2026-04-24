/**
 * @fileoverview 카테고리 페이지 - 한국어 버전 (TanStack Start)
 */

import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import {
  buildCategoryRouteHead,
  type CategoryLoaderData,
  CategoryPageContent,
  categoryCanonicalPath,
  categoryRouteLoader,
} from '@/components/pages/CategoryPageContent';
import { APP_CONFIG } from '@/config';

export const Route = createFileRoute('/ko/category/$categoryId')({
  loader: categoryRouteLoader,
  head: dynamicHeadFactoryKo<CategoryLoaderData>(
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
