/**
 * Context Menu Tests
 * ====================
 *
 * CONCEPT: Right-click (context menu) interactions.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - locator.click({ button: 'right' }) — trigger context menu / right-click
 * - page.on('dialog') — handle JavaScript alert triggered by right-click
 * - dialog.accept() / dialog.dismiss() — respond to native dialogs
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/context_menu
 * DOCS: https://playwright.dev/docs/input#mouse-click
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Context Menu', () => {
  test('should trigger alert on right-click @interactions', async ({ page }) => {
    await page.goto(URLS.contextMenu);

    let dialogMessage = '';
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await page.locator('#hot-spot').click({ button: 'right' });

    expect(dialogMessage).toBe('You selected a context menu');
  });
});
