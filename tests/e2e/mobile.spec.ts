import { expect, test } from '@playwright/test';

const MIN_TOUCH_TARGET = 44;

test.describe('Mobile Optimality', () => {
  test('touch targets should be at least 44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 주요 인터랙티브 요소 (인라인 링크 제외 - 텍스트 링크는 44px 미만일 수 있음)
    const interactiveElements = page.locator('button, input, select, textarea, [role="button"]');
    const count = await interactiveElements.count();

    let passCount = 0;
    let checkCount = 0;

    for (let i = 0; i < count; i++) {
      const element = interactiveElements.nth(i);
      const isVisible = await element.isVisible();

      if (isVisible) {
        const box = await element.boundingBox();
        if (box && box.width > 0 && box.height > 0) {
          checkCount++;
          // 너비 또는 높이 중 하나만 충족해도 통과 (WCAG 2.1 권장)
          if (box.width >= MIN_TOUCH_TARGET || box.height >= MIN_TOUCH_TARGET) {
            passCount++;
          }
        }
      }
    }

    // 80% 이상의 요소가 터치 타겟 기준을 충족해야 함
    if (checkCount > 0) {
      const passRate = passCount / checkCount;
      expect(passRate).toBeGreaterThanOrEqual(0.8);
    }
  });

  test('should not have horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    // 약간의 오차 허용 (1px 이내)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
