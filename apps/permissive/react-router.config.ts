import type { Config } from '@react-router/dev/config';
import { extractStaticRoutes } from '@soundblue/i18n';
import { categoryMeta, getLibrarySlug, libraries } from './app/data/libraries.js';
import { getWebApiSlug, webApis } from './app/data/web-apis.js';
import routes from './app/routes.js';

/**
 * React Router 설정 (SSR + SSG 하이브리드)
 *
 * ## BUILD_MODE 환경변수에 따라 렌더링 모드 선택:
 * - `ssr`: SSR 모드 - Cloudflare Pages Functions (동적 렌더링)
 * - (기본): SSG 모드 - 정적 HTML 생성
 *
 * ## SSR 모드 사용법
 * ```bash
 * # 개발 서버
 * BUILD_MODE=ssr pnpm dev
 *
 * # 빌드
 * BUILD_MODE=ssr pnpm build
 * ```
 *
 * ## Single Source of Truth
 * - 정적 라우트: routes.ts에서 자동 추출 (extractStaticRoutes)
 * - 동적 라우트: libraries, categories, webApis 데이터에서 생성
 */

const isSSR = process.env.BUILD_MODE === 'ssr';

export default {
  ssr: isSSR,
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

    // SSR 모드: 모든 페이지 prerender (정적 + 동적)
    // SSG 모드: 동일하게 모든 페이지 prerender
    const allRoutes = [...staticRoutes, ...libraryRoutes, ...categoryRoutes, ...webApiRoutes];

    if (isSSR) {
      console.log(`[SSR] Prerender all routes: ${allRoutes.length}`);
    } else {
      console.log(`[SSG] Prerender all routes: ${allRoutes.length}`);
    }

    return allRoutes;
  },
} satisfies Config;
