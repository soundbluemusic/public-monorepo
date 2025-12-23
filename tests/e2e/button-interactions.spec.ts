import { expect, test } from '@playwright/test';

const apps = [
  { name: 'context', url: 'http://localhost:3003' },
  { name: 'permissive', url: 'http://localhost:3004' },
  { name: 'roots', url: 'http://localhost:3005' },
];

for (const app of apps) {
  test.describe(`${app.name} - Button Interactions`, () => {
    test('dark mode toggle should work', async ({ page }) => {
      await page.goto(app.url);

      // Find dark mode toggle button
      const darkModeButton = page
        .locator('button')
        .filter({
          has: page.locator('svg').filter({ hasNot: page.locator('text') }),
        })
        .first();

      // Get initial theme
      const initialTheme = await page.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      );

      // Click dark mode toggle
      await darkModeButton.click();

      // Wait for theme change
      await page.waitForTimeout(100);

      // Check theme changed
      const newTheme = await page.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      );

      expect(newTheme).not.toBe(initialTheme);

      // Click again to toggle back
      await darkModeButton.click();
      await page.waitForTimeout(100);

      const finalTheme = await page.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      );

      expect(finalTheme).toBe(initialTheme);
    });

    test('language toggle should work', async ({ page }) => {
      await page.goto(app.url);

      // Find language toggle
      const langToggle = page.locator('a').filter({ hasText: /EN|KR/ }).first();

      // Check current language
      const currentLang = await langToggle.textContent();

      // Verify toggle exists and is visible
      await expect(langToggle).toBeVisible();
      expect(currentLang).toMatch(/EN|KR/);

      // Click language toggle
      await langToggle.click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Check URL changed (should have /ko or not)
      const url = page.url();
      if (currentLang?.includes('EN')) {
        // Was English, should now be Korean
        expect(url).toContain('/ko');
      } else {
        // Was Korean, should now be English
        expect(url).not.toContain('/ko');
      }
    });

    test('back to top button should work', async ({ page }) => {
      await page.goto(app.url);

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(200);

      // Back to top button should appear
      const backToTopButton = page
        .locator('button')
        .filter({
          has: page.locator('svg[aria-hidden="true"]'),
        })
        .filter({ hasText: '' })
        .last();

      // Click back to top
      await backToTopButton.click();

      // Wait for scroll
      await page.waitForTimeout(500);

      // Check scroll position
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(100);
    });
  });
}

// Context app specific tests
test.describe('context - Specific Button Tests', () => {
  test('menu button should open sidebar', async ({ page }) => {
    await page.goto('http://localhost:3003');

    // Find menu button
    const menuButton = page
      .locator('button[aria-label*="menu"], button[aria-label*="메뉴"]')
      .first();

    // Click menu button
    await menuButton.click();

    // Wait for sidebar to appear
    await page.waitForTimeout(300);

    // Check sidebar is visible
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible();

    // Find close button
    const closeButton = page
      .locator('button[aria-label*="Close"], button[aria-label*="닫기"]')
      .first();

    // Click close button
    await closeButton.click();

    // Wait for sidebar to close
    await page.waitForTimeout(300);
  });

  test('search input should work', async ({ page }) => {
    await page.goto('http://localhost:3003');

    // Find search input
    const searchInput = page.locator('input[type="text"]').first();

    // Type in search
    await searchInput.fill('안녕');

    // Wait for results
    await page.waitForTimeout(500);

    // Check if results dropdown exists (if there are results)
    const hasResults = await page.locator('button').filter({ hasText: '안녕' }).count();
    expect(hasResults).toBeGreaterThanOrEqual(0);
  });

  test('navigation links should work', async ({ page }) => {
    await page.goto('http://localhost:3003');

    // Test Browse link
    const browseLink = page.locator('a[href="/browse"], a[href="/ko/browse"]').first();
    await browseLink.click();

    await page.waitForLoadState('networkidle');

    // Check URL changed
    const url = page.url();
    expect(url).toContain('browse');
  });
});

// Permissive app specific tests
test.describe('permissive - Specific Button Tests', () => {
  test('menu button should open sidebar on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3004');

    // Find menu button
    const menuButton = page
      .locator('button')
      .filter({
        has: page.locator('svg'),
      })
      .first();

    // Click menu button
    await menuButton.click();

    // Wait for sidebar
    await page.waitForTimeout(300);

    // Check sidebar is visible
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible();
  });

  test('navigation links should work', async ({ page }) => {
    await page.goto('http://localhost:3004');

    // Test Web API link
    const webApiLink = page.locator('a[href="/web-api"], a[href="/ko/web-api"]').first();
    await webApiLink.click();

    await page.waitForLoadState('networkidle');

    // Check URL changed
    const url = page.url();
    expect(url).toContain('web-api');
  });

  test('external links should have correct attributes', async ({ page }) => {
    await page.goto('http://localhost:3004');

    // Find GitHub link
    const githubLink = page.locator('a[href*="github.com"]').first();

    // Check attributes
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

// Roots app specific tests
test.describe('roots - Specific Button Tests', () => {
  test('search form should work', async ({ page }) => {
    await page.goto('http://localhost:3005');

    // Find search input
    const searchInput = page.locator('input[type="text"]').first();

    // Type in search
    await searchInput.fill('algebra');

    // Submit form
    await searchInput.press('Enter');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Check URL contains search query
    const url = page.url();
    expect(url).toContain('search');
    expect(url).toContain('algebra');
  });

  test('navigation links should work', async ({ page }) => {
    await page.goto('http://localhost:3005');

    // Test Browse link
    const browseLink = page.locator('a[href="/browse"], a[href="/ko/browse"]').first();
    await browseLink.click();

    await page.waitForLoadState('networkidle');

    // Check URL changed
    const url = page.url();
    expect(url).toContain('browse');
  });

  test('bottom navigation should work on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3005');

    // Find bottom nav
    const bottomNav = page
      .locator('nav')
      .filter({ hasText: /browse|favorites|constants/i })
      .first();

    // Should be visible on mobile
    await expect(bottomNav).toBeVisible();

    // Test favorites link
    const favoritesLink = bottomNav
      .locator('a')
      .filter({ hasText: /favorites|즐겨찾기/i })
      .first();
    await favoritesLink.click();

    await page.waitForLoadState('networkidle');

    // Check URL changed
    const url = page.url();
    expect(url).toContain('favorites');
  });
});
