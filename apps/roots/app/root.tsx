import { OfflineIndicator } from '@soundblue/pwa/react';
import { MotionProvider } from '@soundblue/ui/animation';
import { ErrorBoundary, ToastContainer } from '@soundblue/ui/feedback';
import { DARK_MODE_INIT_SCRIPT, DARK_MODE_TOGGLE_SCRIPT } from '@soundblue/ui/utils';
import type { MetaArgs } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router';
import { I18nProvider } from './i18n';
import './styles/global.css';

/**
 * Critical CSS for FOUC prevention
 *
 * This CSS MUST be inlined before DARK_MODE_INIT_SCRIPT and external CSS.
 * It defines only the essential variables needed for initial paint.
 *
 * Order in <head>:
 * 1. CRITICAL_THEME_CSS (inline <style>)
 * 2. DARK_MODE_INIT_SCRIPT (inline <script>)
 * 3. External CSS (<link> via <Links />)
 */
const CRITICAL_THEME_CSS = `
:root {
  --bg-primary: #f8fafc;
  --bg-secondary: #f1f5f9;
  --bg-tertiary: #e2e8f0;
  --bg-elevated: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #475569;
}
.dark {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --bg-elevated: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
}
html, body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
`;

export function meta(_: MetaArgs) {
  return [
    { title: 'Roots - Math Documentation' },
    {
      name: 'description',
      content: 'Learn math concepts easily - From basic arithmetic to advanced calculus',
    },
  ];
}

/**
 * Layout - Pure HTML structure only, no hooks
 * Follows soundblue-monorepo pattern for proper SSG hydration
 */
export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const lang = location.pathname.startsWith('/ko') ? 'ko' : 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        {/* Critical theme CSS - MUST be first for FOUC prevention */}
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for FOUC prevention
          dangerouslySetInnerHTML={{ __html: CRITICAL_THEME_CSS }}
        />
        {/* Dark mode init - MUST be after critical CSS but before external CSS */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for dark mode flash prevention
          dangerouslySetInnerHTML={{ __html: DARK_MODE_INIT_SCRIPT }}
        />
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
