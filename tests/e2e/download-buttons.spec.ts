import { expect, test } from '@playwright/test';

/**
 * Test to verify download page buttons work
 * Tests the plain JS event delegation fallback for hydration issues
 */
test.describe('Download Page Buttons', () => {
  test('JSON download button triggers download', async ({ page }) => {
    // Track download events
    const downloads: string[] = [];
    page.on('download', (download) => {
      downloads.push(download.suggestedFilename());
    });

    // Navigate to download page
    await page.goto('http://localhost:3003/download');
    await page.waitForLoadState('networkidle');

    // Find and click the JSON download button
    const jsonDownloadBtn = page.locator('button[data-action="download"][data-format="json"]');
    await expect(jsonDownloadBtn).toBeVisible();

    // Click the download button
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await jsonDownloadBtn.click();

    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('context-vocabulary');
    expect(download.suggestedFilename()).toContain('.json');
  });

  test('CSV download button triggers download', async ({ page }) => {
    await page.goto('http://localhost:3003/download');
    await page.waitForLoadState('networkidle');

    const csvDownloadBtn = page.locator('button[data-action="download"][data-format="csv"]');
    await expect(csvDownloadBtn).toBeVisible();

    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await csvDownloadBtn.click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('context-vocabulary');
    expect(download.suggestedFilename()).toContain('.csv');
  });

  test('download data is embedded in page', async ({ page }) => {
    await page.goto('http://localhost:3003/download');
    await page.waitForLoadState('networkidle');

    // Check that window.__downloadData exists and has entries
    const downloadData = await page.evaluate(() => {
      // @ts-expect-error - global variable set by the page
      const data = window.__downloadData;
      return {
        exists: !!data,
        hasEntries: !!(data?.entries && data.entries.length > 0),
        entryCount: data?.entries?.length || 0,
        locale: data?.locale,
      };
    });

    expect(downloadData.exists).toBe(true);
    expect(downloadData.hasEntries).toBe(true);
    expect(downloadData.entryCount).toBeGreaterThan(0);
    console.log(
      `Download data: ${downloadData.entryCount} entries, locale: ${downloadData.locale}`,
    );
  });

  test('all download buttons have data attributes', async ({ page }) => {
    await page.goto('http://localhost:3003/download');
    await page.waitForLoadState('networkidle');

    // Check for download buttons with proper data attributes
    const downloadButtons = page.locator('button[data-action="download"][data-format]');
    const count = await downloadButtons.count();

    expect(count).toBe(4); // json, csv, txt, md

    // Verify each format
    for (const format of ['json', 'csv', 'txt', 'md']) {
      const btn = page.locator(`button[data-action="download"][data-format="${format}"]`);
      await expect(btn).toBeVisible();
    }
  });
});
