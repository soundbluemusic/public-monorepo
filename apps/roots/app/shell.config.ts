/**
 * @fileoverview Roots App Shell Configuration
 * @environment universal
 */

import type { RootShellConfig } from '@soundblue/ui/shell';
import { APP_CONFIG } from './config';

export const shellConfig: RootShellConfig = {
  appName: 'Roots - Math Documentation',
  baseUrl: APP_CONFIG.baseUrl,
  themeColor: '#a5b4fc',
  description: 'Learn math concepts easily - From basic arithmetic to advanced calculus',
  languages: ['ko', 'en'],
  searchUrlTemplate: `${APP_CONFIG.baseUrl}/search?q={search_term}`,
  themeColors: {
    light: {
      bgPrimary: '#f8fafc',
      bgSecondary: '#f1f5f9',
      bgTertiary: '#e2e8f0',
      bgElevated: '#ffffff',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
    },
    dark: {
      bgPrimary: '#0f172a',
      bgSecondary: '#1e293b',
      bgTertiary: '#334155',
      bgElevated: '#1e293b',
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
    },
  },
  navigationItems: [
    { name: 'Home', path: '/' },
    { name: 'Browse', path: '/browse' },
  ],
  features: {
    mobileSidebarToggle: false,
  },
};
