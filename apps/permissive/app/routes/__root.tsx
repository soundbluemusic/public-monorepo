import { OfflineIndicator } from '@soundblue/pwa/react';
import { MotionProvider } from '@soundblue/ui/animation';
import { ErrorBoundary, ToastContainer } from '@soundblue/ui/feedback';
import {
  DARK_MODE_INIT_SCRIPT,
  DARK_MODE_TOGGLE_SCRIPT,
  MOBILE_SIDEBAR_TOGGLE_SCRIPT,
  SIDEBAR_COLLAPSE_INIT_SCRIPT,
  SIDEBAR_COLLAPSE_SCRIPT,
} from '@soundblue/ui/utils';
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { I18nProvider } from '../i18n';
import '../styles/global.css';

/**
 * Critical CSS for FOUC prevention
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
 * JSON-LD WebSite Schema
 */
const WEBSITE_SCHEMA = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Permissive - Free Web Dev Resources',
  url: 'https://permissive.soundbluemusic.com',
  description: 'Discover free and open-source web development tools, libraries, and resources',
  inLanguage: ['ko', 'en'],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://permissive.soundbluemusic.com/libraries?q={search_term_string}',
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
      { name: 'theme-color', content: '#4a9e95' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
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
        {/* Mobile sidebar toggle script - handles mobile menu button clicks */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for mobile sidebar toggle
          dangerouslySetInnerHTML={{ __html: MOBILE_SIDEBAR_TOGGLE_SCRIPT }}
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
