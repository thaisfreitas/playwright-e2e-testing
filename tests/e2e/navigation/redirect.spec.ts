/**
 * Redirect Tests
 * ================
 *
 * CONCEPT: Following redirect chains and verifying final URLs.
 *
 * HTTP redirects (301, 302, 307) are invisible to users but critical for
 * testing. Playwright follows redirects automatically — page.goto() resolves
 * to the FINAL URL after all redirects complete.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - page.waitForURL() — wait for URL to change (useful after redirects)
 * - toHaveURL() — assert the final URL matches expected pattern
 * - Response status codes after navigation
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/redirector
 * DOCS: https://playwright.dev/docs/navigations
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Redirects', () => {
  test('should follow redirect to status codes page @navigation', async ({ page }) => {
    await page.goto(URLS.redirector);

    await page.getByRole('link', { name: /here/i }).click();

    await expect(page).toHaveURL(/\/status_codes/);
  });

  test('should verify page content after redirect @navigation', async ({ page }) => {
    await page.goto(URLS.redirector);
    await page.getByRole('link', { name: /here/i }).click();

    await page.waitForURL(/\/status_codes/);
    await expect(page.locator('h3')).toHaveText('Status Codes');
  });
});
