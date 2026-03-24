/**
 * Multiple Windows Tests
 * ========================
 *
 * CONCEPT: Handling popups, new tabs, and multiple windows.
 *
 * When a link has target="_blank", clicking it opens a new tab/window.
 * Playwright can capture this new page via `waitForEvent('popup')`.
 *
 * PATTERN:
 *   const [newPage] = await Promise.all([
 *     page.waitForEvent('popup'),         // set up listener BEFORE the click
 *     page.click('a[target="_blank"]'),    // trigger the popup
 *   ]);
 *   // newPage is the new tab — interact with it like a regular Page
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - page.waitForEvent('popup') — capture new window/tab
 * - context.pages() — list all open pages in a context
 * - Interacting with multiple pages simultaneously
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/windows
 * DOCS: https://playwright.dev/docs/pages#handling-new-pages
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Multiple Windows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.multipleWindows);
  });

  test('should open and interact with a new window @advanced', async ({ page }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Click Here' }).click(),
    ]);

    await expect(newPage).toHaveURL(/\/windows\/new/);
    await expect(newPage.locator('h3')).toHaveText('New Window');
  });

  test('should have two pages in the context after opening new window @advanced', async ({ page, context }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Click Here' }).click(),
    ]);

    const allPages = context.pages();
    expect(allPages.length).toBe(2);

    await newPage.close();
    expect(context.pages().length).toBe(1);
  });
});
