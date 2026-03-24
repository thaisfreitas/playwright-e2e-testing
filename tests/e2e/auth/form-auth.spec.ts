/**
 * Form Authentication Tests
 * ==========================
 *
 * CONCEPT: Form-based login/logout — the most common authentication pattern
 * in web applications. Tests cover the happy path (valid credentials), error
 * paths (invalid credentials), and session management (logout).
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - Page Object Model (LoginPage)
 * - Web-first assertions (toContainText, toHaveURL)
 * - test.describe for grouping related tests
 * - test.beforeEach for shared navigation setup
 * - Tags (@smoke, @auth) for selective test execution
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/login
 * DOCS: https://playwright.dev/docs/auth
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page.js';
import { CREDENTIALS, URLS, EXPECTED_TEXT } from '../../../utils/test-data.js';

test.describe('Form Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login with valid credentials @smoke @auth', async ({ page }) => {
    await loginPage.login(CREDENTIALS.valid.username, CREDENTIALS.valid.password);

    await expect(page).toHaveURL(/\/secure/);
    await loginPage.expectSuccessMessage();
  });

  test('should show error for invalid username @auth', async () => {
    await loginPage.login(CREDENTIALS.invalid.username, CREDENTIALS.valid.password);

    await loginPage.expectErrorMessage(EXPECTED_TEXT.loginError);
  });

  test('should show error for invalid password @auth', async () => {
    await loginPage.login(CREDENTIALS.valid.username, CREDENTIALS.invalid.password);

    await loginPage.expectErrorMessage(EXPECTED_TEXT.loginPasswordError);
  });

  test('should logout successfully after login @smoke @auth', async ({ page }) => {
    await loginPage.login(CREDENTIALS.valid.username, CREDENTIALS.valid.password);
    await expect(page).toHaveURL(/\/secure/);

    await loginPage.logout();

    await expect(page).toHaveURL(/\/login/);
    await loginPage.expectErrorMessage(EXPECTED_TEXT.logoutSuccess);
  });

  test('should not access secure page without login @auth', async ({ page }) => {
    await page.goto(URLS.secure);

    await expect(page).toHaveURL(/\/login/);
  });
});
