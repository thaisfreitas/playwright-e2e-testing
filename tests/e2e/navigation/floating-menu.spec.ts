/**
 * Floating Menu Tests
 * =====================
 *
 * CONCEPT: Fixed/sticky elements that remain visible during scroll.
 *
 * Floating menus stay in a fixed position regardless of scroll position.
 * Testing them requires:
 * 1. Verifying the menu is visible before scroll
 * 2. Scrolling the page significantly
 * 3. Verifying the menu is STILL visible after scroll
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - page.evaluate(() => window.scrollTo()) — programmatic scroll
 * - toBeVisible() — verify element visibility after scroll
 * - toBeInViewport() — verify element is within the visible viewport
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/floating_menu
 * DOCS: https://playwright.dev/docs/actionability#visible
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Floating Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.floatingMenu);
  });

  test('should remain visible after scrolling down @navigation', async ({ page }) => {
    const menu = page.locator('#menu');

    await expect(menu).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 1000));

    await expect(menu).toBeVisible();
  });

  test('should remain in viewport after scrolling @navigation', async ({ page }) => {
    const menu = page.locator('#menu');

    await page.evaluate(() => window.scrollTo(0, 2000));

    await expect(menu).toBeInViewport();
  });

  test('menu links should be functional after scroll @navigation', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 1500));

    const homeLink = page.locator('#menu a[href="#home"]');
    await expect(homeLink).toBeVisible();
  });
});
