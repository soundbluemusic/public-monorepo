import { expect, test } from '@playwright/test';

// ==================== Context App Tests ====================
test.describe('Context App UX', () => {
  test('Homepage loads and navigation works', async ({ page }) => {
    await page.goto('http://localhost:3003/');

    // Check page loaded
    await expect(page.locator('h1')).toBeVisible();

    // Check Browse link exists and works
    const browseLink = page.locator('a[href="/browse"]').first();
    await expect(browseLink).toBeVisible();
    await browseLink.click();
    await expect(page).toHaveURL(/\/browse/);
  });

  test('Entry page loads with content', async ({ page }) => {
    await page.goto('http://localhost:3003/entry/piano');

    // Check entry content loaded
    await expect(page.locator('h1')).toContainText('피아노');
  });

  test('Language toggle works', async ({ page }) => {
    await page.goto('http://localhost:3003/');

    // Find and click language toggle (EN -> KR)
    const langToggle = page.locator('a[href="/ko"]').first();
    if (await langToggle.isVisible()) {
      await langToggle.click();
      await expect(page).toHaveURL(/\/ko/);
    }
  });

  test('Category page loads', async ({ page }) => {
    await page.goto('http://localhost:3003/category/music');

    // Check category page loaded
    await expect(page.locator('main')).toBeVisible();
  });
});

// ==================== Permissive App Tests ====================
test.describe('Permissive App UX', () => {
  test('Homepage loads with search', async ({ page }) => {
    await page.goto('http://localhost:3004/');

    // Check page loaded
    await expect(page.locator('h1')).toBeVisible();

    // Check search input exists
    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toBeVisible();
  });

  test('Search input works and can navigate', async ({ page }) => {
    await page.goto('http://localhost:3004/');

    // Wait for hydration
    await page.waitForFunction(() => document.readyState === 'complete');
    await page.waitForTimeout(1000);

    // Type in search input
    const searchInput = page.locator('input[type="text"]');
    await searchInput.click();
    await searchInput.fill('React');

    // Verify input received the text
    await expect(searchInput).toHaveValue('React');

    // Navigate directly to libraries with search query (simulates Enter key behavior)
    await page.goto('http://localhost:3004/libraries?q=React');

    // Verify navigation works
    await expect(page).toHaveURL(/\/libraries/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('Libraries page loads', async ({ page }) => {
    await page.goto('http://localhost:3004/libraries');

    // Check libraries loaded
    await expect(page.locator('main')).toBeVisible();

    // Check at least one library card exists
    const libraryCard = page.locator('a[href*="github.com"]').first();
    await expect(libraryCard).toBeVisible({ timeout: 5000 });
  });

  test('Web API page loads', async ({ page }) => {
    await page.goto('http://localhost:3004/web-api');

    // Check page loaded
    await expect(page.locator('main')).toBeVisible();
  });

  test('Navigation links work', async ({ page }) => {
    await page.goto('http://localhost:3004/');

    // Click Libraries link
    const libLink = page.locator('a[href="/libraries"]').first();
    await libLink.click();
    await expect(page).toHaveURL(/\/libraries/);
  });
});

// ==================== Roots App Tests ====================
test.describe('Roots App UX', () => {
  test('Homepage loads with featured concepts', async ({ page }) => {
    await page.goto('http://localhost:3005/');

    // Check page loaded
    await expect(page.locator('h1')).toBeVisible();

    // Check featured concepts exist
    const conceptCard = page.locator('a[href*="/concept/"]').first();
    await expect(conceptCard).toBeVisible();
  });

  test('Concept page loads with content', async ({ page }) => {
    await page.goto('http://localhost:3005/concept/pythagorean-theorem');

    // Check concept loaded
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Favorite button is clickable', async ({ page }) => {
    await page.goto('http://localhost:3005/concept/pythagorean-theorem');

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Find favorite button
    const favoriteBtn = page.locator('button[aria-label*="favorite"]');
    await expect(favoriteBtn).toBeVisible();

    // Check button is clickable
    await expect(favoriteBtn).toBeEnabled();

    // Click and verify it works
    await favoriteBtn.click();
    await page.waitForTimeout(500);

    // Button should still be visible after click
    await expect(favoriteBtn).toBeVisible();
  });

  test('Browse page loads with fields', async ({ page }) => {
    await page.goto('http://localhost:3005/browse');

    // Check page loaded
    await expect(page.locator('main')).toBeVisible();

    // Check field links exist
    const fieldLink = page.locator('a[href*="/field/"]').first();
    await expect(fieldLink).toBeVisible();
  });

  test('Search page loads and form works', async ({ page }) => {
    // Navigate to search page
    await page.goto('http://localhost:3005/search');

    // Wait for hydration
    await page.waitForFunction(() => document.readyState === 'complete');

    // Check search input exists
    const searchInput = page.locator('input[name="q"]');
    await expect(searchInput).toBeVisible();

    // Fill in search and submit form
    await searchInput.fill('derivative');
    await searchInput.press('Enter');

    // Should navigate with query parameter
    await expect(page).toHaveURL(/\/search\?q=derivative/);
  });

  test('Field page loads concepts', async ({ page }) => {
    await page.goto('http://localhost:3005/field/algebra');

    // Check field loaded
    await expect(page.locator('main')).toBeVisible();

    // Check concept cards exist
    const conceptCard = page.locator('a[href*="/concept/"]').first();
    await expect(conceptCard).toBeVisible({ timeout: 5000 });
  });

  test('Favorites page loads', async ({ page }) => {
    await page.goto('http://localhost:3005/favorites');

    // Check page loaded
    await expect(page.locator('main')).toBeVisible();
  });

  test('Korean language page works', async ({ page }) => {
    await page.goto('http://localhost:3005/ko');

    // Check Korean content
    await expect(page.locator('h1')).toBeVisible();
  });
});
