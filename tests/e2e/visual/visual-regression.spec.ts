/**
 * Visual Regression Tests
 * =========================
 *
 * CONCEPT: Screenshot comparison (visual testing) with toHaveScreenshot().
 *
 * Visual regression testing captures screenshots and compares them against
 * saved baselines. Any pixel difference beyond the configured threshold
 * triggers a failure, catching unintended visual changes.
 *
 * HOW IT WORKS:
 * 1. First run: Playwright captures screenshots and saves them as baselines
 *    in a __snapshots__ folder next to the test file.
 * 2. Subsequent runs: new screenshots are compared pixel-by-pixel against
 *    the baselines. Differences are reported with a visual diff image.
 * 3. To update baselines after intentional changes:
 *    `npx playwright test --update-snapshots`
 *
 * KEY OPTIONS:
 * - maxDiffPixels: absolute number of pixels allowed to differ
 * - maxDiffPixelRatio: percentage of pixels allowed to differ (0-1)
 * - threshold: per-pixel color sensitivity (0 = exact, 1 = any color)
 * - mask: array of locators to hide dynamic content (dates, ads, etc.)
 *
 * WHEN TO USE VISUAL TESTING:
 * - Catch CSS regressions (layout shifts, color changes, font issues)
 * - Validate complex UI that's hard to assert with locators alone
 * - Complement (not replace) functional assertions
 *
 * WHEN NOT TO USE:
 * - Dynamic content that changes every load (use mask or functional tests)
 * - Content behind animations (disable animations first)
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - expect(page).toHaveScreenshot() — full page comparison
 * - expect(locator).toHaveScreenshot() — element-level comparison
 * - Masking dynamic areas with the `mask` option
 * - maxDiffPixelRatio for tolerance configuration
 *
 * DOCS: https://playwright.dev/docs/test-snapshots
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Visual Regression', () => {
  test('should match login page screenshot @visual', async ({ page }) => {
    await page.goto(URLS.login);

    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test('should match checkboxes page screenshot @visual', async ({ page }) => {
    await page.goto(URLS.checkboxes);

    await expect(page).toHaveScreenshot('checkboxes-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test('should match dropdown element screenshot @visual', async ({ page }) => {
    await page.goto(URLS.dropdown);

    const dropdown = page.locator('#dropdown');
    await expect(dropdown).toHaveScreenshot('dropdown-element.png');
  });

  test('should match tables page with dynamic content masked @visual', async ({ page }) => {
    await page.goto(URLS.sortableTables);

    await expect(page).toHaveScreenshot('tables-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      mask: [page.locator('#table2')],
    });
  });
});
