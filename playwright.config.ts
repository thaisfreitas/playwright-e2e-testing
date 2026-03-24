/**
 * Playwright Configuration for E2E Testing
 * ==========================================
 *
 * This file configures how Playwright runs our end-to-end browser tests against
 * "The Internet" (https://the-internet.herokuapp.com/) — a purpose-built site
 * with 44+ pages designed for practicing UI test automation.
 *
 * Unlike the sibling `playwright-api-testing` project (which uses APIRequestContext
 * without browsers), this project launches real browsers to simulate user interactions.
 *
 * KEY CONCEPTS:
 *
 * 1. `baseURL` — All page.goto() calls use this as a prefix, so instead of writing
 *    `page.goto('https://the-internet.herokuapp.com/login')` in every test, we just
 *    write `page.goto('/login')`. This keeps tests clean and makes environment
 *    switching trivial (dev, staging, prod).
 *
 * 2. `projects` — Playwright's way of running the same tests across multiple browsers.
 *    We define chromium, firefox, and webkit projects so every test runs on all three
 *    engines. A separate "setup" project handles one-time authentication.
 *
 * 3. `use` — Shared browser settings applied to every test: screenshots on failure,
 *    video recording on failure, and trace collection on first retry. These artifacts
 *    are invaluable for debugging flaky or failing tests.
 *
 * 4. `reporter` — Controls test output. We use terminal output ('list') for local
 *    development and an HTML report for CI/detailed post-run analysis.
 *
 * DOCS: https://playwright.dev/docs/test-configuration
 */

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  /**
   * Directory where test files live. Playwright recursively finds all files
   * matching `testMatch` inside this directory.
   *
   * We scope to `tests/e2e` to keep test files separate from pages, fixtures,
   * and utilities — a clean separation of concerns.
   */
  testDir: './tests/e2e',

  /**
   * Pattern for identifying test files. The default `**\/*.spec.ts` matches our
   * naming convention: `login.spec.ts`, `checkboxes.spec.ts`, etc.
   */
  testMatch: '**/*.spec.ts',

  /**
   * Run all tests in parallel by default. Each test gets its own BrowserContext,
   * so there is no shared state between tests. This is safe because The Internet
   * is a stateless demo site (no persistent server-side sessions between tests).
   *
   * If testing against a stateful app, you may need to disable this or use
   * test isolation strategies (unique accounts, database seeding, etc.).
   */
  fullyParallel: true,

  /**
   * Fail the build on CI if test.only is left in the source code.
   * This prevents accidentally committing focused tests that skip the rest
   * of the suite.
   */
  forbidOnly: !!process.env.CI,

  /**
   * Retry failed tests. Flaky tests are the #1 pain point in E2E testing.
   * - 0 retries locally: fail fast for quick feedback during development
   * - 2 retries in CI: tolerate transient network/rendering issues
   *
   * Combined with `trace: 'on-first-retry'`, the first retry captures a full
   * trace for debugging without slowing down passing tests.
   */
  retries: process.env.CI ? 2 : 0,

  /**
   * Number of parallel worker processes. `undefined` lets Playwright auto-detect
   * based on CPU cores. In CI, we use 1 worker for deterministic, reproducible runs.
   *
   * E2E tests are heavier than API tests (browser overhead), so fewer workers
   * may be needed compared to the API testing sibling project.
   */
  workers: process.env.CI ? 1 : undefined,

  /**
   * Maximum time (ms) a single test can run. 30 seconds is generous for most
   * UI interactions. Increase for tests involving slow-loading pages or
   * complex multi-step flows.
   */
  timeout: 30_000,

  /**
   * Reporters control how test results are displayed and saved.
   * - 'list': prints each test result to the terminal (great for local dev)
   * - 'html': generates an interactive HTML report (great for CI artifacts)
   * - 'github': annotates PR checks with test failures (CI only)
   *
   * View the HTML report with: `npx playwright show-report`
   */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  /**
   * Shared settings applied to all projects. These configure every browser
   * context created during testing.
   *
   * DOCS: https://playwright.dev/docs/test-use-options
   */
  use: {
    /**
     * Base URL for all navigation. Tests use relative paths:
     *   await page.goto('/login')  // resolves to https://the-internet.herokuapp.com/login
     *
     * Override via environment variable for different environments:
     *   BASE_URL=http://localhost:3000 npx playwright test
     */
    baseURL: process.env.BASE_URL || 'https://the-internet.herokuapp.com',

    /**
     * Collect trace on first retry. Traces include screenshots, DOM snapshots,
     * network logs, and console output — everything needed to debug a failure
     * without reproducing it locally.
     *
     * View traces with: `npx playwright show-trace test-results/trace.zip`
     *
     * Options: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry'
     */
    trace: 'on-first-retry',

    /**
     * Capture a screenshot only when a test fails. Keeps test artifacts small
     * while still providing visual evidence of failures.
     *
     * Options: 'off' | 'on' | 'only-on-failure'
     */
    screenshot: 'only-on-failure',

    /**
     * Record video only for failed tests and retain them. Videos are invaluable
     * for understanding flaky tests where a screenshot alone isn't enough.
     *
     * Options: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry'
     */
    video: 'retain-on-failure',

    /**
     * Maximum time (ms) for each user action (click, fill, etc.) to complete.
     * Playwright auto-waits for elements to be actionable before performing
     * actions, so this timeout covers the waiting + action combined.
     *
     * 10 seconds handles most cases; increase for slow-loading elements.
     */
    actionTimeout: 10_000,

    /**
     * Maximum time (ms) for page.goto() and similar navigation actions.
     * The Internet's Heroku hosting can be slow on cold starts, so 30 seconds
     * provides a comfortable buffer.
     */
    navigationTimeout: 30_000,
  },

  /**
   * Projects define named test configurations. Each project runs the full test
   * suite with a different browser engine.
   *
   * The "setup" project runs first (auth.setup.ts) to authenticate once and
   * save the session. All browser projects depend on it so they reuse the
   * saved auth state instead of logging in before every test.
   *
   * Run a specific project: `npx playwright test --project=chromium`
   *
   * DOCS: https://playwright.dev/docs/test-projects
   */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
  ],
});
