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
