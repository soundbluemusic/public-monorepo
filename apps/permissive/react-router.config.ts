import type { Config } from '@react-router/dev/config';
import { extractStaticRoutes } from '@soundblue/i18n';
import { categoryMeta, getLibrarySlug, libraries } from './app/data/libraries.js';
import { getWebApiSlug, webApis } from './app/data/web-apis.js';
import routes from './app/routes.js';

/**
 * React Router SSR 설정
 *
 * ## Single Source of Truth
 * - 정적 라우트: routes.ts에서 자동 추출 (extractStaticRoutes)
 * - 동적 라우트: libraries, categories, webApis 데이터에서 생성
 */
export default {
  ssr: true,
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);

    // Generate library detail routes
    const libraryRoutes = libraries.flatMap((lib) => {
      const slug = getLibrarySlug(lib.name);
      return [`/library/${slug}`, `/ko/library/${slug}`];
    });

    // Generate category routes (All 카테고리 제외)
    const categoryRoutes = categoryMeta
      .filter((cat) => cat.id !== 'all')
      .flatMap((cat) => [`/category/${cat.id}`, `/ko/category/${cat.id}`]);

    // Generate Web API detail routes
    const webApiRoutes = webApis.flatMap((api) => {
      const slug = getWebApiSlug(api.name);
      return [`/web-api/${slug}`, `/ko/web-api/${slug}`];
    });

    return [...staticRoutes, ...libraryRoutes, ...categoryRoutes, ...webApiRoutes];
  },
} satisfies Config;
