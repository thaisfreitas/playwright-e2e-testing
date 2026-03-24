/**
 * Dynamic Controls Page Object
 * ==============================
 *
 * CONCEPT: Waiting for elements to appear, disappear, enable, or disable.
 *
 * This page has two sections:
 * 1. A checkbox that can be added/removed via a toggle button
 * 2. A text input that can be enabled/disabled via a toggle button
 *
 * Both operations are asynchronous — after clicking the button, you must
 * WAIT for the change to complete. Playwright's auto-waiting handles this
 * automatically through its web-first assertions.
 *
 * ANTI-PATTERN: Never use `await page.waitForTimeout(3000)` to wait for
 * dynamic changes. It's slow (always waits the full duration) and flaky
 * (the operation might take longer on slow networks/CI).
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/dynamic_controls
 * DOCS: https://playwright.dev/docs/actionability
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { URLS } from '../utils/test-data.js';

export class DynamicControlsPage extends BasePage {
  readonly checkbox: Locator;
  readonly checkboxToggleButton: Locator;
  readonly textInput: Locator;
  readonly inputToggleButton: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    super(page);
    this.checkbox = page.locator('#checkbox');
    this.checkboxToggleButton = page.getByRole('button', { name: /remove|add/i });
    this.textInput = page.locator('#input-example input');
    this.inputToggleButton = page.getByRole('button', { name: /enable|disable/i });
    this.message = page.locator('#message');
  }

  async goto(): Promise<void> {
    await this.navigate(URLS.dynamicControls);
  }
}
