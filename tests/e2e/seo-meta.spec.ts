/**
 * @fileoverview SEO Meta Tag Tests
 *
 * SSR 앱에서 메타 태그가 올바르게 렌더링되는지 검증합니다.
 * - title 태그
 * - meta description
 * - Open Graph 태그
 * - canonical URL
 * - hreflang 태그
 */

import { expect, test } from '@playwright/test';

const apps = [
  { name: 'Context', baseUrl: 'http://localhost:3003', titlePattern: /Context/ },
  { name: 'Permissive', baseUrl: 'http://localhost:3004', titlePattern: /Permissive/ },
  { name: 'Roots', baseUrl: 'http://localhost:3005', titlePattern: /Roots/ },
];

for (const app of apps) {
  test.describe(`${app.name} - SEO Meta Tags`, () => {
    test('homepage has required meta tags', async ({ page }) => {
      await page.goto(app.baseUrl);

      // Title 태그 검증
      const title = await page.title();
      expect(title).toMatch(app.titlePattern);
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(70); // Google 권장 길이

      // Meta description 검증
      const description = await page.getAttribute('meta[name="description"]', 'content');
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(50);
      expect(description!.length).toBeLessThan(160); // Google 권장 길이

      // Open Graph 태그 검증
      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
      const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
      const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
      const ogType = await page.getAttribute('meta[property="og:type"]', 'content');

      expect(ogTitle).toBeTruthy();
      expect(ogDescription).toBeTruthy();
      expect(ogUrl).toBeTruthy();
      expect(ogType).toBe('website');

      // Canonical URL 검증
      const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
      expect(canonical).toBeTruthy();
      expect(canonical).toMatch(/^https?:\/\//);
    });

    test('Korean version has correct hreflang tags', async ({ page }) => {
      await page.goto(`${app.baseUrl}/ko/`);

      // hreflang 태그 검증
      const hreflangEn = await page.getAttribute('link[hreflang="en"]', 'href');
      const hreflangKo = await page.getAttribute('link[hreflang="ko"]', 'href');
      const hreflangDefault = await page.getAttribute('link[hreflang="x-default"]', 'href');

      expect(hreflangEn).toBeTruthy();
      expect(hreflangKo).toBeTruthy();
      expect(hreflangDefault).toBeTruthy();

      // 한국어 페이지 title 검증
      const title = await page.title();
      expect(title).toMatch(app.titlePattern);
    });

    test('meta tags are not empty placeholders', async ({ page }) => {
      await page.goto(app.baseUrl);

      // 빈 값이나 placeholder 검증
      const description = await page.getAttribute('meta[name="description"]', 'content');
      expect(description).not.toBe('');
      expect(description).not.toMatch(/undefined|null|placeholder/i);

      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
      expect(ogTitle).not.toBe('');
      expect(ogTitle).not.toMatch(/undefined|null|placeholder/i);
    });
  });
}

// Context 앱 전용: 동적 Entry 페이지 메타 태그 검증
test.describe('Context - Dynamic Entry Meta Tags', () => {
  const baseUrl = 'http://localhost:3003';

  test('entry page has dynamic meta tags', async ({ page }) => {
    await page.goto(`${baseUrl}/entry/annyeong`);

    // 동적 title 검증 (한국어 단어 포함)
    const title = await page.title();
    expect(title).toContain('안녕');

    // 동적 description 검증
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(20);

    // Open Graph 동적 URL 검증
    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    expect(ogUrl).toContain('/entry/annyeong');
  });

  test('Korean entry page has localized meta tags', async ({ page }) => {
    await page.goto(`${baseUrl}/ko/entry/annyeong`);

    // 한국어 버전 title 검증
    const title = await page.title();
    expect(title).toContain('안녕');

    // hreflang 검증
    const hreflangEn = await page.getAttribute('link[hreflang="en"]', 'href');
    expect(hreflangEn).toContain('/entry/annyeong');
  });

  test('category page has correct meta tags', async ({ page }) => {
    await page.goto(`${baseUrl}/category/greetings`);

    const title = await page.title();
    expect(title).toMatch(/greetings|인사/i);

    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
  });
});

// Roots 앱 전용: 동적 Concept 페이지 메타 태그 검증
test.describe('Roots - Dynamic Concept Meta Tags', () => {
  const baseUrl = 'http://localhost:3005';

  test('concept page has dynamic meta tags', async ({ page }) => {
    await page.goto(`${baseUrl}/concept/addition`);

    const title = await page.title();
    expect(title).toMatch(/addition|덧셈/i);

    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
  });

  test('field page has correct meta tags', async ({ page }) => {
    await page.goto(`${baseUrl}/field/algebra`);

    const title = await page.title();
    expect(title).toMatch(/algebra|대수/i);
  });
});

// Permissive 앱 전용: 동적 Library 페이지 메타 태그 검증
test.describe('Permissive - Dynamic Library Meta Tags', () => {
  const baseUrl = 'http://localhost:3004';

  test('library page has dynamic meta tags', async ({ page }) => {
    await page.goto(`${baseUrl}/library/react`);

    const title = await page.title();
    expect(title).toMatch(/react/i);

    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
  });

  test('web-api page has correct meta tags', async ({ page }) => {
    await page.goto(`${baseUrl}/web-api/fetch`);

    const title = await page.title();
    expect(title).toMatch(/fetch/i);
  });
});
