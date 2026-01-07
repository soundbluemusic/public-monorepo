/**
 * @fileoverview E2E tests for PWA manifest.json validation
 */

import { expect, test } from '@playwright/test';

test.describe('PWA Manifest', () => {
  test('should have manifest link in head', async ({ page }) => {
    await page.goto('/ko');

    const manifestLink = await page.$('link[rel="manifest"]');
    expect(manifestLink).not.toBeNull();

    const href = await manifestLink?.getAttribute('href');
    expect(href).toBe('/manifest.json');
  });

  test('should load manifest.json successfully', async ({ page }) => {
    await page.goto('/ko');

    const manifestResponse = await page.goto('/manifest.json');
    expect(manifestResponse?.status()).toBe(200);
    expect(manifestResponse?.headers()['content-type']).toContain('application/json');
  });

  test('should have required manifest properties', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    const manifest = await response?.json();

    expect(manifest.name).toBeDefined();
    expect(manifest.name).not.toBe('');

    expect(manifest.short_name).toBeDefined();
    expect(manifest.short_name).not.toBe('');

    expect(manifest.start_url).toBeDefined();
    expect(manifest.display).toBeDefined();
  });

  test('should have icons array with required sizes', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    const manifest = await response?.json();

    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);

    interface ManifestIcon {
      src: string;
      sizes: string;
      type: string;
    }

    // Should have 192x192 icon
    const has192 = manifest.icons.some(
      (icon: ManifestIcon) => icon.sizes === '192x192' || icon.sizes === 'any',
    );
    expect(has192).toBe(true);

    // Should have 512x512 icon or any size
    const has512 = manifest.icons.some(
      (icon: ManifestIcon) => icon.sizes === '512x512' || icon.sizes === 'any',
    );
    expect(has512).toBe(true);
  });

  test('should have valid display mode', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    const manifest = await response?.json();

    const validDisplayModes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
    expect(validDisplayModes).toContain(manifest.display);
  });

  test('should have theme_color', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    const manifest = await response?.json();

    expect(manifest.theme_color).toBeDefined();
    expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  test('should have background_color', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    const manifest = await response?.json();

    expect(manifest.background_color).toBeDefined();
    expect(manifest.background_color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  test('icon URLs should be accessible', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    const manifest = await response?.json();

    // Test first icon
    if (manifest.icons && manifest.icons.length > 0) {
      const firstIcon = manifest.icons[0];
      const iconResponse = await page.goto(firstIcon.src);
      expect(iconResponse?.status()).toBe(200);
    }
  });

  test('should have description', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    const manifest = await response?.json();

    expect(manifest.description).toBeDefined();
    expect(manifest.description.length).toBeGreaterThan(10);
  });
});
