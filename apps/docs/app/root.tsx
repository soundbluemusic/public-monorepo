import type { LinksFunction, MetaFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import './styles/app.css';

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/public-monorepo/favicon.svg' },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/public-monorepo/apple-touch-icon.png' },
  { rel: 'manifest', href: '/public-monorepo/manifest.json' },
];

export const meta: MetaFunction = () => [
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  { name: 'theme-color', content: '#2563eb' },
  { name: 'google-site-verification', content: 'QWPMYT_MaDQIC8WTwnD_iwBWX8QWfeTR1hdkjYIclwc' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-(--bg-primary) text-(--text-primary)">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
