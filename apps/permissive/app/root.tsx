import { OfflineIndicator } from '@soundblue/pwa/react';
import { MotionProvider } from '@soundblue/ui/animation';
import { ErrorBoundary, ToastContainer } from '@soundblue/ui/feedback';
import {
  DARK_MODE_INIT_SCRIPT,
  DARK_MODE_TOGGLE_SCRIPT,
  MOBILE_SIDEBAR_TOGGLE_SCRIPT,
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
  --bg-primary: #f7fafa;
  --bg-secondary: #eff5f4;
  --bg-tertiary: #e5efec;
  --bg-elevated: #ffffff;
  --text-primary: #2a3836;
  --text-secondary: #4a5e5a;
}
.dark {
  --bg-primary: #0f1716;
  --bg-secondary: #161f1e;
  --bg-tertiary: #1e2928;
  --bg-elevated: #253332;
  --text-primary: #e5f0ee;
  --text-secondary: #b0c5c2;
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
