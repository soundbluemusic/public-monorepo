import { index, type RouteConfig, route } from '@react-router/dev/routes';

/**
 * Context 앱 라우트 설정 (SSR + D1 전용)
 *
 * ## URL 패턴
 * - /path        → 영어 (locale = undefined)
 * - /ko/path     → 한국어 (locale = 'ko')
 *
 * ## 라우트 분리 전략
 * 영어와 한글 라우트를 별도로 정의하고, id 옵션으로 고유 ID를 부여합니다.
 * 동일한 컴포넌트 파일을 재사용하되, 라우트 ID만 분리하여 각각 loader가 실행되도록 합니다.
 *
 * ## SSR + D1 아키텍처
 * 모든 entry 페이지는 Cloudflare D1에서 실시간 조회합니다.
 * SSG 모드는 더 이상 지원하지 않습니다.
 */

// Entry 파일: D1에서 실시간 조회
const entryFile = 'routes/($locale).entry.$entryId.tsx';

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

  // 동적 사이트맵 (D1에서 실시간 생성)
  route('sitemap.xml', 'routes/sitemap.xml.tsx'),
  route('sitemap-pages.xml', 'routes/sitemap-pages.xml.tsx'),
  route('sitemap-categories.xml', 'routes/sitemap-categories.xml.tsx'),
  // Dynamic sitemap: /sitemaps/entries/greetings.xml
  route('sitemaps/entries/:categoryId.xml', 'routes/sitemap-entry-$categoryId.tsx'),

  // API 엔드포인트
  route('api/offline-db', 'routes/api.offline-db.tsx'),

  // 404 catch-all
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
