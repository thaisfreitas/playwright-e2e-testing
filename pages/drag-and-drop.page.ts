/**
 * Drag and Drop Page Object
 * ===========================
 *
 * CONCEPT: Drag and drop interactions with Playwright's dragTo() API.
 *
 * Playwright offers two approaches:
 * 1. locator.dragTo(target) — high-level API, works for most drag-and-drop
 * 2. Manual mouse events — page.mouse.move/down/up for complex custom drag
 *
 * NOTE: The Internet's drag-and-drop page uses HTML5 drag events, which can
 * be tricky. The high-level dragTo() may not work on all implementations;
 * in those cases, dispatching drag events manually via evaluate() is needed.
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/drag_and_drop
 * DOCS: https://playwright.dev/docs/input#drag-and-drop
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { URLS } from '../utils/test-data.js';

export class DragAndDropPage extends BasePage {
  readonly columnA: Locator;
  readonly columnB: Locator;

  constructor(page: Page) {
    super(page);
    this.columnA = page.locator('#column-a');
    this.columnB = page.locator('#column-b');
  }

  async goto(): Promise<void> {
    await this.navigate(URLS.dragAndDrop);
  }

  /**
   * Perform drag from column A to column B using JavaScript DataTransfer events.
   * The Internet's drag-and-drop implementation requires dispatching native
   * HTML5 drag events rather than using Playwright's built-in dragTo().
   */
  async dragAToB(): Promise<void> {
    await this.page.evaluate(() => {
      const source = document.querySelector('#column-a')!;
      const target = document.querySelector('#column-b')!;

      const dataTransfer = new DataTransfer();
      source.dispatchEvent(new DragEvent('dragstart', { dataTransfer, bubbles: true }));
      target.dispatchEvent(new DragEvent('dragover', { dataTransfer, bubbles: true }));
      target.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true }));
      source.dispatchEvent(new DragEvent('dragend', { dataTransfer, bubbles: true }));
    });
  }
}
