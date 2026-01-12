import type { Config } from '@react-router/dev/config';
import { extractStaticRoutes } from '@soundblue/i18n';
import { categoryMeta, getCategorySlug, getLibrarySlug, libraries } from './app/data/libraries.js';
import routes from './app/routes.js';

/**
 * React Router SSG 설정
 *
 * ## Single Source of Truth
 * - 정적 라우트: routes.ts에서 자동 추출 (extractStaticRoutes)
 * - 동적 라우트: libraries, categories 데이터에서 생성
 */
export default {
  ssr: false, // 100% SSG - 서버 없이 정적 파일만 생성
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

    return [...staticRoutes, ...libraryRoutes, ...categoryRoutes];
  },
} satisfies Config;
