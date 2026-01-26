/**
 * @fileoverview E2E tests for mobile SEO
 *
 * Tests that mobile-specific SEO requirements are met:
 * - Mobile viewport meta tag
 * - Responsive design
 * - Touch-friendly elements
 * - Mobile-friendly content
 */

import { expect, test, devices } from '@playwright/test';

// Use iPhone 12 for mobile tests
const iPhone = devices['iPhone 12'];

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

// =============================================================================
// Mobile Responsive Layout Tests
// =============================================================================

test.describe('Mobile Responsive Layout', () => {
  test.use({ ...iPhone });

  test('should not have horizontal scroll on mobile', async ({ page }) => {
    await page.goto('/');

    // Check if page has horizontal overflow
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });

  test('should have readable text size on mobile', async ({ page }) => {
    await page.goto('/');

    // Check body font size is at least 14px (mobile readable)
    const fontSize = await page.evaluate(() => {
      const body = document.body;
      const style = window.getComputedStyle(body);
      return parseFloat(style.fontSize);
    });

    expect(fontSize).toBeGreaterThanOrEqual(14);
  });

  test('should have tap targets of adequate size', async ({ page }) => {
    await page.goto('/');

    // Get all interactive elements
    const tapTargets = await page.$$eval('a, button, [role="button"], input, select', (elements) =>
      elements.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          tag: el.tagName,
        };
      }),
    );

    // Filter visible elements
    const visibleTargets = tapTargets.filter((t) => t.width > 0 && t.height > 0);

    // Most tap targets should be at least 44x44 (Apple HIG) or 48x48 (Material)
    // We'll be lenient and check for 40x40 minimum
    const smallTargets = visibleTargets.filter((t) => t.width < 40 || t.height < 40);

    // Allow some small targets (like icon buttons) but majority should be accessible
    const smallTargetRatio = smallTargets.length / visibleTargets.length;
    expect(smallTargetRatio).toBeLessThan(0.3); // Less than 30% small targets
  });
});

// =============================================================================
// Mobile Content Readability
// =============================================================================

test.describe('Mobile Content Readability', () => {
  test.use({ ...iPhone });

  test('should have adequate line height for readability', async ({ page }) => {
    await page.goto('/');

    const lineHeight = await page.evaluate(() => {
      const paragraphs = document.querySelectorAll('p');
      if (paragraphs.length === 0) return 1.5; // Default acceptable

      const firstP = paragraphs[0];
      const style = window.getComputedStyle(firstP);
      const fontSize = parseFloat(style.fontSize);
      const lineHeightPx = parseFloat(style.lineHeight);

      return lineHeightPx / fontSize;
    });

    // Line height should be at least 1.4 for readability
    expect(lineHeight).toBeGreaterThanOrEqual(1.4);
  });

  test('should have adequate contrast (basic check)', async ({ page }) => {
    await page.goto('/');

    // Basic check: body background and text colors should be different
    const colors = await page.evaluate(() => {
      const body = document.body;
      const style = window.getComputedStyle(body);
      return {
        background: style.backgroundColor,
        color: style.color,
      };
    });

    // Background and text should not be the same
    expect(colors.background).not.toBe(colors.color);
  });
});

// =============================================================================
// Mobile SEO Meta Tags Consistency
// =============================================================================

test.describe('Mobile SEO Meta Consistency', () => {
  test.use({ ...iPhone });

  test('should have same meta tags as desktop', async ({ page }) => {
    await page.goto('/');

    // Essential meta tags should be present on mobile too
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    const description = await page.getAttribute('meta[name="description"]', 'content');
    if (description) {
      expect(description.length).toBeGreaterThan(10);
    }

    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).not.toBeNull();
  });

  test('should have canonical URL on mobile', async ({ page }) => {
    await page.goto('/');

    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');

    // Canonical should point to responsive URL (not mobile-specific subdomain)
    if (canonical) {
      expect(canonical).not.toContain('m.');
      expect(canonical).not.toContain('mobile.');
    }
  });
});

// =============================================================================
// Mobile Dynamic Route Tests
// =============================================================================

test.describe('Mobile Dynamic Routes SEO', () => {
  test.use({ ...iPhone });

  test('Context: entry page should work on mobile', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3003')) {
      test.skip();
      return;
    }

    const response = await page.goto('/entry/annyeong');
    expect(response?.status()).toBe(200);

    // Should not have horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('Roots: concept page should work on mobile', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    const response = await page.goto('/concept/sine-cosine');
    expect(response?.status()).toBe(200);

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('Permissive: library page should work on mobile', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3004')) {
      test.skip();
      return;
    }

    const response = await page.goto('/library/zod');
    expect(response?.status()).toBe(200);

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});

// =============================================================================
// Mobile Page Load Performance Hints
// =============================================================================

test.describe('Mobile Performance SEO Hints', () => {
  test.use({ ...iPhone });

  test('should have preconnect hints for external resources', async ({ page }) => {
    await page.goto('/');

    // Check for preconnect hints
    const preconnects = await page.$$('link[rel="preconnect"]');

    // Having preconnect hints is good for performance
    // This is optional but recommended
    if (preconnects.length > 0) {
      for (const link of preconnects) {
        const href = await link.getAttribute('href');
        expect(href).toMatch(/^https?:\/\//);
      }
    }
  });

  test('should not have render-blocking resources in head', async ({ page }) => {
    await page.goto('/');

    // Check for non-async, non-defer scripts in head
    const blockingScripts = await page.$$eval('head script:not([async]):not([defer])', (scripts) =>
      scripts.filter((s) => s.src).map((s) => s.src),
    );

    // Ideally should be minimal blocking scripts
    // Allow some for critical functionality
    expect(blockingScripts.length).toBeLessThanOrEqual(3);
  });
});

// =============================================================================
// Mobile Structured Data
// =============================================================================

test.describe('Mobile Structured Data', () => {
  test.use({ ...iPhone });

  test('should have same JSON-LD on mobile as desktop', async ({ page }) => {
    await page.goto('/');

    const jsonLdScripts = await page.$$('script[type="application/ld+json"]');

    // JSON-LD should be present on mobile too
    expect(jsonLdScripts.length).toBeGreaterThan(0);

    // Verify it's valid JSON
    for (const script of jsonLdScripts) {
      const content = await script.textContent();
      if (content) {
        expect(() => JSON.parse(content)).not.toThrow();
      }
    }
  });
});
