import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  // English routes
  index('routes/_index.tsx'),
  route('web-api', 'routes/web-api.tsx'),
  route('libraries', 'routes/libraries.tsx'),

  // Korean routes
  route('ko', 'routes/ko._index.tsx'),
  route('ko/web-api', 'routes/ko.web-api.tsx'),
  route('ko/libraries', 'routes/ko.libraries.tsx'),

  // 404 catch-all
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
