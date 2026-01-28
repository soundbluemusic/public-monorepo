import { defineConfig, devices } from '@playwright/test';

const APP_PORTS = {
  context: 3003,
  permissive: 3004,
  roots: 3005,
} as const;

// 프로덕션 URL (환경 변수로 오버라이드 가능)
const PROD_URLS = {
  context: process.env.PLAYWRIGHT_BASE_URL_CONTEXT || 'https://context.soundbluemusic.com',
  permissive: process.env.PLAYWRIGHT_BASE_URL_PERMISSIVE || 'https://permissive.soundbluemusic.com',
  roots: process.env.PLAYWRIGHT_BASE_URL_ROOTS || 'https://roots.soundbluemusic.com',
} as const;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  /* Visual snapshot settings */
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02, // 2% 픽셀 차이 허용
      threshold: 0.2, // 색상 차이 임계값
    },
  },
  /* Snapshot output */
  snapshotDir: './tests/e2e/__snapshots__',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',

  projects: [
    {
      name: 'context',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${APP_PORTS.context}`,
      },
      testMatch:
        /context|button-interactions|accessibility|responsive|mobile|seo|pwa|security|visual|download|hydration/,
    },
    {
      name: 'permissive',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${APP_PORTS.permissive}`,
      },
      testMatch:
        /permissive|button-interactions|accessibility|responsive|mobile|seo|pwa|security|visual/,
    },
    {
      name: 'roots',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${APP_PORTS.roots}`,
      },
      testMatch:
        /roots|button-interactions|accessibility|responsive|mobile|seo|pwa|security|visual/,
    },
    // Production projects (프로덕션 URL 테스트용)
    {
      name: 'context-prod',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: PROD_URLS.context,
      },
      testMatch: /context|seo|accessibility/,
    },
    {
      name: 'permissive-prod',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: PROD_URLS.permissive,
      },
      testMatch: /permissive|seo|accessibility/,
    },
    {
      name: 'roots-prod',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: PROD_URLS.roots,
      },
      testMatch: /roots|seo|accessibility/,
    },
  ],

  /* 빌드된 앱을 서빙하는 preview 서버 (로컬 테스트용, 프로덕션 테스트 시 불필요) */
  webServer: process.env.PLAYWRIGHT_BASE_URL_CONTEXT
    ? undefined
    : [
        {
          command: 'pnpm preview:context',
          port: APP_PORTS.context,
          reuseExistingServer: true,
          timeout: 120 * 1000,
        },
        {
          command: 'pnpm preview:permissive',
          port: APP_PORTS.permissive,
          reuseExistingServer: true,
          timeout: 120 * 1000,
        },
        {
          command: 'pnpm preview:roots',
          port: APP_PORTS.roots,
          reuseExistingServer: true,
          timeout: 120 * 1000,
        },
      ],
});
