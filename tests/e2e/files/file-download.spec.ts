/**
 * File Download Tests
 * =====================
 *
 * CONCEPT: Capturing and validating file downloads with Playwright.
 *
 * Playwright intercepts downloads automatically — the browser never shows
 * a "Save As" dialog. Instead, downloads are captured as Download objects
 * with methods to inspect the filename, save to disk, or read contents.
 *
 * PATTERN: Always set up the download Promise BEFORE triggering the action:
 *   const [download] = await Promise.all([
 *     page.waitForEvent('download'),
 *     page.click('a.download-link'),
 *   ]);
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - page.waitForEvent('download') — capture download event
 * - download.suggestedFilename() — get the server-suggested filename
 * - download.saveAs(path) — save downloaded file to disk
 * - download.path() — temporary path where file is stored
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/download
 * DOCS: https://playwright.dev/docs/downloads
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('File Download', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.fileDownload);
  });

  test('should download a file and verify its name @files', async ({ page }) => {
    const downloadLink = page.locator('.example a').first();
    const expectedFilename = await downloadLink.textContent();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadLink.click(),
    ]);

    expect(download.suggestedFilename()).toBe(expectedFilename?.trim());
  });

  test('should save downloaded file to disk @files', async ({ page }) => {
    const downloadLink = page.locator('.example a').first();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadLink.click(),
    ]);

    const filePath = `test-results/downloads/${download.suggestedFilename()}`;
    await download.saveAs(filePath);

    const path = await download.path();
    expect(path).toBeTruthy();
  });
});
