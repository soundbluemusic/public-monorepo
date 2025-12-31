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
