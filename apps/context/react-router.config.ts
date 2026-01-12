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

    // 빌드 대상에 따라 라우트 선택
    let allRoutes: string[];

    if (buildTarget === 'pages') {
      // Pages: 핵심 페이지만 (20K 제한 내)
      // 메모리 최적화: lightEntries를 로드하지 않음 (~30MB 절약)
      allRoutes = [...staticRoutes, ...categoryRoutes, ...conversationRoutes];
      console.log(
        `[SSG:pages] Prerender routes: ${allRoutes.length} (entries excluded for memory optimization)`,
      );
    } else if (buildTarget === 'r2') {
      // Entry routes (대량 - R2용) - r2/all 모드에서만 로드
      const { lightEntries } = await import('./app/data/entries/index.js');
      const entryRoutes = generateI18nRoutes(lightEntries, (entry) => `/entry/${entry.id}`);
      // R2: 엔트리 + 정적 페이지 (loader 있는 라우트도 prerender해야 검증 통과)
      // 업로드 스크립트에서 entry 폴더만 선택하므로 정적 페이지는 R2에 업로드되지 않음
      allRoutes = [...staticRoutes, ...entryRoutes, ...categoryRoutes, ...conversationRoutes];
      console.log(
        `[SSG:r2] Prerender routes: ${allRoutes.length} (entries: ${entryRoutes.length})`,
      );
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
