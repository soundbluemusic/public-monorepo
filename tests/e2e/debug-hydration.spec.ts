import { test } from '@playwright/test';

test('Debug React hydration', async ({ page }) => {
  await page.goto('http://localhost:3003');

  // Wait for network idle
  await page.waitForLoadState('networkidle');

  // Check if React loaded
  const reactLoaded = await page.evaluate(() => {
    return (
      typeof window.React !== 'undefined' ||
      document.querySelector('[data-reactroot]') !== null ||
      document.querySelector('script[src*="entry.client"]') !== null
    );
  });

  console.log('React loaded:', reactLoaded);

  // Check if entry.client.js executed
  const entryClientExecuted = await page.evaluate(() => {
    // Check for React Router context
    return typeof (window as any).__reactRouterContext !== 'undefined';
  });

  console.log('Entry client executed:', entryClientExecuted);

  // Find the dark mode button
  const buttonExists = await page.locator('button[aria-label*="mode" i]').count();
  console.log('Button count:', buttonExists);

  // Check button properties
  if (buttonExists > 0) {
    const buttonProps = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label*="mode" i]') as any;
      if (!btn) return null;

      return {
        onclick: typeof btn.onclick,
        hasReactKeys: Object.keys(btn).filter((k) => k.startsWith('__react')).length,
        allKeys: Object.keys(btn).length,
        classList: Array.from(btn.classList),
      };
    });

    console.log('Button props:', JSON.stringify(buttonProps, null, 2));
  }

  // Try clicking and see what happens
  await page.locator('button[aria-label*="mode" i]').first().click();

  await page.waitForTimeout(1000);

  const themeChanged = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark');
  });

  console.log('Theme changed after click:', themeChanged);
});
