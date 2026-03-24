/**
 * Infinite Scroll Page Object
 * =============================
 *
 * CONCEPT: Programmatic scrolling and lazy-loaded content.
 *
 * Infinite scroll pages load more content as the user scrolls down. Testing
 * them requires:
 * 1. Scrolling to the bottom of the viewport
 * 2. Waiting for new content to load (NOT using waitForTimeout!)
 * 3. Asserting that new content appeared
 *
 * ANTI-PATTERN: `await page.waitForTimeout(2000)` — this is the most common
 * mistake in infinite scroll tests. Use `waitFor` on the new elements instead.
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/infinite_scroll
 * DOCS: https://playwright.dev/docs/input#scrolling
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { URLS } from '../utils/test-data.js';

export class InfiniteScrollPage extends BasePage {
  readonly scrollParagraphs: Locator;

  constructor(page: Page) {
    super(page);
    this.scrollParagraphs = page.locator('.jscroll-added');
  }

  async goto(): Promise<void> {
    await this.navigate(URLS.infiniteScroll);
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }
}
