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
      ],
    }),
  ],
});
