import { index, type RouteConfig, route } from '@react-router/dev/routes';

/**
 * Roots 앱 라우트 설정
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
  // Index pages (home) - use index() function for root path
  index('routes/($locale)._index.tsx', { id: 'en-index' }),
  route('browse', 'routes/($locale).browse.tsx', { id: 'en-browse' }),
  route('search', 'routes/($locale).search.tsx', { id: 'en-search' }),
  route('favorites', 'routes/($locale).favorites.tsx', { id: 'en-favorites' }),
  route('constants', 'routes/($locale).constants.tsx', { id: 'en-constants' }),
  route('about', 'routes/($locale).about.tsx', { id: 'en-about' }),
  route('built-with', 'routes/($locale).built-with.tsx', { id: 'en-built-with' }),
  route('sitemap', 'routes/($locale).sitemap.tsx', { id: 'en-sitemap' }),

  // Static pages - Korean
  route('ko', 'routes/($locale)._index.tsx', { id: 'ko-index' }),
  route('ko/browse', 'routes/($locale).browse.tsx', { id: 'ko-browse' }),
  route('ko/search', 'routes/($locale).search.tsx', { id: 'ko-search' }),
  route('ko/favorites', 'routes/($locale).favorites.tsx', { id: 'ko-favorites' }),
  route('ko/constants', 'routes/($locale).constants.tsx', { id: 'ko-constants' }),
  route('ko/about', 'routes/($locale).about.tsx', { id: 'ko-about' }),
  route('ko/built-with', 'routes/($locale).built-with.tsx', { id: 'ko-built-with' }),
  route('ko/sitemap', 'routes/($locale).sitemap.tsx', { id: 'ko-sitemap' }),

  // Dynamic pages - English
  route('field/:fieldId', 'routes/($locale).field.$fieldId.tsx', { id: 'en-field' }),
  route('concept/:conceptId', 'routes/($locale).concept.$conceptId.tsx', { id: 'en-concept' }),

  // Dynamic pages - Korean
  route('ko/field/:fieldId', 'routes/($locale).field.$fieldId.tsx', { id: 'ko-field' }),
  route('ko/concept/:conceptId', 'routes/($locale).concept.$conceptId.tsx', { id: 'ko-concept' }),

  // 404 catch-all
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
