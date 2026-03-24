/**
 * Checkboxes Page Object
 * =======================
 *
 * CONCEPT: Checkbox interactions — .check(), .uncheck(), .isChecked()
 *
 * Playwright provides dedicated checkbox methods that are smarter than
 * raw .click(): calling .check() on an already-checked box is a no-op,
 * and .uncheck() on an unchecked box is a no-op. This prevents accidental
 * state toggles that make tests flaky.
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/checkboxes
 * DOCS: https://playwright.dev/docs/input#checkboxes-and-radio-buttons
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { URLS } from '../utils/test-data.js';

export class CheckboxesPage extends BasePage {
  readonly checkbox1: Locator;
  readonly checkbox2: Locator;

  constructor(page: Page) {
    super(page);
    this.checkbox1 = page.locator('#checkboxes input').nth(0);
    this.checkbox2 = page.locator('#checkboxes input').nth(1);
  }

  async goto(): Promise<void> {
    await this.navigate(URLS.checkboxes);
  }
}
