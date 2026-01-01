import { defineConfig, devices } from '@playwright/test';

const APP_PORTS = {
  context: 3003,
  permissive: 3004,
  roots: 3005,
} as const;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
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
        /context|button-interactions|accessibility|responsive|mobile|seo|pwa|security|visual/,
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
  ],
});
