import { index, type RouteConfig, route } from '@react-router/dev/routes';

export default [
  // English routes
  index('routes/_index.tsx'),
  route('browse', 'routes/browse.tsx'),
  route('search', 'routes/search.tsx'),
  route('favorites', 'routes/favorites.tsx'),
  route('constants', 'routes/constants.tsx'),
  route('about', 'routes/about.tsx'),
  route('built-with', 'routes/built-with.tsx'),
  route('sitemap', 'routes/sitemap.tsx'),
  route('field/:fieldId', 'routes/field.$fieldId.tsx'),
  route('concept/:conceptId', 'routes/concept.$conceptId.tsx'),

  // Korean routes
  route('ko', 'routes/ko._index.tsx'),
  route('ko/browse', 'routes/ko.browse.tsx'),
  route('ko/search', 'routes/ko.search.tsx'),
  route('ko/favorites', 'routes/ko.favorites.tsx'),
  route('ko/constants', 'routes/ko.constants.tsx'),
  route('ko/about', 'routes/ko.about.tsx'),
  route('ko/built-with', 'routes/ko.built-with.tsx'),
  route('ko/sitemap', 'routes/ko.sitemap.tsx'),
  route('ko/field/:fieldId', 'routes/ko.field.$fieldId.tsx'),
  route('ko/concept/:conceptId', 'routes/ko.concept.$conceptId.tsx'),

  // 404 catch-all
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
