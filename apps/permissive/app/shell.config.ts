/**
 * @fileoverview Permissive App Shell Configuration
 * @environment universal
 */

import type { RootShellConfig } from '@soundblue/ui/shell';
import { APP_CONFIG } from './config';

export const shellConfig: RootShellConfig = {
  appName: 'Permissive - Open Web Dev Resources',
  baseUrl: APP_CONFIG.baseUrl,
  themeColor: '#4a9e95',
  description:
    'Discover web standards and open-source web development libraries with license metadata',
  languages: ['ko', 'en'],
  searchUrlTemplate: `${APP_CONFIG.baseUrl}/libraries?q={search_term}`,
  themeColors: {
    light: {
      bgPrimary: '#f7fafa',
      bgSecondary: '#eff5f4',
      bgTertiary: '#e5efec',
      bgElevated: '#ffffff',
      textPrimary: '#2a3836',
      textSecondary: '#4a5e5a',
    },
    dark: {
      bgPrimary: '#0f1716',
      bgSecondary: '#161f1e',
      bgTertiary: '#1e2928',
      bgElevated: '#253332',
      textPrimary: '#e5f0ee',
      textSecondary: '#b0c5c2',
    },
  },
  navigationItems: [
    { name: 'Home', path: '/' },
    { name: 'Libraries', path: '/libraries' },
    { name: 'Web API', path: '/web-api' },
  ],
  features: {
    mobileSidebarToggle: true,
  },
};
