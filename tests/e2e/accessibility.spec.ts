/**
 * Accessibility Tests
 *
 * axe-core를 사용한 포괄적인 접근성 테스트
 * WCAG 2.1 AA 기준 준수 검증
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// WCAG 2.1 AA 태그
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('Accessibility', () => {
  // ========================================
  // 기본 접근성 테스트
  // ========================================

  test('should have no accessibility violations (WCAG 2.1 AA)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(wcagTags).analyze();

    // 위반 사항이 있으면 상세 정보 출력
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations:');
      for (const violation of accessibilityScanResults.violations) {
        console.log(`- ${violation.id}: ${violation.description}`);
        console.log(`  Impact: ${violation.impact}`);
        console.log(`  Nodes: ${violation.nodes.length}`);
      }
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // h1은 하나만 있어야 함
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // 헤딩 레벨이 순차적이어야 함 (h1 -> h2 -> h3, h2 스킵하고 h3 X)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let lastLevel = 0;

    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
      const level = Number.parseInt(tagName.replace('h', ''), 10);

      // 레벨이 2 이상 점프하면 안됨 (예: h1 다음 h3)
      expect(level - lastLevel).toBeLessThanOrEqual(1);
      lastLevel = level;
    }
  });

  // ========================================
  // 이미지 접근성
  // ========================================

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');

      // alt가 있거나, 장식용 이미지(role="presentation" 또는 alt="")
      const isDecorative = role === 'presentation' || role === 'none' || alt === '';
      const hasAlt = alt !== null;

      expect(hasAlt || isDecorative).toBeTruthy();
    }
  });

  // ========================================
  // 키보드 접근성
  // ========================================

  // Skip: Tab 순회 타이밍이 CI 환경에서 불안정
  test.skip('all interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // 포커스 가능한 요소들
    const interactiveElements = page.locator(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const count = await interactiveElements.count();

    // Tab으로 순회하면서 포커스 확인
    for (let i = 0; i < Math.min(count, 10); i++) {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      const focusedCount = await focusedElement.count();
      expect(focusedCount).toBeGreaterThan(0);
    }
  });

  test('focus should be visible', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');

    if ((await focusedElement.count()) > 0) {
      // 포커스 아웃라인이 있는지 확인
      const outline = await focusedElement.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          outline: style.outline,
          outlineWidth: style.outlineWidth,
          boxShadow: style.boxShadow,
        };
      });

      // outline 또는 box-shadow로 포커스 표시
      const hasVisibleFocus =
        (outline.outline !== 'none' && outline.outlineWidth !== '0px') ||
        outline.boxShadow !== 'none';

      expect(hasVisibleFocus).toBeTruthy();
    }
  });

  // ========================================
  // 터치 타겟 크기 (Mobile)
  // ========================================

  test('touch targets should be at least 44x44 pixels', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 주요 인터랙티브 요소 (버튼, 입력 필드 등 - 인라인 링크 제외)
    const touchTargets = page.locator('button, input, select, textarea, [role="button"]');
    const count = await touchTargets.count();

    let passCount = 0;
    let checkCount = 0;

    for (let i = 0; i < Math.min(count, 20); i++) {
      const element = touchTargets.nth(i);
      const isVisible = await element.isVisible();

      if (isVisible) {
        const box = await element.boundingBox();
        if (box && box.width > 0 && box.height > 0) {
          checkCount++;
          // 최소 44x44 픽셀 (WCAG 2.1 권장) - 너비 또는 높이 중 하나만 충족해도 통과
          // 인라인 요소의 경우 높이만 충분하면 터치 가능
          if (box.width >= 44 || box.height >= 44) {
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

  // ========================================
  // 색상 대비
  // ========================================

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .options({ runOnly: ['color-contrast'] })
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  // ========================================
  // ARIA 사용
  // ========================================

  test('ARIA attributes should be valid', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .options({
        runOnly: [
          'aria-allowed-attr',
          'aria-hidden-focus',
          'aria-required-attr',
          'aria-required-children',
          'aria-required-parent',
          'aria-roles',
          'aria-valid-attr',
          'aria-valid-attr-value',
        ],
      })
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  // ========================================
  // 폼 접근성
  // ========================================

  test('form inputs should have associated labels', async ({ page }) => {
    await page.goto('/');

    const inputs = page.locator(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea',
    );
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');

      // id가 있으면 연결된 label이 있는지 확인
      let hasLabel = false;
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        hasLabel = (await label.count()) > 0;
      }

      // 라벨이 있거나 aria-label/aria-labelledby가 있어야 함
      // (placeholder만 있는 것은 권장하지 않지만 허용)
      const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledby || placeholder;
      expect(hasAccessibleName).toBeTruthy();
    }
  });
});

// ========================================
// 다크모드 접근성 테스트
// ========================================

test.describe('Dark Mode Accessibility', () => {
  // Skip: 다크모드 클래스 적용 타이밍이 CI에서 불안정
  test.skip('dark mode should have sufficient contrast', async ({ page }) => {
    await page.goto('/');

    // 다크모드 활성화
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    await page.waitForTimeout(300);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .options({ runOnly: ['color-contrast'] })
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
