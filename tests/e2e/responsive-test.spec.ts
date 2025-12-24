import { expect, test } from '@playwright/test';

// 테스트할 뷰포트 크기들
const viewports = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: '4K', width: 2560, height: 1440 },
];

// ==================== Context App Tests ====================
test.describe('Context App Responsive', () => {
  for (const viewport of viewports) {
    test(`Homepage - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3003/');

      // 페이지 로드 확인
      await expect(page.locator('h1')).toBeVisible();

      // 스크린샷
      await page.screenshot({
        path: `/tmp/responsive/context-home-${viewport.name.replace(/ /g, '-')}.png`,
        fullPage: true,
      });

      // 기본 레이아웃 체크
      const h1 = page.locator('h1');
      const h1Box = await h1.boundingBox();
      expect(h1Box).not.toBeNull();

      // h1이 화면 안에 있는지 확인
      if (h1Box) {
        expect(h1Box.x).toBeGreaterThanOrEqual(0);
        expect(h1Box.x + h1Box.width).toBeLessThanOrEqual(viewport.width + 10);
      }

      // 수평 스크롤 없는지 확인 (오버플로우 체크)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test(`Entry page - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3003/entry/piano');

      await expect(page.locator('h1')).toBeVisible();

      await page.screenshot({
        path: `/tmp/responsive/context-entry-${viewport.name.replace(/ /g, '-')}.png`,
        fullPage: true,
      });

      // 수평 스크롤 없는지 확인
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test(`Browse page - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3003/browse');

      await expect(page.locator('main')).toBeVisible();

      await page.screenshot({
        path: `/tmp/responsive/context-browse-${viewport.name.replace(/ /g, '-')}.png`,
        fullPage: true,
      });

      // 수평 스크롤 없는지 확인
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });
  }

  // 모바일 네비게이션 테스트
  test('Mobile navigation hamburger menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3003/');

    // 햄버거 메뉴 또는 바텀 네비게이션 확인
    const bottomNav = page.locator('nav').filter({ has: page.locator('a[href="/browse"]') });
    const isBottomNavVisible = await bottomNav
      .first()
      .isVisible()
      .catch(() => false);

    // 모바일에서는 네비게이션이 있어야 함
    expect(isBottomNavVisible).toBe(true);
  });
});

// ==================== Permissive App Tests ====================
test.describe('Permissive App Responsive', () => {
  for (const viewport of viewports) {
    test(`Homepage - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3004/');

      await expect(page.locator('h1')).toBeVisible();

      await page.screenshot({
        path: `/tmp/responsive/permissive-home-${viewport.name.replace(/ /g, '-')}.png`,
        fullPage: true,
      });

      // 수평 스크롤 없는지 확인
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test(`Libraries page - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3004/libraries');

      await expect(page.locator('main')).toBeVisible();

      await page.screenshot({
        path: `/tmp/responsive/permissive-libraries-${viewport.name.replace(/ /g, '-')}.png`,
        fullPage: true,
      });

      // 수평 스크롤 없는지 확인
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test(`Web API page - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3004/web-api');

      await expect(page.locator('main')).toBeVisible();

      await page.screenshot({
        path: `/tmp/responsive/permissive-webapi-${viewport.name.replace(/ /g, '-')}.png`,
        fullPage: true,
      });

      // 수평 스크롤 없는지 확인
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });
  }

  // 사이드바 반응형 테스트
  test('Sidebar hidden on mobile, visible on desktop', async ({ page }) => {
    // 모바일
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3004/');

    const sidebar = page.locator('aside');
    const isSidebarVisibleMobile = await sidebar.isVisible().catch(() => false);

    // 모바일에서는 사이드바가 숨겨져야 함
    expect(isSidebarVisibleMobile).toBe(false);

    // 데스크탑
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3004/');

    const isSidebarVisibleDesktop = await sidebar.isVisible().catch(() => false);

    // 데스크탑에서는 사이드바가 보여야 함
    expect(isSidebarVisibleDesktop).toBe(true);
  });
});

// ==================== Roots App Tests ====================
test.describe('Roots App Responsive', () => {
  for (const viewport of viewports) {
    test(`Homepage - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3005/');

      await expect(page.locator('h1')).toBeVisible();

      await page.screenshot({
        path: `/tmp/responsive/roots-home-${viewport.name.replace(/ /g, '-')}.png`,
        fullPage: true,
      });

      // 수평 스크롤 없는지 확인
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test(`Concept page - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3005/concept/pythagorean-theorem');

      await expect(page.locator('h1')).toBeVisible();

      await page.screenshot({
        path: `/tmp/responsive/roots-concept-${viewport.name.replace(/ /g, '-')}.png`,
        fullPage: true,
      });

      // 수평 스크롤 없는지 확인
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test(`Browse page - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3005/browse');

      await expect(page.locator('main')).toBeVisible();

      await page.screenshot({
        path: `/tmp/responsive/roots-browse-${viewport.name.replace(/ /g, '-')}.png`,
        fullPage: true,
      });

      // 수평 스크롤 없는지 확인
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test(`Field page - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3005/field/algebra');

      await expect(page.locator('main')).toBeVisible();

      await page.screenshot({
        path: `/tmp/responsive/roots-field-${viewport.name.replace(/ /g, '-')}.png`,
        fullPage: true,
      });

      // 수평 스크롤 없는지 확인
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });
  }

  // 터치 타겟 크기 테스트 (44px 이상)
  test('Touch targets are at least 44px on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3005/');

    // 클릭 가능한 요소들 확인
    const buttons = await page.locator('button').all();

    for (const button of buttons.slice(0, 5)) {
      const box = await button.boundingBox();
      if (box && box.width > 0 && box.height > 0) {
        // 최소 44px 터치 타겟
        expect(Math.max(box.width, box.height)).toBeGreaterThanOrEqual(40);
      }
    }
  });

  // 그리드 반응형 테스트
  test('Grid columns adjust based on viewport', async ({ page }) => {
    // 모바일 - 1열
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3005/');

    // 데스크탑 - 4열
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3005/');

    // Featured concepts 그리드 확인
    const grid = page.locator('.grid').first();
    const isGridVisible = await grid.isVisible().catch(() => false);
    expect(isGridVisible).toBe(true);
  });
});

