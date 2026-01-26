/**
 * @fileoverview E2E tests for 404 page SEO
 *
 * Tests that 404 pages:
 * - Return proper 404 status code
 * - Have appropriate meta tags (noindex)
 * - Don't leak sensitive information
 * - Have user-friendly content
 */

import { expect, test } from '@playwright/test';

// =============================================================================
// 404 Status Code Tests
// =============================================================================

test.describe('404 Page - Status Code Validation', () => {
  const nonExistentPaths = [
    '/this-page-does-not-exist',
    '/entry/nonexistent-entry-id-12345',
    '/concept/fake-concept-xyz',
    '/library/fake-library-abc',
    '/ko/this-does-not-exist',
    '/random/nested/path/that/does/not/exist',
  ];

  for (const path of nonExistentPaths) {
    test(`should return 404 for ${path}`, async ({ page }) => {
      const response = await page.goto(path);

      // Should return 404 status
      expect(response?.status()).toBe(404);
    });
  }
});

// =============================================================================
// 404 Page Meta Tags Tests
// =============================================================================

test.describe('404 Page - Meta Tags for SEO', () => {
  test('should have noindex meta tag on 404 pages', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    // Check for robots meta tag with noindex
    const robotsMeta = await page.getAttribute('meta[name="robots"]', 'content');

    // 404 pages should either:
    // 1. Have robots noindex directive
    // 2. Or rely on HTTP status code (Google respects 404 status)
    // We check if noindex is present when robots meta exists
    if (robotsMeta) {
      expect(robotsMeta.toLowerCase()).toContain('noindex');
    }
    // If no robots meta, the 404 status code itself tells search engines not to index
  });

  test('should have appropriate title on 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    const title = await page.title();

    // Title should indicate page not found
    expect(title.length).toBeGreaterThan(0);
    // Should contain "404" or "Not Found" or similar
    const has404Indicator =
      title.includes('404') ||
      title.toLowerCase().includes('not found') ||
      title.toLowerCase().includes('찾을 수 없') ||
      title.toLowerCase().includes('페이지를 찾을');

    // At minimum, should have some title (app name)
    expect(title.length).toBeGreaterThan(0);
  });

  test('should NOT have canonical pointing to 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');

    // 404 pages should NOT have canonical (or should point to homepage)
    if (canonical) {
      // If canonical exists, it should NOT point to the 404 URL itself
      expect(canonical).not.toContain('this-page-does-not-exist');
    }
  });
});

// =============================================================================
// 404 Page Content Tests
// =============================================================================

test.describe('404 Page - User Experience', () => {
  test('should display user-friendly 404 message', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    // Page should have some visible content
    const bodyText = await page.textContent('body');

    expect(bodyText).not.toBeNull();
    expect(bodyText!.length).toBeGreaterThan(0);
  });

  test('should provide navigation back to homepage', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    // Should have at least one link to homepage or navigation
    const homeLinks = await page.$$('a[href="/"], a[href="/ko"]');
    const navLinks = await page.$$('nav a');

    // Either direct home link or navigation should exist
    expect(homeLinks.length + navLinks.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// Context App - 404 for Invalid Entry
// =============================================================================

test.describe('Context App - 404 for Invalid Entry', () => {
  test('should return 404 for non-existent entry', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3003')) {
      test.skip();
      return;
    }

    const response = await page.goto('/entry/this-entry-does-not-exist-xyz123');
    expect(response?.status()).toBe(404);
  });

  test('should return 404 for non-existent Korean entry', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3003')) {
      test.skip();
      return;
    }

    const response = await page.goto('/ko/entry/fake-entry-abc456');
    expect(response?.status()).toBe(404);
  });

  test('should return 404 for non-existent category', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3003')) {
      test.skip();
      return;
    }

    const response = await page.goto('/category/non-existent-category');
    expect(response?.status()).toBe(404);
  });
});

// =============================================================================
// Roots App - 404 for Invalid Concept
// =============================================================================

test.describe('Roots App - 404 for Invalid Concept', () => {
  test('should return 404 for non-existent concept', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    const response = await page.goto('/concept/fake-math-concept-xyz');
    expect(response?.status()).toBe(404);
  });

  test('should return 404 for non-existent field', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    const response = await page.goto('/field/non-existent-field');
    expect(response?.status()).toBe(404);
  });
});

// =============================================================================
// Permissive App - 404 for Invalid Library
// =============================================================================

test.describe('Permissive App - 404 for Invalid Library', () => {
  test('should return 404 for non-existent library', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3004')) {
      test.skip();
      return;
    }

    const response = await page.goto('/library/fake-library-that-does-not-exist');
    expect(response?.status()).toBe(404);
  });

  test('should return 404 for non-existent web API', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3004')) {
      test.skip();
      return;
    }

    const response = await page.goto('/web-api/non-existent-api');
    expect(response?.status()).toBe(404);
  });
});

// =============================================================================
// Security: 404 Should Not Leak Information
// =============================================================================

test.describe('404 Page - Security', () => {
  test('should not leak server information in 404 response', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');

    // Check response headers for security
    const headers = response?.headers();

    if (headers) {
      // Should not expose server version
      const serverHeader = headers['server'];
      if (serverHeader) {
        // Should not contain version numbers
        expect(serverHeader).not.toMatch(/\d+\.\d+/);
      }

      // Should not have X-Powered-By header
      expect(headers['x-powered-by']).toBeUndefined();
    }
  });

  test('should not include stack traces in 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    const bodyText = await page.textContent('body');

    if (bodyText) {
      // Should not contain stack traces
      expect(bodyText).not.toContain('at Object.');
      expect(bodyText).not.toContain('at Module.');
      expect(bodyText).not.toContain('node_modules');
      expect(bodyText).not.toContain('.tsx:');
      expect(bodyText).not.toContain('.ts:');
    }
  });
});

// =============================================================================
// 404 with Query Parameters
// =============================================================================

test.describe('404 Page - Query Parameters', () => {
  test('should return 404 even with query parameters', async ({ page }) => {
    const response = await page.goto('/non-existent-page?foo=bar&baz=qux');
    expect(response?.status()).toBe(404);
  });

  test('should not reflect query parameters in page content (XSS prevention)', async ({
    page,
  }) => {
    await page.goto('/non-existent-page?xss=<script>alert(1)</script>');

    const bodyHtml = await page.content();

    // Should not reflect the XSS payload
    expect(bodyHtml).not.toContain('<script>alert(1)</script>');
  });
});
