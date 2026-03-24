/**
 * Dropdown Tests
 * ===============
 *
 * CONCEPT: Native <select> dropdown with selectOption()
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - selectOption(value) — select by value attribute
 * - selectOption({ label }) — select by visible text
 * - toHaveValue() — web-first assertion for <select> value
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/dropdown
 * DOCS: https://playwright.dev/docs/input#select-options
 */

import { test, expect } from '@playwright/test';
import { DropdownPage } from '../../../pages/dropdown.page.js';

test.describe('Dropdown', () => {
  let dropdownPage: DropdownPage;

  test.beforeEach(async ({ page }) => {
    dropdownPage = new DropdownPage(page);
    await dropdownPage.goto();
  });

  test('should select option by value @forms', async () => {
    await dropdownPage.selectByValue('1');

    await expect(dropdownPage.dropdown).toHaveValue('1');
  });

  test('should select option by visible label @forms', async () => {
    await dropdownPage.selectByLabel('Option 2');

    await expect(dropdownPage.dropdown).toHaveValue('2');
  });

  test('should change selection from one option to another @forms', async () => {
    await dropdownPage.selectByValue('1');
    await expect(dropdownPage.dropdown).toHaveValue('1');

    await dropdownPage.selectByValue('2');
    await expect(dropdownPage.dropdown).toHaveValue('2');
  });
});
