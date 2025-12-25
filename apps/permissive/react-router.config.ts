import type { Config } from '@react-router/dev/config';

export default {
  // 100% SSG - 서버 없이 정적 파일만 생성
  ssr: false,

  // 사전 렌더링할 라우트 목록
  async prerender() {
    return [
      '/',
      '/ko',
      '/web-api',
      '/ko/web-api',
      '/libraries',
      '/ko/libraries',
      '/sitemap',
      '/ko/sitemap',
    ];
  },
} satisfies Config;
