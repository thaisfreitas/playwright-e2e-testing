/**
 * HTTP Basic Authentication Tests
 * =================================
 *
 * CONCEPT: HTTP Basic Auth is handled at the protocol level (not via a form).
 * The browser sends an Authorization header with every request. Playwright
 * supports this via `httpCredentials` on the BrowserContext.
 *
 * DIFFERENCE FROM FORM AUTH:
 * - Form Auth: user fills a <form>, server sets a session cookie.
 * - Basic Auth: browser sends Base64-encoded credentials in every HTTP request
 *   header. There's no login page — the browser shows a native dialog.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - browser.newContext({ httpCredentials }) for Basic Auth
 * - Creating isolated contexts with specific configurations
 * - Testing with and without credentials
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/basic_auth
 * DOCS: https://playwright.dev/docs/auth#http-authentication
 */

import { test, expect } from '@playwright/test';
import { BASIC_AUTH_CREDENTIALS, URLS, EXPECTED_TEXT } from '../../../utils/test-data.js';

test.describe('HTTP Basic Authentication', () => {
  test('should access page with valid credentials @smoke @auth', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: BASIC_AUTH_CREDENTIALS.username,
        password: BASIC_AUTH_CREDENTIALS.password,
      },
    });
    const page = await context.newPage();

    await page.goto(URLS.basicAuth);

    await expect(page.locator('p')).toContainText(EXPECTED_TEXT.basicAuthSuccess);

    await context.close();
  });

  test('should fail without credentials @auth', async ({ page }) => {
    const response = await page.goto(URLS.basicAuth);

    expect(response?.status()).toBe(401);
  });
});
