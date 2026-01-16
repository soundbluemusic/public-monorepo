import type { Config } from '@react-router/dev/config';
import { extractStaticRoutes, generateI18nRoutes } from '@soundblue/i18n';
import routes from './app/routes.js';

/**
 * React Router 설정 (SSR 모드)
 *
 * ## BUILD_MODE 환경변수에 따라 렌더링 모드 선택:
 * - `ssr`: SSR 모드 - Cloudflare Pages Functions + D1 (권장)
 * - (기본): SSG 모드 - 정적 HTML 생성 (레거시, pages/all만 지원)
 *
 * ## BUILD_TARGET 환경변수 (SSG 모드 전용):
 * - `pages` (기본): 핵심 페이지만 빌드 → Cloudflare Pages
 * - `all`: 전체 빌드 (로컬 테스트용)
 *
 * ## SSR 모드 사용법
 * ```bash
 * # 개발 서버
 * BUILD_MODE=ssr pnpm dev
 *
 * # 빌드
 * BUILD_MODE=ssr pnpm build
 * ```
 */

const isSSR = process.env.BUILD_MODE === 'ssr';

export default {
  ssr: isSSR,
  async prerender() {
    // SSR 모드에서는 정적 페이지만 prerender
    if (isSSR) {
      const staticRoutes = extractStaticRoutes(routes);
      const { categories } = await import('./app/data/categories.js');
      const { getCategoriesWithConversations } = await import('./app/data/conversations.js');

      const categoryRoutes = generateI18nRoutes(
        categories,
        (category) => `/category/${category.id}`,
      );
      const conversationCategoryIds = getCategoriesWithConversations();
      const conversationRoutes = generateI18nRoutes(
        conversationCategoryIds,
        (categoryId) => `/conversations/${categoryId}`,
      );

      console.log('[SSR] Prerender static routes only, entry pages served dynamically from D1');
      return [...staticRoutes, ...categoryRoutes, ...conversationRoutes];
    }

    // SSG 모드: 기존 로직 유지
    const buildTarget = process.env.BUILD_TARGET || 'pages';

    // 정적 라우트: routes.ts에서 자동 추출
    const staticRoutes = extractStaticRoutes(routes);

    // 동적 라우트: 데이터 기반 생성
    const { categories } = await import('./app/data/categories.js');
    const { getCategoriesWithConversations } = await import('./app/data/conversations.js');

    // Category routes
    const categoryRoutes = generateI18nRoutes(categories, (category) => `/category/${category.id}`);

    // Conversation routes
    const conversationCategoryIds = getCategoriesWithConversations();
    const conversationRoutes = generateI18nRoutes(
      conversationCategoryIds,
      (categoryId) => `/conversations/${categoryId}`,
    );

    // 빌드 대상에 따라 라우트 선택
    let allRoutes: string[];

    if (buildTarget === 'pages') {
      // Pages: 핵심 페이지만
      allRoutes = [...staticRoutes, ...categoryRoutes, ...conversationRoutes];
      console.log(`[SSG:pages] Prerender routes: ${allRoutes.length}`);
    } else {
      // all: 전체 (로컬 테스트용)
      const { lightEntries } = await import('./app/data/entries/index.js');
      const entryRoutes = generateI18nRoutes(lightEntries, (entry) => `/entry/${entry.id}`);
      allRoutes = [...staticRoutes, ...entryRoutes, ...categoryRoutes, ...conversationRoutes];
      console.log(`[SSG:all] Total prerender routes: ${allRoutes.length}`);
    }

    return allRoutes;
  },
} satisfies Config;
