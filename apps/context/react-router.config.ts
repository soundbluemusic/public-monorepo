import type { Config } from '@react-router/dev/config';
import { extractStaticRoutes, generateI18nRoutes } from '@soundblue/i18n';
import routes from './app/routes.js';

/**
 * React Router SSG 설정
 *
 * ## 하이브리드 빌드 전략 (Pages + R2)
 *
 * ### BUILD_TARGET 환경변수에 따라 빌드 대상 분리:
 * - `pages` (기본): 핵심 페이지만 빌드 → Cloudflare Pages (20K 제한)
 * - `r2`: 엔트리 페이지만 빌드 → R2 업로드 (파일 무제한)
 * - `all`: 전체 빌드 (로컬 테스트용)
 *
 * ### 100% SSG 유지 (SEO 원칙)
 * - 모든 페이지는 빌드 시 완전한 HTML로 생성
 * - R2에서 서빙해도 완전한 HTML (빈 HTML 아님)
 */
export default {
  ssr: false,
  async prerender() {
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

    // Entry routes (대량 - R2용)
    const { lightEntries } = await import('./app/data/entries/index.js');
    const entryRoutes = generateI18nRoutes(lightEntries, (entry) => `/entry/${entry.id}`);

    // 빌드 대상에 따라 라우트 선택
    let allRoutes: string[];

    if (buildTarget === 'pages') {
      // Pages: 핵심 페이지만 (20K 제한 내)
      allRoutes = [...staticRoutes, ...categoryRoutes, ...conversationRoutes];
      console.log(
        `[SSG:pages] Prerender routes: ${allRoutes.length} (excluding ${entryRoutes.length} entries)`,
      );
    } else if (buildTarget === 'r2') {
      // R2: 엔트리 페이지만
      allRoutes = [...entryRoutes];
      console.log(`[SSG:r2] Prerender routes: ${allRoutes.length} (entries only)`);
    } else {
      // all: 전체 (로컬 테스트용)
      allRoutes = [...staticRoutes, ...entryRoutes, ...categoryRoutes, ...conversationRoutes];
      console.log(`[SSG:all] Total prerender routes: ${allRoutes.length}`);
    }

    return allRoutes;
  },
} satisfies Config;
