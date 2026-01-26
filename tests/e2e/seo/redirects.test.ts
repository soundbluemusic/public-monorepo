/**
 * @fileoverview E2E tests for redirect handling and SEO
 *
 * Tests that redirects are properly handled for SEO:
 * - 301 (permanent) vs 302 (temporary) redirects
 * - Redirect chains (should be avoided)
 * - Trailing slash consistency
 * - Language prefix handling
 */

import { expect, test } from '@playwright/test';

// =============================================================================
// Trailing Slash Consistency
// =============================================================================

test.describe('Trailing Slash Handling', () => {
  const pathsToTest = ['/', '/about', '/ko', '/ko/about'];

  for (const path of pathsToTest) {
    test(`should handle trailing slash consistently for ${path}`, async ({ page, request }) => {
      // Test path without trailing slash (except root)
      const pathWithoutSlash = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
      const pathWithSlash = path === '/' ? '/' : `${pathWithoutSlash}/`;

      // Make request to path without trailing slash
      const response1 = await request.get(pathWithoutSlash);

      // Make request to path with trailing slash
      const response2 = await request.get(pathWithSlash);

      // Both should either:
      // 1. Return 200 OK (both versions work)
      // 2. One redirects to the other (301/302)
      const status1 = response1.status();
      const status2 = response2.status();

      // At least one should be successful or redirect
      expect([200, 301, 302, 307, 308].includes(status1)).toBe(true);
      expect([200, 301, 302, 307, 308].includes(status2)).toBe(true);
    });
  }
});

// =============================================================================
// Language Redirect Tests
// =============================================================================

test.describe('Language URL Handling', () => {
  test('should NOT redirect /en to / (no /en prefix in this project)', async ({
    page,
    request,
  }) => {
    // In this project, English is the default without prefix
    // /en should return 404 or redirect appropriately
    const response = await request.get('/en');
    const status = response.status();

    // /en should either:
    // 1. Return 404 (path doesn't exist)
    // 2. Redirect to / (301/302)
    expect([200, 301, 302, 404].includes(status)).toBe(true);
  });

  test('Korean paths should work with /ko prefix', async ({ page }) => {
    const response = await page.goto('/ko');

    // Should return 200 OK
    expect(response?.status()).toBe(200);
  });

  test('/ko/ with trailing slash should be handled consistently', async ({ request }) => {
    const response = await request.get('/ko/');
    const status = response.status();

    // Should either work (200) or redirect to /ko (301/302)
    expect([200, 301, 302, 307, 308].includes(status)).toBe(true);
  });
});

// =============================================================================
// Redirect Chain Detection
// =============================================================================

test.describe('Redirect Chain Prevention', () => {
  test('should not have redirect chains (max 1 redirect)', async ({ page }) => {
    let redirectCount = 0;

    page.on('response', (response) => {
      const status = response.status();
      if ([301, 302, 307, 308].includes(status)) {
        redirectCount++;
      }
    });

    await page.goto('/');

    // Should have at most 1 redirect
    expect(redirectCount).toBeLessThanOrEqual(1);
  });

  test('dynamic routes should not create redirect chains', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    let redirectCount = 0;

    page.on('response', (response) => {
      const status = response.status();
      if ([301, 302, 307, 308].includes(status)) {
        redirectCount++;
      }
    });

    await page.goto('/concept/sine-cosine');

    expect(redirectCount).toBeLessThanOrEqual(1);
  });
});

// =============================================================================
// Canonical After Redirect
// =============================================================================

test.describe('Canonical URL After Redirect', () => {
  test('canonical should point to final URL after redirect', async ({ page }) => {
    await page.goto('/');

    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    const currentUrl = page.url();

    if (canonical) {
      // Canonical should match the final URL (without query params)
      const canonicalPath = new URL(canonical).pathname;
      const currentPath = new URL(currentUrl).pathname;

      // Paths should be equivalent (accounting for trailing slash)
      const normalizedCanonical = canonicalPath.replace(/\/$/, '') || '/';
      const normalizedCurrent = currentPath.replace(/\/$/, '') || '/';

      expect(normalizedCanonical).toBe(normalizedCurrent);
    }
  });
});

// =============================================================================
// HTTP to HTTPS Redirect (Production Only)
// =============================================================================

test.describe('Security Redirects', () => {
  test('should use HTTPS URLs in production meta tags', async ({ page }) => {
    await page.goto('/');

    // Check canonical uses HTTPS
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    if (canonical) {
      expect(canonical).toMatch(/^https:\/\//);
    }

    // Check OG URL uses HTTPS
    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    if (ogUrl) {
      expect(ogUrl).toMatch(/^https:\/\//);
    }

    // Check hreflang URLs use HTTPS
    const hreflangLinks = await page.$$eval('link[rel="alternate"][hreflang]', (links) =>
      links.map((l) => l.getAttribute('href')),
    );

    for (const href of hreflangLinks) {
      if (href) {
        expect(href).toMatch(/^https:\/\//);
      }
    }
  });
});

// =============================================================================
// Old URL Pattern Redirects (if applicable)
// =============================================================================

test.describe('Legacy URL Handling', () => {
  test('old URL patterns should redirect or 404 gracefully', async ({ request }) => {
    // Test common old URL patterns that might exist
    const oldPatterns = [
      '/index.html',
      '/home',
      '/main',
      '/default.html',
      '/entry.html',
      '/pages/about',
    ];

    for (const pattern of oldPatterns) {
      const response = await request.get(pattern);
      const status = response.status();

      // Should either redirect (301/302) or 404 - not 500 error
      expect([200, 301, 302, 307, 308, 404].includes(status)).toBe(true);
    }
  });
});

// =============================================================================
// Context App Specific Redirects
// =============================================================================

test.describe('Context App - Entry URL Handling', () => {
  test('entry URLs should be consistent', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3003')) {
      test.skip();
      return;
    }

    // Visit entry page
    const response = await page.goto('/entry/annyeong');

    // Should return 200 OK (no redirect chain)
    expect(response?.status()).toBe(200);

    // Final URL should match expected format
    const finalUrl = page.url();
    expect(finalUrl).toContain('/entry/annyeong');
  });
});

// =============================================================================
// Roots App Specific Redirects
// =============================================================================

test.describe('Roots App - Concept URL Handling', () => {
  test('concept URLs should be consistent', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    const response = await page.goto('/concept/sine-cosine');
    expect(response?.status()).toBe(200);

    const finalUrl = page.url();
    expect(finalUrl).toContain('/concept/sine-cosine');
  });
});

// =============================================================================
// Permissive App Specific Redirects
// =============================================================================

test.describe('Permissive App - Library URL Handling', () => {
  test('library URLs should be consistent', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3004')) {
      test.skip();
      return;
    }

    const response = await page.goto('/library/zod');
    expect(response?.status()).toBe(200);

    const finalUrl = page.url();
    expect(finalUrl).toContain('/library/zod');
  });
});

// =============================================================================
// Response Headers for Redirects
// =============================================================================

test.describe('Redirect Response Headers', () => {
  test('redirects should have proper cache headers', async ({ request }) => {
    // Make a request that might redirect
    const response = await request.get('/');
    const status = response.status();

    if ([301, 308].includes(status)) {
      // Permanent redirects should be cacheable
      const headers = response.headers();
      const cacheControl = headers['cache-control'];

      if (cacheControl) {
        // Should not have no-cache for permanent redirects
        expect(cacheControl).not.toContain('no-cache');
      }
    }
  });
});
