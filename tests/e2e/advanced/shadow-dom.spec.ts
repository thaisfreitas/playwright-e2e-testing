/**
 * Shadow DOM Tests
 * ==================
 *
 * CONCEPT: Playwright automatically pierces Shadow DOM boundaries.
 *
 * Shadow DOM encapsulates a component's internal structure, making its elements
 * invisible to document.querySelector(). But Playwright's locator() API pierces
 * through shadow roots automatically — no special configuration needed.
 *
 * This is a significant advantage over other testing tools that require explicit
 * shadow DOM traversal (e.g., Selenium's getShadowRoot()).
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - locator() automatic shadow DOM piercing
 * - Asserting on text content inside shadow roots
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/shadowdom
 * DOCS: https://playwright.dev/docs/locators#locate-in-shadow-dom
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Shadow DOM', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.shadowDom);
  });

  test('should access text inside shadow DOM @advanced', async ({ page }) => {
    const shadowContent = page.locator('span');

    const count = await shadowContent.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should find elements inside shadow root with locator @advanced', async ({ page }) => {
    const listItems = page.locator('li');

    const count = await listItems.count();
    expect(count).toBeGreaterThan(0);

    const firstItemText = await listItems.first().textContent();
    expect(firstItemText?.trim()).toBeTruthy();
  });
});
