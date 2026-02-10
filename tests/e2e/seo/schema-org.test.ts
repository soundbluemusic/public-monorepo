/**
 * @fileoverview E2E tests for Schema.org JSON-LD structured data
 */

import { expect, test } from '@playwright/test';

/**
 * 페이지의 모든 JSON-LD 스키마를 파싱하여 반환합니다.
 * 배열 형식과 단일 객체 형식 모두 지원합니다.
 */
async function getAllSchemas(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const schemas: Record<string, unknown>[] = [];
    for (const script of scripts) {
      if (!script.textContent) continue;
      const parsed = JSON.parse(script.textContent);
      if (Array.isArray(parsed)) {
        schemas.push(...parsed);
      } else {
        schemas.push(parsed);
      }
    }
    return schemas;
  });
}

test.describe('Schema.org JSON-LD', () => {
  test('should exist on roots homepage', async ({ page }) => {
    await page.goto('/ko');

    const jsonLdScript = await page.$('script[type="application/ld+json"]');
    expect(jsonLdScript).not.toBeNull();
  });

  test('should have valid JSON structure on roots', async ({ page }) => {
    await page.goto('/ko');

    const schemas = await getAllSchemas(page);
    expect(schemas.length).toBeGreaterThan(0);

    const websiteSchema = schemas.find((s) => s['@type'] === 'WebSite');
    expect(websiteSchema).toBeDefined();
    expect(websiteSchema?.['@context']).toBe('https://schema.org');
  });

  test('should have required WebSite properties on roots', async ({ page }) => {
    await page.goto('/ko');

    const schemas = await getAllSchemas(page);
    const websiteSchema = schemas.find((s) => s['@type'] === 'WebSite');

    expect(websiteSchema).toBeDefined();
    expect(websiteSchema?.name).toBeDefined();
    expect(String(websiteSchema?.name)).toContain('Roots');

    expect(websiteSchema?.url).toBeDefined();
    expect(String(websiteSchema?.url)).toContain('roots.soundbluemusic.com');

    expect(websiteSchema?.description).toBeDefined();
    expect(String(websiteSchema?.description).length).toBeGreaterThan(10);
  });

  test('should include inLanguage property', async ({ page }) => {
    await page.goto('/ko');

    const schemas = await getAllSchemas(page);
    const websiteSchema = schemas.find((s) => s['@type'] === 'WebSite');

    expect(websiteSchema?.inLanguage).toBeDefined();
    expect(Array.isArray(websiteSchema?.inLanguage)).toBe(true);
    expect(websiteSchema?.inLanguage).toContain('ko');
    expect(websiteSchema?.inLanguage).toContain('en');
  });

  test('should include SearchAction for roots', async ({ page }) => {
    await page.goto('/ko');

    const schemas = await getAllSchemas(page);
    const websiteSchema = schemas.find((s) => s['@type'] === 'WebSite') as Record<string, unknown>;

    const action = websiteSchema?.potentialAction as Record<string, unknown>;
    expect(action).toBeDefined();
    expect(action['@type']).toBe('SearchAction');

    const target = action.target as Record<string, unknown>;
    expect(target).toBeDefined();
    expect(target['@type']).toBe('EntryPoint');
    expect(String(target.urlTemplate)).toContain('search');
    expect(String(target.urlTemplate)).toContain('{search_term_string}');
    expect(action['query-input']).toBe('required name=search_term_string');
  });

  test('should be present on English version', async ({ page }) => {
    await page.goto('/');

    const jsonLdScript = await page.$('script[type="application/ld+json"]');
    expect(jsonLdScript).not.toBeNull();
  });

  test('should include Organization schema', async ({ page }) => {
    await page.goto('/ko');

    const schemas = await getAllSchemas(page);
    const orgSchema = schemas.find((s) => s['@type'] === 'Organization');

    expect(orgSchema).toBeDefined();
    expect(orgSchema?.['@context']).toBe('https://schema.org');
    expect(orgSchema?.name).toBe('SoundBlue Music');
    expect(orgSchema?.url).toBe('https://soundbluemusic.com');
    expect(Array.isArray(orgSchema?.sameAs)).toBe(true);
    expect((orgSchema?.sameAs as string[]).length).toBeGreaterThan(0);
  });

  test('should include SiteNavigationElement schema', async ({ page }) => {
    await page.goto('/ko');

    const schemas = await getAllSchemas(page);
    const navSchema = schemas.find(
      (s) =>
        s['@type'] === 'ItemList' &&
        Array.isArray(s.itemListElement) &&
        (s.itemListElement as Record<string, unknown>[]).some(
          (item) => item['@type'] === 'SiteNavigationElement',
        ),
    );

    expect(navSchema).toBeDefined();
    expect(navSchema?.name).toBe('Main Navigation');

    const items = navSchema?.itemListElement as Array<Record<string, unknown>>;
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]['@type']).toBe('SiteNavigationElement');
    expect(items[0].position).toBe(1);
    expect(items[0].name).toBeDefined();
    expect(items[0].url).toBeDefined();
  });
});
