import type { Meta, StoryObj } from '@storybook/react-vite';
import { FamilySites } from './FamilySites';

const meta = {
  title: 'Components/FamilySites',
  component: FamilySites,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentAppId: {
      control: 'select',
      options: ['context', 'roots', 'permissive'],
      description: 'Current app ID to exclude from the list',
    },
    variant: {
      control: 'radio',
      options: ['footer', 'sidebar'],
      description: 'Layout variant',
    },
    locale: {
      control: 'radio',
      options: ['en', 'ko'],
      description: 'Language for display text',
    },
  },
} satisfies Meta<typeof FamilySites>;

export default meta;
type Story = StoryObj<typeof meta>;

// Footer variant - English
export const FooterEnglish: Story = {
  args: {
    currentAppId: 'context',
    variant: 'footer',
    locale: 'en',
  },
};

// Footer variant - Korean
export const FooterKorean: Story = {
  args: {
    currentAppId: 'context',
    variant: 'footer',
    locale: 'ko',
  },
};

// Sidebar variant - English
export const SidebarEnglish: Story = {
  args: {
    currentAppId: 'roots',
    variant: 'sidebar',
    locale: 'en',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px', padding: '16px', background: 'var(--bg-elevated, #1a1a1a)' }}>
        <Story />
      </div>
    ),
  ],
};

// Sidebar variant - Korean
export const SidebarKorean: Story = {
  args: {
    currentAppId: 'permissive',
    variant: 'sidebar',
    locale: 'ko',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px', padding: '16px', background: 'var(--bg-elevated, #1a1a1a)' }}>
        <Story />
      </div>
    ),
  ],
};
