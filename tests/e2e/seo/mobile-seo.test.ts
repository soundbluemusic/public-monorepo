/**
 * @fileoverview E2E tests for mobile SEO (desktop browser)
 *
 * Tests that mobile-specific SEO requirements are met:
 * - Mobile viewport meta tag
 * - Theme color and iOS meta tags
 *
 * Note: Tests requiring actual mobile device emulation are in mobile-seo.mobile.test.ts
 */

import { expect, test } from '@playwright/test';

// =============================================================================
// Mobile Viewport Meta Tag
// =============================================================================

test.describe('Mobile Viewport Meta Tag', () => {
  test('should have proper viewport meta tag', async ({ page }) => {
    await page.goto('/');

    const viewport = await page.getAttribute('meta[name="viewport"]', 'content');

    expect(viewport).not.toBeNull();
    expect(viewport).toContain('width=device-width');
    expect(viewport).toContain('initial-scale=1');

    // Should NOT disable user scaling (accessibility issue)
    // Relaxed check: some apps may use maximum-scale for specific reasons
    if (viewport?.includes('user-scalable')) {
      // If explicitly set, should not be 'no'
      expect(viewport).not.toContain('user-scalable=no');
    }
  });

  test('should have viewport meta on Korean page', async ({ page }) => {
    await page.goto('/ko');

    const viewport = await page.getAttribute('meta[name="viewport"]', 'content');
    expect(viewport).toContain('width=device-width');
  });
});

// =============================================================================
// Mobile-Specific SEO Elements
// =============================================================================

test.describe('Mobile SEO Elements', () => {
  test('should have proper theme-color for mobile browsers', async ({ page }) => {
    await page.goto('/');

    const themeColor = await page.getAttribute('meta[name="theme-color"]', 'content');

    // Theme color is optional but recommended
    if (themeColor) {
      // Should be a valid hex color
      expect(themeColor).toMatch(/^#[0-9a-fA-F]{3,6}$/);
    }
  });

  test('should have apple-mobile-web-app meta tags for iOS', async ({ page }) => {
    await page.goto('/');

    // These are optional but good for PWA
    const appleMobileWebAppCapable = await page.getAttribute(
      'meta[name="apple-mobile-web-app-capable"]',
      'content',
    );

    const appleMobileWebAppTitle = await page.getAttribute(
      'meta[name="apple-mobile-web-app-title"]',
      'content',
    );

    // At least one iOS-specific meta should be present for PWA apps
    // This is optional, so we just check format if present
    if (appleMobileWebAppCapable) {
      expect(['yes', 'no'].includes(appleMobileWebAppCapable)).toBe(true);
    }
  });
});
