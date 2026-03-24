/**
 * Numeric Input Tests
 * ====================
 *
 * CONCEPT: Text input interactions — fill() vs type(), and input validation.
 *
 * fill() vs type():
 * - fill() clears the field first, then sets the value instantly. Use for most cases.
 * - type() simulates individual keystrokes. Use when the app reacts to each keystroke
 *   (e.g., autocomplete, live search, character-by-character validation).
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - page.locator('input') — CSS selector (last resort for inputs without labels)
 * - fill() — clear + set value
 * - press() — simulate individual key presses
 * - toHaveValue() — assert current input value
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/inputs
 * DOCS: https://playwright.dev/docs/input#text-input
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Numeric Inputs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.inputs);
  });

  test('should fill a numeric value @forms', async ({ page }) => {
    const input = page.locator('input[type="number"]');

    await input.fill('42');

    await expect(input).toHaveValue('42');
  });

  test('should clear and replace input value @forms', async ({ page }) => {
    const input = page.locator('input[type="number"]');

    await input.fill('100');
    await expect(input).toHaveValue('100');

    await input.fill('200');
    await expect(input).toHaveValue('200');
  });

  test('should increment value with arrow keys @forms', async ({ page }) => {
    const input = page.locator('input[type="number"]');

    await input.fill('10');
    await input.press('ArrowUp');

    await expect(input).toHaveValue('11');
  });

  test('should decrement value with arrow keys @forms', async ({ page }) => {
    const input = page.locator('input[type="number"]');

    await input.fill('10');
    await input.press('ArrowDown');

    await expect(input).toHaveValue('9');
  });
});
