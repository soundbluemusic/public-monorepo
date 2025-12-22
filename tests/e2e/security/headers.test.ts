/**
 * @fileoverview E2E tests for security headers
 */

import { test, expect } from '@playwright/test';

test.describe('Security Headers', () => {
  test('should have X-Content-Type-Options header', async ({ page }) => {
    const response = await page.goto('/ko');
    const headers = response?.headers();

    expect(headers?.['x-content-type-options']).toBe('nosniff');
  });

  test('should have X-Frame-Options header', async ({ page }) => {
    const response = await page.goto('/ko');
    const headers = response?.headers();

    const xFrameOptions = headers?.['x-frame-options'];
    expect(xFrameOptions).toBeDefined();
    expect(xFrameOptions).toMatch(/DENY|SAMEORIGIN/i);
  });

  test('should have Referrer-Policy header', async ({ page }) => {
    const response = await page.goto('/ko');
    const headers = response?.headers();

    expect(headers?.['referrer-policy']).toBeDefined();
  });

  test('should have Content-Security-Policy header', async ({ page }) => {
    const response = await page.goto('/ko');
    const headers = response?.headers();

    const csp = headers?.['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
  });

  test('CSP should allow necessary inline scripts', async ({ page }) => {
    const response = await page.goto('/ko');
    const csp = response?.headers()['content-security-policy'];

    // Should allow unsafe-inline for scripts (dark mode prevention)
    expect(csp).toContain("script-src");
    expect(csp).toContain("'unsafe-inline'");
  });

  test('CSP should allow necessary inline styles', async ({ page }) => {
    const response = await page.goto('/ko');
    const csp = response?.headers()['content-security-policy'];

    // Should allow unsafe-inline for styles
    expect(csp).toContain("style-src");
    expect(csp).toContain("'unsafe-inline'");
  });

  test('CSP should allow images from self and data URIs', async ({ page }) => {
    const response = await page.goto('/ko');
    const csp = response?.headers()['content-security-policy'];

    expect(csp).toContain("img-src");
    expect(csp).toContain("'self'");
    expect(csp).toContain('data:');
  });

  test('should not leak sensitive headers', async ({ page }) => {
    const response = await page.goto('/ko');
    const headers = response?.headers();

    // Should not expose server information
    expect(headers?.['server']).toBeUndefined();
    expect(headers?.['x-powered-by']).toBeUndefined();
  });
});
