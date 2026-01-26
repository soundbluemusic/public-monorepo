/**
 * @fileoverview E2E tests for hreflang bidirectional reference validation
 *
 * Google requires hreflang links to be bidirectional:
 * - If page A links to page B with hreflang="ko", page B must link back to A with hreflang="en"
 * - This test verifies that en→ko and ko→en links are properly reciprocal
 */

import { expect, test } from '@playwright/test';

interface HreflangLink {
  hreflang: string;
  href: string;
}

async function getHreflangLinks(page: import('@playwright/test').Page): Promise<HreflangLink[]> {
  return page.evaluate(() => {
    const links = document.querySelectorAll('link[rel="alternate"][hreflang]');
    return Array.from(links).map((link) => ({
      hreflang: link.getAttribute('hreflang') || '',
      href: link.getAttribute('href') || '',
    }));
  });
}

// =============================================================================
// Roots App - Bidirectional hreflang Tests
// =============================================================================

test.describe('Roots App - hreflang Bidirectional Validation', () => {
  test('homepage: English should reference Korean and vice versa', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    // Check English homepage
    await page.goto('/');
    const enLinks = await getHreflangLinks(page);

    const enToKo = enLinks.find((l) => l.hreflang === 'ko');
    const enToEn = enLinks.find((l) => l.hreflang === 'en');
    const enXDefault = enLinks.find((l) => l.hreflang === 'x-default');

    expect(enToKo).toBeDefined();
    expect(enToEn || enXDefault).toBeDefined();

    // Check Korean homepage
    await page.goto('/ko');
    const koLinks = await getHreflangLinks(page);

    const koToEn = koLinks.find((l) => l.hreflang === 'en');
    const koToKo = koLinks.find((l) => l.hreflang === 'ko');

    expect(koToEn).toBeDefined();
    expect(koToKo).toBeDefined();

    // Verify bidirectional: en page's ko link should match ko page's ko link
    if (enToKo && koToKo) {
      expect(enToKo.href).toBe(koToKo.href);
    }
  });

  test('concept page: bidirectional hreflang between en and ko', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    // English concept page
    await page.goto('/concept/sine-cosine');
    const enLinks = await getHreflangLinks(page);

    const enToKo = enLinks.find((l) => l.hreflang === 'ko');

    // Korean concept page
    await page.goto('/ko/concept/sine-cosine');
    const koLinks = await getHreflangLinks(page);

    const koToEn = koLinks.find((l) => l.hreflang === 'en');

    // Both should exist
    expect(enToKo).toBeDefined();
    expect(koToEn).toBeDefined();

    // Bidirectional check: en→ko and ko→en should point to correct pages
    if (enToKo) {
      expect(enToKo.href).toContain('/ko/concept/sine-cosine');
    }
    if (koToEn) {
      expect(koToEn.href).toContain('/concept/sine-cosine');
      expect(koToEn.href).not.toContain('/ko/concept/');
    }
  });

  test('x-default should point to default language (English)', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    await page.goto('/ko');
    const links = await getHreflangLinks(page);

    const xDefault = links.find((l) => l.hreflang === 'x-default');
    const enLink = links.find((l) => l.hreflang === 'en');

    if (xDefault && enLink) {
      // x-default should point to English (default) version
      expect(xDefault.href).toBe(enLink.href);
    }
  });
});

// =============================================================================
// Context App - Bidirectional hreflang Tests
// =============================================================================

test.describe('Context App - hreflang Bidirectional Validation', () => {
  test('homepage: bidirectional hreflang', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3003')) {
      test.skip();
      return;
    }

    // English homepage
    await page.goto('/');
    const enLinks = await getHreflangLinks(page);

    // Korean homepage
    await page.goto('/ko');
    const koLinks = await getHreflangLinks(page);

    // Both should have alternate links
    expect(enLinks.length).toBeGreaterThanOrEqual(1);
    expect(koLinks.length).toBeGreaterThanOrEqual(1);

    // Verify reciprocal references
    const enToKo = enLinks.find((l) => l.hreflang === 'ko');
    const koToEn = koLinks.find((l) => l.hreflang === 'en');

    if (enToKo && koToEn) {
      expect(enToKo.href).toContain('/ko');
      expect(koToEn.href).not.toContain('/ko');
    }
  });

  test('entry page: bidirectional hreflang', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3003')) {
      test.skip();
      return;
    }

    // English entry page
    await page.goto('/entry/annyeong');
    const enLinks = await getHreflangLinks(page);

    // Korean entry page
    await page.goto('/ko/entry/annyeong');
    const koLinks = await getHreflangLinks(page);

    const enToKo = enLinks.find((l) => l.hreflang === 'ko');
    const koToEn = koLinks.find((l) => l.hreflang === 'en');

    expect(enToKo).toBeDefined();
    expect(koToEn).toBeDefined();

    // Verify URLs are correct
    if (enToKo) {
      expect(enToKo.href).toContain('/ko/entry/annyeong');
    }
    if (koToEn) {
      expect(koToEn.href).toContain('/entry/annyeong');
      expect(koToEn.href).not.toContain('/ko/entry/');
    }
  });
});

