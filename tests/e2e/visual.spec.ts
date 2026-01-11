/**
 * Visual Regression Tests
 *
 * 스크린샷 기반 시각적 회귀 테스트
 * pixelmatch를 사용하여 UI 변경 감지
 *
 * Visual regression snapshots require baseline images.
 * Run locally with: pnpm playwright test visual.spec.ts --update-snapshots
 */
import { expect, test } from '@playwright/test';

// Skip visual regression in CI (baseline images are not committed)
const skipVisualRegression = process.env.CI === 'true';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

test.describe('Visual Regression', () => {
  // 각 뷰포트에서 홈페이지 스크린샷
  for (const viewport of viewports) {
    test(`homepage should match snapshot on ${viewport.name}`, async ({ page }, testInfo) => {
      test.skip(skipVisualRegression, 'Visual regression baselines not committed to git');

      const appName = testInfo.project.name;
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      // 페이지 로딩 완료 대기
      await page.waitForLoadState('networkidle');

      // 애니메이션 완료 대기
      await page.waitForTimeout(500);

      // fullPage 제거 - viewport 크기만 캡처 (동적 높이 문제 방지)
      await expect(page).toHaveScreenshot(`${appName}-home-${viewport.name}.png`, {
        animations: 'disabled',
        maxDiffPixelRatio: 0.1, // 허용 오차 10%
      });
    });
  }

  // 다크모드 테스트
  test('should match snapshot in dark mode', async ({ page }, testInfo) => {
    test.skip(skipVisualRegression, 'Visual regression baselines not committed to git');

    const appName = testInfo.project.name;
    await page.goto('/');

    // 다크모드 활성화
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    await page.waitForTimeout(300);

    // fullPage 제거 - viewport 크기만 캡처
    await expect(page).toHaveScreenshot(`${appName}-dark-mode.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.1,
    });
  });

  // 상호작용 상태 테스트
  test('should show correct hover states', async ({ page }, testInfo) => {
    test.skip(skipVisualRegression, 'Visual regression baselines not committed to git');

    const appName = testInfo.project.name;
    await page.goto('/');

    // 첫 번째 버튼/링크에 호버
    const firstInteractive = page.locator('a, button').first();
    if ((await firstInteractive.count()) > 0) {
      await firstInteractive.hover();
      await page.waitForTimeout(200);

      await expect(page).toHaveScreenshot(`${appName}-hover-state.png`, {
        animations: 'disabled',
        maxDiffPixelRatio: 0.1,
      });
    }
  });

  // 포커스 상태 테스트
  test('should show correct focus states', async ({ page }, testInfo) => {
    test.skip(skipVisualRegression, 'Visual regression baselines not committed to git');

    const appName = testInfo.project.name;
    await page.goto('/');

    // Tab으로 첫 포커스 가능 요소로 이동
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    await expect(page).toHaveScreenshot(`${appName}-focus-state.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.1,
    });
  });
});

// 컴포넌트 수준 시각 테스트 (Context 앱 예시)
test.describe('Context - Component Visual Tests', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'context', 'Context-only visual checks.');
    test.skip(skipVisualRegression, 'Visual regression baselines not committed to git');
  });

  test('search component should match snapshot', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[type="search"]');
    if ((await searchInput.count()) > 0) {
      await searchInput.click();
      await page.waitForTimeout(200);

      await expect(page.locator('header')).toHaveScreenshot('context-search-focused.png', {
        animations: 'disabled',
        maxDiffPixelRatio: 0.1,
      });
    }
  });

  test('sidebar should match snapshot when open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 모바일에서 사이드바 열기 버튼 찾기
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]');
    if ((await menuButton.count()) > 0) {
      await menuButton.click();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot('context-sidebar-open.png', {
        animations: 'disabled',
        maxDiffPixelRatio: 0.1,
      });
    }
  });
});
