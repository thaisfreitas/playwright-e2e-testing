/**
 * JavaScript Alerts Page Object
 * ===============================
 *
 * CONCEPT: Handling native JavaScript dialogs (alert, confirm, prompt).
 *
 * Native dialogs (window.alert, window.confirm, window.prompt) block the
 * main thread in a real browser. Playwright handles them via the 'dialog'
 * event — you register a handler BEFORE the action that triggers the dialog.
 *
 * IMPORTANT: Register page.on('dialog', handler) BEFORE clicking the button
 * that triggers the dialog. If you click first, the dialog may auto-dismiss
 * before your handler runs.
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/javascript_alerts
 * DOCS: https://playwright.dev/docs/dialogs
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { URLS } from '../utils/test-data.js';

export class JavaScriptAlertsPage extends BasePage {
  readonly alertButton: Locator;
  readonly confirmButton: Locator;
  readonly promptButton: Locator;
  readonly result: Locator;

  constructor(page: Page) {
    super(page);
    this.alertButton = page.getByRole('button', { name: 'Click for JS Alert' });
    this.confirmButton = page.getByRole('button', { name: 'Click for JS Confirm' });
    this.promptButton = page.getByRole('button', { name: 'Click for JS Prompt' });
    this.result = page.locator('#result');
  }

  async goto(): Promise<void> {
    await this.navigate(URLS.javascriptAlerts);
  }
}
