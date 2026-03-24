/**
 * Hovers Tests
 * ==============
 *
 * CONCEPT: Mouse hover to reveal hidden content.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - locator.hover() — trigger CSS :hover and JS mouseover
 * - Asserting on elements that only appear during hover
 * - Iterating over multiple similar elements with nth()
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/hovers
 * DOCS: https://playwright.dev/docs/input#mouse-click
 */

import { test, expect } from '@playwright/test';
import { HoversPage } from '../../../pages/hovers.page.js';

test.describe('Hovers', () => {
  let hoversPage: HoversPage;

  test.beforeEach(async ({ page }) => {
    hoversPage = new HoversPage(page);
    await hoversPage.goto();
  });

  const users = [
    { index: 0, name: 'user1' },
    { index: 1, name: 'user2' },
    { index: 2, name: 'user3' },
  ];

  for (const { index, name } of users) {
    test(`should reveal info for ${name} on hover @interactions`, async () => {
      const caption = hoversPage.getFigureCaption(index);
      await expect(caption).toBeHidden();

      await hoversPage.hoverOverFigure(index);

      await expect(caption).toBeVisible();
      await expect(caption).toContainText(`name: ${name}`);
    });
  }
});
