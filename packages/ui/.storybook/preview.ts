import type { Preview } from '@storybook/react-vite';
import './storybook.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // axe-core configuration
      config: {
        rules: [
          {
            // Ensure color contrast meets WCAG AA
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default preview;
