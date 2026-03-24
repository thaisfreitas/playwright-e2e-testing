/**
 * Authentication Fixture
 * =======================
 *
 * Provides an `authenticatedPage` fixture — a Page instance that is already
 * logged in via saved storageState. Tests that need authenticated access use
 * this instead of logging in through the UI every time.
 *
 * HOW IT WORKS:
 * 1. The `auth.setup.ts` file runs ONCE before all tests (via the "setup" project
 *    in playwright.config.ts). It logs in through the UI and saves cookies/storage
 *    to `playwright/.auth/user.json`.
 * 2. This fixture creates a new BrowserContext preloaded with that saved state,
 *    so the browser is already authenticated when the test starts.
 * 3. The context (and its page) are disposed after each test automatically.
 *
 * WHY REUSE AUTH STATE?
 * - Performance: login through UI takes ~2-5 seconds. With 50+ tests, that's
 *   minutes of wasted time. Reusing saved state is near-instant.
 * - Reliability: fewer network requests = fewer chances for flaky failures.
 * - Isolation: each test still gets its own BrowserContext with a fresh page,
 *   so tests can't interfere with each other.
 *
 * DOCS:
 * - Authentication: https://playwright.dev/docs/auth
 * - Storage state:  https://playwright.dev/docs/api/class-browsercontext#browser-context-storage-state
 */

import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
