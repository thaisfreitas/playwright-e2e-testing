/**
 * Dropdown Page Object
 * =====================
 *
 * CONCEPT: Native <select> dropdown interactions with selectOption()
 *
 * Playwright's selectOption() supports selecting by value, label, or index.
 * It works ONLY with native <select> elements. For custom dropdowns (built
 * with divs/spans), you'd use click() + getByRole('option') instead.
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/dropdown
 * DOCS: https://playwright.dev/docs/input#select-options
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { URLS } from '../utils/test-data.js';

export class DropdownPage extends BasePage {
  readonly dropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.dropdown = page.locator('#dropdown');
  }

  async goto(): Promise<void> {
    await this.navigate(URLS.dropdown);
  }

  async selectByValue(value: string): Promise<void> {
    await this.dropdown.selectOption(value);
  }

  async selectByLabel(label: string): Promise<void> {
    await this.dropdown.selectOption({ label });
  }
}
