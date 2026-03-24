/**
 * Disappearing Elements Tests
 * =============================
 *
 * CONCEPT: Non-deterministic UI — elements that may or may not be present.
 *
 * The Internet's Disappearing Elements page randomly shows 5 or 6 navigation
 * links on each page load. This is intentionally non-deterministic, which makes
 * it a perfect exercise for:
 * - Soft assertions: continue test execution even if an assertion fails
 * - Counting elements without assuming a fixed number
 * - Writing tests that are resilient to UI variations
 *
 * SOFT ASSERTIONS:
 * Normal assertions (`expect`) stop the test on failure. Soft assertions
 * (`expect.soft`) record the failure but let the test continue, allowing
 * you to collect multiple failures in a single run.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - expect.soft() — non-blocking assertions
 * - locator.count() — count matching elements
 * - toHaveCount() — assert element count with auto-retry
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/disappearing_elements
 * DOCS: https://playwright.dev/docs/test-assertions#soft-assertions
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Disappearing Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.disappearingElements);
  });

  test('should always have at least 5 navigation links @dynamic', async ({ page }) => {
    const links = page.locator('ul li');
    const count = await links.count();

    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('should display standard navigation items @dynamic', async ({ page }) => {
    const expectedItems = ['Home', 'About', 'Contact Us', 'Portfolio'];

    for (const item of expectedItems) {
      await expect.soft(page.getByRole('link', { name: item })).toBeVisible();
    }
  });

  test('Gallery link may or may not be present (non-deterministic) @dynamic', async ({ page }) => {
    const galleryLink = page.getByRole('link', { name: 'Gallery' });
    const isVisible = await galleryLink.isVisible();

    if (isVisible) {
      await expect(page.locator('ul li')).toHaveCount(6);
    } else {
      await expect(page.locator('ul li')).toHaveCount(5);
    }
  });
});
