/**
 * Base Page Object
 * =================
 *
 * The foundation of our Page Object Model (POM). Every page-specific class
 * (LoginPage, CheckboxesPage, etc.) extends this abstract class to inherit
 * common navigation and utility methods.
 *
 * WHY USE A BASE PAGE?
 *
 * - DRY (Don't Repeat Yourself): navigation, screenshots, and page-level
 *   queries are written once and shared across all page objects.
 * - Consistent API: every page object exposes the same base methods, making
 *   tests predictable and easier to read.
 * - Single point of change: if The Internet redesigns its layout (e.g., the
 *   heading moves from h3 to h2), we fix it in one place.
 *
 * PATTERN: This follows the "Template Method" design pattern — the base class
 * defines the skeleton of operations, and subclasses fill in page-specific details.
 *
 * DOCS:
 * - Page Object Model: https://playwright.dev/docs/pom
 * - Page class API:    https://playwright.dev/docs/api/class-page
 */

import { type Page, type Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h3');
  }

  /**
   * Navigate to a path relative to baseURL configured in playwright.config.ts.
   *
   * WHEN TO USE: In every page object's `goto()` method. Always use relative
   * paths so the baseURL can be swapped via environment variables.
   *
   * EXAMPLE: `await this.navigate('/login')` resolves to
   * `https://the-internet.herokuapp.com/login`
   */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Wait until the page reaches the 'load' state — all resources (images,
   * stylesheets, scripts) have finished loading.
   *
   * WHEN TO USE: After navigation when you need to ensure the page is fully
   * rendered before asserting on visual or layout-dependent elements.
   *
   * NOTE: Playwright's auto-waiting handles most cases. Use this only when
   * you specifically need ALL resources loaded (e.g., before a screenshot).
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
  }

  /**
   * Get the browser tab's title (the <title> tag content).
   *
   * WHEN TO USE: For page-level assertions to confirm you landed on the
   * correct page, especially after navigation or redirects.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Get the current page URL.
   *
   * WHEN TO USE: To verify navigation succeeded, especially after form
   * submissions, redirects, or login flows.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Capture a full-page screenshot and save it to the screenshots/ directory.
   *
   * WHEN TO USE: For visual debugging during test development, or to create
   * visual evidence of a test step. For automated visual comparison, prefer
   * `expect(page).toHaveScreenshot()` instead.
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /**
   * Get the main heading text. The Internet uses <h3> as the primary heading
   * on most pages, which serves as a reliable page identifier.
   *
   * WHEN TO USE: To verify you're on the expected page after navigation.
   */
  async getHeadingText(): Promise<string> {
    return this.heading.innerText();
  }
}
