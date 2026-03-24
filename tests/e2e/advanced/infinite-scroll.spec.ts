/**
 * Infinite Scroll Tests
 * =======================
 *
 * CONCEPT: Scrolling and waiting for dynamically loaded content.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - page.evaluate(() => window.scrollTo()) — programmatic scroll
 * - page.mouse.wheel() — simulate mouse wheel scroll
 * - Waiting for new elements instead of arbitrary timeouts
 * - locator.count() — count dynamically added elements
 *
 * ANTI-PATTERN AVOIDED:
 *   // BAD: arbitrary wait, slow and flaky
 *   await page.waitForTimeout(3000);
 *
 *   // GOOD: wait for the content you expect
 *   await expect(page.locator('.jscroll-added')).toHaveCount(expectedCount);
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/infinite_scroll
 * DOCS: https://playwright.dev/docs/input#scrolling
 */

import { test, expect } from '@playwright/test';
import { InfiniteScrollPage } from '../../../pages/infinite-scroll.page.js';

test.describe('Infinite Scroll', () => {
  test('should load more content on scroll @advanced', async ({ page }) => {
    const infiniteScrollPage = new InfiniteScrollPage(page);
    await infiniteScrollPage.goto();

    const initialCount = await infiniteScrollPage.scrollParagraphs.count();

    await infiniteScrollPage.scrollToBottom();
    await expect(infiniteScrollPage.scrollParagraphs).not.toHaveCount(initialCount);
  });

  test('should load content using mouse wheel @advanced', async ({ page }) => {
    const infiniteScrollPage = new InfiniteScrollPage(page);
    await infiniteScrollPage.goto();

    const initialCount = await infiniteScrollPage.scrollParagraphs.count();

    await page.mouse.wheel(0, 2000);
    await expect(infiniteScrollPage.scrollParagraphs).not.toHaveCount(initialCount);
  });
});
