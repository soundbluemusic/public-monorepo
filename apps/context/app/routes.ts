import { index, type RouteConfig, route } from '@react-router/dev/routes';

/**
 * Context 앱 라우트 설정
 *
 * ## URL 패턴
 * - /path        → 영어 (locale = undefined)
 * - /ko/path     → 한국어 (locale = 'ko')
 *
 * ## 라우트 분리 전략 (SSG .data 파일 생성 문제 해결)
 * React Router v7 SSG에서 optional parameter `(:locale)?`를 사용하면
 * 첫 번째 경로(/path)에 대해서만 .data 파일이 생성되고,
 * 두 번째 경로(/ko/path)는 loader가 실행되지 않아 데이터가 없는 HTML이 생성됩니다.
 *
 * 해결: 영어와 한글 라우트를 별도로 정의하고, id 옵션으로 고유 ID를 부여합니다.
 * 동일한 컴포넌트 파일을 재사용하되, 라우트 ID만 분리하여 각각 loader가 실행되도록 합니다.
 *
 * ## Entry 라우트 분기
 * React Router SSG에서 동적 라우트에 loader가 있으면 prerender 목록에 있어야 합니다.
 * - BUILD_TARGET=pages: entry가 prerender에 없음 → loader 없는 파일 사용
 * - BUILD_TARGET=r2/all: entry가 prerender에 있음 → loader 있는 파일 사용
 */

const buildTarget = process.env.BUILD_TARGET || 'pages';
const entryFile =
  buildTarget === 'r2' || buildTarget === 'all' || buildTarget === 'chunked'
    ? 'routes/($locale).entry.$entryId.ssg.tsx'
    : 'routes/($locale).entry.$entryId.tsx';

export default [
  // Index pages
  index('routes/_index.tsx'),
  route('ko', 'routes/ko._index.tsx'),

  // Static pages - English
  route('browse', 'routes/($locale).browse.tsx', { id: 'en-browse' }),
  route('my-learning', 'routes/($locale).my-learning.tsx', { id: 'en-my-learning' }),
  route('bookmarks', 'routes/($locale).bookmarks.tsx', { id: 'en-bookmarks' }),
  route('about', 'routes/($locale).about.tsx', { id: 'en-about' }),
  route('sitemap', 'routes/($locale).sitemap.tsx', { id: 'en-sitemap' }),
  route('privacy', 'routes/($locale).privacy.tsx', { id: 'en-privacy' }),
  route('terms', 'routes/($locale).terms.tsx', { id: 'en-terms' }),
  route('license', 'routes/($locale).license.tsx', { id: 'en-license' }),
  route('built-with', 'routes/($locale).built-with.tsx', { id: 'en-built-with' }),
  route('download', 'routes/($locale).download.tsx', { id: 'en-download' }),

  // Static pages - Korean
  route('ko/browse', 'routes/($locale).browse.tsx', { id: 'ko-browse' }),
  route('ko/my-learning', 'routes/($locale).my-learning.tsx', { id: 'ko-my-learning' }),
  route('ko/bookmarks', 'routes/($locale).bookmarks.tsx', { id: 'ko-bookmarks' }),
  route('ko/about', 'routes/($locale).about.tsx', { id: 'ko-about' }),
  route('ko/sitemap', 'routes/($locale).sitemap.tsx', { id: 'ko-sitemap' }),
  route('ko/privacy', 'routes/($locale).privacy.tsx', { id: 'ko-privacy' }),
  route('ko/terms', 'routes/($locale).terms.tsx', { id: 'ko-terms' }),
  route('ko/license', 'routes/($locale).license.tsx', { id: 'ko-license' }),
  route('ko/built-with', 'routes/($locale).built-with.tsx', { id: 'ko-built-with' }),
  route('ko/download', 'routes/($locale).download.tsx', { id: 'ko-download' }),

  // Dynamic pages - English
  route('entry/:entryId', entryFile, { id: 'en-entry' }),
  route('category/:categoryId', 'routes/($locale).category.$categoryId.tsx', { id: 'en-category' }),
  route('conversations', 'routes/($locale).conversations._index.tsx', { id: 'en-conversations' }),
  route('conversations/:categoryId', 'routes/($locale).conversations.$categoryId.tsx', {
    id: 'en-conversations-category',
  }),

  // Dynamic pages - Korean
  route('ko/entry/:entryId', entryFile, { id: 'ko-entry' }),
  route('ko/category/:categoryId', 'routes/($locale).category.$categoryId.tsx', {
    id: 'ko-category',
  }),
  route('ko/conversations', 'routes/($locale).conversations._index.tsx', {
    id: 'ko-conversations',
  }),
  route('ko/conversations/:categoryId', 'routes/($locale).conversations.$categoryId.tsx', {
    id: 'ko-conversations-category',
  }),

  // 404 catch-all
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
