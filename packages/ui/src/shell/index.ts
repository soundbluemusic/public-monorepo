/**
 * @fileoverview RootShell Module
 * @environment universal
 *
 * Utilities for creating consistent root shell components across apps.
 *
 * @example
 * ```tsx
 * // apps/context/app/shell.config.ts
 * import type { RootShellConfig } from '@soundblue/ui/shell';
 *
 * export const shellConfig: RootShellConfig = {
 *   appName: 'Context - Korean Dictionary',
 *   baseUrl: 'https://context.soundbluemusic.com',
 *   themeColor: '#7c5cff',
 *   // ...
 * };
 * ```
 *
 * ```tsx
 * // apps/context/app/routes/__root.tsx
 * import {
 *   createCriticalCss,
 *   createStructuredData,
 *   createHeadMeta,
 *   detectLanguage,
 * } from '@soundblue/ui/shell';
 * import { shellConfig } from '../shell.config';
 *
 * const CRITICAL_CSS = createCriticalCss(shellConfig.themeColors);
 * const STRUCTURED_DATA = createStructuredData(shellConfig);
 *
 * export const Route = createRootRoute({
 *   head: () => ({
 *     meta: createHeadMeta(shellConfig),
 *     links: [{ rel: 'icon', href: '/favicon.ico' }],
 *   }),
 * });
 * ```
 */

export type {
  HeadLink,
  HeadMeta,
  NavigationItem,
  RootShellConfig,
  SiteVerification,
  ThemeColors,
} from './types';

export {
  createCriticalCss,
  createHeadLinks,
  createHeadMeta,
  createStructuredData,
  detectLanguage,
} from './utils';
