/**
 * Authentication Setup
 * =====================
 *
 * This file runs ONCE before all browser test projects (chromium, firefox, webkit)
 * as part of the "setup" project defined in playwright.config.ts.
 *
 * It performs a real UI login and saves the resulting cookies and localStorage
 * to `playwright/.auth/user.json`. All subsequent tests reuse this saved state
 * instead of logging in again, making the test suite dramatically faster.
 *
 * HOW IT CONNECTS TO playwright.config.ts:
 *
 *   projects: [
 *     { name: 'setup', testMatch: /.*\.setup\.ts/ },          // runs this file
 *     { name: 'chromium', dependencies: ['setup'], ... },     // waits for setup
 *   ]
 *
 * The `dependencies: ['setup']` ensures setup completes before any tests run.
 *
 * DOCS: https://playwright.dev/docs/auth#basic-shared-account-in-all-tests
 */

import { test as setup, expect } from '@playwright/test';
import { CREDENTIALS, URLS, EXPECTED_TEXT } from '../../../utils/test-data.js';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto(URLS.login);

  await page.locator('#username').fill(CREDENTIALS.valid.username);
  await page.locator('#password').fill(CREDENTIALS.valid.password);
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page.locator('.flash.success')).toContainText(EXPECTED_TEXT.loginSuccess);

  await page.context().storageState({ path: authFile });
});
