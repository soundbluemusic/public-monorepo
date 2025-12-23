import { test } from '@playwright/test';

test('Debug onclick property', async ({ page }) => {
  await page.goto('http://localhost:3003');
  await page.waitForLoadState('networkidle');

  const onclickDetails = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label*="mode" i]') as any;
    if (!btn) return null;

    const onclick = btn.onclick;

    return {
      type: typeof onclick,
      isNull: onclick === null,
      constructor: onclick?.constructor?.name,
      value: onclick?.toString?.(),
      keys: onclick ? Object.keys(onclick) : [],
      proto: onclick ? Object.getPrototypeOf(onclick)?.constructor?.name : null,
    };
  });

  console.log('onclick details:', JSON.stringify(onclickDetails, null, 2));

  // Try calling onclick directly
  const directClickResult = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label*="mode" i]') as any;
    if (!btn || !btn.onclick) return 'no onclick';

    try {
      if (typeof btn.onclick === 'function') {
        btn.onclick();
        return 'called as function';
      }
      return `not a function: ${typeof btn.onclick}`;
    } catch (e: any) {
      return `error: ${e.message}`;
    }
  });

  console.log('Direct click result:', directClickResult);
});
