import { expect, test } from '@playwright/test';

const MIN_TOUCH_TARGET = 44;

test.describe('Mobile Optimality', () => {
  test('touch targets should be at least 44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

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
    await page.goto('/');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
