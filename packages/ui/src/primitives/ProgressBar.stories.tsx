import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Primitives/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    max: {
      control: { type: 'number' },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    noAnimation: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
    max: 100,
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    value: 30,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    value: 75,
    size: 'lg',
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    size: 'md',
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    size: 'md',
  },
};

export const NoAnimation: Story = {
  args: {
    value: 60,
    noAnimation: true,
  },
};

export const CustomMax: Story = {
  args: {
    value: 7,
    max: 10,
    label: '7 of 10 items completed',
  },
};
