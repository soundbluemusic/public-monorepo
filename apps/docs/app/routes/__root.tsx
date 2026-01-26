import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import '../styles/app.css';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#2563eb' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/public-monorepo/favicon.svg' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/public-monorepo/apple-touch-icon.png' },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
