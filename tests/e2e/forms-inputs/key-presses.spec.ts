/**
 * Key Presses Tests
 * ==================
 *
 * CONCEPT: Keyboard events with page.keyboard and locator.press()
 *
 * Playwright provides two keyboard APIs:
 * - locator.press('Key') — sends a key to a specific element (preferred)
 * - page.keyboard.press('Key') — sends a key to the currently focused element
 *
 * Use locator.press() when you have a target element (input fields).
 * Use page.keyboard.press() for global shortcuts or when no element is focused.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - locator.press() — send key to specific element
 * - page.keyboard.press() — global key press
 * - Key names: 'Enter', 'Tab', 'Escape', 'ArrowUp', 'a', 'A' (shift+a)
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/key_presses
 * DOCS: https://playwright.dev/docs/input#keys-and-shortcuts
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Key Presses', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.keyPresses);
  });

  const keysToTest = [
    { key: 'a', expected: 'A' },
    { key: 'Tab', expected: 'TAB' },
    { key: 'Escape', expected: 'ESCAPE' },
    { key: 'ArrowUp', expected: 'UP' },
    { key: 'ArrowDown', expected: 'DOWN' },
  ];

  for (const { key, expected } of keysToTest) {
    test(`should detect "${key}" key press @forms`, async ({ page }) => {
      const input = page.locator('#target');
      const result = page.locator('#result');

      await input.click();
      await page.keyboard.press(key);

      await expect(result).toContainText(expected);
    });
  }

  test('should submit form when pressing Enter @forms', async ({ page }) => {
    const input = page.locator('#target');
    const result = page.locator('#result');

    await input.click();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/key_presses\?/);
    await expect(result).toHaveText('');
  });
});