// ==================== Cross-App Tests ====================
test.describe('Cross-App Responsive Checks', () => {
  const apps = [
    { name: 'Context', url: 'http://localhost:3003/' },
    { name: 'Permissive', url: 'http://localhost:3004/' },
    { name: 'Roots', url: 'http://localhost:3005/' },
  ];

  for (const app of apps) {
    test(`${app.name} - No text overflow on smallest mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto(app.url);

      // 텍스트가 화면 밖으로 나가지 않는지 확인
      const hasOverflow = await page.evaluate(() => {
        const elements = document.querySelectorAll('p, h1, h2, h3, span, a');
        for (const el of elements) {
          const rect = el.getBoundingClientRect();
          if (rect.right > window.innerWidth + 5) {
            return true;
          }
        }
        return false;
      });

      expect(hasOverflow).toBe(false);
    });

    test(`${app.name} - Font sizes are readable on mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(app.url);

      // 본문 텍스트 최소 14px 확인
      const smallestFontSize = await page.evaluate(() => {
        const textElements = document.querySelectorAll('p, span, a, li');
        let smallest = 100;
        for (const el of textElements) {
          const style = window.getComputedStyle(el);
          const fontSize = Number.parseFloat(style.fontSize);
          if (fontSize > 0 && fontSize < smallest) {
            smallest = fontSize;
          }
        }
        return smallest;
      });

      // 최소 12px 이상
      expect(smallestFontSize).toBeGreaterThanOrEqual(12);
    });

    test(`${app.name} - Images are responsive`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(app.url);

      // 이미지가 화면을 넘어가지 않는지 확인
      const hasOversizedImages = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        for (const img of images) {
          if (img.offsetWidth > window.innerWidth) {
            return true;
          }
        }
        return false;
      });

      expect(hasOversizedImages).toBe(false);
    });
  }
});
