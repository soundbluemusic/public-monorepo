import { expect, test } from '@playwright/test';

const apps = [
  { name: 'context', url: 'http://localhost:3003' },
  { name: 'permissive', url: 'http://localhost:3004' },
  { name: 'roots', url: 'http://localhost:3005' },
];

const MIN_TOUCH_TARGET = 44;
const MIN_VISIBLE_SIZE = 8; // Elements smaller than this are likely hidden/focus-traps

for (const app of apps) {
  test.describe(`${app.name} - Mobile Optimality`, () => {
    test('touch targets should be at least 44px', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // Mobile viewport
      await page.goto(app.url);

      const interactiveElements = page.locator(
        'button, a, input, select, textarea, [role="button"]',
      );
      const count = await interactiveElements.count();
      const smallElements: string[] = [];

      for (let i = 0; i < count; i++) {
        const element = interactiveElements.nth(i);
        const box = await element.boundingBox();

        // Skip invisible or very tiny elements (focus traps, skip links, etc.)
        if (!box || box.width < MIN_VISIBLE_SIZE || box.height < MIN_VISIBLE_SIZE) {
          continue;
        }

        // Check if at least one dimension meets touch target requirement
        const isLargeEnough = box.width >= MIN_TOUCH_TARGET || box.height >= MIN_TOUCH_TARGET;

        if (!isLargeEnough) {
          const tagName = await element.evaluate((el) => el.tagName);
          const text = await element.evaluate((el) => el.textContent?.slice(0, 20) || '');
          smallElements.push(
            `${tagName} "${text}" (${Math.round(box.width)}x${Math.round(box.height)})`,
          );
        }
      }

      expect(
        smallElements,
        `Found ${smallElements.length} elements with touch targets < 44px:\n${smallElements.join('\n')}`,
      ).toHaveLength(0);
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
