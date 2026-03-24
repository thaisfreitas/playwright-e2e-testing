/**
 * Notification Messages Tests
 * =============================
 *
 * CONCEPT: Transient/flash messages that appear and may change on each load.
 *
 * The Internet's notification page displays a flash message that varies between
 * "Action successful" and "Action unsuccesful, please try again" (yes, the typo
 * is intentional on the site). This teaches:
 * - Asserting on elements that appear after navigation
 * - Handling non-deterministic content with flexible matchers
 * - Using regex patterns in assertions
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - toContainText() with regex for flexible matching
 * - Handling flash messages that appear after navigation
 * - getByRole('link') for clicking navigation elements
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/notification_message
 * DOCS: https://playwright.dev/docs/test-assertions#expectlocatortocontaintext
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Notification Messages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.notificationMessage);
  });

  test('should display a notification message @dynamic', async ({ page }) => {
    const flash = page.locator('#flash');

    await expect(flash).toBeVisible();
    await expect(flash).toContainText(/Action/);
  });

  test('should display a new notification after clicking the link @dynamic', async ({ page }) => {
    await page.getByRole('link', { name: /click here/i }).click();

    const flash = page.locator('#flash');
    await expect(flash).toBeVisible();
    await expect(flash).toContainText(/Action (successful|unsuccesful)/);
  });
});
