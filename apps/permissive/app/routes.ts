import { type RouteConfig, route } from '@react-router/dev/routes';

/**
 * Permissive 앱 라우트 설정
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
 */
export default [
  // Static pages - English
  route('', 'routes/($locale)._index.tsx', { id: 'en-index' }),
  route('web-api', 'routes/($locale).web-api.tsx', { id: 'en-web-api' }),
  route('libraries', 'routes/($locale).libraries.tsx', { id: 'en-libraries' }),
  route('built-with', 'routes/($locale).built-with.tsx', { id: 'en-built-with' }),
  route('sitemap', 'routes/($locale).sitemap.tsx', { id: 'en-sitemap' }),

  // Static pages - Korean
  route('ko', 'routes/($locale)._index.tsx', { id: 'ko-index' }),
  route('ko/web-api', 'routes/($locale).web-api.tsx', { id: 'ko-web-api' }),
  route('ko/libraries', 'routes/($locale).libraries.tsx', { id: 'ko-libraries' }),
  route('ko/built-with', 'routes/($locale).built-with.tsx', { id: 'ko-built-with' }),
  route('ko/sitemap', 'routes/($locale).sitemap.tsx', { id: 'ko-sitemap' }),

  // Dynamic pages - English
  route('web-api/:slug', 'routes/($locale).web-api.$slug.tsx', { id: 'en-web-api-detail' }),
  route('library/:slug', 'routes/($locale).library.$slug.tsx', { id: 'en-library-detail' }),
  route('category/:categoryId', 'routes/category.$categoryId.tsx', { id: 'en-category' }),

  // Dynamic pages - Korean
  route('ko/web-api/:slug', 'routes/($locale).web-api.$slug.tsx', { id: 'ko-web-api-detail' }),
  route('ko/library/:slug', 'routes/($locale).library.$slug.tsx', { id: 'ko-library-detail' }),
  route('ko/category/:categoryId', 'routes/ko.category.$categoryId.tsx', { id: 'ko-category' }),

  // 404 catch-all
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
