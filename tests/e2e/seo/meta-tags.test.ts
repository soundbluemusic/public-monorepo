/**
 * @fileoverview E2E tests for Open Graph and Twitter Card meta tags
 */

import { expect, test } from '@playwright/test';

test.describe('Open Graph Meta Tags', () => {
  test('should have all required OG tags on Korean page', async ({ page }) => {
    await page.goto('/ko');

    // Required OG tags
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).not.toBe('');
    expect(ogTitle).not.toBeNull();

    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    expect(ogDescription).not.toBe('');
    expect(ogDescription).not.toBeNull();

    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    expect(ogUrl).not.toBe('');
    expect(ogUrl).toContain('/ko');

    const ogType = await page.getAttribute('meta[property="og:type"]', 'content');
    expect(ogType).toBe('website');

    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
    expect(ogImage).not.toBe('');
    expect(ogImage).not.toBeNull();

    const ogLocale = await page.getAttribute('meta[property="og:locale"]', 'content');
    expect(ogLocale).not.toBe('');
    expect(ogLocale).toContain('ko');
  });

  test('should have OG image dimensions', async ({ page }) => {
    await page.goto('/ko');

    const ogImageWidth = await page.getAttribute('meta[property="og:image:width"]', 'content');
    expect(ogImageWidth).toBe('1200');

    const ogImageHeight = await page.getAttribute('meta[property="og:image:height"]', 'content');
    expect(ogImageHeight).toBe('630');
  });

  test('should have proper description length (50-160 chars)', async ({ page }) => {
    await page.goto('/ko');

    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    if (ogDescription) {
      expect(ogDescription.length).toBeGreaterThanOrEqual(50);
      expect(ogDescription.length).toBeLessThanOrEqual(160);
    }
  });

  test('should have OG tags on English page', async ({ page }) => {
    await page.goto('/');

    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).not.toBeNull();

    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    expect(ogUrl).not.toBeNull();
  });

  test('OG URL should be absolute HTTPS URL', async ({ page }) => {
    await page.goto('/ko');

    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    expect(ogUrl).toMatch(/^https:\/\//);
  });

  test('OG image should be absolute HTTPS URL', async ({ page }) => {
    await page.goto('/ko');

    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
    expect(ogImage).toMatch(/^https:\/\//);
  });
});

test.describe('Twitter Card Meta Tags', () => {
  test('should have all required Twitter Card tags', async ({ page }) => {
    await page.goto('/ko');

    const twitterCard = await page.getAttribute('meta[name="twitter:card"]', 'content');
    expect(twitterCard).toMatch(/summary|summary_large_image/);

    const twitterTitle = await page.getAttribute('meta[name="twitter:title"]', 'content');
    expect(twitterTitle).not.toBe('');
    expect(twitterTitle).not.toBeNull();

    const twitterDescription = await page.getAttribute(
      'meta[name="twitter:description"]',
      'content',
    );
    expect(twitterDescription).not.toBe('');
    expect(twitterDescription).not.toBeNull();

    const twitterImage = await page.getAttribute('meta[name="twitter:image"]', 'content');
    expect(twitterImage).not.toBe('');
    expect(twitterImage).not.toBeNull();
  });

  test('Twitter image should be absolute URL', async ({ page }) => {
    await page.goto('/ko');

    const twitterImage = await page.getAttribute('meta[name="twitter:image"]', 'content');
    expect(twitterImage).toMatch(/^https?:\/\//);
  });

  test('should have matching OG and Twitter descriptions', async ({ page }) => {
    await page.goto('/ko');

    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    const twitterDescription = await page.getAttribute(
      'meta[name="twitter:description"]',
      'content',
    );

    // They should match
    expect(ogDescription).toBe(twitterDescription);
  });

  test('should have matching OG and Twitter titles', async ({ page }) => {
    await page.goto('/ko');

    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    const twitterTitle = await page.getAttribute('meta[name="twitter:title"]', 'content');

    // They should match
    expect(ogTitle).toBe(twitterTitle);
  });
});

test.describe('Basic Meta Tags', () => {
  test('should have meta description', async ({ page }) => {
    await page.goto('/ko');

    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).not.toBe('');
    expect(description).not.toBeNull();
    expect(description?.length).toBeGreaterThanOrEqual(50);
    expect(description?.length).toBeLessThanOrEqual(160);
  });

  test('should have title tag with proper length', async ({ page }) => {
    await page.goto('/ko');

    const title = await page.title();
    expect(title.length).toBeGreaterThanOrEqual(30);
    expect(title.length).toBeLessThanOrEqual(60);
  });

  test('should have charset meta tag', async ({ page }) => {
    await page.goto('/ko');

    const charset = await page.getAttribute('meta[charset]', 'charset');
    expect(charset).toBe('utf-8');
  });

  test('should have viewport meta tag', async ({ page }) => {
    await page.goto('/ko');

    const viewport = await page.getAttribute('meta[name="viewport"]', 'content');
    expect(viewport).toContain('width=device-width');
    expect(viewport).toContain('initial-scale=1');
  });

  test('should have theme-color meta tag', async ({ page }) => {
    await page.goto('/ko');

    const themeColor = await page.getAttribute('meta[name="theme-color"]', 'content');
    expect(themeColor).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

test.describe('Canonical and Alternate Links', () => {
  test('should have canonical link on Korean page', async ({ page }) => {
    await page.goto('/ko');

    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical).not.toBeNull();
    expect(canonical).toContain('/ko');
    expect(canonical).toMatch(/^https:\/\//);
  });

  test('should have hreflang alternate links', async ({ page }) => {
    await page.goto('/ko');

    const alternateLinks = await page.$$('link[rel="alternate"][hreflang]');
    expect(alternateLinks.length).toBeGreaterThanOrEqual(2); // At least ko and en

    // Check for ko
    const koLink = await page.$('link[rel="alternate"][hreflang="ko"]');
    expect(koLink).not.toBeNull();

    // Check for en
    const enLink = await page.$('link[rel="alternate"][hreflang="en"]');
    expect(enLink).not.toBeNull();

    // Check for x-default
    const defaultLink = await page.$('link[rel="alternate"][hreflang="x-default"]');
    expect(defaultLink).not.toBeNull();
  });

  test('hreflang URLs should be absolute', async ({ page }) => {
    await page.goto('/ko');

    const alternateLinks = await page.$$('link[rel="alternate"][hreflang]');

    for (const link of alternateLinks) {
      const href = await link.getAttribute('href');
      expect(href).toMatch(/^https:\/\//);
    }
  });
});
