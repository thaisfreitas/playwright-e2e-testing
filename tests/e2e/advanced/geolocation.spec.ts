/**
 * Geolocation Tests
 * ===================
 *
 * CONCEPT: Mocking geolocation and granting browser permissions.
 *
 * Playwright can override the browser's geolocation to return specific
 * coordinates, and grant permissions that would normally require user
 * interaction (like "Allow location access").
 *
 * This is essential for testing:
 * - Store locator features ("find nearby stores")
 * - Location-based personalization
 * - Geofencing logic
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - context.grantPermissions(['geolocation']) — auto-grant permission
 * - context.setGeolocation({ latitude, longitude }) — mock coordinates
 * - browser.newContext({ geolocation, permissions }) — configure at creation
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/geolocation
 * DOCS: https://playwright.dev/docs/emulation#geolocation
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Geolocation', () => {
  test('should display mocked geolocation coordinates @advanced', async ({ browser }) => {
    const context = await browser.newContext({
      geolocation: { latitude: 40.7128, longitude: -74.0060 },
      permissions: ['geolocation'],
    });
    const page = await context.newPage();

    await page.goto(URLS.geolocation);
    await page.getByRole('button', { name: /where am i/i }).click();

    await expect(page.locator('#lat-value')).toHaveText('40.7128');
    await expect(page.locator('#long-value')).toHaveText('-74.006');

    await context.close();
  });

  test('should update coordinates when geolocation changes @advanced', async ({ browser }) => {
    const context = await browser.newContext({
      geolocation: { latitude: 51.5074, longitude: -0.1278 },
      permissions: ['geolocation'],
    });
    const page = await context.newPage();

    await page.goto(URLS.geolocation);
    await page.getByRole('button', { name: /where am i/i }).click();

    await expect(page.locator('#lat-value')).toHaveText('51.5074');

    await context.setGeolocation({ latitude: 35.6762, longitude: 139.6503 });
    await page.getByRole('button', { name: /where am i/i }).click();

    await expect(page.locator('#lat-value')).toHaveText('35.6762');

    await context.close();
  });
});
