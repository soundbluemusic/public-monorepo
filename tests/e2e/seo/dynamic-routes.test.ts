/**
 * @fileoverview E2E tests for dynamic route SEO meta tags
 *
 * Tests that dynamic pages (entry, concept, library) have proper SEO meta tags.
 * Each app is tested with its specific dynamic routes.
 */

import { expect, test } from '@playwright/test';

// =============================================================================
// Context App - Entry Pages (/entry/:entryId)
// =============================================================================

test.describe('Context App - Dynamic Entry Pages SEO', () => {
  // Common entry IDs that should exist in D1 database
  const SAMPLE_ENTRIES = ['annyeong', 'gamsahamnida', 'saranghae'];

  for (const entryId of SAMPLE_ENTRIES) {
    test.describe(`Entry: ${entryId}`, () => {
      test(`should have proper title tag on /entry/${entryId}`, async ({ page, baseURL }) => {
        // Skip if not Context app
        if (!baseURL?.includes('3003')) {
          test.skip();
          return;
        }

        const response = await page.goto(`/entry/${entryId}`);

        // Should return 200 OK
        expect(response?.status()).toBe(200);

        // Title should contain entry-specific content
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
        expect(title).toContain('Context');
      });

      test(`should have OG meta tags on /entry/${entryId}`, async ({ page, baseURL }) => {
        if (!baseURL?.includes('3003')) {
          test.skip();
          return;
        }

        await page.goto(`/entry/${entryId}`);
        await page.waitForLoadState('domcontentloaded');

        const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
        const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');

        // OG tags should exist
        expect(ogTitle).not.toBeNull();

        // URL should be absolute HTTPS
        if (ogUrl) {
          expect(ogUrl).toMatch(/^https:\/\//);
          expect(ogUrl).toContain(`/entry/${entryId}`);
        }
      });

      test(`should have JSON-LD structured data on /entry/${entryId}`, async ({
        page,
        baseURL,
      }) => {
        if (!baseURL?.includes('3003')) {
          test.skip();
          return;
        }

        await page.goto(`/entry/${entryId}`);

        const jsonLdScript = await page.$('script[type="application/ld+json"]');
        expect(jsonLdScript).not.toBeNull();

        const jsonContent = await page.evaluate(() => {
          const script = document.querySelector('script[type="application/ld+json"]');
          return script?.textContent ? JSON.parse(script.textContent) : null;
        });

        expect(jsonContent).not.toBeNull();
        expect(jsonContent['@context']).toBe('https://schema.org');
      });

      test(`should have hreflang links on /entry/${entryId}`, async ({ page, baseURL }) => {
        if (!baseURL?.includes('3003')) {
          test.skip();
          return;
        }

        await page.goto(`/entry/${entryId}`);

        const alternateLinks = await page.$$('link[rel="alternate"][hreflang]');
        expect(alternateLinks.length).toBeGreaterThanOrEqual(1);
      });
    });
  }

  test('should have proper meta on Korean entry page /ko/entry/annyeong', async ({
    page,
    baseURL,
  }) => {
    if (!baseURL?.includes('3003')) {
      test.skip();
      return;
    }

    const response = await page.goto('/ko/entry/annyeong');
    expect(response?.status()).toBe(200);

    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    if (ogUrl) {
      expect(ogUrl).toContain('/ko/entry/annyeong');
    }
  });
});

// =============================================================================
// Roots App - Concept Pages (/concept/:conceptId)
// =============================================================================

test.describe('Roots App - Dynamic Concept Pages SEO', () => {
  // Known concept IDs from the data files
  const SAMPLE_CONCEPTS = ['sine-cosine', 'tangent', 'addition', 'subtraction'];

  for (const conceptId of SAMPLE_CONCEPTS) {
    test.describe(`Concept: ${conceptId}`, () => {
      test(`should have proper title tag on /concept/${conceptId}`, async ({ page, baseURL }) => {
        if (!baseURL?.includes('3005')) {
          test.skip();
          return;
        }

        const response = await page.goto(`/concept/${conceptId}`);
        expect(response?.status()).toBe(200);

        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
        expect(title).toContain('Roots');
      });

      test(`should have OG meta tags on /concept/${conceptId}`, async ({ page, baseURL }) => {
        if (!baseURL?.includes('3005')) {
          test.skip();
          return;
        }

        await page.goto(`/concept/${conceptId}`);
        await page.waitForLoadState('domcontentloaded');

        const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
        expect(ogTitle).not.toBeNull();

        const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
        if (ogUrl) {
          expect(ogUrl).toMatch(/^https:\/\//);
          expect(ogUrl).toContain(`/concept/${conceptId}`);
        }
      });

      test(`should have proper description on /concept/${conceptId}`, async ({
        page,
        baseURL,
      }) => {
        if (!baseURL?.includes('3005')) {
          test.skip();
          return;
        }

        await page.goto(`/concept/${conceptId}`);

        const description = await page.getAttribute('meta[name="description"]', 'content');
        if (description) {
          expect(description.length).toBeGreaterThan(10);
        }
      });
    });
  }

  test('should have proper meta on Korean concept page', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    const response = await page.goto('/ko/concept/sine-cosine');
    expect(response?.status()).toBe(200);

    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    if (ogUrl) {
      expect(ogUrl).toContain('/ko/concept/');
    }
  });
});

// =============================================================================
// Roots App - Field Pages (/field/:fieldId)
// =============================================================================

test.describe('Roots App - Dynamic Field Pages SEO', () => {
  const SAMPLE_FIELDS = ['trigonometry', 'algebra', 'calculus'];

  for (const fieldId of SAMPLE_FIELDS) {
    test(`should have proper SEO on /field/${fieldId}`, async ({ page, baseURL }) => {
      if (!baseURL?.includes('3005')) {
        test.skip();
        return;
      }

      const response = await page.goto(`/field/${fieldId}`);
      expect(response?.status()).toBe(200);

      const title = await page.title();
      expect(title).toContain('Roots');

      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
      expect(ogTitle).not.toBeNull();
    });
  }
});

// =============================================================================
// Permissive App - Library Pages (/library/:slug)
// =============================================================================

test.describe('Permissive App - Dynamic Library Pages SEO', () => {
  // Library slugs (name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
  const SAMPLE_LIBRARIES = ['react-router', 'tanstack-router', 'zod', 'vitest'];

  for (const slug of SAMPLE_LIBRARIES) {
    test.describe(`Library: ${slug}`, () => {
      test(`should have proper title tag on /library/${slug}`, async ({ page, baseURL }) => {
        if (!baseURL?.includes('3004')) {
          test.skip();
          return;
        }

        const response = await page.goto(`/library/${slug}`);
        expect(response?.status()).toBe(200);

        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
        expect(title).toContain('Permissive');
      });

      test(`should have OG meta tags on /library/${slug}`, async ({ page, baseURL }) => {
        if (!baseURL?.includes('3004')) {
          test.skip();
          return;
        }

        await page.goto(`/library/${slug}`);
        await page.waitForLoadState('domcontentloaded');

        const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
        expect(ogTitle).not.toBeNull();

        const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
        if (ogDescription) {
          expect(ogDescription.length).toBeGreaterThan(0);
        }
      });

      test(`should have JSON-LD SoftwareApplication schema on /library/${slug}`, async ({
        page,
        baseURL,
      }) => {
        if (!baseURL?.includes('3004')) {
          test.skip();
          return;
        }

        await page.goto(`/library/${slug}`);

        const jsonLdScript = await page.$('script[type="application/ld+json"]');
        expect(jsonLdScript).not.toBeNull();

        const jsonContent = await page.evaluate(() => {
          const scripts = document.querySelectorAll('script[type="application/ld+json"]');
          for (const script of scripts) {
            const data = JSON.parse(script.textContent || '{}');
            if (data['@type'] === 'SoftwareApplication') {
              return data;
            }
          }
          return null;
        });

        // Should have SoftwareApplication schema for library pages
        if (jsonContent) {
          expect(jsonContent['@type']).toBe('SoftwareApplication');
          expect(jsonContent.name).toBeDefined();
        }
      });
    });
  }

  test('should have proper meta on Korean library page', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3004')) {
      test.skip();
      return;
    }

    const response = await page.goto('/ko/library/react-router');
    expect(response?.status()).toBe(200);

    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    if (ogUrl) {
      expect(ogUrl).toContain('/ko/library/');
    }
  });
});

