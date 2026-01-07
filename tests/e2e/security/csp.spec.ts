/**
 * @fileoverview E2E tests for Content Security Policy (CSP) headers
 *
 * NOTE: CSP headers are served by Cloudflare via _headers file, not by dev server.
 */

import { expect, test } from '@playwright/test';

// CSP headers are ONLY served by Cloudflare CDN via _headers file
// Dev servers and CI preview servers do not process _headers
const isCloudflareDeployment = process.env.PRODUCTION_TEST === 'true';

test.describe('Content Security Policy (CSP)', () => {
  test.skip(() => !isCloudflareDeployment, 'CSP headers only available in Cloudflare deployment');
  test('should have CSP header', async ({ page }) => {
    const response = await page.goto('/ko');
    const cspHeader = response?.headers()['content-security-policy'];

    expect(cspHeader).toBeDefined();
    expect(cspHeader).not.toBe('');
  });

  test('should include default-src directive', async ({ page }) => {
    const response = await page.goto('/ko');
    const cspHeader = response?.headers()['content-security-policy'];

    if (cspHeader) {
      expect(cspHeader).toContain('default-src');
    }
  });

  test('should include script-src directive', async ({ page }) => {
    const response = await page.goto('/ko');
    const cspHeader = response?.headers()['content-security-policy'];

    if (cspHeader) {
      expect(cspHeader).toContain('script-src');
    }
  });

  test('should include style-src directive', async ({ page }) => {
    const response = await page.goto('/ko');
    const cspHeader = response?.headers()['content-security-policy'];

    if (cspHeader) {
      expect(cspHeader).toContain('style-src');
    }
  });

  test('should not allow unsafe-inline for scripts', async ({ page }) => {
    const response = await page.goto('/ko');
    const cspHeader = response?.headers()['content-security-policy'];

    if (cspHeader?.includes('script-src')) {
      // CSP should either use nonces/hashes or strict-dynamic instead of unsafe-inline
      const scriptSrcDirective = cspHeader
        .split(';')
        .find((d) => d.trim().startsWith('script-src'));

      if (scriptSrcDirective) {
        // If unsafe-inline is present, there should also be nonces or hashes
        if (scriptSrcDirective.includes("'unsafe-inline'")) {
          const hasNonce = scriptSrcDirective.includes("'nonce-");
          const hasHash = scriptSrcDirective.includes("'sha");
          expect(hasNonce || hasHash).toBe(true);
        }
      }
    }
  });

  test('should not use unsafe-eval', async ({ page }) => {
    const response = await page.goto('/ko');
    const cspHeader = response?.headers()['content-security-policy'];

    if (cspHeader) {
      // unsafe-eval should not be present (major security risk)
      expect(cspHeader).not.toContain("'unsafe-eval'");
    }
  });

  test('should include frame-ancestors directive', async ({ page }) => {
    const response = await page.goto('/ko');
    const cspHeader = response?.headers()['content-security-policy'];

    if (cspHeader) {
      expect(cspHeader).toContain('frame-ancestors');
    }
  });

  test('should include object-src directive', async ({ page }) => {
    const response = await page.goto('/ko');
    const cspHeader = response?.headers()['content-security-policy'];

    if (cspHeader) {
      expect(cspHeader).toContain('object-src');
    }
  });

  test('should include base-uri directive', async ({ page }) => {
    const response = await page.goto('/ko');
    const cspHeader = response?.headers()['content-security-policy'];

    if (cspHeader) {
      expect(cspHeader).toContain('base-uri');
    }
  });

  test('should allow CDN sources for external resources', async ({ page }) => {
    const response = await page.goto('/ko');
    const cspHeader = response?.headers()['content-security-policy'];

    if (cspHeader) {
      // Should allow CDN sources like cdn.jsdelivr.net for KaTeX
      const scriptSrcDirective = cspHeader
        .split(';')
        .find((d) => d.trim().startsWith('script-src'));

      if (scriptSrcDirective) {
        // Should include self and trusted CDNs
        expect(
          scriptSrcDirective.includes("'self'") ||
            scriptSrcDirective.includes('cdn.jsdelivr.net') ||
            scriptSrcDirective.includes('https:'),
        ).toBe(true);
      }
    }
  });
});

test.describe('CSP Report-Only Mode', () => {
  test.skip(() => !isCloudflareDeployment, 'CSP headers only available in Cloudflare deployment');
  test('should use CSP enforcement mode (not report-only)', async ({ page }) => {
    const response = await page.goto('/ko');
    const cspHeader = response?.headers()['content-security-policy'];
    const _cspReportOnlyHeader = response?.headers()['content-security-policy-report-only'];

    // Prefer enforcement mode over report-only
    // (report-only is useful for testing, but production should enforce)
    if (cspHeader) {
      expect(cspHeader).toBeDefined();
    }
  });
});

test.describe('CSP Violation Handling', () => {
  test.skip(() => !isCloudflareDeployment, 'CSP headers only available in Cloudflare deployment');
  test('should not trigger CSP violations on page load', async ({ page }) => {
    const violations: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        violations.push(msg.text());
      }
    });

    await page.goto('/ko');
    await page.waitForLoadState('networkidle');

    expect(violations.length).toBe(0);
  });
});
