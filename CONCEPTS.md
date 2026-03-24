# Playwright E2E Testing Concepts

A deep dive into every Playwright concept demonstrated in this project. Each section includes an explanation, code examples, links to official docs, and common pitfalls to avoid.

---

## Table of Contents

1. [Project Configuration](#1-project-configuration)
2. [Page Object Model](#2-page-object-model)
3. [Resilient Selectors](#3-resilient-selectors)
4. [Auto-Waiting](#4-auto-waiting)
5. [Web-First Assertions](#5-web-first-assertions)
6. [Custom Fixtures](#6-custom-fixtures)
7. [Authentication](#7-authentication)
8. [File Handling](#8-file-handling)
9. [Frames and iFrames](#9-frames-and-iframes)
10. [JavaScript Dialogs](#10-javascript-dialogs)
11. [Shadow DOM](#11-shadow-dom)
12. [Network Interception](#12-network-interception)
13. [Multiple Windows and Tabs](#13-multiple-windows-and-tabs)
14. [Visual Regression Testing](#14-visual-regression-testing)
15. [Scroll and Lazy Loading](#15-scroll-and-lazy-loading)
16. [Keyboard and Mouse Events](#16-keyboard-and-mouse-events)
17. [Geolocation and Permissions](#17-geolocation-and-permissions)
18. [Test Tagging and Filtering](#18-test-tagging-and-filtering)
19. [Parallelism and Test Isolation](#19-parallelism-and-test-isolation)
20. [CI/CD Pipeline for E2E](#20-cicd-pipeline-for-e2e)
21. [Debugging](#21-debugging)

---

## 1. Project Configuration

**File:** `playwright.config.ts`

The configuration file controls how Playwright discovers tests, which browsers to run, timeouts, reporters, and more.

**Key settings for E2E testing:**

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'https://the-internet.herokuapp.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

**Why it matters:** E2E config differs from API config — you need browser projects, artifact collection (traces, screenshots, videos), and navigation timeouts.

**Anti-patterns:**
- Don't hardcode absolute URLs in tests — always use `baseURL`
- Don't set `retries: 5` everywhere — fix flaky tests instead of masking them
- Don't skip `trace` — traces are your best debugging tool in CI

**Docs:** https://playwright.dev/docs/test-configuration

---

## 2. Page Object Model

**Files:** `pages/base.page.ts`, `pages/login.page.ts`, etc.

POM encapsulates page-specific selectors and actions in classes. Tests interact with page objects instead of raw selectors.

```typescript
// page object
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly submitButton: Locator;

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.submitButton.click();
  }
}

// test
test('should login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user', 'pass');
});
```

**Why it matters:**
- **Maintainability**: when a selector changes, update ONE file (the page object), not 20 test files
- **Readability**: `loginPage.login(user, pass)` is clearer than three raw locator calls
- **Reusability**: multiple tests share the same page object methods

**Anti-patterns:**
- Don't put assertions in page objects (debatable — some teams do, but keep it minimal)
- Don't create a single "GodPage" object — one class per page/component
- Don't expose raw locators when a method is more descriptive

**Docs:** https://playwright.dev/docs/pom

---

## 3. Resilient Selectors

**Files:** All page objects

Always choose selectors in this priority order:

| Priority | Method            | Rationale                                |
| -------- | ----------------- | ---------------------------------------- |
| 1        | `getByRole`       | Matches accessibility tree, most stable  |
| 2        | `getByLabel`      | Label associations rarely change         |
| 3        | `getByPlaceholder`| Fallback when no label exists            |
| 4        | `getByText`       | Visible text is user-facing and stable   |
| 5        | `getByTestId`     | Explicit test hooks, never shown to users|
| 6        | CSS/XPath         | Last resort, brittle, breaks on refactors|

```typescript
// GOOD: semantic, resilient
page.getByRole('button', { name: 'Submit' });
page.getByLabel('Email');

// BAD: fragile, breaks on any DOM change
page.locator('div.container > form > button:nth-child(3)');
```

**Why it matters:** Brittle selectors are the #1 cause of flaky tests. Semantic selectors survive CSS refactors, component library upgrades, and DOM restructuring.

**Anti-patterns:**
- Auto-generated selectors like `#radix-12 > div:nth-child(2)` — meaningless and fragile
- XPath with absolute paths — breaks on any DOM change
- Class-based selectors for styled components — class names change with CSS-in-JS builds

**Docs:** https://playwright.dev/docs/locators

---

## 4. Auto-Waiting

**Files:** `dynamic-controls.spec.ts`, `dynamic-loading.spec.ts`

Playwright automatically waits for elements to be actionable before performing operations. When you call `locator.click()`, Playwright waits for the element to be visible, enabled, stable, and receiving events.

```typescript
// Playwright auto-waits for the button to appear, become enabled, and be clickable
await page.getByRole('button', { name: 'Submit' }).click();

// Web-first assertions auto-retry until they pass or timeout
await expect(element).toBeVisible();   // retries until visible
await expect(element).toHaveText('OK'); // retries until text matches
```

**Why it matters:** Auto-waiting eliminates the need for explicit waits, making tests both faster (no unnecessary delays) and more reliable (no timing-dependent failures).

**Anti-patterns:**
```typescript
// NEVER DO THIS — arbitrary delay, slow and flaky
await page.waitForTimeout(3000);

// NEVER DO THIS — manual polling
while (!(await element.isVisible())) { /* ... */ }

// DO THIS — let Playwright handle timing
await expect(element).toBeVisible();
```

**Docs:** https://playwright.dev/docs/actionability

---

## 5. Web-First Assertions

**Files:** All spec files

Web-first assertions retry until the condition is met (or timeout expires). They're designed for the async nature of web UIs.

```typescript
// Visibility
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();

// Text
await expect(locator).toHaveText('Expected text');
await expect(locator).toContainText('partial');

// Input state
await expect(locator).toHaveValue('value');
await expect(locator).toBeChecked();
await expect(locator).toBeDisabled();

// Page-level
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveTitle('Page Title');

// Count
await expect(locator).toHaveCount(5);

// Screenshot
await expect(page).toHaveScreenshot('baseline.png');
```

**Why it matters:** Non-retrying assertions (`expect(await locator.textContent()).toBe('X')`) are race-condition-prone. Web-first assertions handle timing automatically.

**Docs:** https://playwright.dev/docs/test-assertions

---

## 6. Custom Fixtures

**Files:** `fixtures/base.fixture.ts`, `fixtures/auth.fixture.ts`

Fixtures provide setup/teardown logic that Playwright manages automatically. They're created on demand (lazy) and cleaned up when done.

```typescript
export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);    // test runs here
    // teardown happens after use() returns
  },
});
```

**Why it matters:**
- Lazy: created only when a test actually needs them
- Composable: fixtures can depend on other fixtures
- Isolated: each test gets its own instance (test-scoped) or shares (worker-scoped)

**Docs:** https://playwright.dev/docs/test-fixtures

---

## 7. Authentication

**Files:** `auth.setup.ts`, `form-auth.spec.ts`, `basic-auth.spec.ts`

**Form Auth with storageState reuse:**
```typescript
// auth.setup.ts — runs once, saves session
setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#username').fill('tomsmith');
  await page.locator('#password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: /login/i }).click();
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```

**HTTP Basic Auth:**
```typescript
const context = await browser.newContext({
  httpCredentials: { username: 'admin', password: 'admin' },
});
```

**Why it matters:** Logging in via UI for every test is slow and fragile. StorageState reuse makes the suite ~10x faster.

**Docs:** https://playwright.dev/docs/auth

---

## 8. File Handling

**Files:** `file-upload.spec.ts`, `file-download.spec.ts`

**Upload:**
```typescript
await page.locator('#file-upload').setInputFiles('test-data/sample.txt');
```

**Download:**
```typescript
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('a.download-link'),
]);
const filename = download.suggestedFilename();
await download.saveAs(`downloads/${filename}`);
```

**Docs:** https://playwright.dev/docs/input#upload-files

---

## 9. Frames and iFrames

**Files:** `iframe.spec.ts`, `nested-frames.spec.ts`

```typescript
// iFrame with frameLocator (recommended)
const frame = page.frameLocator('#editor-iframe');
await frame.locator('#content').fill('Hello');

// Legacy frameset with frame()
const topFrame = page.frame({ name: 'frame-top' });
const middleFrame = topFrame.childFrames().find(f => f.name() === 'frame-middle');
```

**frameLocator vs frame():**
- `frameLocator()`: returns FrameLocator with full locator API + auto-waiting. Use for `<iframe>`.
- `frame()`: returns Frame object with evaluate/goto. Use for `<frameset>` or when you need Frame methods.

**Docs:** https://playwright.dev/docs/frames

---

## 10. JavaScript Dialogs

**Files:** `javascript-alerts.spec.ts`

```typescript
// Register handler BEFORE triggering the dialog
page.on('dialog', async (dialog) => {
  expect(dialog.type()).toBe('confirm');
  await dialog.accept();      // or dialog.dismiss()
});
await page.click('#trigger-button');
```

**Important:** Register `page.on('dialog')` BEFORE the action that triggers the dialog. Unhandled dialogs are auto-dismissed.

**Docs:** https://playwright.dev/docs/dialogs

---

## 11. Shadow DOM

**Files:** `shadow-dom.spec.ts`

Playwright's `locator()` pierces through shadow DOM boundaries automatically. No special configuration needed.

```typescript
// This works even if the element is inside a shadow root
const text = page.locator('span.shadow-content');
await expect(text).toBeVisible();
```

**Why it matters:** Other tools (Selenium) require explicit shadow root traversal. Playwright handles it transparently.

**Docs:** https://playwright.dev/docs/locators#locate-in-shadow-dom

---

## 12. Network Interception

**Files:** `status-codes.spec.ts`

```typescript
// Mock a response
await page.route('**/api/data', async (route) => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({ mocked: true }),
  });
});

// Block a request
await page.route('**/analytics/**', route => route.abort());

// Wait for a specific response
const response = await page.waitForResponse('**/api/submit');
expect(response.status()).toBe(200);
```

**Why it matters:** Mock slow/flaky third-party APIs. Test error handling by simulating 500 responses. Block analytics to speed up tests.

**Docs:** https://playwright.dev/docs/network

---

## 13. Multiple Windows and Tabs

**Files:** `multiple-windows.spec.ts`

```typescript
const [newPage] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('a[target="_blank"]'),
]);
await expect(newPage).toHaveURL('/new-window');
```

**Pattern:** Always set up `waitForEvent('popup')` BEFORE the click that opens the new window.

**Docs:** https://playwright.dev/docs/pages

---

## 14. Visual Regression Testing

**Files:** `visual-regression.spec.ts`

```typescript
// Full page screenshot comparison
await expect(page).toHaveScreenshot('homepage.png', {
  fullPage: true,
  maxDiffPixelRatio: 0.01,
});

// Element-level comparison with masking
await expect(locator).toHaveScreenshot('card.png', {
  mask: [page.locator('.dynamic-timestamp')],
});
```

**Workflow:**
1. First run: creates baseline screenshots in `__snapshots__/`
2. Subsequent runs: compares against baselines
3. Update baselines: `npx playwright test --update-snapshots`

**Docs:** https://playwright.dev/docs/test-snapshots

---

## 15. Scroll and Lazy Loading

**Files:** `infinite-scroll.spec.ts`, `floating-menu.spec.ts`

```typescript
// Programmatic scroll
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

// Mouse wheel
await page.mouse.wheel(0, 2000);

// Wait for lazy-loaded content (NOT waitForTimeout!)
await expect(page.locator('.new-content')).toBeVisible();
```

**Anti-pattern:** `await page.waitForTimeout(3000)` after scroll. Always wait for the content you expect instead.

**Docs:** https://playwright.dev/docs/input#scrolling

---

## 16. Keyboard and Mouse Events

**Files:** `key-presses.spec.ts`, `horizontal-slider.spec.ts`, `context-menu.spec.ts`

```typescript
// Key press on element
await locator.press('Enter');
await locator.press('ArrowRight');

// Global keyboard
await page.keyboard.press('Control+a');

// Right-click
await locator.click({ button: 'right' });

// Hover
await locator.hover();
```

**Docs:** https://playwright.dev/docs/input

---

## 17. Geolocation and Permissions

**Files:** `geolocation.spec.ts`

```typescript
const context = await browser.newContext({
  geolocation: { latitude: 40.7128, longitude: -74.0060 },
  permissions: ['geolocation'],
});
```

**Why it matters:** Test location-dependent features without physically moving. Override coordinates per-test or per-context.

**Docs:** https://playwright.dev/docs/emulation#geolocation

---

## 18. Test Tagging and Filtering

**Files:** All spec files

Add tags inline in test titles:

```typescript
test('should login @smoke @auth', async ({ page }) => { ... });
test('should sort table @regression @interactions', async ({ page }) => { ... });
```

Run filtered:
```bash
npx playwright test --grep @smoke        # only smoke tests
npx playwright test --grep-invert @visual # skip visual tests
```

**Why it matters:** Run only critical tests on every commit (@smoke), full suite nightly (@regression).

**Docs:** https://playwright.dev/docs/test-annotations#tag-tests

---

## 19. Parallelism and Test Isolation

**Files:** `playwright.config.ts`

```typescript
fullyParallel: true,  // every test file runs in parallel
workers: undefined,   // auto-detect CPU count
```

**Isolation guarantees:**
- Each test gets its own BrowserContext (separate cookies, storage, cache)
- Tests cannot share state — they run in complete isolation
- No test ordering dependencies (tests can run in any order)

**Anti-patterns:**
- Shared mutable state (global variables modified by tests)
- Tests that depend on execution order
- Tests that modify server-side state without cleanup

**Docs:** https://playwright.dev/docs/test-parallel

---

## 20. CI/CD Pipeline for E2E

**File:** `.github/workflows/e2e-tests.yml`

Key CI considerations for E2E tests (vs API tests):
- **Browser installation**: `npx playwright install --with-deps` installs browsers AND OS dependencies
- **Browser matrix**: run across chromium, firefox, webkit in parallel jobs
- **Artifacts**: upload traces, screenshots, and videos for failure debugging
- **Timeouts**: E2E tests are slower; set generous job timeouts
- **Sharding**: split tests across workers for faster CI runs

**Docs:** https://playwright.dev/docs/ci-intro

---

## 21. Debugging

**Tools available:**

| Tool            | Command                                    | Use case                              |
| --------------- | ------------------------------------------ | ------------------------------------- |
| Headed mode     | `npx playwright test --headed`             | Watch the browser during test runs    |
| UI mode         | `npx playwright test --ui`                 | Interactive runner with time travel   |
| Debug mode      | `npx playwright test --debug`              | Step through with Playwright Inspector|
| Code generation | `npx playwright codegen https://example.com` | Record actions, generate test code |
| Trace viewer    | `npx playwright show-trace trace.zip`      | Full replay of a test run             |
| Page pause      | `await page.pause()`                       | Pause execution, open inspector       |
| Single test     | `test.only('...')`                         | Isolate one test during development   |

**Trace viewer** is the most powerful debugging tool. It records:
- DOM snapshots at every step
- Network requests and responses
- Console output
- Action timeline with screenshots

**Docs:** https://playwright.dev/docs/debug
