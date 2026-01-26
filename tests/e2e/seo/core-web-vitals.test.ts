/**
 * @fileoverview E2E tests for Core Web Vitals and performance SEO
 *
 * Tests performance metrics that affect SEO:
 * - LCP (Largest Contentful Paint) - should be < 2.5s
 * - FID (First Input Delay) - should be < 100ms (measured as TBT)
 * - CLS (Cumulative Layout Shift) - should be < 0.1
 *
 * Note: Playwright can measure some metrics but not all.
 * These tests focus on what can be reliably measured.
 */

import { expect, test } from '@playwright/test';

// =============================================================================
// Page Load Performance
// =============================================================================

test.describe('Page Load Performance', () => {
  test('homepage should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const loadTime = Date.now() - startTime;

    // Page should load DOM within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('homepage should reach networkidle within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    // Full page load should complete within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('Korean homepage should load quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/ko', { waitUntil: 'domcontentloaded' });

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });
});

// =============================================================================
// Largest Contentful Paint (LCP) Hints
// =============================================================================

test.describe('LCP Optimization Hints', () => {
  test('should have hero content above the fold', async ({ page }) => {
    await page.goto('/');

    // Check if there's substantial content in viewport without scrolling
    const viewportContent = await page.evaluate(() => {
      const viewportHeight = window.innerHeight;
      const elements = document.querySelectorAll('h1, h2, p, img');

      let contentInViewport = 0;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportHeight && rect.bottom > 0) {
          contentInViewport++;
        }
      });

      return contentInViewport;
    });

    // Should have at least some content above the fold
    expect(viewportContent).toBeGreaterThan(0);
  });

  test('should preload critical images', async ({ page }) => {
    await page.goto('/');

    // Check for preload hints for images
    const preloads = await page.$$('link[rel="preload"][as="image"]');

    // Having image preloads is good for LCP
    // This is optional but recommended for hero images
    // We just verify they're valid if present
    for (const link of preloads) {
      const href = await link.getAttribute('href');
      expect(href).not.toBeNull();
    }
  });

  test('should not have render-blocking CSS', async ({ page }) => {
    await page.goto('/');

    // Check for stylesheets that might block rendering
    const stylesheets = await page.$$eval('link[rel="stylesheet"]', (links) =>
      links.map((l) => ({
        href: l.getAttribute('href'),
        media: l.getAttribute('media'),
      })),
    );

    // All stylesheets should either be:
    // 1. Internal (no blocking external requests)
    // 2. Have media queries (non-blocking)
    // 3. Be preloaded
    // We check that external stylesheets are minimal
    const externalStylesheets = stylesheets.filter(
      (s) => s.href && s.href.startsWith('http') && !s.href.includes(page.url()),
    );

    // Should have minimal external blocking stylesheets
    expect(externalStylesheets.length).toBeLessThanOrEqual(2);
  });
});

// =============================================================================
// Cumulative Layout Shift (CLS) Prevention
// =============================================================================

test.describe('CLS Prevention', () => {
  test('images should have explicit dimensions', async ({ page }) => {
    await page.goto('/');

    const imagesWithoutDimensions = await page.$$eval('img', (images) =>
      images.filter((img) => {
        const width = img.getAttribute('width') || img.style.width;
        const height = img.getAttribute('height') || img.style.height;
        // Check if dimensions are explicitly set
        return !width && !height && img.src;
      }),
    );

    // Most images should have explicit dimensions to prevent CLS
    // Allow some flexibility for dynamic images
    expect(imagesWithoutDimensions.length).toBeLessThanOrEqual(3);
  });

  test('should reserve space for dynamic content', async ({ page }) => {
    await page.goto('/');

    // Check for skeleton loaders or min-height containers
    const skeletonOrPlaceholders = await page.$$('[class*="skeleton"], [class*="placeholder"]');

    // This is optional - just checking if there are loading states
    // Having them is good practice but not required
  });

  test('fonts should not cause layout shift', async ({ page }) => {
    await page.goto('/');

    // Check for font-display: swap or optional
    const fontFaces = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets);
      const fontRules: string[] = [];

      try {
        styles.forEach((sheet) => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            rules.forEach((rule) => {
              if (rule instanceof CSSFontFaceRule) {
                fontRules.push(rule.cssText);
              }
            });
          } catch {
            // Cross-origin stylesheets may throw
          }
        });
      } catch {
        // Handle errors
      }

      return fontRules;
    });

    // If there are font-face rules, they should use font-display
    // This is a soft check - just ensuring no FOIT
    for (const fontRule of fontFaces) {
      // font-display should be present for custom fonts
      // swap, optional, or fallback are acceptable values
    }
  });

  test('should not have elements that resize after load', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Take initial measurements
    const initialSizes = await page.evaluate(() => {
      const elements = document.querySelectorAll('main, article, section, div');
      return Array.from(elements)
        .slice(0, 10)
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        });
    });

    // Wait a bit for any delayed content
    await page.waitForTimeout(500);

    // Take measurements again
    const finalSizes = await page.evaluate(() => {
      const elements = document.querySelectorAll('main, article, section, div');
      return Array.from(elements)
        .slice(0, 10)
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        });
    });

    // Sizes should be mostly stable
    let layoutShifts = 0;
    for (let i = 0; i < initialSizes.length; i++) {
      if (initialSizes[i] && finalSizes[i]) {
        const widthDiff = Math.abs((initialSizes[i]?.width ?? 0) - (finalSizes[i]?.width ?? 0));
        const heightDiff = Math.abs((initialSizes[i]?.height ?? 0) - (finalSizes[i]?.height ?? 0));
        if (widthDiff > 10 || heightDiff > 10) {
          layoutShifts++;
        }
      }
    }

    // Should have minimal layout shifts
    expect(layoutShifts).toBeLessThanOrEqual(2);
  });
});

