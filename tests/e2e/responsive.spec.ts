/**
 * @fileoverview Responsive design tests
 *
 * Tests verify:
 * 1. No horizontal overflow at any viewport size (always runs)
 * 2. Visual regression comparison (only runs locally with baseline images)
 */
import { expect, test } from '@playwright/test';

// Visual regression snapshots are not committed to git (18MB+)
// Run locally with: pnpm playwright test responsive.spec.ts --update-snapshots
const skipVisualRegression = process.env.CI === 'true';

const locales = [
  { name: 'en', path: '/' },
  { name: 'ko', path: '/ko' },
];

const viewports = [
  { name: 'mobile-small', width: 320, height: 568 },
  { name: 'mobile', width: 375, height: 667 },
  { name: 'mobile-large', width: 414, height: 896 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'desktop-large', width: 1920, height: 1080 },
  { name: '4k', width: 2560, height: 1440 },
];

for (const locale of locales) {
  test.describe(`${locale.name} - Responsive`, () => {
    for (const viewport of viewports) {
      test(`should have no horizontal overflow at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(locale.path);

        // Check for horizontal overflow (layout bug)
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
      });

      test(`should match visual baseline at ${viewport.name}`, async ({ page }, testInfo) => {
        test.skip(skipVisualRegression, 'Visual regression baselines not committed to git');

        const appName = testInfo.project.name;
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(locale.path);

        // fullPage 제거 - viewport 크기만 캡처 (동적 높이 문제 방지)
        await expect(page).toHaveScreenshot(`${appName}-${locale.name}-${viewport.name}.png`, {
          maxDiffPixelRatio: 0.1, // 허용 오차 10%
        });
      });
    }
  });
}
