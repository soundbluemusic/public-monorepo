import { index, type RouteConfig, route } from '@react-router/dev/routes';

/**
 * Context 앱 라우트 설정
 *
 * 라우트 파일들은 BUILD_TARGET 환경변수에 따라 조건부로 loader를 export합니다.
 * - pages: clientLoader만 사용 (SPA fallback)
 * - r2/all: loader + clientLoader 모두 사용 (완전한 SSG)
 *
 * 이 방식으로 라우트 파일 중복을 제거하고 단일 파일로 관리합니다.
 */

export default [
  // English routes
  index('routes/_index.tsx'),
  route('browse', 'routes/browse.tsx'),
  route('my-learning', 'routes/my-learning.tsx'),
  route('bookmarks', 'routes/bookmarks.tsx'),
  route('about', 'routes/about.tsx'),
  route('sitemap', 'routes/sitemap.tsx'),
  route('privacy', 'routes/privacy.tsx'),
  route('terms', 'routes/terms.tsx'),
  route('license', 'routes/license.tsx'),
  route('built-with', 'routes/built-with.tsx'),
  route('download', 'routes/download.tsx'),
  route('entry/:entryId', 'routes/entry.$entryId.tsx'),
  route('category/:categoryId', 'routes/category.$categoryId.tsx'),
  route('conversations', 'routes/conversations._index.tsx'),
  route('conversations/:categoryId', 'routes/conversations.$categoryId.tsx'),

  // Korean routes
  route('ko', 'routes/ko._index.tsx'),
  route('ko/browse', 'routes/ko.browse.tsx'),
  route('ko/my-learning', 'routes/ko.my-learning.tsx'),
  route('ko/bookmarks', 'routes/ko.bookmarks.tsx'),
  route('ko/about', 'routes/ko.about.tsx'),
  route('ko/sitemap', 'routes/ko.sitemap.tsx'),
  route('ko/privacy', 'routes/ko.privacy.tsx'),
  route('ko/terms', 'routes/ko.terms.tsx'),
  route('ko/license', 'routes/ko.license.tsx'),
  route('ko/built-with', 'routes/ko.built-with.tsx'),
  route('ko/download', 'routes/ko.download.tsx'),
  route('ko/entry/:entryId', 'routes/ko.entry.$entryId.tsx'),
  route('ko/category/:categoryId', 'routes/ko.category.$categoryId.tsx'),
  route('ko/conversations', 'routes/ko.conversations._index.tsx'),
  route('ko/conversations/:categoryId', 'routes/ko.conversations.$categoryId.tsx'),

  // 404 catch-all
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
