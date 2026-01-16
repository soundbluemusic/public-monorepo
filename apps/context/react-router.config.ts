import type { Config } from '@react-router/dev/config';
import { extractStaticRoutes, generateI18nRoutes } from '@soundblue/i18n';
import routes from './app/routes.js';

/**
 * React Router 설정 (SSR + SSG 하이브리드)
 *
 * ## BUILD_MODE 환경변수에 따라 렌더링 모드 선택:
 * - `ssr`: SSR 모드 - Cloudflare Pages Functions + D1 (권장)
 * - (기본): SSG 모드 - 정적 HTML 생성 (레거시)
 *
 * ## BUILD_TARGET 환경변수에 따라 빌드 대상 분리 (SSG 모드 전용):
 * - `pages` (기본): 핵심 페이지만 빌드 → Cloudflare Pages (20K 제한)
 * - `r2`: 엔트리 페이지만 빌드 → R2 업로드 (파일 무제한)
 * - `chunked`: 청크 기반 빌드 → 100만+ 페이지 지원 (CHUNK_INDEX, CHUNK_SIZE 필요)
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
 *
 * ## SSG 청크 빌드 사용법 (100만+ 페이지)
 * ```bash
 * # 청크 메타데이터 확인
 * tsx -e "import('./app/data/route-chunks.js').then(m => m.getChunkMetadata().then(console.log))"
 *
 * # 청크 0 빌드
 * BUILD_TARGET=chunked CHUNK_INDEX=0 CHUNK_SIZE=50000 pnpm build
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

      // sitemap.xml 라우트는 런타임에 D1에서 동적 생성하므로 prerender 제외
      const prerenderRoutes = [...staticRoutes, ...categoryRoutes, ...conversationRoutes].filter(
        (route) => !route.includes('sitemap') || !route.endsWith('.xml'),
      );

      console.log('[SSR] Prerender static routes only, entry pages served dynamically from D1');
      console.log(`[SSR] Sitemap routes excluded from prerender (served dynamically from D1)`);
      return prerenderRoutes;
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

    if (buildTarget === 'chunked') {
      // Chunked: 100만+ 페이지 대응
      // 환경변수로 청크 범위 지정
      const chunkIndex = parseInt(process.env.CHUNK_INDEX || '0', 10);
      const chunkSize = parseInt(process.env.CHUNK_SIZE || '50000', 10);

      const { getRouteChunk, getChunkMetadata } = await import('./app/data/route-chunks.js');
      const metadata = await getChunkMetadata(chunkSize);

      console.log(`[SSG:chunked] Chunk ${chunkIndex + 1}/${metadata.totalChunks}`);
      console.log(
        `[SSG:chunked] Total entries: ${metadata.totalEntries}, Chunk size: ${chunkSize}`,
      );

      const chunkRoutes = await getRouteChunk(chunkIndex, chunkSize);

      // 청크 0에만 정적 라우트 포함 (중복 방지)
      if (chunkIndex === 0) {
        allRoutes = [...staticRoutes, ...categoryRoutes, ...conversationRoutes, ...chunkRoutes];
      } else {
        allRoutes = chunkRoutes;
      }

      console.log(`[SSG:chunked] Prerender routes: ${allRoutes.length}`);
    } else if (buildTarget === 'pages') {
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
