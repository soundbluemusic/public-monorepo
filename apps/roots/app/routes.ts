import { type RouteConfig, route } from '@react-router/dev/routes';

export default [
  // Consolidated routes with optional locale
  route('(:locale)?', 'routes/($locale)._index.tsx'),
  route('(:locale)?/browse', 'routes/($locale).browse.tsx'),
  route('(:locale)?/search', 'routes/($locale).search.tsx'),
  route('(:locale)?/favorites', 'routes/($locale).favorites.tsx'),
  route('(:locale)?/constants', 'routes/($locale).constants.tsx'),
  route('(:locale)?/about', 'routes/($locale).about.tsx'),
  route('(:locale)?/built-with', 'routes/($locale).built-with.tsx'),
  route('(:locale)?/sitemap', 'routes/($locale).sitemap.tsx'),
  route('(:locale)?/field/:fieldId', 'routes/($locale).field.$fieldId.tsx'),
  route('(:locale)?/concept/:conceptId', 'routes/($locale).concept.$conceptId.tsx'),

  // 404 catch-all
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
