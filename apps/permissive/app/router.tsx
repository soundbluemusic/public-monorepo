import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
  });

  return router;
}

// TanStack Start server entry용 (필수)
// ⚠️ 싱글톤 금지: Cloudflare Workers는 isolate를 여러 요청에서 공유하므로,
// 싱글톤 router를 쓰면 __store.state.redirect 등 이전 요청 상태가 다음 요청에 누출됩니다.
// (예: /search 경로의 validateSearch가 /search?q= 로의 canonical redirect를 트리거하면,
//  이후 모든 요청이 307 Location: /search?q= 응답을 받아 접속이 깨집니다.)
// 매 요청마다 새 router를 만들도록 createRouter를 그대로 export 합니다.
//
// 동일 fix가 Roots에는 적용됨 (PR #129, commit 177bb1c2). Permissive에서 누락되어
// /ko/, /ko/libraries/ 등 trailing slash 페이지에서 무한 redirect 루프 발생.
export const getRouter = createRouter;

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
