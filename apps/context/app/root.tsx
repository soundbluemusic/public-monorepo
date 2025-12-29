import {
  DARK_MODE_INIT_SCRIPT,
  DARK_MODE_TOGGLE_SCRIPT,
  getLocaleFromPath,
} from '@soundblue/shared';
import { ErrorBoundary, OfflineIndicator, ToastContainer } from '@soundblue/shared-react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router';
import { I18nProvider } from './i18n';
import './styles/global.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const lang = getLocaleFromPath(location.pathname);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c5cff" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Context - Korean Meaning Dictionary',
              url: 'https://context.soundbluemusic.com',
              description:
                'Korean meaning dictionary for learners - Understand Korean words and contexts easily',
              inLanguage: ['ko', 'en'],
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://context.soundbluemusic.com/browse?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for dark mode flash prevention
          dangerouslySetInnerHTML={{ __html: DARK_MODE_INIT_SCRIPT }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for dark mode toggle - must be at body end
          dangerouslySetInnerHTML={{ __html: DARK_MODE_TOGGLE_SCRIPT }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <ErrorBoundary>
        <OfflineIndicator />
        <Outlet />
        <ToastContainer />
      </ErrorBoundary>
    </I18nProvider>
  );
}
