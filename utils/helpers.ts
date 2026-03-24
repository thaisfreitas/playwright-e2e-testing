/**
 * Test Helper Functions
 * ======================
 *
 * Reusable utility functions shared across test files. These encapsulate
 * common operations that aren't specific to a single page object.
 *
 * WHEN TO USE HELPERS VS PAGE OBJECTS:
 * - Page objects encapsulate interactions with a SPECIFIC page/component.
 * - Helpers are page-agnostic utilities (ID generation, download handling, etc.).
 *
 * DOCS: https://playwright.dev/docs/api/class-download
 */

import { type Page, type Download } from '@playwright/test';

/**
 * Generate a unique string ID, useful for creating distinct test data
 * that won't collide across parallel test runs.
 */
export function generateUniqueId(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Wait for a download event triggered by a click action and return the
 * Download object. Playwright intercepts downloads automatically —
 * the browser won't show a "Save As" dialog.
 *
 * USAGE:
 *   const download = await waitForDownload(page, () => page.click('a.download'));
 *   expect(download.suggestedFilename()).toBe('report.csv');
 *
 * WHY: Playwright's download API requires setting up the Promise BEFORE
 * the action that triggers the download. This helper encapsulates that
 * pattern to keep test code clean.
 *
 * DOCS: https://playwright.dev/docs/downloads
 */
export async function waitForDownload(
  page: Page,
  triggerAction: () => Promise<void>,
): Promise<Download> {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    triggerAction(),
  ]);
  return download;
}

/**
 * Validate that the current page follows The Internet's standard layout:
 * an h3 heading should be present and visible.
 *
 * WHEN TO USE: As a quick sanity check in beforeEach hooks to confirm
 * the page loaded correctly before running test assertions.
 */
export async function validatePageLayout(page: Page): Promise<boolean> {
  const heading = page.locator('h3');
  return heading.isVisible();
}