// =============================================================================
// Permissive App - Bidirectional hreflang Tests
// =============================================================================

test.describe('Permissive App - hreflang Bidirectional Validation', () => {
  test('homepage: bidirectional hreflang', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3004')) {
      test.skip();
      return;
    }

    await page.goto('/');
    const enLinks = await getHreflangLinks(page);

    await page.goto('/ko');
    const koLinks = await getHreflangLinks(page);

    expect(enLinks.length).toBeGreaterThanOrEqual(1);
    expect(koLinks.length).toBeGreaterThanOrEqual(1);
  });

  test('library page: bidirectional hreflang', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3004')) {
      test.skip();
      return;
    }

    // English library page
    await page.goto('/library/zod');
    const enLinks = await getHreflangLinks(page);

    // Korean library page
    await page.goto('/ko/library/zod');
    const koLinks = await getHreflangLinks(page);

    const enToKo = enLinks.find((l) => l.hreflang === 'ko');
    const koToEn = koLinks.find((l) => l.hreflang === 'en');

    expect(enToKo).toBeDefined();
    expect(koToEn).toBeDefined();

    if (enToKo) {
      expect(enToKo.href).toContain('/ko/library/zod');
    }
    if (koToEn) {
      expect(koToEn.href).toContain('/library/zod');
      expect(koToEn.href).not.toContain('/ko/library/');
    }
  });
});

// =============================================================================
// Cross-Validation: All hreflang URLs Should Be Absolute HTTPS
// =============================================================================

test.describe('hreflang URL Format Validation', () => {
  const pages = [
    { app: 'context', port: '3003', paths: ['/', '/ko', '/entry/annyeong', '/ko/entry/annyeong'] },
    {
      app: 'roots',
      port: '3005',
      paths: ['/', '/ko', '/concept/sine-cosine', '/ko/concept/sine-cosine'],
    },
    { app: 'permissive', port: '3004', paths: ['/', '/ko', '/library/zod', '/ko/library/zod'] },
  ];

  for (const { app, port, paths } of pages) {
    for (const path of paths) {
      test(`${app}: hreflang URLs on ${path} should be absolute HTTPS`, async ({
        page,
        baseURL,
      }) => {
        if (!baseURL?.includes(port)) {
          test.skip();
          return;
        }

        await page.goto(path);
        const links = await getHreflangLinks(page);

        for (const link of links) {
          // All hreflang URLs must be absolute HTTPS
          expect(link.href).toMatch(/^https:\/\//);
          // Should not contain localhost or 127.0.0.1
          expect(link.href).not.toContain('localhost');
          expect(link.href).not.toContain('127.0.0.1');
        }
      });
    }
  }
});

// =============================================================================
// Self-Reference: Each page should reference itself
// =============================================================================

test.describe('hreflang Self-Reference Validation', () => {
  test('English page should have hreflang="en" pointing to itself', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    await page.goto('/');
    const links = await getHreflangLinks(page);

    const enLink = links.find((l) => l.hreflang === 'en');
    expect(enLink).toBeDefined();

    // Self-reference should not contain /ko
    if (enLink) {
      expect(enLink.href).not.toContain('/ko');
    }
  });

  test('Korean page should have hreflang="ko" pointing to itself', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    await page.goto('/ko');
    const links = await getHreflangLinks(page);

    const koLink = links.find((l) => l.hreflang === 'ko');
    expect(koLink).toBeDefined();

    // Self-reference should contain /ko
    if (koLink) {
      expect(koLink.href).toContain('/ko');
    }
  });
});
