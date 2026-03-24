/**
 * Checkboxes Tests
 * =================
 *
 * CONCEPT: Checkbox interactions and the toBeChecked() assertion.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - .check() / .uncheck() — idempotent checkbox operations
 * - .isChecked() — query checkbox state
 * - toBeChecked() — web-first assertion that auto-retries
 * - Locator.nth() — selecting elements by position
 *
 * WHY check()/uncheck() OVER click()?
 * - click() toggles state: if the checkbox is already checked, click() unchecks it.
 *   This makes tests dependent on initial state, which is fragile.
 * - check() is idempotent: calling check() on an already-checked box does nothing.
 *   This makes tests deterministic regardless of initial state.
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/checkboxes
 * DOCS: https://playwright.dev/docs/input#checkboxes-and-radio-buttons
 */

import { test, expect } from '@playwright/test';
import { CheckboxesPage } from '../../../pages/checkboxes.page.js';

test.describe('Checkboxes', () => {
  let checkboxesPage: CheckboxesPage;

  test.beforeEach(async ({ page }) => {
    checkboxesPage = new CheckboxesPage(page);
    await checkboxesPage.goto();
  });

  test('should verify default checkbox states @smoke @forms', async () => {
    await expect(checkboxesPage.checkbox1).not.toBeChecked();
    await expect(checkboxesPage.checkbox2).toBeChecked();
  });

  test('should check an unchecked checkbox @forms', async () => {
    await checkboxesPage.checkbox1.check();

    await expect(checkboxesPage.checkbox1).toBeChecked();
  });

  test('should uncheck a checked checkbox @forms', async () => {
    await checkboxesPage.checkbox2.uncheck();

    await expect(checkboxesPage.checkbox2).not.toBeChecked();
  });

  test('should toggle both checkboxes @forms', async () => {
    await checkboxesPage.checkbox1.check();
    await checkboxesPage.checkbox2.uncheck();

    await expect(checkboxesPage.checkbox1).toBeChecked();
    await expect(checkboxesPage.checkbox2).not.toBeChecked();
  });

  test('check() is idempotent — calling it twice keeps the checkbox checked @forms', async () => {
    await checkboxesPage.checkbox1.check();
    await checkboxesPage.checkbox1.check();

    await expect(checkboxesPage.checkbox1).toBeChecked();
  });
});
