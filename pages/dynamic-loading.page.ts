/**
 * Dynamic Loading Page Object
 * =============================
 *
 * CONCEPT: Elements that appear after an asynchronous operation (loading state).
 *
 * The Internet has two Dynamic Loading examples:
 * - Example 1: Element is hidden in the DOM and revealed after loading
 * - Example 2: Element doesn't exist in the DOM until loading completes
 *
 * Both require waiting for the loading to finish, but Playwright's auto-waiting
 * handles this seamlessly — you just assert on the final state and Playwright
 * retries until the element appears or the timeout expires.
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/dynamic_loading/1 and /2
 * DOCS: https://playwright.dev/docs/actionability#auto-waiting
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

export class DynamicLoadingPage extends BasePage {
  readonly startButton: Locator;
  readonly loadingIndicator: Locator;
  readonly finishText: Locator;

  constructor(page: Page) {
    super(page);
    this.startButton = page.getByRole('button', { name: /start/i });
    this.loadingIndicator = page.locator('#loading');
    this.finishText = page.locator('#finish h4');
  }

  async goto(example: 1 | 2): Promise<void> {
    await this.navigate(`/dynamic_loading/${example}`);
  }
}
