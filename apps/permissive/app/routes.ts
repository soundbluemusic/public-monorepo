import { type RouteConfig, route } from '@react-router/dev/routes';

/**
 * Permissive 라우트 설정
 *
 * optional locale 패턴 사용: `(:locale)?`
 * - `/` → 영어 (기본)
 * - `/ko` → 한국어
 *
 * 기존 명시적 분리 패턴 (ko.*.tsx)에서 통합 패턴 (($locale).*.tsx)으로 마이그레이션됨.
 * 라우트 파일 수: 14개 → 8개 (43% 감소)
 */
export default [
  // Consolidated routes with optional locale
  route('(:locale)?', 'routes/($locale)._index.tsx'),
  route('(:locale)?/web-api', 'routes/($locale).web-api.tsx'),
  route('(:locale)?/web-api/:slug', 'routes/($locale).web-api.$slug.tsx'),
  route('(:locale)?/libraries', 'routes/($locale).libraries.tsx'),
  route('(:locale)?/library/:slug', 'routes/($locale).library.$slug.tsx'),
  route('(:locale)?/built-with', 'routes/($locale).built-with.tsx'),
  route('(:locale)?/sitemap', 'routes/($locale).sitemap.tsx'),

  // 404 catch-all
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
