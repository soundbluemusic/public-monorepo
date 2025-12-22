/**
 * @fileoverview E2E tests for WCAG 2.1 AA accessibility compliance
 */

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('WCAG 2.1 AA Accessibility', () => {
  test('should not have any automatically detectable accessibility issues (Korean)', async ({
    page,
  }) => {
    await page.goto('/ko');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have any automatically detectable accessibility issues (English)', async ({
    page,
  }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper document structure', async ({ page }) => {
    await page.goto('/ko');

    // Should have one main landmark
    const mains = await page.$$('main');
    expect(mains.length).toBe(1);

    // Should have proper heading hierarchy (h1)
    const h1 = await page.$('h1');
    expect(h1).not.toBeNull();
  });

  test('should have lang attribute on html element', async ({ page }) => {
    await page.goto('/ko');

    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBeDefined();
    expect(lang).not.toBe('');
  });

  test('should have accessible labels for form inputs', async ({ page }) => {
    await page.goto('/ko/search');

    const inputs = await page.$$('input');

    for (const input of inputs) {
      // Check if input has label, aria-label, or aria-labelledby
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      if (id) {
        const label = await page.$(`label[for="${id}"]`);
        if (!label && !ariaLabel && !ariaLabelledBy) {
          throw new Error('Input must have associated label');
        }
      } else {
        if (!ariaLabel && !ariaLabelledBy) {
          throw new Error('Input without id must have aria-label or aria-labelledby');
        }
      }
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/ko');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.color'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/ko');

    const images = await page.$$('img');

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Alt can be empty string for decorative images, but must exist
      expect(alt).not.toBeNull();
    }
  });

  test('should not have any skip-link violations', async ({ page }) => {
    await page.goto('/ko');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.keyboard'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Color Contrast', () => {
  test('should meet WCAG AA color contrast requirements', async ({ page }) => {
    await page.goto('/ko');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('body')
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have sufficient contrast on interactive elements', async ({ page }) => {
    await page.goto('/ko');

    const buttons = await page.$$('button, a[href]');

    for (const button of buttons) {
      const isVisible = await button.isVisible();
      if (isVisible) {
        // Element is visible, should pass contrast check
        const bbox = await button.boundingBox();
        if (bbox) {
          const accessibilityScanResults = await new AxeBuilder({ page })
            .include(button)
            .withRules(['color-contrast'])
            .analyze();

          expect(accessibilityScanResults.violations).toEqual([]);
        }
      }
    }
  });
});

test.describe('Keyboard Navigation', () => {
  test('should be able to navigate with Tab key', async ({ page }) => {
    await page.goto('/ko');

    // Get all focusable elements
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusableCount = await page.locator(focusableSelector).count();

    if (focusableCount > 0) {
      // Press Tab and check if focus moves
      await page.keyboard.press('Tab');

      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });

      expect(focusedElement).toBeDefined();
      expect(focusedElement).not.toBe('BODY');
    }
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/ko');

    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled])';

    const focusableElements = await page.$$(focusableSelector);

    if (focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      await firstElement.focus();

      // Check if element has focus styles
      const hasFocusOutline = await page.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        const outline = styles.outline;
        const outlineWidth = styles.outlineWidth;
        const boxShadow = styles.boxShadow;

        // Should have either outline or box-shadow for focus
        return (
          (outline && outline !== 'none') ||
          (outlineWidth && outlineWidth !== '0px') ||
          (boxShadow && boxShadow !== 'none')
        );
      }, firstElement);

      expect(hasFocusOutline).toBe(true);
    }
  });
});
