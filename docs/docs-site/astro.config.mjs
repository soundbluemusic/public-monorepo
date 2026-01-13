import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://soundbluemusic.github.io',
  base: '/public-monorepo',
  legacy: {
    collections: true,
  },
  vite: {
    ssr: {
      noExternal: ['nanoid'],
    },
  },
  integrations: [
    starlight({
      title: 'SoundBlue Docs',
      description: 'Complete documentation for Context, Permissive, and Roots applications',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: false,
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/soundbluemusic/public-monorepo' },
      ],
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        ko: { label: '한국어', lang: 'ko' },
        ja: { label: '日本語', lang: 'ja' },
      },
      sidebar: [
        {
          label: 'Getting Started',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Context — Korean Dictionary',
          autogenerate: { directory: 'apps/context' },
        },
        {
          label: 'Permissive — Web Dev Resources',
          autogenerate: { directory: 'apps/permissive' },
        },
        {
          label: 'Roots — Math Documentation',
          autogenerate: { directory: 'apps/roots' },
        },
        {
          label: 'Packages (API)',
          autogenerate: { directory: 'packages' },
        },
        {
          label: 'Contributing',
          autogenerate: { directory: 'contributing' },
        },
        {
          label: 'AI Guidelines',
          autogenerate: { directory: 'ai-guidelines' },
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
        {
          label: 'Open Source',
          link: '/open-source/',
        },
      ],
      customCss: [
        './src/styles/custom.css',
      ],
      editLink: {
        baseUrl: 'https://github.com/soundbluemusic/public-monorepo/edit/main/docs/docs-site/',
      },
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: 'https://soundbluemusic.github.io/public-monorepo/og-image.png' },
        },
        {
          tag: 'link',
          attrs: { rel: 'manifest', href: '/public-monorepo/manifest.json' },
        },
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#2563eb' },
        },
        {
          tag: 'meta',
          attrs: { name: 'apple-mobile-web-app-capable', content: 'yes' },
        },
        {
          tag: 'meta',
          attrs: { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        },
        {
          tag: 'link',
          attrs: { rel: 'apple-touch-icon', href: '/public-monorepo/apple-touch-icon.svg' },
        },
        {
          tag: 'script',
          content: `
            // Sidebar controls initialization (runs before DOM)
            (function() {
              const COLLAPSED_KEY = 'sb-sidebar-collapsed';
              const WIDTH_KEY = 'sb-sidebar-width';
              const isCollapsed = localStorage.getItem(COLLAPSED_KEY) === 'true';
              const savedWidth = localStorage.getItem(WIDTH_KEY);
              if (isCollapsed) document.documentElement.setAttribute('data-sidebar-collapsed', 'true');
              if (savedWidth) document.documentElement.style.setProperty('--sb-sidebar-width', savedWidth);
            })();

            // Create sidebar toggle button
            function createSidebarToggle() {
              if (document.getElementById('sidebar-toggle')) return;

              var btn = document.createElement('button');
              btn.id = 'sidebar-toggle';
              btn.className = 'sidebar-toggle-btn';
              btn.setAttribute('aria-label', 'Toggle sidebar');
              btn.innerHTML = '<svg class="sidebar-open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg><svg class="sidebar-closed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><polyline points="14 9 17 12 14 15"/></svg>';
              document.body.appendChild(btn);

              btn.addEventListener('click', function() {
                var isCollapsed = document.documentElement.getAttribute('data-sidebar-collapsed') === 'true';
                document.documentElement.setAttribute('data-sidebar-collapsed', String(!isCollapsed));
                localStorage.setItem('sb-sidebar-collapsed', String(!isCollapsed));
              });
            }

            // Run on DOMContentLoaded or immediately if already loaded
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', createSidebarToggle);
            } else {
              createSidebarToggle();
            }

            // Also handle Astro view transitions
            document.addEventListener('astro:page-load', createSidebarToggle);

            // Register Service Worker for PWA
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/public-monorepo/sw.js')
                  .then(function(registration) {
                    console.log('SW registered:', registration.scope);
                  })
                  .catch(function(error) {
                    console.log('SW registration failed:', error);
                  });
              });
            }
          `,
        },
      ],
      components: {
        Footer: './src/components/CustomFooter.astro',
      },
    }),
  ],
});
