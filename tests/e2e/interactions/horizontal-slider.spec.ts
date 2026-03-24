/**
 * Horizontal Slider Tests
 * ========================
 *
 * CONCEPT: Slider (range input) interaction with keyboard and mouse.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - locator.fill() does NOT work on range inputs — use keyboard instead
 * - locator.press('ArrowRight') — increment slider value
 * - page.mouse — low-level mouse control for precise positioning
 * - toHaveValue() — assert input value (works on range inputs too)
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/horizontal_slider
 * DOCS: https://playwright.dev/docs/input#keys-and-shortcuts
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Horizontal Slider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.horizontalSlider);
  });

  test('should move slider with keyboard arrows @interactions', async ({ page }) => {
    const slider = page.locator('input[type="range"]');
    const display = page.locator('#range');

    await slider.focus();
    await slider.press('ArrowRight');
    await slider.press('ArrowRight');
    await slider.press('ArrowRight');

    const value = await display.textContent();
    expect(Number(value)).toBeGreaterThan(0);
  });

  test('should set slider to maximum @interactions', async ({ page }) => {
    const slider = page.locator('input[type="range"]');

    await slider.focus();
    for (let i = 0; i < 20; i++) {
      await slider.press('ArrowRight');
    }

    await expect(slider).toHaveValue('5');
  });

  test('should set slider to minimum @interactions', async ({ page }) => {
    const slider = page.locator('input[type="range"]');

    await slider.focus();
    for (let i = 0; i < 20; i++) {
      await slider.press('ArrowLeft');
    }

    await expect(slider).toHaveValue('0');
  });
});
