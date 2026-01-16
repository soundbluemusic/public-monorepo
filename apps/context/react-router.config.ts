import type { Config } from '@react-router/dev/config';
import { extractStaticRoutes, generateI18nRoutes } from '@soundblue/i18n';
import routes from './app/routes.js';

/**
 * React Router 설정 (SSR + D1 전용)
 *
 * Context 앱은 SSR 모드로만 운영됩니다.
 * 모든 entry 페이지는 Cloudflare D1에서 실시간 조회합니다.
 *
 * ## 정적 페이지 (prerender)
 * - 홈, about, browse 등 정적 페이지
 * - 카테고리 목록 페이지
 * - 대화 목록 페이지
 *
 * ## 동적 페이지 (SSR)
 * - /entry/:entryId - D1에서 실시간 조회
 * - /sitemap*.xml - D1에서 실시간 생성
 */

export default {
  ssr: true,
  async prerender() {
    const staticRoutes = extractStaticRoutes(routes);
    const { categories } = await import('./app/data/categories.js');
    const { getCategoriesWithConversations } = await import('./app/data/conversations.js');

    const categoryRoutes = generateI18nRoutes(categories, (category) => `/category/${category.id}`);
    const conversationCategoryIds = getCategoriesWithConversations();
    const conversationRoutes = generateI18nRoutes(
      conversationCategoryIds,
      (categoryId) => `/conversations/${categoryId}`,
    );

    // sitemap.xml 라우트는 런타임에 D1에서 동적 생성하므로 prerender 제외
    const prerenderRoutes = [...staticRoutes, ...categoryRoutes, ...conversationRoutes].filter(
      (route) => !route.includes('sitemap') || !route.endsWith('.xml'),
    );

    console.log('[SSR] Prerender static routes only, entry pages served dynamically from D1');
    return prerenderRoutes;
  },
} satisfies Config;
