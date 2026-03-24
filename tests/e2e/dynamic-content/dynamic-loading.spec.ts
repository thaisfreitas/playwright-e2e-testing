/**
 * Dynamic Loading Tests
 * ======================
 *
 * CONCEPT: Elements that load asynchronously — hidden elements vs rendered-after.
 *
 * Example 1 — Element Hidden: The target <h4> exists in the DOM from the start
 *   but is hidden with CSS. After clicking Start, a loading bar appears and the
 *   element becomes visible.
 *
 * Example 2 — Element Rendered After: The target <h4> does NOT exist in the DOM.
 *   After clicking Start, the server adds it dynamically.
 *
 * In BOTH cases, Playwright's auto-waiting assertion handles the timing:
 *   `await expect(finishText).toHaveText('Hello World!')` retries until the
 *   element is visible and has the expected text.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - Auto-waiting assertions across loading states
 * - toHaveText() with auto-retry
 * - toBeHidden() for loading indicator
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/dynamic_loading/1 and /2
 * DOCS: https://playwright.dev/docs/actionability
 */

import { test, expect } from '@playwright/test';
import { DynamicLoadingPage } from '../../../pages/dynamic-loading.page.js';

test.describe('Dynamic Loading', () => {
  test.describe('Example 1 — Element Hidden', () => {
    test('should reveal hidden element after loading @dynamic', async ({ page }) => {
      const dynamicLoadingPage = new DynamicLoadingPage(page);
      await dynamicLoadingPage.goto(1);

      await dynamicLoadingPage.startButton.click();

      await expect(dynamicLoadingPage.finishText).toHaveText('Hello World!');
    });
  });

  test.describe('Example 2 — Element Rendered After', () => {
    test('should render new element after loading @dynamic', async ({ page }) => {
      const dynamicLoadingPage = new DynamicLoadingPage(page);
      await dynamicLoadingPage.goto(2);

      await dynamicLoadingPage.startButton.click();

      await expect(dynamicLoadingPage.finishText).toHaveText('Hello World!');
    });

    test('loading indicator should disappear after completion @dynamic', async ({ page }) => {
      const dynamicLoadingPage = new DynamicLoadingPage(page);
      await dynamicLoadingPage.goto(2);

      await dynamicLoadingPage.startButton.click();
      await expect(dynamicLoadingPage.finishText).toBeVisible();

      await expect(dynamicLoadingPage.loadingIndicator).toBeHidden();
    });
  });
});
