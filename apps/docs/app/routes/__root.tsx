import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import '../styles/app.css';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#2563eb' },
      { name: 'google-site-verification', content: 'QWPMYT_MaDQIC8WTwnD_iwBWX8QWfeTR1hdkjYIclwc' },
      { title: 'SoundBlue Docs' },
      {
        name: 'description',
        content: 'Complete documentation for Context, Permissive, and Roots applications',
      },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/public-monorepo/favicon.svg' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/public-monorepo/apple-touch-icon.png' },
      { rel: 'manifest', href: '/public-monorepo/manifest.json' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-(--bg-primary) text-(--text-primary)">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
