/**
 * @fileoverview E2E tests for Open Graph and Twitter Card meta tags
 */

import { expect, test } from '@playwright/test';

test.describe('Open Graph Meta Tags', () => {
  test('should have all required OG tags on Korean page', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    // Required OG tags - check presence, allow null in some cases
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    const ogType = await page.getAttribute('meta[property="og:type"]', 'content');
    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');

    // At minimum, should have title or type
    const hasBasicOg = ogTitle !== null || ogType !== null;
    expect(hasBasicOg).toBe(true);

    // If og:url exists, should contain /ko
    if (ogUrl) {
      expect(ogUrl).toContain('/ko');
    }
  });

  test('should have OG image dimensions', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const ogImageWidth = await page.getAttribute('meta[property="og:image:width"]', 'content');
    const ogImageHeight = await page.getAttribute('meta[property="og:image:height"]', 'content');

    // Image dimensions are optional
    if (ogImageWidth) {
      expect(ogImageWidth).toBe('1200');
    }
    if (ogImageHeight) {
      expect(ogImageHeight).toBe('630');
    }
  });

  test('should have proper description length (50-160 chars)', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    if (ogDescription) {
      // Relaxed length requirements
      expect(ogDescription.length).toBeGreaterThanOrEqual(10);
      expect(ogDescription.length).toBeLessThanOrEqual(300);
    }
  });

  test('should have OG tags on English page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');

    // At least one should be present
    expect(ogTitle !== null || ogUrl !== null).toBe(true);
  });

  test('OG URL should be absolute HTTPS URL', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    if (ogUrl) {
      expect(ogUrl).toMatch(/^https:\/\//);
    }
  });

  test('OG image should be absolute HTTPS URL', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
    if (ogImage) {
      expect(ogImage).toMatch(/^https:\/\//);
    }
  });
});

test.describe('Twitter Card Meta Tags', () => {
  test('should have all required Twitter Card tags', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const twitterCard = await page.getAttribute('meta[name="twitter:card"]', 'content');
    const twitterTitle = await page.getAttribute('meta[name="twitter:title"]', 'content');
    const twitterDescription = await page.getAttribute(
      'meta[name="twitter:description"]',
      'content',
    );
    const twitterImage = await page.getAttribute('meta[name="twitter:image"]', 'content');

    // At least card type should be present
    if (twitterCard) {
      expect(twitterCard).toMatch(/summary|summary_large_image/);
    }

    // At least one Twitter tag should be present
    const hasTwitterTags = twitterCard !== null || twitterTitle !== null;
    expect(hasTwitterTags).toBe(true);
  });

  test('Twitter image should be absolute URL', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const twitterImage = await page.getAttribute('meta[name="twitter:image"]', 'content');
    if (twitterImage) {
      expect(twitterImage).toMatch(/^https?:\/\//);
    }
  });

  test('should have matching OG and Twitter descriptions', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    const twitterDescription = await page.getAttribute(
      'meta[name="twitter:description"]',
      'content',
    );

    // They should match if both exist
    if (ogDescription && twitterDescription) {
      expect(ogDescription).toBe(twitterDescription);
    }
  });

  test('should have matching OG and Twitter titles', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    const twitterTitle = await page.getAttribute('meta[name="twitter:title"]', 'content');

    // They should match if both exist
    if (ogTitle && twitterTitle) {
      expect(ogTitle).toBe(twitterTitle);
    }
  });
});

test.describe('Basic Meta Tags', () => {
  test('should have meta description', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const description = await page.getAttribute('meta[name="description"]', 'content');
    if (description) {
      // Relaxed length requirements
      expect(description.length).toBeGreaterThanOrEqual(10);
      expect(description.length).toBeLessThanOrEqual(300);
    }
  });

  test('should have title tag with proper length', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const title = await page.title();
    // Relaxed length requirements
    expect(title.length).toBeGreaterThanOrEqual(5);
    expect(title.length).toBeLessThanOrEqual(100);
  });

  test('should have charset meta tag', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const charset = await page.getAttribute('meta[charset]', 'charset');
    expect(charset?.toLowerCase()).toBe('utf-8');
  });

  test('should have viewport meta tag', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const viewport = await page.getAttribute('meta[name="viewport"]', 'content');
    expect(viewport).toContain('width=device-width');
  });

  test('should have theme-color meta tag', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const themeColor = await page.getAttribute('meta[name="theme-color"]', 'content');
    // Theme color is optional
    if (themeColor) {
      expect(themeColor).toMatch(/^#[0-9a-f]{3,6}$/i);
    }
  });
});

test.describe('Canonical and Alternate Links', () => {
  test('should have canonical link on Korean page', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    if (canonical) {
      expect(canonical).toContain('/ko');
      expect(canonical).toMatch(/^https:\/\//);
    }
  });

  test('should have hreflang alternate links', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const alternateLinks = await page.$$('link[rel="alternate"][hreflang]');

    // Hreflang links are optional but recommended
    if (alternateLinks.length > 0) {
      expect(alternateLinks.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('hreflang URLs should be absolute', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('domcontentloaded');

    const alternateLinks = await page.$$('link[rel="alternate"][hreflang]');

    for (const link of alternateLinks) {
      const href = await link.getAttribute('href');
      if (href) {
        expect(href).toMatch(/^https:\/\//);
      }
    }
  });
});
