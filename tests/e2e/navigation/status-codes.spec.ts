/**
 * Status Codes and Network Interception Tests
 * ==============================================
 *
 * CONCEPT: HTTP status codes and Playwright's network interception API.
 *
 * page.route() intercepts network requests BEFORE they reach the server.
 * You can:
 * - route.fulfill() — return a custom response (mock)
 * - route.abort() — block the request entirely
 * - route.continue() — let it through (optionally modifying headers/body)
 *
 * page.waitForResponse() waits for a specific response to arrive — useful
 * for asserting on API calls triggered by UI actions.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - page.route() — intercept and mock network requests
 * - route.fulfill() — return custom responses
 * - page.waitForResponse() — wait for specific API responses
 * - Response status code validation
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/status_codes
 * DOCS: https://playwright.dev/docs/network
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Status Codes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.statusCodes);
  });

  const statusCodes = [200, 301, 404, 500];

  for (const code of statusCodes) {
    test(`should navigate to ${code} status code page @navigation`, async ({ page }) => {
      const [response] = await Promise.all([
        page.waitForResponse((resp) => resp.url().includes(`status_codes/${code}`)),
        page.getByRole('link', { name: String(code) }).click(),
      ]);

      expect(response.status()).toBe(code === 301 ? 301 : code);
    });
  }
});

test.describe('Network Interception', () => {
  test('should intercept and mock a response @navigation', async ({ page }) => {
    await page.route('**/status_codes/200', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<h3>Mocked Response</h3><p>This response was intercepted by Playwright.</p>',
      });
    });

    await page.goto('/status_codes/200');

    await expect(page.locator('h3')).toHaveText('Mocked Response');
  });

  test('should abort a specific request @navigation', async ({ page }) => {
    await page.route('**/status_codes/500', async (route) => {
      await route.abort();
    });

    // Browser engines throw different messages for aborted navigation:
    // Chromium -> ERR_FAILED, Firefox -> NS_ERROR_FAILURE, WebKit -> Blocked by Web Inspector.
    // We only assert that navigation is rejected.
    await expect(page.goto('/status_codes/500')).rejects.toThrow();
  });
});
