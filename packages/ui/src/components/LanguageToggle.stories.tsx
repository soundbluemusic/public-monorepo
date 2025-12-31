import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageToggle } from './LanguageToggle';

const meta = {
  title: 'Components/LanguageToggle',
  component: LanguageToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: { type: 'select' },
      options: ['en', 'ko'],
    },
    currentPath: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof LanguageToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  args: {
    locale: 'en',
    currentPath: '/',
  },
};

export const Korean: Story = {
  args: {
    locale: 'ko',
    currentPath: '/',
  },
};

export const WithPath: Story = {
  args: {
    locale: 'en',
    currentPath: '/entry/hello',
  },
};

export const InHeader: Story = {
  args: {
    locale: 'en',
    currentPath: '/',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-2 px-4 py-2 bg-(--bg-elevated) border border-(--border-primary) rounded-lg">
        <span className="text-sm text-(--text-secondary)">Language:</span>
        <Story />
      </div>
    ),
  ],
};
