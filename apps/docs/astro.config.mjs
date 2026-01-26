import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://soundbluemusic.github.io',
  base: '/public-monorepo',
  integrations: [
    starlight({
      title: 'SoundBlue Docs',
      description: 'Documentation for Context, Permissive, and Roots applications',
      head: [
        // Open Graph image
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://soundbluemusic.github.io/public-monorepo/og-image.png',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:width',
            content: '1200',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:height',
            content: '630',
          },
        },
        // Twitter image
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: 'https://soundbluemusic.github.io/public-monorepo/og-image.png',
          },
        },
        // PWA manifest
        {
          tag: 'link',
          attrs: {
            rel: 'manifest',
            href: '/public-monorepo/manifest.json',
          },
        },
        // PWA theme color
        {
          tag: 'meta',
          attrs: {
            name: 'theme-color',
            content: '#2563eb',
          },
        },
        // Apple touch icon
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            href: '/public-monorepo/apple-touch-icon.png',
          },
        },
        // Service Worker registration
        {
          tag: 'script',
          content: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/public-monorepo/sw.js')
                  .then(reg => console.log('SW registered'))
                  .catch(err => console.log('SW registration failed:', err));
              });
            }
          `,
        },
      ],
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      social: {
        github: 'https://github.com/soundbluemusic/public-monorepo',
        youtube: 'https://www.youtube.com/@SoundBlueMusic',
        'x.com': 'https://x.com/SoundBlueMusic',
      },
      locales: {
        root: { label: 'English', lang: 'en' },
        ko: { label: '한국어', lang: 'ko' },
        ja: { label: '日本語', lang: 'ja' },
      },
      sidebar: [
        {
          label: 'Getting Started',
          translations: { ko: '시작하기', ja: 'はじめに' },
          items: [
            { label: 'Introduction', link: '/introduction/' },
            { label: 'Quick Start', link: '/quick-start/' },
          ],
        },
        {
          label: 'Apps',
          translations: { ko: '앱', ja: 'アプリ' },
          items: [
            { label: 'Context', link: '/apps/context/' },
            { label: 'Permissive', link: '/apps/permissive/' },
            { label: 'Roots', link: '/apps/roots/' },
          ],
        },
        {
          label: 'Architecture',
          translations: { ko: '아키텍처', ja: 'アーキテクチャ' },
          items: [
            { label: 'Overview', link: '/architecture/overview/' },
            { label: 'Packages', link: '/architecture/packages/' },
            { label: 'Layers', link: '/architecture/layers/' },
          ],
        },
        {
          label: 'Packages',
          translations: { ko: '패키지', ja: 'パッケージ' },
          autogenerate: { directory: 'packages' },
        },
        {
          label: 'Contributing',
          translations: { ko: '기여하기', ja: '貢献' },
          items: [
            { label: 'Guidelines', link: '/contributing/guidelines/' },
            { label: 'Development', link: '/contributing/development/' },
          ],
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/soundbluemusic/public-monorepo/edit/main/apps/docs/',
      },
      lastUpdated: true,
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
