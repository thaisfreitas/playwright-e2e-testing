/**
 * iFrame Tests
 * ==============
 *
 * CONCEPT: Interacting with content inside iframes using frameLocator().
 *
 * iFrames are embedded documents within a page. Regular locators can't reach
 * inside them — you need frameLocator() to "enter" the iframe's document.
 *
 * frameLocator() vs frame():
 * - frameLocator() (recommended): returns a FrameLocator that supports the full
 *   locator API (getByRole, getByText, etc.) with auto-waiting.
 * - frame() (legacy): returns a Frame object with older APIs. Use only when
 *   you need Frame-specific methods like frame.url() or frame.evaluate().
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - page.frameLocator() — enter an iframe by selector
 * - Chaining locators inside frames
 * - Interacting with rich text editors (TinyMCE) inside iframes
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/iframe
 * DOCS: https://playwright.dev/docs/frames
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('iFrame — TinyMCE Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.iframe);
  });

  test('should read content inside iframe @frames', async ({ page }) => {
    const editorFrame = page.frameLocator('#mce_0_ifr');
    const body = editorFrame.locator('#tinymce');

    await expect(body).toBeVisible();
    await expect(body).toHaveAttribute('aria-label', /Rich Text Area/i);
  });

  test('should clear and type in the TinyMCE editor @frames', async ({ page }) => {
    const editorFrame = page.frameLocator('#mce_0_ifr');
    const body = editorFrame.locator('#tinymce');

    const content = 'Hello from Playwright!';
    await page.evaluate((value) => {
      const win = window as Window & { tinymce?: { activeEditor?: { setContent: (v: string) => void } } };
      win.tinymce?.activeEditor?.setContent(value);
    }, content);

    await expect(body).toContainText(content);
  });
});
