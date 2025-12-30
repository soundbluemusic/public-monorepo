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
 * ## 100만개+ 확장성
 * - 개별 entry 페이지는 SSG 대신 SPA fallback 사용
 * - /entry/:id → 단일 SPA 라우트, 런타임에 JSON chunk fetch
 * - 카테고리, 대화 등은 개수가 적으므로 SSG 유지
 */

// 환경 변수로 SSG 모드 제어 (기본: full)
// full: 모든 entry 페이지를 SSG로 생성 (751개 × 2 언어 = 1502개)
// hybrid: entry 페이지는 SPA fallback 사용 (대용량 데이터용)
const SSG_MODE = process.env.SSG_MODE || 'full';

export default {
  ssr: false,
  async prerender() {
    // 정적 라우트: routes.ts에서 자동 추출
    const staticRoutes = extractStaticRoutes(routes);

    // 동적 라우트: 데이터 기반 생성
    const { categories } = await import('./app/data/categories.js');
    const { getCategoriesWithConversations } = await import('./app/data/conversations.js');

    // Entry routes: 모드에 따라 결정
    let entryRoutes: string[] = [];
    if (SSG_MODE === 'full') {
      const { meaningEntries } = await import('./app/data/entries/index.js');
      entryRoutes = generateI18nRoutes(meaningEntries, (entry) => `/entry/${entry.id}`);
      console.log(`[SSG] Full mode: ${entryRoutes.length} entry routes`);
    } else {
      console.log(`[SSG] Hybrid mode: Entry pages use SPA fallback`);
    }

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
