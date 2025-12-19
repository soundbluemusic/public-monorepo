import { expect, test } from '@playwright/test';

const apps = [
  { name: 'context', url: 'http://localhost:3003' },
  { name: 'permissive', url: 'http://localhost:3004' },
  { name: 'roots', url: 'http://localhost:3005' },
];

const MIN_TOUCH_TARGET = 44;

for (const app of apps) {
  test.describe(`${app.name} - Mobile Optimality`, () => {
    test('touch targets should be at least 44px', async ({ page }) => {
      await page.goto(app.url);

      const interactiveElements = page.locator(
        'button, a, input, select, textarea, [role="button"]',
      );
      const count = await interactiveElements.count();

      for (let i = 0; i < count; i++) {
        const element = interactiveElements.nth(i);
        const box = await element.boundingBox();

        if (box && box.width > 0 && box.height > 0) {
          const isLargeEnough = box.width >= MIN_TOUCH_TARGET || box.height >= MIN_TOUCH_TARGET;
          expect(
            isLargeEnough,
            `Element ${i} touch target too small: ${box.width}x${box.height}`,
          ).toBe(true);
        }
      }
    });

    test('should not have horizontal scroll on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(app.url);

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  });
}
