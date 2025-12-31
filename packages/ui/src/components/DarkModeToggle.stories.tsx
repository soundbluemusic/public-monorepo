import type { Meta, StoryObj } from '@storybook/react-vite';
import { DarkModeToggle } from './DarkModeToggle';

const meta = {
  title: 'Components/DarkModeToggle',
  component: DarkModeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DarkModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const InHeader: Story = {
  decorators: [
    (Story) => (
      <div className="flex items-center gap-2 px-4 py-2 bg-(--bg-elevated) border border-(--border-primary) rounded-lg">
        <span className="text-sm text-(--text-secondary)">Theme:</span>
        <Story />
      </div>
    ),
  ],
};
