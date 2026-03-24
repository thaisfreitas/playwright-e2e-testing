/**
 * Login Page Object
 * ==================
 *
 * Encapsulates all interactions with The Internet's Form Authentication page:
 * https://the-internet.herokuapp.com/login
 *
 * CONCEPT: Page Object Model (POM)
 * Each page object encapsulates the selectors and actions for a single page.
 * Tests interact with page objects ("loginPage.login(...)") instead of
 * raw selectors, making tests readable and maintainable.
 *
 * SELECTOR STRATEGY (priority order):
 * 1. getByRole     — matches the accessibility tree (best practice)
 * 2. getByLabel    — for form inputs with associated <label> elements
 * 3. getByPlaceholder — when no label is present
 * 4. getByText     — for non-interactive elements with visible text
 * 5. getByTestId   — when semantic selectors aren't feasible
 * 6. CSS/XPath     — last resort; document why others failed
 *
 * NOTE: The Internet's login page uses #username / #password IDs without
 * proper <label> associations, so we fall back to CSS ID selectors here.
 * In a real app, you'd advocate for proper labels and use getByLabel.
 *
 * DOCS:
 * - Locators:  https://playwright.dev/docs/locators
 * - Selectors: https://playwright.dev/docs/selectors
 */

import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page.js';
import { URLS } from '../utils/test-data.js';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly flashMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.getByRole('button', { name: /login/i });
    this.flashMessage = page.locator('#flash');
    this.logoutButton = page.getByRole('link', { name: /logout/i });
  }

  async goto(): Promise<void> {
    await this.navigate(URLS.login);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectSuccessMessage(): Promise<void> {
    await expect(this.flashMessage).toContainText('You logged into a secure area!');
  }

  async expectErrorMessage(text: string): Promise<void> {
    await expect(this.flashMessage).toContainText(text);
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
