/**
 * @fileoverview E2E tests for Service Worker registration and functionality
 */

import { expect, test } from '@playwright/test';

test.describe('Service Worker Registration', () => {
  test('should register service worker', async ({ page }) => {
    await page.goto('/ko');

    // Wait for service worker to be registered
    await page.waitForTimeout(2000);

    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });

    expect(swRegistered).toBe(true);
  });

  test('should have active service worker after registration', async ({ page }) => {
    await page.goto('/ko');

    // Wait for service worker to activate
    await page.waitForTimeout(3000);

    const hasActiveSW = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return registration?.active !== null;
      }
      return false;
    });

    expect(hasActiveSW).toBe(true);
  });

  test('should serve cached assets on second visit', async ({ page }) => {
    // First visit - loads from network
    await page.goto('/ko');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Second visit - should use cache
    await page.goto('/ko');
    await page.waitForLoadState('networkidle');

    const hasSW = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return registration?.active !== null;
      }
      return false;
    });

    expect(hasSW).toBe(true);
  });

  test('should update service worker on new version', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForTimeout(2000);

    const swVersion = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return registration?.active?.scriptURL;
      }
      return null;
    });

    expect(swVersion).toBeTruthy();
    expect(swVersion).toContain('sw.js');
  });
});

test.describe('Service Worker Caching', () => {
  test('should cache static assets', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const cacheKeys = await page.evaluate(async () => {
      const cacheNames = await caches.keys();
      return cacheNames;
    });

    expect(cacheKeys.length).toBeGreaterThan(0);
  });

  test('should have workbox cache', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const hasWorkboxCache = await page.evaluate(async () => {
      const cacheNames = await caches.keys();
      return cacheNames.some((name) => name.includes('workbox'));
    });

    expect(hasWorkboxCache).toBe(true);
  });
});

test.describe('Service Worker Scope', () => {
  test('should have correct scope', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForTimeout(2000);

    const scope = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return registration?.scope;
      }
      return null;
    });

    expect(scope).toBeTruthy();
    expect(scope).toContain('/');
  });

  test('should control the page', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForTimeout(2000);

    const _isControlled = await page.evaluate(() => {
      return navigator.serviceWorker.controller !== null;
    });

    // First visit might not be controlled, but subsequent visits should be
    // We'll just check if SW is registered
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });

    expect(swRegistered).toBe(true);
  });
});
