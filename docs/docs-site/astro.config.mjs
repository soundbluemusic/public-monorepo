import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
    site: 'https://soundbluemusic.github.io',
    base: '/public-monorepo',
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
                  defaultLocale: 'en',
                  locales: {
                            en: { label: 'English', lang: 'en' },
                            ko: { label: '한국어', lang: 'ko' },
                  },
                  sidebar: [
                    {
                                label: 'Getting Started',
                                items: [
                                  { label: 'Introduction', slug: 'guides/introduction' },
                                  { label: 'Quick Start', slug: 'guides/quickstart' },
                                  { label: 'Architecture', slug: 'guides/architecture' },
                                            ],
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
                                label: 'Packages',
                                autogenerate: { directory: 'packages' },
                    },
                    {
                                label: 'Development',
                                items: [
                                  { label: 'Contributing', slug: 'development/contributing' },
                                  { label: 'Testing', slug: 'development/testing' },
                                  { label: 'CI/CD', slug: 'development/cicd' },
                                            ],
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
