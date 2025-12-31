import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  PageSkeleton,
  Skeleton,
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  SkeletonText,
} from './Skeleton';

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    className: 'h-8 w-32',
  },
};

export const Text: StoryObj<typeof SkeletonText> = {
  render: (args) => <SkeletonText {...args} />,
  args: {
    lines: 3,
  },
};

export const TextFiveLines: StoryObj<typeof SkeletonText> = {
  render: (args) => <SkeletonText {...args} />,
  args: {
    lines: 5,
  },
};

export const Card: StoryObj<typeof SkeletonCard> = {
  render: (args) => <SkeletonCard {...args} />,
  args: {},
};

export const List: StoryObj<typeof SkeletonList> = {
  render: (args) => <SkeletonList {...args} />,
  args: {
    count: 5,
  },
};

export const ListThreeItems: StoryObj<typeof SkeletonList> = {
  render: (args) => <SkeletonList {...args} />,
  args: {
    count: 3,
  },
};

export const GridThreeColumns: StoryObj<typeof SkeletonGrid> = {
  render: (args) => <SkeletonGrid {...args} />,
  args: {
    count: 6,
    columns: 3,
  },
};

export const GridTwoColumns: StoryObj<typeof SkeletonGrid> = {
  render: (args) => <SkeletonGrid {...args} />,
  args: {
    count: 4,
    columns: 2,
  },
};

export const PageSkeletonDefault: StoryObj<typeof PageSkeleton> = {
  render: (args) => <PageSkeleton {...args} />,
  args: {},
};
