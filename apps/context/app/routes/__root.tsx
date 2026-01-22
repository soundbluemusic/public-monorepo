import { OfflineIndicator } from '@soundblue/pwa/react';
import { MotionProvider } from '@soundblue/ui/animation';
import { ErrorBoundary, ToastContainer } from '@soundblue/ui/feedback';
import {
  DARK_MODE_INIT_SCRIPT,
  DARK_MODE_TOGGLE_SCRIPT,
  MOBILE_SIDEBAR_TOGGLE_SCRIPT,
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
 * JSON-LD WebSite Schema
 */
const WEBSITE_SCHEMA = JSON.stringify({
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
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'color-scheme', content: 'light dark' },
      { name: 'theme-color', content: '#7c5cff' },
      { name: 'naver-site-verification', content: '08c5e0c0cc564309e1781214f8a6e300536c9a69' },
      { name: 'google-site-verification', content: 'mw0M1q-2K63FX-NZCL5AetN7V6VI6cXY5ItnMXyl85A' },
      { name: 'msvalidate.01', content: '2555E807B2875180F8DAC1EB5D284D3D' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'manifest', href: '/manifest.json' },
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
        <HeadContent />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
          dangerouslySetInnerHTML={{ __html: WEBSITE_SCHEMA }}
        />
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
        {/* Mobile sidebar toggle script - handles mobile menu button clicks */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for mobile sidebar toggle
          dangerouslySetInnerHTML={{ __html: MOBILE_SIDEBAR_TOGGLE_SCRIPT }}
        />
      </body>
    </html>
  );
}
