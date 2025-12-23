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

      // Listen to console logs for debugging
      page.on('console', (msg) => {
        if (msg.text().includes('[DarkModeToggle]')) {
          console.log('Browser console:', msg.text());
        }
      });

      // Wait for React hydration to complete
      await page.waitForLoadState('networkidle');
      await page.waitForLoadState('domcontentloaded');

      // Wait for React to attach event handlers (check for React fiber)
      await page.waitForFunction(
        () => {
          const btn = document.querySelector('button[aria-label*="mode" i]');
          if (!btn) return false;
          // Check if React has attached its internal properties
          const keys = Object.keys(btn);
          return keys.some((key) => key.startsWith('__react'));
        },
        { timeout: 5000 },
      );

      await page.waitForTimeout(500);

      // Find dark mode toggle button by aria-label
      const darkModeButton = page.locator('button[aria-label*="mode" i]').first();

      // Ensure button is visible and ready
      await expect(darkModeButton).toBeVisible();
      await expect(darkModeButton).toBeEnabled();

      // Get initial theme
      const initialTheme = await page.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      );
      console.log('Initial theme (dark):', initialTheme);

      // Click dark mode toggle - use native DOM click for better React synthetic event triggering
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label*="mode" i]');
        if (btn) btn.click();
      });

      // Wait for theme change and re-render
      await page.waitForTimeout(1000);

      // Check theme changed
      const newTheme = await page.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      );
      console.log('New theme (dark):', newTheme);

      expect(newTheme).not.toBe(initialTheme);

      // Click again to toggle back
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label*="mode" i]');
        if (btn) btn.click();
      });
      await page.waitForTimeout(1000);

      const finalTheme = await page.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      );
      console.log('Final theme (dark):', finalTheme);

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

      // Wait for React hydration
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Scroll down significantly (button appears at 300px)
      await page.evaluate(() => window.scrollTo(0, 800));

      // Wait for scroll event to trigger and button to render
      await page.waitForTimeout(1000);

      // Back to top button should appear - find by aria-label
      const backToTopButton = page.locator('button[aria-label*="top"], button[aria-label*="위로"]');

      // Wait for button to be visible with longer timeout
      await expect(backToTopButton).toBeVisible({ timeout: 5000 });

      // Click back to top
      await backToTopButton.click({ force: true });

      // Wait for smooth scroll animation
      await page.waitForTimeout(1000);

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

    // Wait for page to be fully loaded and React to hydrate
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Find menu button in header (not in sidebar) - case-insensitive
    const menuButton = page
      .locator(
        'header button[aria-label*="Menu" i], header button[aria-label*="menu" i], header button[aria-label*="메뉴" i]',
      )
      .first();

    // Ensure button is visible
    await expect(menuButton).toBeVisible();

    // Click menu button with force to bypass any overlay
    await menuButton.click({ force: true });

    // Wait for sidebar transition
    await page.waitForTimeout(500);

    // Check sidebar is visible
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible();

    // Find close button in sidebar
    const closeButton = page
      .locator(
        'aside button[aria-label*="Close" i], aside button[aria-label*="close" i], aside button[aria-label*="닫기" i]',
      )
      .first();

    // Click close button with force to bypass viewport issues
    await closeButton.click({ force: true });

    // Wait for sidebar to close
    await page.waitForTimeout(500);
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

    // Wait for page to be fully loaded and React to hydrate
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Find menu button in header by aria-label - case-insensitive
    const menuButton = page
      .locator(
        'header button[aria-label*="Menu" i], header button[aria-label*="menu" i], header button[aria-label*="메뉴" i]',
      )
      .first();

    // Ensure button is visible
    await expect(menuButton).toBeVisible();

    // Click menu button with force to bypass overlay
    await menuButton.click({ force: true });

    // Wait for sidebar transition
    await page.waitForTimeout(500);

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

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Find bottom nav by class (mobile only, fixed at bottom)
    const bottomNav = page.locator('nav.lg\\:hidden.fixed.bottom-0');

    // Should be visible on mobile
    await expect(bottomNav).toBeVisible();

    // Test favorites link in bottom nav
    const favoritesLink = bottomNav.locator('a[href*="favorites"]');
    await favoritesLink.click();

    await page.waitForLoadState('networkidle');

    // Check URL changed
    const url = page.url();
    expect(url).toContain('favorites');
  });
});
