/**
 * @fileoverview Visual Regression Tests (Playwright Screenshot Comparison)
 *
 * 페이지 스크린샷을 baseline과 비교하여 UI 깨짐을 감지합니다.
 * - 첫 실행 시 baseline 스크린샷 생성
 * - 이후 실행 시 baseline과 비교
 * - 차이 발견 시 테스트 실패 + diff 이미지 생성
 *
 * Baseline 업데이트: npx playwright test --update-snapshots
 */

import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

const apps = [
  { name: 'context', baseUrl: 'http://localhost:3003' },
  { name: 'permissive', baseUrl: 'http://localhost:3004' },
  { name: 'roots', baseUrl: 'http://localhost:3005' },
];

for (const app of apps) {
  test.describe(`${app.name} - Visual Regression`, () => {
    // 홈페이지 시각적 회귀 테스트
    for (const viewport of viewports) {
      test(`homepage - ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(app.baseUrl);

        // 페이지 로드 대기 (hydration 완료)
        await page.waitForLoadState('networkidle');

        // 동적 콘텐츠 안정화 대기
        await page.waitForTimeout(500);

        await expect(page).toHaveScreenshot(`${app.name}-homepage-${viewport.name}.png`, {
          fullPage: false, // 뷰포트만 캡처 (전체 페이지는 너무 길 수 있음)
          maxDiffPixelRatio: 0.01, // 1% 차이까지 허용
        });
      });
    }

    // 한국어 버전 시각적 회귀 테스트
    test('korean homepage - desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(`${app.baseUrl}/ko/`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`${app.name}-homepage-ko.png`, {
        maxDiffPixelRatio: 0.01,
      });
    });

    // 다크모드 시각적 회귀 테스트
    test('homepage dark mode - desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      // 다크모드 설정
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto(app.baseUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`${app.name}-homepage-dark.png`, {
        maxDiffPixelRatio: 0.01,
      });
    });

    // 라이트모드 시각적 회귀 테스트
    test('homepage light mode - desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      // 라이트모드 설정
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto(app.baseUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`${app.name}-homepage-light.png`, {
        maxDiffPixelRatio: 0.01,
      });
    });
  });
}

// Context 앱 전용: Entry 페이지 시각적 회귀 테스트
test.describe('Context - Entry Page Visual Regression', () => {
  const baseUrl = 'http://localhost:3003';

  for (const viewport of viewports) {
    test(`entry page - ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${baseUrl}/entry/annyeong`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`context-entry-${viewport.name}.png`, {
        maxDiffPixelRatio: 0.02, // Entry 페이지는 동적 콘텐츠가 많아 2% 허용
      });
    });
  }

  test('category page - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${baseUrl}/category/greetings`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('context-category.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('browse page - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${baseUrl}/browse`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('context-browse.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

// Roots 앱 전용: Concept 페이지 시각적 회귀 테스트
test.describe('Roots - Concept Page Visual Regression', () => {
  const baseUrl = 'http://localhost:3005';

  for (const viewport of viewports) {
    test(`concept page - ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${baseUrl}/concept/addition`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`roots-concept-${viewport.name}.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  }

  test('field page - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${baseUrl}/field/algebra`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('roots-field.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

// Permissive 앱 전용: Library 페이지 시각적 회귀 테스트
test.describe('Permissive - Library Page Visual Regression', () => {
  const baseUrl = 'http://localhost:3004';

  for (const viewport of viewports) {
    test(`library page - ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${baseUrl}/library/react`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`permissive-library-${viewport.name}.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  }

  test('web-api page - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${baseUrl}/web-api/fetch`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('permissive-webapi.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

// 네비게이션 컴포넌트 시각적 회귀 테스트
test.describe('Navigation Components Visual Regression', () => {
  for (const app of apps) {
    test(`${app.name} - header navigation`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(app.baseUrl);
      await page.waitForLoadState('networkidle');

      // 헤더만 캡처
      const header = page.locator('header').first();
      await expect(header).toHaveScreenshot(`${app.name}-header.png`, {
        maxDiffPixelRatio: 0.01,
      });
    });

    test(`${app.name} - mobile menu`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(app.baseUrl);
      await page.waitForLoadState('networkidle');

      // 모바일 메뉴 버튼 클릭 (있는 경우)
      const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]');
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.waitForTimeout(300); // 애니메이션 대기

        await expect(page).toHaveScreenshot(`${app.name}-mobile-menu-open.png`, {
          maxDiffPixelRatio: 0.02,
        });
      }
    });
  }
});

// 에러 페이지 시각적 회귀 테스트
test.describe('Error Pages Visual Regression', () => {
  for (const app of apps) {
    test(`${app.name} - 404 page`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(`${app.baseUrl}/this-page-does-not-exist-12345`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`${app.name}-404.png`, {
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});
