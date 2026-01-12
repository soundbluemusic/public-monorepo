import { index, type RouteConfig, route } from '@react-router/dev/routes';

/**
 * Context 앱 라우트 설정
 *
 * ## URL 패턴
 * - /path        → 영어 (locale = undefined)
 * - /ko/path     → 한국어 (locale = 'ko')
 *
 * ## (:locale)? 패턴
 * React Router v7의 optional segment를 사용하여 영어/한국어 라우트를 단일 파일로 관리합니다.
 * - 파일명: ($locale).route-name.tsx
 * - params.locale: undefined (영어) | 'ko' (한국어)
 *
 * ## BUILD_TARGET
 * - pages: clientLoader만 사용 (SPA fallback)
 * - r2/all: loader + clientLoader 모두 사용 (완전한 SSG)
 */

export default [
  // Static pages (optional locale)
  index('routes/_index.tsx'),
  route('ko', 'routes/ko._index.tsx'),
  route('(:locale)?/browse', 'routes/($locale).browse.tsx'),
  route('(:locale)?/my-learning', 'routes/($locale).my-learning.tsx'),
  route('(:locale)?/bookmarks', 'routes/($locale).bookmarks.tsx'),
  route('(:locale)?/about', 'routes/($locale).about.tsx'),
  route('(:locale)?/sitemap', 'routes/($locale).sitemap.tsx'),
  route('(:locale)?/privacy', 'routes/($locale).privacy.tsx'),
  route('(:locale)?/terms', 'routes/($locale).terms.tsx'),
  route('(:locale)?/license', 'routes/($locale).license.tsx'),
  route('(:locale)?/built-with', 'routes/($locale).built-with.tsx'),
  route('(:locale)?/download', 'routes/($locale).download.tsx'),

  // Dynamic pages (optional locale)
  route('(:locale)?/entry/:entryId', 'routes/($locale).entry.$entryId.tsx'),
  route('(:locale)?/category/:categoryId', 'routes/($locale).category.$categoryId.tsx'),
  route('(:locale)?/conversations', 'routes/($locale).conversations._index.tsx'),
  route('(:locale)?/conversations/:categoryId', 'routes/($locale).conversations.$categoryId.tsx'),

  // 404 catch-all
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
