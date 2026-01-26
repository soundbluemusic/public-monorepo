import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://soundbluemusic.github.io',
  base: '/public-monorepo',
  integrations: [
    starlight({
      title: 'SoundBlue Docs',
      description: 'Documentation for Context, Permissive, and Roots applications',
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
