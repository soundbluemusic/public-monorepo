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
          attrs: { name: 'mobile-web-app-capable', content: 'yes' },
        },
        {
          tag: 'meta',
          attrs: { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        },
        {
          tag: 'link',
          attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/public-monorepo/apple-touch-icon.png' },
        },
        {
          tag: 'link',
          attrs: { rel: 'icon', type: 'image/svg+xml', href: '/public-monorepo/favicon.svg' },
        },
        {
          tag: 'link',
          attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/public-monorepo/favicon-32.png' },
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

            // Search suggestions - show quick links when search is empty
            function initSearchSuggestions() {
              // 다이얼로그 내 search-container 찾기
              var dialog = document.querySelector('dialog[aria-label="Search"]');
              if (!dialog || !dialog.open) return;

              var searchContainer = dialog.querySelector('.search-container');
              if (!searchContainer) return;

              // 이미 추가되어 있으면 스킵
              if (searchContainer.querySelector('#search-suggestions-container')) return;

              var lang = document.documentElement.lang || 'en';
              var basePath = '/public-monorepo';

              var suggestions = {
                en: {
                  title: 'Quick Links',
                  links: [
                    { icon: '🚀', label: 'Quick Start', href: basePath + '/guides/quickstart/' },
                    { icon: '📐', label: 'Architecture', href: basePath + '/guides/architecture/' },
                    { icon: '📖', label: 'Context App', href: basePath + '/apps/context/overview/' },
                    { icon: '📦', label: 'Packages', href: basePath + '/packages/' },
                    { icon: '🤖', label: 'AI Guidelines', href: basePath + '/ai-guidelines/' }
                  ]
                },
                ko: {
                  title: '빠른 링크',
                  links: [
                    { icon: '🚀', label: '빠른 시작', href: basePath + '/ko/guides/quickstart/' },
                    { icon: '📐', label: '아키텍처', href: basePath + '/ko/guides/architecture/' },
                    { icon: '📖', label: 'Context 앱', href: basePath + '/ko/apps/context/overview/' },
                    { icon: '📦', label: '패키지', href: basePath + '/ko/packages/' },
                    { icon: '🤖', label: 'AI 가이드', href: basePath + '/ko/ai-guidelines/' }
                  ]
                },
                ja: {
                  title: 'クイックリンク',
                  links: [
                    { icon: '🚀', label: 'クイックスタート', href: basePath + '/ja/guides/quickstart/' },
                    { icon: '📐', label: 'アーキテクチャ', href: basePath + '/ja/guides/architecture/' },
                    { icon: '📖', label: 'Context アプリ', href: basePath + '/ja/apps/context/overview/' },
                    { icon: '📦', label: 'パッケージ', href: basePath + '/ja/packages/' },
                    { icon: '🤖', label: 'AI ガイド', href: basePath + '/ja/ai-guidelines/' }
                  ]
                }
              };

              var data = suggestions[lang] || suggestions.en;

              var suggestionsEl = document.createElement('div');
              suggestionsEl.id = 'search-suggestions-container';
              suggestionsEl.innerHTML = '<div class="search-suggestions">' +
                '<div class="search-suggestions-title">' + data.title + '</div>' +
                '<div class="search-suggestions-links">' +
                data.links.map(function(link) {
                  return '<a href="' + link.href + '" class="search-suggestion-link">' +
                    '<span class="search-suggestion-icon">' + link.icon + '</span>' +
                    '<span>' + link.label + '</span>' +
                  '</a>';
                }).join('') +
                '</div></div>';

              searchContainer.appendChild(suggestionsEl);

              // input 변화 감지하여 표시/숨김 처리
              function checkInput() {
                var input = searchContainer.querySelector('input');
                if (input) {
                  var hasQuery = input.value.length > 0;
                  suggestionsEl.style.display = hasQuery ? 'none' : 'block';
                  input.addEventListener('input', function() {
                    suggestionsEl.style.display = this.value.length > 0 ? 'none' : 'block';
                  });
                }
              }

              // Pagefind UI가 로드될 때까지 대기
              var checkInterval = setInterval(function() {
                var input = searchContainer.querySelector('input');
                if (input) {
                  clearInterval(checkInterval);
                  checkInput();
                }
              }, 100);

              // 5초 후 자동 정리
              setTimeout(function() { clearInterval(checkInterval); }, 5000);
            }

            // 다이얼로그 열림 감지
            document.addEventListener('click', function(e) {
              if (e.target.closest('[data-open-modal]')) {
                setTimeout(initSearchSuggestions, 300);
              }
            });

            // 키보드 단축키로 열릴 때
            document.addEventListener('keydown', function(e) {
              if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                setTimeout(initSearchSuggestions, 300);
              }
            });
          `,
        },
      ],
      components: {
        Footer: './src/components/CustomFooter.astro',
      },
    }),
  ],
});
