import { expect, test } from '@playwright/test';

const apps = [
  {
    name: 'context',
    baseURL: process.env.PLAYWRIGHT_BASE_URL_CONTEXT ?? 'https://context.soundbluemusic.com',
    samplePath: '/entry/annyeong',
  },
  {
    name: 'permissive',
    baseURL:
      process.env.PLAYWRIGHT_BASE_URL_PERMISSIVE ?? 'https://permissive.soundbluemusic.com',
    samplePath: '/web-api/fetch-api',
  },
  {
    name: 'roots',
    baseURL: process.env.PLAYWRIGHT_BASE_URL_ROOTS ?? 'https://roots.soundbluemusic.com',
    samplePath: '/concept/pythagorean-theorem',
  },
] as const;

for (const app of apps) {
  test.describe(`${app.name} production smoke`, () => {
    test('serves SSR homepage HTML with SEO metadata', async ({ page }) => {
      const response = await page.goto(app.baseURL, { waitUntil: 'domcontentloaded' });

      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/.+/);

      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute('content', /.+/);

      const bodyText = await page.locator('body').innerText();
      expect(bodyText.trim().length).toBeGreaterThan(100);
      expect(await page.locator('#root:empty').count()).toBe(0);
    });

    test('serves representative dynamic route', async ({ page }) => {
      const response = await page.goto(new URL(app.samplePath, app.baseURL).toString(), {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.status()).toBe(200);

      const bodyText = await page.locator('body').innerText();
      expect(bodyText.trim().length).toBeGreaterThan(100);
    });
  });
}
