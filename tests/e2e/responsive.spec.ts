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

const apps = [
  { name: 'context', url: 'http://localhost:3003' },
  { name: 'permissive', url: 'http://localhost:3004' },
  { name: 'roots', url: 'http://localhost:3005' },
];

const locales = [
  { name: 'en', path: '' },
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

for (const app of apps) {
  for (const locale of locales) {
    test.describe(`${app.name} (${locale.name}) - Responsive`, () => {
      for (const viewport of viewports) {
        test(`should have no horizontal overflow at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
          page,
        }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(`${app.url}${locale.path}`);

          // Check for horizontal overflow (layout bug)
          const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
          expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
        });

        test(`should match visual baseline at ${viewport.name}`, async ({ page }) => {
          test.skip(skipVisualRegression, 'Visual regression baselines not committed to git');

          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(`${app.url}${locale.path}`);

          await expect(page).toHaveScreenshot(`${app.name}-${locale.name}-${viewport.name}.png`, {
            fullPage: true,
            maxDiffPixelRatio: 0.05,
          });
        });
      }
    });
  }
}
