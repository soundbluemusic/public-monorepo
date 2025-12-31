import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  framework: '@storybook/react-vite',
  addons: ['@storybook/addon-a11y'],
  viteFinal: async (config) => {
    // Tailwind CSS v4 support
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
