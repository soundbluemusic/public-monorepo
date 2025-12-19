import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const apps = [
  { name: 'context', url: 'http://localhost:3003' },
  { name: 'permissive', url: 'http://localhost:3004' },
  { name: 'roots', url: 'http://localhost:3005' },
];

for (const app of apps) {
  test.describe(`${app.name} - Accessibility`, () => {
    test('should have no accessibility violations', async ({ page }) => {
      await page.goto(app.url);

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(app.url);

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('all images should have alt text', async ({ page }) => {
      await page.goto(app.url);

      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).not.toBeNull();
      }
    });
  });
}