// =============================================================================
// Permissive App - Web API Pages (/web-api/:slug)
// =============================================================================

test.describe('Permissive App - Dynamic Web API Pages SEO', () => {
  const SAMPLE_APIS = ['view-transitions-api', 'webgpu', 'navigation-api'];

  for (const slug of SAMPLE_APIS) {
    test(`should have proper SEO on /web-api/${slug}`, async ({ page, baseURL }) => {
      if (!baseURL?.includes('3004')) {
        test.skip();
        return;
      }

      const response = await page.goto(`/web-api/${slug}`);
      expect(response?.status()).toBe(200);

      const title = await page.title();
      expect(title).toContain('Permissive');
    });
  }
});

// =============================================================================
// Cross-App: Canonical URL Consistency
// =============================================================================

test.describe('Canonical URL Consistency on Dynamic Pages', () => {
  test('Context: canonical should match current URL for entry pages', async ({
    page,
    baseURL,
  }) => {
    if (!baseURL?.includes('3003')) {
      test.skip();
      return;
    }

    await page.goto('/entry/annyeong');
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');

    if (canonical) {
      expect(canonical).toMatch(/^https:\/\//);
      expect(canonical).toContain('/entry/annyeong');
      // Should NOT contain /ko for English page
      expect(canonical).not.toContain('/ko/entry/');
    }
  });

  test('Roots: canonical should match current URL for concept pages', async ({
    page,
    baseURL,
  }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    await page.goto('/concept/sine-cosine');
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');

    if (canonical) {
      expect(canonical).toMatch(/^https:\/\//);
      expect(canonical).toContain('/concept/sine-cosine');
    }
  });

  test('Permissive: canonical should match current URL for library pages', async ({
    page,
    baseURL,
  }) => {
    if (!baseURL?.includes('3004')) {
      test.skip();
      return;
    }

    await page.goto('/library/zod');
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');

    if (canonical) {
      expect(canonical).toMatch(/^https:\/\//);
      expect(canonical).toContain('/library/zod');
    }
  });
});
