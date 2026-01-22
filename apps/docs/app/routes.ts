import { index, type RouteConfig, route } from '@react-router/dev/routes';

export default [
  index('routes/_index.tsx'),

  // Catch-all route for docs pages
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
