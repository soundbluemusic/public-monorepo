/**
 * @fileoverview Context App Shell Configuration
 * @environment universal
 */

import type { RootShellConfig } from '@soundblue/ui/shell';
import { APP_CONFIG } from './config';

export const shellConfig: RootShellConfig = {
  appName: 'Context - Korean Meaning Dictionary',
  baseUrl: APP_CONFIG.baseUrl,
  themeColor: '#7c5cff',
  description:
    'Korean meaning dictionary for learners - Understand Korean words and contexts easily',
  languages: ['ko', 'en'],
  searchUrlTemplate: `${APP_CONFIG.baseUrl}/browse?q={search_term}`,
  themeColors: {
    light: {
      bgPrimary: '#faf9fc',
      bgSecondary: '#f3f1f8',
      bgTertiary: '#ebe8f2',
      bgElevated: '#ffffff',
      textPrimary: '#2d2640',
      textSecondary: '#5c5470',
    },
    dark: {
      bgPrimary: '#14121c',
      bgSecondary: '#1c1926',
      bgTertiary: '#252230',
      bgElevated: '#2a2638',
      textPrimary: '#f0eef5',
      // 다크 모드 보조 텍스트 색을 약간 밝게 조정 — bgSecondary(#1c1926) 대비 WCAG AA 충족
      textSecondary: '#cbc5dc',
    },
  },
  navigationItems: [
    { name: 'Home', path: '/' },
    { name: 'Browse', path: '/browse' },
    { name: 'Categories', path: '/categories' },
    { name: 'Conversations', path: '/conversations' },
  ],
  siteVerification: {
    naver: '08c5e0c0cc564309e1781214f8a6e300536c9a69',
    google: 'mw0M1q-2K63FX-NZCL5AetN7V6VI6cXY5ItnMXyl85A',
    bing: '2555E807B2875180F8DAC1EB5D284D3D',
  },
  features: {
    mobileSidebarToggle: true,
  },
};
