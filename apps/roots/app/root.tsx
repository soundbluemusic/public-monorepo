import { OfflineIndicator } from '@soundblue/pwa/react';
import { MotionProvider } from '@soundblue/ui/animation';
import { ErrorBoundary, ToastContainer } from '@soundblue/ui/feedback';
import { DARK_MODE_INIT_SCRIPT, DARK_MODE_TOGGLE_SCRIPT } from '@soundblue/ui/utils';
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#a5b4fc" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Roots - Math Documentation',
              url: 'https://roots.soundbluemusic.com',
              description:
                'Learn math concepts easily - From basic arithmetic to advanced calculus',
              inLanguage: ['ko', 'en'],
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://roots.soundbluemusic.com/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* Inline dark mode init - prevents flash of wrong theme */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for dark mode flash prevention
          dangerouslySetInnerHTML={{ __html: DARK_MODE_INIT_SCRIPT }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {/* Dark mode toggle script - handles clicks via event delegation */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for dark mode toggle
          dangerouslySetInnerHTML={{ __html: DARK_MODE_TOGGLE_SCRIPT }}
        />
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
    <MotionProvider>
      <I18nProvider>
        <ErrorBoundary>
          <OfflineIndicator />
          <Outlet />
          <ToastContainer />
        </ErrorBoundary>
      </I18nProvider>
    </MotionProvider>
  );
}

export default function App() {
  return <AppContent />;
}
