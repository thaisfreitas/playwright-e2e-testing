/**
 * Broken Images Tests
 * =====================
 *
 * CONCEPT: Validating that images and resources loaded correctly.
 *
 * Broken images are a common UI defect that functional tests often miss.
 * You can detect them by checking the image's naturalWidth/naturalHeight
 * properties (0 means the image failed to load) or by monitoring network
 * responses for failed requests.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - page.evaluate() — run JavaScript in the browser to inspect DOM properties
 * - page.$$eval() — evaluate on all matching elements
 * - Network response monitoring for broken resources
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/broken_images
 * DOCS: https://playwright.dev/docs/evaluating
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Broken Images', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.brokenImages);
  });

  test('should detect broken images via naturalWidth @advanced', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    const brokenImages: string[] = [];

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate(
        (el) => (el as HTMLImageElement).naturalWidth,
      );
      if (naturalWidth === 0) {
        const src = await img.getAttribute('src');
        brokenImages.push(src || 'unknown');
      }
    }

    expect(brokenImages.length).toBeGreaterThan(0);
  });

  test('should identify which images are broken @advanced', async ({ page }) => {
    const imageResults = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map((img) => ({
        src: img.getAttribute('src') || '',
        loaded: img.naturalWidth > 0,
      }));
    });

    const broken = imageResults.filter((img) => !img.loaded);
    const loaded = imageResults.filter((img) => img.loaded);

    expect(broken.length).toBeGreaterThan(0);
    expect(loaded.length).toBeGreaterThan(0);
  });
});
