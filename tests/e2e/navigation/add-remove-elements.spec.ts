/**
 * Add/Remove Elements Tests
 * ===========================
 *
 * CONCEPT: Dynamic element counting with toHaveCount().
 *
 * This page lets you add and remove buttons dynamically. It's a perfect
 * exercise for:
 * - Counting elements with toHaveCount() (auto-retrying)
 * - Using locator.count() for imperative counting
 * - Verifying DOM changes after user actions
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - toHaveCount() — web-first assertion that retries until count matches
 * - locator.count() — get current count (no retry)
 * - getByRole('button') — semantic button selection
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/add_remove_elements/
 * DOCS: https://playwright.dev/docs/test-assertions#expectlocatortohavecount
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Add/Remove Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.addRemoveElements);
  });

  test('should start with no Delete buttons @navigation', async ({ page }) => {
    const deleteButtons = page.locator('.added-manually');
    await expect(deleteButtons).toHaveCount(0);
  });

  test('should add elements when clicking Add Element @navigation', async ({ page }) => {
    const addButton = page.getByRole('button', { name: 'Add Element' });
    const deleteButtons = page.locator('.added-manually');

    await addButton.click();
    await addButton.click();
    await addButton.click();

    await expect(deleteButtons).toHaveCount(3);
  });

  test('should remove an element when clicking Delete @navigation', async ({ page }) => {
    const addButton = page.getByRole('button', { name: 'Add Element' });
    const deleteButtons = page.locator('.added-manually');

    await addButton.click();
    await addButton.click();
    await expect(deleteButtons).toHaveCount(2);

    await deleteButtons.first().click();
    await expect(deleteButtons).toHaveCount(1);
  });

  test('should handle adding and removing multiple elements @navigation', async ({ page }) => {
    const addButton = page.getByRole('button', { name: 'Add Element' });
    const deleteButtons = page.locator('.added-manually');

    for (let i = 0; i < 5; i++) {
      await addButton.click();
    }
    await expect(deleteButtons).toHaveCount(5);

    for (let i = 4; i >= 0; i--) {
      await deleteButtons.first().click();
      await expect(deleteButtons).toHaveCount(i);
    }
  });
});
