/**
 * @fileoverview E2E tests for sitemap.xml validation
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { expect, test } from '@playwright/test';

test.describe('Sitemap XML', () => {
  test('should exist and be accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
  });

  test('should have correct content type', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('xml');
  });

  test('should be valid XML', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const content = await response?.text();

    expect(content).toContain('<?xml version="1.0"');
    expect(content).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  });

  test('should contain sitemap index or urlset', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const content = await response?.text();

    const hasSitemapIndex = content?.includes('<sitemapindex');
    const hasUrlset = content?.includes('<urlset');

    expect(hasSitemapIndex || hasUrlset).toBe(true);
  });

  test('should include lastmod dates', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const content = await response?.text();

    expect(content).toContain('<lastmod>');
  });

  test('should have valid date format in lastmod', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const content = await response?.text();

    if (content) {
      // Extract lastmod dates
      const lastmodMatches = content.match(/<lastmod>(.*?)<\/lastmod>/g);

      if (lastmodMatches) {
        for (const match of lastmodMatches) {
          const date = match.replace(/<\/?lastmod>/g, '');
          // Should be ISO 8601 format (YYYY-MM-DD or full timestamp)
          expect(date).toMatch(/^\d{4}-\d{2}-\d{2}/);
        }
      }
    }
  });

  test('should include all main routes', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const content = await response?.text();

    if (content) {
      // Should include homepage variations
      expect(content).toMatch(/\/ko|\/en|\/<\/loc>/);

      // Check if it's a sitemap index
      if (content.includes('<sitemapindex')) {
        // Should reference sub-sitemaps
        expect(content).toContain('<sitemap>');
        expect(content).toContain('<loc>');
      }
    }
  });

  test('all URLs should be absolute HTTPS URLs', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const content = await response?.text();

    if (content) {
      const urlMatches = content.match(/<loc>(.*?)<\/loc>/g);

      if (urlMatches) {
        for (const match of urlMatches) {
          const url = match.replace(/<\/?loc>/g, '');
          expect(url).toMatch(/^https:\/\//);
        }
      }
    }
  });

  test('should not contain invalid URLs', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const content = await response?.text();

    if (content) {
      expect(content).not.toContain('undefined');
      expect(content).not.toContain('null');
      expect(content).not.toContain('localhost');
      expect(content).not.toContain('127.0.0.1');
    }
  });
});

test.describe('Sitemap Structure (roots app)', () => {
  test('should have sitemap files in public directory', () => {
    const sitemapPath = path.join(process.cwd(), 'apps/roots/public/sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);
  });

  test('sitemap.xml should be valid XML file', () => {
    const sitemapPath = path.join(process.cwd(), 'apps/roots/public/sitemap.xml');

    if (fs.existsSync(sitemapPath)) {
      const content = fs.readFileSync(sitemapPath, 'utf-8');

      expect(content).toContain('<?xml version="1.0"');
      expect(content).toContain('xmlns');
    }
  });

  test('should include domain name in sitemap URLs', () => {
    const sitemapPath = path.join(process.cwd(), 'apps/roots/public/sitemap.xml');

    if (fs.existsSync(sitemapPath)) {
      const content = fs.readFileSync(sitemapPath, 'utf-8');

      expect(content).toContain('roots.soundbluemusic.com');
    }
  });
});

test.describe('Sitemap Validation', () => {
  test('should not exceed 50MB size limit', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const content = await response?.text();

    if (content) {
      const sizeInBytes = Buffer.byteLength(content, 'utf-8');
      const sizeInMB = sizeInBytes / (1024 * 1024);

      // Sitemap protocol limit is 50MB uncompressed
      expect(sizeInMB).toBeLessThan(50);
    }
  });

  test('should not have too many URLs in single sitemap', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const content = await response?.text();

    if (content?.includes('<urlset')) {
      // Count <url> tags
      const urlMatches = content.match(/<url>/g);
      const urlCount = urlMatches ? urlMatches.length : 0;

      // Sitemap protocol limit is 50,000 URLs per sitemap
      expect(urlCount).toBeLessThanOrEqual(50000);
    }
  });

  test('should have proper XML escaping', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const content = await response?.text();

    if (content) {
      // Should not contain unescaped ampersands
      const invalidAmpersands = content.match(/&(?!(amp|lt|gt|quot|apos);)/g);
      expect(invalidAmpersands).toBeNull();
    }
  });
});
