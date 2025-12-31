import { create } from 'storybook/theming';

export default create({
  base: 'dark',

  // Branding
  brandTitle: 'public-monorepo by soundbluemusic',
  brandUrl: 'https://github.com/soundbluemusic/public-monorepo',
  brandTarget: '_blank',

  // Typography
  fontBase:
    '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',

  // Colors - Blue accent matching project theme
  colorPrimary: '#3b82f6',
  colorSecondary: '#60a5fa',

  // UI - Dark theme
  appBg: '#0a0a0a',
  appContentBg: '#0a0a0a',
  appPreviewBg: '#0a0a0a',
  appBorderColor: '#27272a',
  appBorderRadius: 8,

  // Text colors
  textColor: '#fafafa',
  textInverseColor: '#0a0a0a',
  textMutedColor: '#a1a1aa',

  // Toolbar colors
  barTextColor: '#a1a1aa',
  barSelectedColor: '#3b82f6',
  barHoverColor: '#60a5fa',
  barBg: '#18181b',

  // Form colors
  inputBg: '#18181b',
  inputBorder: '#27272a',
  inputTextColor: '#fafafa',
  inputBorderRadius: 6,
});
