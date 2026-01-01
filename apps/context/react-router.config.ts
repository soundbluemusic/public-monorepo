import type { Config } from '@react-router/dev/config';
import { extractStaticRoutes, generateI18nRoutes } from '@soundblue/i18n';
import routes from './app/routes.js';

/**
 * React Router SSG 설정
 *
 * ## Single Source of Truth
 * - 정적 라우트: routes.ts에서 자동 추출 (extractStaticRoutes)
 * - 동적 라우트: 데이터 기반 생성 (generateI18nRoutes)
 *
 * ## 100% SSG 필수 (SEO 원칙)
 * - 모든 페이지는 빌드 시 완전한 HTML로 생성
 * - 빈 HTML 서빙 금지 (검색엔진 크롤링 필수)
 */
export default {
  ssr: false,
  async prerender() {
    // 정적 라우트: routes.ts에서 자동 추출
    const staticRoutes = extractStaticRoutes(routes);

    // 동적 라우트: 데이터 기반 생성
    const { categories } = await import('./app/data/categories.js');
    const { getCategoriesWithConversations } = await import('./app/data/conversations.js');

    // Entry routes: 모든 entry 페이지를 SSG로 생성 (SEO 필수)
    const { meaningEntries } = await import('./app/data/entries/index.js');
    const entryRoutes = generateI18nRoutes(meaningEntries, (entry) => `/entry/${entry.id}`);

    // Category routes
    const categoryRoutes = generateI18nRoutes(categories, (category) => `/category/${category.id}`);

    // Conversation routes
    const conversationCategoryIds = getCategoriesWithConversations();
    const conversationRoutes = generateI18nRoutes(
      conversationCategoryIds,
      (categoryId) => `/conversations/${categoryId}`,
    );

    const allRoutes = [...staticRoutes, ...entryRoutes, ...categoryRoutes, ...conversationRoutes];
    console.log(`[SSG] Total prerender routes: ${allRoutes.length}`);

    return allRoutes;
  },
} satisfies Config;
