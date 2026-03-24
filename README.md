# Playwright E2E Testing Template

A comprehensive, learning-oriented project that demonstrates **all core concepts** of end-to-end browser testing with [Playwright](https://playwright.dev/) and TypeScript — using the free [The Internet](https://the-internet.herokuapp.com/) practice site.

## Why this project?

This template exists so you can **learn by reading and running real tests**. Every file is heavily documented with:

- **What** the code does
- **Why** the pattern is used
- **When** to use each approach
- Links to official Playwright docs

## Target Site: The Internet

[The Internet](https://the-internet.herokuapp.com/) is a free, purpose-built site with 44+ pages designed for practicing UI test automation.

| Feature              | Page Path               | What it covers                         |
| -------------------- | ----------------------- | -------------------------------------- |
| Form Authentication  | `/login`                | Login, logout, session management      |
| HTTP Basic Auth      | `/basic_auth`           | Protocol-level auth (httpCredentials)   |
| Checkboxes           | `/checkboxes`           | check(), uncheck(), toBeChecked()      |
| Dropdown             | `/dropdown`             | selectOption(), toHaveValue()          |
| Inputs               | `/inputs`               | fill(), type(), keyboard navigation    |
| Key Presses          | `/key_presses`          | Keyboard events, special keys          |
| Dynamic Controls     | `/dynamic_controls`     | Auto-waiting, toBeEnabled/Disabled     |
| Dynamic Loading      | `/dynamic_loading/1`    | Loading states, hidden vs rendered     |
| Disappearing Elements| `/disappearing_elements`| Soft assertions, non-deterministic UI  |
| Notification Messages| `/notification_message` | Flash messages, regex assertions       |
| Drag and Drop        | `/drag_and_drop`        | HTML5 DnD, DataTransfer events         |
| Hovers               | `/hovers`               | hover(), revealing hidden content      |
| Context Menu         | `/context_menu`         | Right-click, dialog handling           |
| Horizontal Slider    | `/horizontal_slider`    | Range input, keyboard arrows           |
| Sortable Tables      | `/tables`               | Table data extraction, sort validation |
| File Upload          | `/upload`               | setInputFiles(), FileChooser event     |
| File Download        | `/download`             | Download event, suggestedFilename()    |
| iFrame (TinyMCE)     | `/iframe`               | frameLocator(), rich text editors      |
| Nested Frames        | `/nested_frames`        | Nested frame(), child frame access     |
| Shadow DOM           | `/shadowdom`            | Automatic shadow DOM piercing          |
| Infinite Scroll      | `/infinite_scroll`      | Programmatic scroll, lazy loading      |
| Multiple Windows     | `/windows`              | waitForEvent('popup'), multi-tab       |
| JavaScript Alerts    | `/javascript_alerts`    | alert, confirm, prompt dialogs         |
| Geolocation          | `/geolocation`          | Permission mocking, coordinate override|
| Broken Images        | `/broken_images`        | naturalWidth check, evaluate()         |
| Redirects            | `/redirector`           | Redirect chains, waitForURL()          |
| Status Codes         | `/status_codes`         | Network interception, route/fulfill    |
| Floating Menu        | `/floating_menu`        | Sticky elements, scroll + visibility   |
| Add/Remove Elements  | `/add_remove_elements/` | toHaveCount(), dynamic DOM changes     |

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm (comes with Node.js)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Run all tests (chromium only for speed)
npx playwright test --project=chromium

# 4. View the HTML report
npm run report
```

## Available Scripts

| Script                    | Command                                              | Description                  |
| ------------------------- | ---------------------------------------------------- | ---------------------------- |
| `npm test`                | `npx playwright test`                                | Run all tests (all browsers) |
| `npm run test:auth`       | `npx playwright test tests/e2e/auth/`                | Run auth tests only          |
| `npm run test:forms`      | `npx playwright test tests/e2e/forms-inputs/`        | Run form/input tests only    |
| `npm run test:dynamic`    | `npx playwright test tests/e2e/dynamic-content/`     | Run dynamic content tests    |
| `npm run test:interactions`| `npx playwright test tests/e2e/interactions/`       | Run interaction tests        |
| `npm run test:files`      | `npx playwright test tests/e2e/files/`               | Run file upload/download     |
| `npm run test:frames`     | `npx playwright test tests/e2e/frames/`              | Run frame/iframe tests       |
| `npm run test:advanced`   | `npx playwright test tests/e2e/advanced/`            | Run advanced scenario tests  |
| `npm run test:navigation` | `npx playwright test tests/e2e/navigation/`          | Run navigation/network tests |
| `npm run test:visual`     | `npx playwright test tests/e2e/visual/`              | Run visual regression tests  |
| `npm run report`          | `npx playwright show-report`                         | Open the HTML report         |

### Useful Playwright CLI Options

```bash
# Run a specific test file
npx playwright test tests/e2e/auth/form-auth.spec.ts

# Run tests matching a name pattern
npx playwright test -g "should login with valid credentials"

# Run only @smoke tagged tests
npx playwright test --grep @smoke

# Run in headed mode (see the browser)
npx playwright test --headed

# Run in UI mode (interactive test runner)
npx playwright test --ui

# Debug a specific test (opens inspector)
npx playwright test --debug tests/e2e/auth/form-auth.spec.ts

# Generate test code by recording actions
npx playwright codegen https://the-internet.herokuapp.com

# View a trace file from a failed test
npx playwright show-trace test-results/trace.zip

# Update visual regression baselines
npx playwright test --update-snapshots

# Run only chromium tests
npx playwright test --project=chromium
```

## Project Structure

```
playwright-e2e-testing/
├── playwright.config.ts          # Playwright config (baseURL, browsers, reporters, timeouts)
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript config with path aliases
├── .env.example                  # Environment variables template
├── .gitignore
│
├── pages/                        # Page Object Model (POM)
│   ├── base.page.ts              # [Concept 1]  Abstract base class for all pages
│   ├── login.page.ts             # [Concept 2]  Form auth page object
│   ├── checkboxes.page.ts        # [Concept 3]  Checkbox interactions
│   ├── dropdown.page.ts          # [Concept 4]  Native dropdown select
│   ├── dynamic-controls.page.ts  # [Concept 5]  Auto-waiting, enable/disable
│   ├── dynamic-loading.page.ts   # [Concept 6]  Loading states
│   ├── drag-and-drop.page.ts     # [Concept 7]  HTML5 drag and drop
│   ├── file-upload.page.ts       # [Concept 8]  File upload
│   ├── hovers.page.ts            # [Concept 9]  Mouse hover
│   ├── tables.page.ts            # [Concept 10] Data table extraction
│   ├── javascript-alerts.page.ts # [Concept 11] JS dialog handling
│   └── infinite-scroll.page.ts   # [Concept 12] Scroll and lazy loading
│
├── fixtures/                     # Custom Playwright fixtures
│   ├── base.fixture.ts           # [Concept 13] Auto-inject page objects
│   └── auth.fixture.ts           # [Concept 14] Authenticated page fixture
│
├── utils/                        # Shared utilities
│   ├── test-data.ts              # [Concept 15] Centralized test constants
│   └── helpers.ts                # [Concept 16] Reusable helper functions
│
├── test-data/                    # Test files
│   └── sample-upload.txt         # Sample file for upload tests
│
├── tests/e2e/                    # All test specs
│   ├── auth/
│   │   ├── auth.setup.ts         # [Concept 17] One-time auth setup (storageState)
│   │   ├── form-auth.spec.ts     # [Concept 18] Form login/logout tests
│   │   └── basic-auth.spec.ts    # [Concept 19] HTTP Basic Auth tests
│   ├── forms-inputs/
│   │   ├── checkboxes.spec.ts    # [Concept 20] check/uncheck, toBeChecked
│   │   ├── dropdown.spec.ts      # [Concept 21] selectOption, toHaveValue
│   │   ├── inputs.spec.ts        # [Concept 22] fill/type, numeric inputs
│   │   └── key-presses.spec.ts   # [Concept 23] Keyboard events, parameterized tests
│   ├── dynamic-content/
│   │   ├── dynamic-controls.spec.ts    # [Concept 24] Auto-waiting, visibility
│   │   ├── dynamic-loading.spec.ts     # [Concept 25] Loading states
│   │   ├── disappearing-elements.spec.ts # [Concept 26] Soft assertions
│   │   └── notification-messages.spec.ts # [Concept 27] Flash messages, regex
│   ├── interactions/
│   │   ├── drag-and-drop.spec.ts       # [Concept 28] HTML5 DnD with evaluate
│   │   ├── hovers.spec.ts             # [Concept 29] Hover, parameterized tests
│   │   ├── context-menu.spec.ts       # [Concept 30] Right-click, dialogs
│   │   ├── horizontal-slider.spec.ts  # [Concept 31] Range input, keyboard
│   │   └── sortable-tables.spec.ts    # [Concept 32] Table sort, parameterized
│   ├── files/
│   │   ├── file-upload.spec.ts        # [Concept 33] setInputFiles, FileChooser
│   │   └── file-download.spec.ts      # [Concept 34] Download event, saveAs
│   ├── frames/
│   │   ├── iframe.spec.ts             # [Concept 35] frameLocator, TinyMCE
│   │   └── nested-frames.spec.ts      # [Concept 36] Nested frame access
│   ├── advanced/
│   │   ├── shadow-dom.spec.ts         # [Concept 37] Shadow DOM piercing
│   │   ├── infinite-scroll.spec.ts    # [Concept 38] Scroll, lazy loading
│   │   ├── multiple-windows.spec.ts   # [Concept 39] Popups, multi-tab
│   │   ├── javascript-alerts.spec.ts  # [Concept 40] alert/confirm/prompt
│   │   ├── geolocation.spec.ts        # [Concept 41] Permission mocking
│   │   └── broken-images.spec.ts      # [Concept 42] evaluate(), naturalWidth
│   ├── navigation/
│   │   ├── redirect.spec.ts           # [Concept 43] Redirect chains
│   │   ├── status-codes.spec.ts       # [Concept 44] Network interception
│   │   ├── floating-menu.spec.ts      # [Concept 45] Sticky elements, scroll
│   │   └── add-remove-elements.spec.ts # [Concept 46] toHaveCount, DOM changes
│   └── visual/
│       └── visual-regression.spec.ts  # [Concept 47] Screenshot comparison
│
├── .github/workflows/
│   └── e2e-tests.yml             # [Concept 48] CI pipeline with GitHub Actions
│
└── CONCEPTS.md                   # Deep dive into each Playwright concept
```

## Concepts Covered

This project covers the following Playwright E2E testing concepts:

1. **Page Object Model** — `pages/base.page.ts` + all page objects
2. **Resilient Selectors** — getByRole > getByLabel > getByText > CSS
3. **Auto-Waiting** — `dynamic-controls.spec.ts`, `dynamic-loading.spec.ts`
4. **Web-First Assertions** — toBeVisible, toHaveText, toHaveURL, toBeChecked
5. **Custom Fixtures** — `fixtures/base.fixture.ts`, `auth.fixture.ts`
6. **Authentication** — Form auth, Basic Auth, storageState reuse
7. **Checkboxes** — check(), uncheck(), toBeChecked()
8. **Dropdowns** — selectOption() by value and label
9. **Keyboard Events** — press(), keyboard shortcuts, key detection
10. **Dynamic Content** — Auto-waiting, toBeEnabled/Disabled/Visible/Hidden
11. **Loading States** — Hidden vs rendered elements after async operations
12. **Soft Assertions** — expect.soft() for non-blocking checks
13. **Drag and Drop** — HTML5 DnD with evaluate(), DataTransfer events
14. **Hover Actions** — hover() to reveal hidden content
15. **Context Menu** — Right-click with button: 'right'
16. **Range Inputs** — Slider manipulation with keyboard arrows
17. **Data Tables** — Extract data, validate sorting, allTextContents()
18. **Test Parameterization** — for...of loops for data-driven tests
19. **File Upload** — setInputFiles() and FileChooser event
20. **File Download** — Download event, suggestedFilename(), saveAs()
21. **iFrames** — frameLocator() for isolated document interaction
22. **Nested Frames** — frame() and childFrames() for legacy framesets
23. **Shadow DOM** — Automatic piercing with locator()
24. **Infinite Scroll** — Programmatic scroll, waitFor new elements
25. **Multiple Windows** — waitForEvent('popup'), context.pages()
26. **JavaScript Dialogs** — page.on('dialog'), accept/dismiss/prompt
27. **Geolocation** — Permission mocking, coordinate override
28. **Broken Resources** — page.evaluate() for DOM property inspection
29. **Redirects** — waitForURL(), following redirect chains
30. **Network Interception** — route(), fulfill(), abort()
31. **Sticky Elements** — Scroll + visibility assertions
32. **Element Counting** — toHaveCount(), dynamic DOM changes
33. **Visual Regression** — toHaveScreenshot(), baselines, masking
34. **CI/CD Pipeline** — GitHub Actions, browser matrix, artifacts
35. **Test Tagging** — @smoke, @auth, @forms, @dynamic for filtering

See [CONCEPTS.md](CONCEPTS.md) for a detailed explanation of each concept.

## Selector Strategy

Always choose selectors in this priority order:

| Priority | Method            | When to use                                  | Example                                         |
| -------- | ----------------- | -------------------------------------------- | ----------------------------------------------- |
| 1        | `getByRole`       | Buttons, links, headings, inputs with labels | `page.getByRole('button', { name: 'Submit' })`  |
| 2        | `getByLabel`      | Form inputs with associated `<label>`        | `page.getByLabel('Email')`                       |
| 3        | `getByPlaceholder` | Inputs with placeholder text only           | `page.getByPlaceholder('Search...')`             |
| 4        | `getByText`       | Non-interactive elements with visible text   | `page.getByText('Welcome back')`                 |
| 5        | `getByTestId`     | When semantic selectors aren't feasible      | `page.getByTestId('checkout-total')`             |
| 6        | CSS/XPath         | Last resort — document why others failed     | `page.locator('#legacy-widget')`                 |

## Adapting This Template for Your Site

1. **Change the base URL** in `playwright.config.ts` (or set `BASE_URL` env var)
2. **Update page objects** in `pages/` to match your site's selectors and structure
3. **Update test data** in `utils/test-data.ts` with your site's credentials and URLs
4. **Adjust auth setup** in `tests/e2e/auth/auth.setup.ts` for your login flow
5. **Copy test patterns** from existing specs and adapt for your pages

## Debugging Tips

- **Headed mode**: `npx playwright test --headed` — see the browser
- **UI mode**: `npx playwright test --ui` — interactive test runner with time travel
- **Debug mode**: `npx playwright test --debug` — step through with inspector
- **Code generation**: `npx playwright codegen https://example.com` — record actions
- **Trace viewer**: `npx playwright show-trace test-results/trace.zip` — full replay
- **Pause execution**: add `await page.pause()` to stop and inspect the page
- **Single test**: use `test.only(...)` to isolate one test during development

## Tech Stack

| Tool                                                  | Purpose                           |
| ----------------------------------------------------- | --------------------------------- |
| [Playwright](https://playwright.dev/)                 | Test runner + browser automation  |
| [TypeScript](https://www.typescriptlang.org/)         | Type-safe test code               |
| [dotenv](https://github.com/motdotla/dotenv)          | Environment variable management   |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline                    |
