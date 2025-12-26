import { getLocaleFromPath } from '@soundblue/shared';
import { OfflineIndicator } from '@soundblue/shared-react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router';
import { I18nProvider } from './i18n';
import './styles/global.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const lang = getLocaleFromPath(location.pathname);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for dark mode flash prevention
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('settings-storage');
                  if (stored) {
                    var parsed = JSON.parse(stored);
                    var theme = parsed.state?.theme;
                    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                      document.documentElement.classList.add('dark');
                    }
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
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
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for dark mode toggle - must be at body end
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Use capture phase (true) to intercept before React's event delegation
                document.addEventListener('click', function(e) {
                  var btn = e.target.closest('button[aria-label*="mode" i]');
                  if (!btn) return;

                  var html = document.documentElement;
                  var willBeDark = !html.classList.contains('dark');

                  if (willBeDark) {
                    html.classList.add('dark');
                  } else {
                    html.classList.remove('dark');
                  }

                  // Update localStorage
                  var newTheme = willBeDark ? 'dark' : 'light';
                  try {
                    var currentStored = localStorage.getItem('settings-storage');
                    var newState = currentStored ? JSON.parse(currentStored) : { state: { theme: 'light' }, version: 0 };
                    newState.state.theme = newTheme;
                    localStorage.setItem('settings-storage', JSON.stringify(newState));
                  } catch(err) {}

                  // Update button appearance
                  var sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>';
                  var moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';

                  btn.innerHTML = willBeDark ? sunIcon : moonIcon;
                  btn.setAttribute('aria-label', willBeDark ? 'Switch to light mode' : 'Switch to dark mode');
                  btn.setAttribute('title', willBeDark ? 'Light mode' : 'Dark mode');
                }, true); // <-- capture phase
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <OfflineIndicator />
      <Outlet />
    </I18nProvider>
  );
}
