import { OfflineIndicator } from '@soundblue/pwa/react';
import { MotionProvider } from '@soundblue/ui/animation';
import { ErrorBoundary, ToastContainer } from '@soundblue/ui/feedback';
import {
  DARK_MODE_INIT_SCRIPT,
  DARK_MODE_TOGGLE_SCRIPT,
  MOBILE_SIDEBAR_TOGGLE_SCRIPT,
  SIDEBAR_COLLAPSE_SCRIPT,
} from '@soundblue/ui/utils';
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
  --bg-primary: #faf9fc;
  --bg-secondary: #f3f1f8;
  --bg-tertiary: #ebe8f2;
  --bg-elevated: #ffffff;
  --text-primary: #2d2640;
  --text-secondary: #5c5470;
}
.dark {
  --bg-primary: #14121c;
  --bg-secondary: #1c1926;
  --bg-tertiary: #252230;
  --bg-elevated: #2a2638;
  --text-primary: #f0eef5;
  --text-secondary: #b8b3c8;
}
html, body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
`;

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
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c5cff" />
        <meta name="naver-site-verification" content="08c5e0c0cc564309e1781214f8a6e300536c9a69" />
        <meta
          name="google-site-verification"
          content="mw0M1q-2K63FX-NZCL5AetN7V6VI6cXY5ItnMXyl85A"
        />
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
        {/* Sidebar collapse script - handles clicks via event delegation */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for sidebar collapse
          dangerouslySetInnerHTML={{ __html: SIDEBAR_COLLAPSE_SCRIPT }}
        />
        {/* Mobile sidebar toggle script - handles mobile menu button clicks */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for mobile sidebar toggle
          dangerouslySetInnerHTML={{ __html: MOBILE_SIDEBAR_TOGGLE_SCRIPT }}
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
