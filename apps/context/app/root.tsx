import { OfflineIndicator } from '@soundblue/pwa/react';
import { ErrorBoundary, ToastContainer } from '@soundblue/ui/feedback';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { I18nProvider } from './i18n';
import './styles/global.css';

/**
 * Layout - Pure HTML structure only, no hooks
 * Follows soundblue-monorepo pattern for proper SSG hydration
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        {/* Inline dark mode init - prevents flash of wrong theme */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for dark mode flash prevention
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('context-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
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

/**
 * AppContent - Interactive wrapper with hooks
 * Hooks are allowed here since it's rendered after hydration
 */
function AppContent() {
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

export default function App() {
  return <AppContent />;
}
