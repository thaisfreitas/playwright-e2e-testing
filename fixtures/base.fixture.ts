/**
 * Base Test Fixtures
 * ===================
 *
 * Custom Playwright fixtures that automatically inject Page Objects into tests.
 * Instead of manually creating page objects in every test:
 *
 *   test('example', async ({ page }) => {
 *     const loginPage = new LoginPage(page);  // repetitive boilerplate
 *   });
 *
 * We extend `test` so page objects are available as fixture parameters:
 *
 *   test('example', async ({ loginPage }) => {
 *     await loginPage.login(user, pass);  // injected automatically
 *   });
 *
 * WHAT IS A FIXTURE?
 * A fixture is a piece of setup/teardown logic that Playwright manages for you.
 * Built-in fixtures include `page`, `browser`, `context`, and `request`.
 * Custom fixtures let you add your own (page objects, API clients, test data).
 *
 * TEST-SCOPED vs WORKER-SCOPED:
 * - Test-scoped (default): created fresh for EACH test. Use for page objects
 *   since each test gets its own isolated BrowserContext.
 * - Worker-scoped: shared across all tests in a worker process. Use for
 *   expensive resources like database connections or server instances.
 *
 * WHY USE FIXTURES OVER beforeEach?
 * 1. Lazy initialization: fixtures are only created if the test actually uses them
 * 2. Composability: fixtures can depend on other fixtures
 * 3. Type safety: TypeScript enforces the fixture API
 * 4. Parallelism: each worker gets its own isolated fixture instances
 *
 * DOCS:
 * - Fixtures overview:  https://playwright.dev/docs/test-fixtures
 * - Custom fixtures:    https://playwright.dev/docs/test-fixtures#creating-a-fixture
 * - Worker fixtures:    https://playwright.dev/docs/test-fixtures#worker-scoped-fixtures
 */

import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { CheckboxesPage } from '../pages/checkboxes.page.js';
import { DropdownPage } from '../pages/dropdown.page.js';
import { DynamicControlsPage } from '../pages/dynamic-controls.page.js';
import { DynamicLoadingPage } from '../pages/dynamic-loading.page.js';
import { DragAndDropPage } from '../pages/drag-and-drop.page.js';
import { FileUploadPage } from '../pages/file-upload.page.js';
import { HoversPage } from '../pages/hovers.page.js';
import { TablesPage } from '../pages/tables.page.js';
import { JavaScriptAlertsPage } from '../pages/javascript-alerts.page.js';
import { InfiniteScrollPage } from '../pages/infinite-scroll.page.js';

type PageFixtures = {
  loginPage: LoginPage;
  checkboxesPage: CheckboxesPage;
  dropdownPage: DropdownPage;
  dynamicControlsPage: DynamicControlsPage;
  dynamicLoadingPage: DynamicLoadingPage;
  dragAndDropPage: DragAndDropPage;
  fileUploadPage: FileUploadPage;
  hoversPage: HoversPage;
  tablesPage: TablesPage;
  javaScriptAlertsPage: JavaScriptAlertsPage;
  infiniteScrollPage: InfiniteScrollPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  checkboxesPage: async ({ page }, use) => {
    await use(new CheckboxesPage(page));
  },

  dropdownPage: async ({ page }, use) => {
    await use(new DropdownPage(page));
  },

  dynamicControlsPage: async ({ page }, use) => {
    await use(new DynamicControlsPage(page));
  },

  dynamicLoadingPage: async ({ page }, use) => {
    await use(new DynamicLoadingPage(page));
  },

  dragAndDropPage: async ({ page }, use) => {
    await use(new DragAndDropPage(page));
  },

  fileUploadPage: async ({ page }, use) => {
    await use(new FileUploadPage(page));
  },

  hoversPage: async ({ page }, use) => {
    await use(new HoversPage(page));
  },

  tablesPage: async ({ page }, use) => {
    await use(new TablesPage(page));
  },

  javaScriptAlertsPage: async ({ page }, use) => {
    await use(new JavaScriptAlertsPage(page));
  },

  infiniteScrollPage: async ({ page }, use) => {
    await use(new InfiniteScrollPage(page));
  },
});

export { expect } from '@playwright/test';
