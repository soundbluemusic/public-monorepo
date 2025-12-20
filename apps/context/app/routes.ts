import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  // English routes
  index('routes/_index.tsx'),
  route('browse', 'routes/browse.tsx'),
  route('about', 'routes/about.tsx'),
  route('sitemap', 'routes/sitemap.tsx'),
  route('privacy', 'routes/privacy.tsx'),
  route('terms', 'routes/terms.tsx'),
  route('license', 'routes/license.tsx'),
  route('built-with', 'routes/built-with.tsx'),
  route('entry/:entryId', 'routes/entry.$entryId.tsx'),
  route('category/:categoryId', 'routes/category.$categoryId.tsx'),

  // Korean routes
  route('ko', 'routes/ko._index.tsx'),
  route('ko/browse', 'routes/ko.browse.tsx'),
  route('ko/about', 'routes/ko.about.tsx'),
  route('ko/sitemap', 'routes/ko.sitemap.tsx'),
  route('ko/privacy', 'routes/ko.privacy.tsx'),
  route('ko/terms', 'routes/ko.terms.tsx'),
  route('ko/license', 'routes/ko.license.tsx'),
  route('ko/built-with', 'routes/ko.built-with.tsx'),
  route('ko/entry/:entryId', 'routes/ko.entry.$entryId.tsx'),
  route('ko/category/:categoryId', 'routes/ko.category.$categoryId.tsx'),

  // 404 catch-all
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
