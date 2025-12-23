import { OfflineIndicator } from '@soundblue/shared-react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { I18nProvider } from './i18n';
import './styles/global.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4a9e95" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Permissive - Free Web Dev Resources',
              url: 'https://permissive.soundbluemusic.com',
              description:
                'Discover free and open-source web development tools, libraries, and resources',
              inLanguage: ['ko', 'en'],
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate:
                    'https://permissive.soundbluemusic.com/libraries?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* Prevent FOUC - Apply theme before first paint */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for dark mode flash prevention
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('settings-storage');
                  if (stored) {
                    var parsed = JSON.parse(stored);
                    var theme = parsed.state?.theme;
                    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                      document.documentElement.classList.add('dark');
                    }
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <OfflineIndicator />
      <Outlet />
    </I18nProvider>
  );
}

// Workaround for React Router v7 hydration bug with ssr:false
// https://github.com/remix-run/react-router/issues/12893
export async function clientLoader() {
  return null;
}

export function HydrateFallback() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] z-30">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="skeleton w-8 h-8 rounded-lg" />
            <div className="skeleton h-5 w-24 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton w-9 h-9 rounded-lg" />
            <div className="skeleton w-9 h-9 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="pt-14 md:ml-60">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="skeleton h-9 w-1/4 rounded-lg" />
            <div className="skeleton h-5 w-1/2 rounded" />
            <div className="flex gap-4 mt-4">
              <div className="skeleton h-11 flex-1 rounded-xl" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton h-32 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
