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
  preloadFont,
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
import { shellConfig } from '../shell.config';
import '../styles/global.css';

// Pre-computed values from config
const CRITICAL_THEME_CSS = createCriticalCss(shellConfig.themeColors);
const STRUCTURED_DATA = createStructuredData(shellConfig);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      ...createHeadMeta(shellConfig),
      { title: shellConfig.appName },
      { name: 'description', content: shellConfig.description },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' },
      { rel: 'manifest', href: '/manifest.json' },
      // Font preloading for LCP optimization
      preloadFont(
        'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css',
        'text/css',
      ),
      // Preconnects for external resources
      ...COMMON_PRECONNECTS.jsdelivr(),
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: STRUCTURED_DATA,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const lang = detectLanguage(pathname);

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
        <QueryProvider>
          <I18nProvider>
            <ErrorBoundary>
              <OfflineIndicator />
              <Outlet />
              <ToastContainer />
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
      </body>
    </html>
  );
}
