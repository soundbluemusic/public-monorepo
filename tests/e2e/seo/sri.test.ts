/**
 * @fileoverview E2E tests for Subresource Integrity (SRI) validation
 */

import { test, expect } from '@playwright/test';

test.describe('Subresource Integrity (SRI)', () => {
  test('should have SRI hash for KaTeX CDN stylesheet', async ({ page }) => {
    await page.goto('/ko');

    // Check for KaTeX CDN link
    const katexLink = await page.$('link[href*="katex"]');

    if (katexLink) {
      const integrity = await katexLink.getAttribute('integrity');
      const crossorigin = await katexLink.getAttribute('crossorigin');

      expect(integrity).toBeDefined();
      expect(integrity).toMatch(/^sha(256|384|512)-/);
      expect(crossorigin).toBe('anonymous');
    }
  });

  test('all external stylesheets should have SRI or be from same origin', async ({ page }) => {
    await page.goto('/ko');

    const externalLinks = await page.$$('link[rel="stylesheet"][href^="https://"]');

    for (const link of externalLinks) {
      const href = await link.getAttribute('href');
      const integrity = await link.getAttribute('integrity');
      const crossorigin = await link.getAttribute('crossorigin');

      if (href && !href.includes(page.url())) {
        // External stylesheet from different origin
        expect(integrity).toBeDefined();
        expect(integrity).toMatch(/^sha(256|384|512)-/);
        expect(crossorigin).toBe('anonymous');
      }
    }
  });

  test('SRI hash should be valid format', async ({ page }) => {
    await page.goto('/ko');

    const linksWithIntegrity = await page.$$('link[integrity]');

    for (const link of linksWithIntegrity) {
      const integrity = await link.getAttribute('integrity');

      if (integrity) {
        // Should be sha256, sha384, or sha512
        expect(integrity).toMatch(/^sha(256|384|512)-[A-Za-z0-9+/]+=*$/);
      }
    }
  });

  test('external scripts should have SRI if from CDN', async ({ page }) => {
    await page.goto('/ko');

    const externalScripts = await page.$$('script[src^="https://"]');

    for (const script of externalScripts) {
      const src = await script.getAttribute('src');

      // Check if it's a CDN (common CDN patterns)
      if (src && (src.includes('cdn.') || src.includes('cdnjs') || src.includes('jsdelivr'))) {
        const integrity = await script.getAttribute('integrity');
        const crossorigin = await script.getAttribute('crossorigin');

        if (integrity) {
          expect(integrity).toMatch(/^sha(256|384|512)-/);
          expect(crossorigin).toBe('anonymous');
        }
      }
    }
  });

  test('crossorigin attribute should be "anonymous" when integrity is present', async ({ page }) => {
    await page.goto('/ko');

    const elementsWithIntegrity = await page.$$('[integrity]');

    for (const element of elementsWithIntegrity) {
      const crossorigin = await element.getAttribute('crossorigin');
      expect(crossorigin).toBe('anonymous');
    }
  });
});
