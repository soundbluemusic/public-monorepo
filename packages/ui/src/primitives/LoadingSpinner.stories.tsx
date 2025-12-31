import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingSpinner } from './LoadingSpinner';

const meta = {
  title: 'Primitives/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomClass: Story = {
  args: {
    className: 'bg-(--bg-tertiary) rounded-lg',
  },
};

export const InCard: Story = {
  decorators: [
    (Story) => (
      <div className="p-8 bg-(--bg-elevated) border border-(--border-primary) rounded-xl">
        <Story />
      </div>
    ),
  ],
};
