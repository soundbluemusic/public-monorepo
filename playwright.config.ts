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
  projects: [
    {
      name: 'context',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${APP_PORTS.context}`,
      },
      testMatch: /context|button-interactions|accessibility|responsive|mobile|seo|pwa|security/,
    },
    {
      name: 'permissive',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${APP_PORTS.permissive}`,
      },
      testMatch: /permissive|button-interactions|accessibility|responsive|mobile|seo|pwa|security/,
    },
    {
      name: 'roots',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${APP_PORTS.roots}`,
      },
      testMatch: /roots|button-interactions|accessibility|responsive|mobile|seo|pwa|security/,
    },
  ],
});
