import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    // packages/ui stories only
    // App-specific components are excluded because they depend on app-specific
    // data, hooks, and aliases (@/) that cannot be resolved in a shared Storybook
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  framework: '@storybook/react-vite',
  addons: ['@storybook/addon-a11y'],
  managerHead: (head) => `
    ${head}
    <style>
      /* Custom branding for public-monorepo by soundbluemusic */
      :root {
        --sb-color-primary: #3b82f6;
        --sb-color-secondary: #60a5fa;
      }
    </style>
    <script>
      // Set brand title
      window.STORYBOOK_BRAND_TITLE = 'public-monorepo by soundbluemusic';
      window.STORYBOOK_BRAND_URL = 'https://github.com/soundbluemusic/public-monorepo';
    </script>
  `,
  viteFinal: async (config) => {
    // Tailwind CSS v4 via @tailwindcss/postcss
    config.css = {
      ...config.css,
      postcss: {
        plugins: [(await import('@tailwindcss/postcss')).default],
      },
    };

    return config;
  },
};

export default config;
