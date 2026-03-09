import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorFallbackUI, RouteErrorUI } from './ErrorBoundary';

const meta = {
  title: 'Feedback/ErrorBoundary',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const ErrorFallback: StoryObj = {
  render: () => (
    <ErrorFallbackUI
      error={new Error('Something went wrong while loading data')}
      onReset={() => alert('Reset clicked!')}
    />
  ),
};

export const ErrorFallbackNoError: StoryObj = {
  render: () => <ErrorFallbackUI error={null} onReset={() => alert('Reset clicked!')} />,
};

export const RouteNotFound: StoryObj = {
  render: () => <RouteErrorUI error={{ status: 404, statusText: 'Not Found' }} />,
};
