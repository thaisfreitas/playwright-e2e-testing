/**
 * JavaScript Alerts Tests
 * =========================
 *
 * CONCEPT: Handling native JS dialogs — alert(), confirm(), prompt().
 *
 * IMPORTANT PATTERN: Register the dialog handler BEFORE the action that
 * triggers it. Playwright auto-dismisses unhandled dialogs, so if your
 * handler isn't registered in time, you'll miss the dialog.
 *
 * Dialog types:
 * - alert(): informational, has only OK button → dialog.accept()
 * - confirm(): has OK and Cancel → dialog.accept() or dialog.dismiss()
 * - prompt(): has text input + OK/Cancel → dialog.accept('text') or dialog.dismiss()
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - page.on('dialog', handler) — register a dialog handler
 * - dialog.type() — 'alert', 'confirm', 'prompt', or 'beforeunload'
 * - dialog.message() — the text displayed in the dialog
 * - dialog.accept(text?) — click OK (optionally with prompt text)
 * - dialog.dismiss() — click Cancel
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/javascript_alerts
 * DOCS: https://playwright.dev/docs/dialogs
 */

import { test, expect } from '@playwright/test';
import { JavaScriptAlertsPage } from '../../../pages/javascript-alerts.page.js';

test.describe('JavaScript Alerts', () => {
  let alertsPage: JavaScriptAlertsPage;

  test.beforeEach(async ({ page }) => {
    alertsPage = new JavaScriptAlertsPage(page);
    await alertsPage.goto();
  });

  test('should accept an alert @advanced', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('I am a JS Alert');
      await dialog.accept();
    });

    await alertsPage.alertButton.click();

    await expect(alertsPage.result).toHaveText('You successfully clicked an alert');
  });

  test('should accept a confirm dialog @advanced', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await alertsPage.confirmButton.click();

    await expect(alertsPage.result).toHaveText('You clicked: Ok');
  });

  test('should dismiss a confirm dialog @advanced', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await alertsPage.confirmButton.click();

    await expect(alertsPage.result).toHaveText('You clicked: Cancel');
  });

  test('should send text to a prompt dialog @advanced', async ({ page }) => {
    const promptText = 'Hello from Playwright!';

    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept(promptText);
    });

    await alertsPage.promptButton.click();

    await expect(alertsPage.result).toHaveText(`You entered: ${promptText}`);
  });

  test('should dismiss a prompt dialog @advanced', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await alertsPage.promptButton.click();

    await expect(alertsPage.result).toHaveText('You entered: null');
  });
});
