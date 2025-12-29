import type { Config } from '@react-router/dev/config';

/**
 * React Router SSG 설정
 *
 * ## 100만개+ 확장성
 * - 개별 entry 페이지는 SSG 대신 SPA fallback 사용
 * - /entry/:id → 단일 SPA 라우트, 런타임에 JSON chunk fetch
 * - 카테고리, 대화 등은 개수가 적으므로 SSG 유지
 *
 * ## 규모별 전략
 * - ~10,000개: 개별 SSG 가능 (현재 751개)
 * - 10,000~100,000개: SPA fallback 권장
 * - 100,000개+: SPA fallback 필수
 */

// 환경 변수로 SSG 모드 제어 (기본: hybrid)
const SSG_MODE = process.env.SSG_MODE || 'hybrid';

export default {
  ssr: false,
  async prerender() {
    const { categories } = await import('./app/data/categories.js');
    const { getCategoriesWithConversations } = await import('./app/data/conversations.js');

    // Base routes (항상 SSG)
    const baseRoutes = [
      '/',
      '/ko',
      '/browse',
      '/ko/browse',
      '/about',
      '/ko/about',
      '/sitemap',
      '/ko/sitemap',
      '/privacy',
      '/ko/privacy',
      '/terms',
      '/ko/terms',
      '/license',
      '/ko/license',
      '/built-with',
      '/ko/built-with',
      '/my-learning',
      '/ko/my-learning',
      '/conversations',
      '/ko/conversations',
    ];

    // Entry routes: 모드에 따라 결정
    let entryRoutes: string[] = [];

    if (SSG_MODE === 'full') {
      // 전체 SSG (10,000개 이하에서만 권장)
      const { meaningEntries } = await import('./app/data/entries/index.js');
      entryRoutes = meaningEntries.flatMap((entry) => [
        `/entry/${entry.id}`,
        `/ko/entry/${entry.id}`,
      ]);
      console.log(`[SSG] Full mode: ${entryRoutes.length} entry routes`);
    } else {
      // SPA fallback (100만개+ 지원)
      // entry 페이지는 빌드하지 않고, 클라이언트에서 동적 로딩
      console.log(`[SSG] Hybrid mode: Entry pages use SPA fallback`);
    }

    // Dynamic category routes (개수 적음 → SSG 유지)
    const categoryRoutes = categories.flatMap((category) => [
      `/category/${category.id}`,
      `/ko/category/${category.id}`,
    ]);

    // Dynamic conversation routes (개수 적음 → SSG 유지)
    const conversationCategoryIds = getCategoriesWithConversations();
    const conversationRoutes = conversationCategoryIds.flatMap((categoryId) => [
      `/conversations/${categoryId}`,
      `/ko/conversations/${categoryId}`,
    ]);

    const allRoutes = [...baseRoutes, ...entryRoutes, ...categoryRoutes, ...conversationRoutes];
    console.log(`[SSG] Total prerender routes: ${allRoutes.length}`);

    return allRoutes;
  },
} satisfies Config;