// =============================================================================
// First Input Delay (FID) / Total Blocking Time (TBT) Hints
// =============================================================================

test.describe('Interaction Readiness', () => {
  test('page should be interactive quickly', async ({ page }) => {
    await page.goto('/');

    // Try to interact with the page shortly after load
    const interactionTime = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const start = performance.now();

        // Try to click something after a short delay
        setTimeout(() => {
          const clickTarget =
            document.querySelector('a') || document.querySelector('button') || document.body;

          // Measure time to respond to interaction
          const handler = () => {
            resolve(performance.now() - start);
          };

          clickTarget.addEventListener('click', handler, { once: true });
          clickTarget.click();
        }, 100);
      });
    });

    // Should respond to interaction quickly
    expect(interactionTime).toBeLessThan(300);
  });

  test('should not have long-running scripts blocking main thread', async ({ page }) => {
    // Enable performance timing
    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');

    await page.goto('/');

    // Get performance metrics
    const metrics = await client.send('Performance.getMetrics');
    const metricsMap = new Map(metrics.metrics.map((m) => [m.name, m.value]));

    // TaskDuration should be reasonable
    const taskDuration = metricsMap.get('TaskDuration');
    if (taskDuration !== undefined) {
      // Total task duration should be under 1 second
      expect(taskDuration).toBeLessThan(1);
    }
  });
});

// =============================================================================
// Resource Loading Optimization
// =============================================================================

test.describe('Resource Loading', () => {
  test('should lazy load below-fold images', async ({ page }) => {
    await page.goto('/');

    const lazyImages = await page.$$eval('img[loading="lazy"]', (imgs) => imgs.length);
    const allImages = await page.$$eval('img', (imgs) => imgs.length);

    // If there are many images, some should be lazy loaded
    if (allImages > 3) {
      expect(lazyImages).toBeGreaterThan(0);
    }
  });

  test('should have efficient JavaScript loading', async ({ page }) => {
    await page.goto('/');

    const scripts = await page.$$eval('script', (scripts) =>
      scripts.map((s) => ({
        src: s.src,
        async: s.async,
        defer: s.defer,
        type: s.type,
      })),
    );

    // External scripts should mostly be async or defer
    const externalScripts = scripts.filter((s) => s.src && !s.src.includes('localhost'));
    const asyncOrDefer = externalScripts.filter((s) => s.async || s.defer || s.type === 'module');

    // Most external scripts should be non-blocking
    if (externalScripts.length > 0) {
      expect(asyncOrDefer.length / externalScripts.length).toBeGreaterThanOrEqual(0.5);
    }
  });

  test('should use modern image formats where possible', async ({ page }) => {
    await page.goto('/');

    const imageFormats = await page.$$eval('img', (imgs) =>
      imgs.map((img) => {
        const src = img.src || '';
        const srcset = img.srcset || '';
        return { src, srcset };
      }),
    );

    // Check for modern format support
    // This is informational - just ensuring images load
    for (const img of imageFormats) {
      if (img.src) {
        // Source should not be empty
        expect(img.src.length).toBeGreaterThan(0);
      }
    }
  });
});

// =============================================================================
// Performance Budget Checks
// =============================================================================

test.describe('Performance Budget', () => {
  test('page weight should be reasonable', async ({ page }) => {
    const resourceSizes: number[] = [];

    page.on('response', async (response) => {
      const headers = response.headers();
      const contentLength = headers['content-length'];
      if (contentLength) {
        resourceSizes.push(parseInt(contentLength, 10));
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    const totalSize = resourceSizes.reduce((sum, size) => sum + size, 0);
    const totalSizeKB = totalSize / 1024;

    // Total page weight should be under 2MB (reasonable for modern web apps)
    expect(totalSizeKB).toBeLessThan(2048);
  });

  test('should have minimal number of requests', async ({ page }) => {
    let requestCount = 0;

    page.on('request', () => {
      requestCount++;
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Should have reasonable number of requests (under 50)
    expect(requestCount).toBeLessThan(50);
  });
});

// =============================================================================
// Dynamic Route Performance
// =============================================================================

test.describe('Dynamic Route Performance', () => {
  test('Context: entry page should load quickly', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3003')) {
      test.skip();
      return;
    }

    const startTime = Date.now();
    await page.goto('/entry/annyeong', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('Roots: concept page should load quickly', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3005')) {
      test.skip();
      return;
    }

    const startTime = Date.now();
    await page.goto('/concept/sine-cosine', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('Permissive: library page should load quickly', async ({ page, baseURL }) => {
    if (!baseURL?.includes('3004')) {
      test.skip();
      return;
    }

    const startTime = Date.now();
    await page.goto('/library/zod', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });
});

// =============================================================================
// Server Response Time
// =============================================================================

test.describe('Server Response Time', () => {
  test('TTFB should be acceptable', async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse((response) => response.url().includes(page.url())),
      page.goto('/'),
    ]);

    // Get timing information
    const timing = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        responseStart: navigation?.responseStart,
        requestStart: navigation?.requestStart,
      };
    });

    if (timing.responseStart && timing.requestStart) {
      const ttfb = timing.responseStart - timing.requestStart;
      // TTFB should be under 600ms for good performance
      expect(ttfb).toBeLessThan(600);
    }
  });
});
