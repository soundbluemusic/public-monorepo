import { QueryProvider } from '@soundblue/features/query';
import { ToastContainer } from '@soundblue/features/toast';
import { OfflineIndicator } from '@soundblue/pwa/react';
import { ErrorBoundary } from '@soundblue/ui/feedback';
import {
  createCriticalCss,
  createHeadMeta,
  createStructuredData,
  detectLanguage,
} from '@soundblue/ui/shell';
import {
  COMMON_PRECONNECTS,
  DARK_MODE_INIT_SCRIPT,
  DARK_MODE_TOGGLE_SCRIPT,
  MOBILE_SIDEBAR_TOGGLE_SCRIPT,
  preloadFont,
  SIDEBAR_COLLAPSE_INIT_SCRIPT,
  SIDEBAR_COLLAPSE_SCRIPT,
} from '@soundblue/ui/utils';
import { createRootRoute, HeadContent, Scripts, useRouterState } from '@tanstack/react-router';
import type * as React from 'react';
import { I18nProvider } from '../i18n';
import { shellConfig } from '../shell.config';
import '../styles/global.css';

// Pre-computed values from config
const CRITICAL_THEME_CSS = createCriticalCss(shellConfig.themeColors);
const STRUCTURED_DATA = createStructuredData(shellConfig);

export const Route = createRootRoute({
  head: () => ({
    meta: createHeadMeta(shellConfig),
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'manifest', href: '/manifest.json' },
      // Font preloading for LCP optimization
      preloadFont(
        'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css',
        'text/css',
      ),
      // Preconnects for external resources
      ...COMMON_PRECONNECTS.jsdelivr(),
    ],
  }),
  shellComponent: RootDocument,
});

/**
 * Root Document Shell (TanStack Start pattern)
 */
function RootDocument({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const lang = detectLanguage(pathname);
  const locale: 'en' | 'ko' = lang === 'ko' ? 'ko' : 'en';

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
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
          dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }}
        />
      </head>
      <body>
        <QueryProvider>
          <I18nProvider>
            <ErrorBoundary locale={locale}>
              <OfflineIndicator locale={locale} />
              {children}
              <ToastContainer locale={locale} />
            </ErrorBoundary>
          </I18nProvider>
        </QueryProvider>
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
