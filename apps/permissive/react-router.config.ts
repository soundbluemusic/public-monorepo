import type { Config } from '@react-router/dev/config';
import { extractStaticRoutes } from '@soundblue/shared';
import routes from './app/routes.js';

/**
 * React Router SSG 설정
 *
 * ## Single Source of Truth
 * - 모든 라우트: routes.ts에서 자동 추출 (extractStaticRoutes)
 * - 동적 라우트 없음 (정적 페이지만)
 */
export default {
  ssr: false, // 100% SSG - 서버 없이 정적 파일만 생성
  async prerender() {
    return extractStaticRoutes(routes);
  },
} satisfies Config;
