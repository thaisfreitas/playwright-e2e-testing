/**
 * Dynamic Controls Tests
 * =======================
 *
 * CONCEPT: Auto-waiting — Playwright's killer feature for handling async UI changes.
 *
 * When you write `await expect(element).toBeVisible()`, Playwright doesn't just
 * check once and fail. It RETRIES the assertion until it passes (or the timeout
 * expires). This eliminates the need for explicit waits and makes tests both
 * faster and more reliable.
 *
 * AUTO-WAITING vs EXPLICIT WAITS:
 * - Auto-wait (preferred): `await expect(element).toBeVisible()` — retries automatically
 * - Explicit wait (avoid): `await page.waitForTimeout(3000)` — arbitrary delay, flaky
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - toBeVisible() / toBeHidden() — element visibility assertions
 * - toBeEnabled() / toBeDisabled() — form control state assertions
 * - Auto-retrying assertions (no explicit waits needed)
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/dynamic_controls
 * DOCS: https://playwright.dev/docs/test-assertions
 */

import { test, expect } from '@playwright/test';
import { DynamicControlsPage } from '../../../pages/dynamic-controls.page.js';

test.describe('Dynamic Controls', () => {
  let dynamicControlsPage: DynamicControlsPage;

  test.beforeEach(async ({ page }) => {
    dynamicControlsPage = new DynamicControlsPage(page);
    await dynamicControlsPage.goto();
  });

  test.describe('Checkbox toggle', () => {
    test('should remove checkbox when clicking Remove @dynamic', async () => {
      await expect(dynamicControlsPage.checkbox).toBeVisible();

      await dynamicControlsPage.checkboxToggleButton.click();

      await expect(dynamicControlsPage.checkbox).toBeHidden();
      await expect(dynamicControlsPage.message).toHaveText("It's gone!");
    });

    test('should add checkbox back when clicking Add @dynamic', async () => {
      await dynamicControlsPage.checkboxToggleButton.click();
      await expect(dynamicControlsPage.checkbox).toBeHidden();

      await dynamicControlsPage.checkboxToggleButton.click();

      await expect(dynamicControlsPage.checkbox).toBeVisible();
      await expect(dynamicControlsPage.message).toHaveText("It's back!");
    });
  });

  test.describe('Input toggle', () => {
    test('should enable disabled input @dynamic', async () => {
      await expect(dynamicControlsPage.textInput).toBeDisabled();

      await dynamicControlsPage.inputToggleButton.click();

      await expect(dynamicControlsPage.textInput).toBeEnabled();
      await expect(dynamicControlsPage.message).toHaveText("It's enabled!");
    });

    test('should disable enabled input @dynamic', async () => {
      await dynamicControlsPage.inputToggleButton.click();
      await expect(dynamicControlsPage.textInput).toBeEnabled();

      await dynamicControlsPage.inputToggleButton.click();

      await expect(dynamicControlsPage.textInput).toBeDisabled();
      await expect(dynamicControlsPage.message).toHaveText("It's disabled!");
    });
  });
});
