/**
 * Hovers Page Object
 * ====================
 *
 * CONCEPT: Mouse hover interactions with locator.hover()
 *
 * Hovering reveals hidden content (tooltips, user info, action menus).
 * Playwright's .hover() moves the mouse to the element's center and
 * triggers CSS :hover state and JavaScript mouseover events.
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/hovers
 * DOCS: https://playwright.dev/docs/input#mouse-click
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { URLS } from '../utils/test-data.js';

export class HoversPage extends BasePage {
  readonly figures: Locator;

  constructor(page: Page) {
    super(page);
    this.figures = page.locator('.figure');
  }

  async goto(): Promise<void> {
    await this.navigate(URLS.hovers);
  }

  async hoverOverFigure(index: number): Promise<void> {
    await this.figures.nth(index).hover();
  }

  getFigureCaption(index: number): Locator {
    return this.figures.nth(index).locator('.figcaption');
  }
}
