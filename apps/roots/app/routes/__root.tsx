import { OfflineIndicator } from '@soundblue/pwa/react';
import { MotionProvider } from '@soundblue/ui/animation';
import { ErrorBoundary, ToastContainer } from '@soundblue/ui/feedback';
import {
  DARK_MODE_INIT_SCRIPT,
  DARK_MODE_TOGGLE_SCRIPT,
  SIDEBAR_COLLAPSE_INIT_SCRIPT,
  SIDEBAR_COLLAPSE_SCRIPT,
} from '@soundblue/ui/utils';
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router';
import { I18nProvider } from '../i18n';
import '../styles/global.css';

/**
 * Critical CSS for FOUC prevention
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

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'color-scheme', content: 'light dark' },
      { name: 'theme-color', content: '#a5b4fc' },
      { title: 'Roots - Math Documentation' },
      {
        name: 'description',
        content: 'Learn math concepts easily - From basic arithmetic to advanced calculus',
      },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Roots - Math Documentation',
          url: 'https://roots.soundbluemusic.com',
          description: 'Learn math concepts easily - From basic arithmetic to advanced calculus',
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
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const lang = pathname.startsWith('/ko') ? 'ko' : 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
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
        {/* Sidebar collapsed init - applies sidebar-collapsed class before React hydrates */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for sidebar state flash prevention
          dangerouslySetInnerHTML={{ __html: SIDEBAR_COLLAPSE_INIT_SCRIPT }}
        />
        <HeadContent />
      </head>
      <body>
        <MotionProvider>
          <I18nProvider>
            <ErrorBoundary>
              <OfflineIndicator />
              <Outlet />
              <ToastContainer />
            </ErrorBoundary>
          </I18nProvider>
        </MotionProvider>
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
      </body>
    </html>
  );
}
