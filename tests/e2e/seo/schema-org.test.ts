/**
 * @fileoverview E2E tests for Schema.org JSON-LD structured data
 */

import { expect, test } from '@playwright/test';

test.describe('Schema.org JSON-LD', () => {
  test('should exist on roots homepage', async ({ page }) => {
    await page.goto('/ko');

    const jsonLdScript = await page.$('script[type="application/ld+json"]');
    expect(jsonLdScript).not.toBeNull();
  });

  test('should have valid JSON structure on roots', async ({ page }) => {
    await page.goto('/ko');

    const jsonContent = await page.evaluate(() => {
      const script = document.querySelector('script[type="application/ld+json"]');
      if (!script || !script.textContent) {
        throw new Error('Schema.org script not found');
      }
      return JSON.parse(script.textContent);
    });

    expect(jsonContent['@context']).toBe('https://schema.org');
    expect(jsonContent['@type']).toBe('WebSite');
  });

  test('should have required WebSite properties on roots', async ({ page }) => {
    await page.goto('/ko');

    const jsonContent = await page.evaluate(() => {
      const script = document.querySelector('script[type="application/ld+json"]');
      return JSON.parse(script?.textContent || '{}');
    });

    expect(jsonContent.name).toBeDefined();
    expect(jsonContent.name).toContain('Roots');

    expect(jsonContent.url).toBeDefined();
    expect(jsonContent.url).toContain('roots.soundbluemusic.com');

    expect(jsonContent.description).toBeDefined();
    expect(jsonContent.description.length).toBeGreaterThan(10);
  });

  test('should include inLanguage property', async ({ page }) => {
    await page.goto('/ko');

    const jsonContent = await page.evaluate(() => {
      const script = document.querySelector('script[type="application/ld+json"]');
      return JSON.parse(script?.textContent || '{}');
    });

    expect(jsonContent.inLanguage).toBeDefined();
    expect(Array.isArray(jsonContent.inLanguage)).toBe(true);
    expect(jsonContent.inLanguage).toContain('ko');
    expect(jsonContent.inLanguage).toContain('en');
  });

  test('should include SearchAction for roots', async ({ page }) => {
    await page.goto('/ko');

    const jsonContent = await page.evaluate(() => {
      const script = document.querySelector('script[type="application/ld+json"]');
      return JSON.parse(script?.textContent || '{}');
    });

    expect(jsonContent.potentialAction).toBeDefined();
    expect(jsonContent.potentialAction['@type']).toBe('SearchAction');
    expect(jsonContent.potentialAction.target).toBeDefined();
    expect(jsonContent.potentialAction.target['@type']).toBe('EntryPoint');
    expect(jsonContent.potentialAction.target.urlTemplate).toContain('search');
    expect(jsonContent.potentialAction.target.urlTemplate).toContain('{search_term_string}');
    expect(jsonContent.potentialAction['query-input']).toBe('required name=search_term_string');
  });

  test('should be present on English version', async ({ page }) => {
    await page.goto('/');

    const jsonLdScript = await page.$('script[type="application/ld+json"]');
    expect(jsonLdScript).not.toBeNull();
  });

  test('should not have duplicate @context', async ({ page }) => {
    await page.goto('/ko');

    const jsonContent = await page.evaluate(() => {
      const script = document.querySelector('script[type="application/ld+json"]');
      const text = script?.textContent || '{}';
      const contextCount = (text.match(/@context/g) || []).length;
      return { contextCount, json: JSON.parse(text) };
    });

    expect(jsonContent.contextCount).toBe(1);
  });
});
