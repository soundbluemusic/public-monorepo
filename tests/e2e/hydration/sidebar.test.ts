/**
 * Sidebar Hydration Tests
 *
 * 사이드바 상태가 페이지 간 일관성 있게 유지되는지 테스트
 * 주요 검증 항목:
 * 1. 사이드바 접힘 상태가 localStorage에 저장되는지
 * 2. 페이지 새로고침 후에도 상태가 유지되는지
 * 3. SSR 초기 렌더링과 클라이언트 hydration 간 불일치가 없는지
 */
import { expect, test } from '@playwright/test';

test.describe('Sidebar Hydration', () => {
  test.beforeEach(async ({ page }) => {
    // localStorage 초기화
    await page.addInitScript(() => {
      localStorage.removeItem('settings-storage');
    });
  });

  test('sidebar collapsed state persists after page reload', async ({ page }, testInfo) => {
    // Context 앱에서만 테스트 (사이드바가 있는 앱)
    test.skip(testInfo.project.name !== 'context', 'Context-only sidebar tests');

    // 데스크톱 뷰포트 설정
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 사이드바 접기 버튼 찾기
    const collapseButton = page.locator('[data-sidebar-collapse]');
    if ((await collapseButton.count()) === 0) {
      test.skip(true, 'No sidebar collapse button found');
      return;
    }

    // 초기 상태: 사이드바 펼쳐짐
    const htmlBefore = await page.locator('html').getAttribute('class');
    expect(htmlBefore).not.toContain('sidebar-collapsed');

    // 사이드바 접기
    await collapseButton.click();
    await page.waitForTimeout(300);

    // 접힌 상태 확인
    const htmlAfter = await page.locator('html').getAttribute('class');
    expect(htmlAfter).toContain('sidebar-collapsed');

    // localStorage에 저장되었는지 확인
    const stored = await page.evaluate(() => {
      return localStorage.getItem('settings-storage');
    });
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.sidebarCollapsed).toBe(true);

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 새로고침 후에도 접힌 상태 유지 확인
    const htmlAfterReload = await page.locator('html').getAttribute('class');
    expect(htmlAfterReload).toContain('sidebar-collapsed');
  });

  test('sidebar state is consistent across different pages', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'context', 'Context-only sidebar tests');

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const collapseButton = page.locator('[data-sidebar-collapse]');
    if ((await collapseButton.count()) === 0) {
      test.skip(true, 'No sidebar collapse button found');
      return;
    }

    // 사이드바 접기
    await collapseButton.click();
    await page.waitForTimeout(300);

    // 다른 페이지로 이동
    await page.goto('/browse');
    await page.waitForLoadState('networkidle');

    // 다른 페이지에서도 접힌 상태 유지 확인
    const htmlOnBrowse = await page.locator('html').getAttribute('class');
    expect(htmlOnBrowse).toContain('sidebar-collapsed');

    // 또 다른 페이지로 이동
    await page.goto('/my-learning');
    await page.waitForLoadState('networkidle');

    // 여전히 접힌 상태 유지
    const htmlOnMyLearning = await page.locator('html').getAttribute('class');
    expect(htmlOnMyLearning).toContain('sidebar-collapsed');
  });

  test('no hydration mismatch on initial load with stored collapsed state', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'context', 'Context-only sidebar tests');

    await page.setViewportSize({ width: 1280, height: 800 });

    // localStorage에 미리 접힌 상태 저장
    await page.addInitScript(() => {
      localStorage.setItem(
        'settings-storage',
        JSON.stringify({
          state: { sidebarCollapsed: true },
          version: 0,
        }),
      );
    });

    // 콘솔 경고/에러 모니터링 (hydration mismatch 감지)
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning' || msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // hydration 완료 대기

    // Hydration 관련 에러가 없어야 함
    const hydrationErrors = consoleMessages.filter(
      (msg) =>
        msg.includes('Hydration') ||
        msg.includes('hydration') ||
        msg.includes('server rendered') ||
        msg.includes('mismatch'),
    );
    expect(hydrationErrors).toHaveLength(0);

    // 초기 로드 시 바로 접힌 상태여야 함 (FOUC 없음)
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('sidebar-collapsed');
  });

  test('sidebar width changes correctly when collapsed', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'context', 'Context-only sidebar tests');

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const sidebar = page.locator('aside[aria-label]').first();
    if ((await sidebar.count()) === 0) {
      test.skip(true, 'No sidebar found');
      return;
    }

    const collapseButton = page.locator('[data-sidebar-collapse]');
    if ((await collapseButton.count()) === 0) {
      test.skip(true, 'No sidebar collapse button found');
      return;
    }

    // 펼쳐진 상태의 사이드바 너비
    const expandedWidth = await sidebar.evaluate((el) => el.getBoundingClientRect().width);

    // 사이드바 접기
    await collapseButton.click();
    await page.waitForTimeout(300);

    // 접힌 상태의 사이드바 너비
    const collapsedWidth = await sidebar.evaluate((el) => el.getBoundingClientRect().width);

    // 접힌 상태가 더 좁아야 함
    expect(collapsedWidth).toBeLessThan(expandedWidth);
    // 접힌 너비는 대략 64px (4rem) 정도여야 함
    expect(collapsedWidth).toBeLessThanOrEqual(80);
  });

  test('main content padding adjusts with sidebar state', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'context', 'Context-only sidebar tests');

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const mainContent = page.locator('main#main-content');
    if ((await mainContent.count()) === 0) {
      test.skip(true, 'No main content found');
      return;
    }

    const collapseButton = page.locator('[data-sidebar-collapse]');
    if ((await collapseButton.count()) === 0) {
      test.skip(true, 'No sidebar collapse button found');
      return;
    }

    // 펼쳐진 상태의 main padding-left
    const expandedPadding = await mainContent.evaluate((el) =>
      parseInt(getComputedStyle(el).paddingLeft),
    );

    // 사이드바 접기
    await collapseButton.click();
    await page.waitForTimeout(300);

    // 접힌 상태의 main padding-left
    const collapsedPadding = await mainContent.evaluate((el) =>
      parseInt(getComputedStyle(el).paddingLeft),
    );

    // 접힌 상태에서 padding이 줄어야 함
    expect(collapsedPadding).toBeLessThan(expandedPadding);
  });
});

// Roots 앱 사이드바 테스트
test.describe('Roots Sidebar Hydration', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('settings-storage');
    });
  });

  test('sidebar state persists in Roots app', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'roots', 'Roots-only sidebar tests');

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const collapseButton = page.locator('[data-sidebar-collapse]');
    if ((await collapseButton.count()) === 0) {
      test.skip(true, 'No sidebar collapse button found');
      return;
    }

    // 사이드바 접기
    await collapseButton.click();
    await page.waitForTimeout(300);

    // 페이지 이동
    await page.goto('/browse');
    await page.waitForLoadState('networkidle');

    // 상태 유지 확인
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('sidebar-collapsed');
  });
});

// Permissive 앱 사이드바 테스트
test.describe('Permissive Sidebar Hydration', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('settings-storage');
    });
  });

  test('sidebar state persists in Permissive app', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'permissive', 'Permissive-only sidebar tests');

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const collapseButton = page.locator('[data-sidebar-collapse]');
    if ((await collapseButton.count()) === 0) {
      test.skip(true, 'No sidebar collapse button found');
      return;
    }

    // 사이드바 접기
    await collapseButton.click();
    await page.waitForTimeout(300);

    // 페이지 이동
    await page.goto('/libraries');
    await page.waitForLoadState('networkidle');

    // 상태 유지 확인
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('sidebar-collapsed');
  });
});
