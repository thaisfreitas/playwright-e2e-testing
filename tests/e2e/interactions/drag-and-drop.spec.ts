/**
 * Drag and Drop Tests
 * =====================
 *
 * CONCEPT: Drag and drop with Playwright — dragTo() and manual events.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - page.evaluate() — execute JS in the browser context for HTML5 DnD
 * - locator.dragTo() — high-level drag API (may not work on all implementations)
 * - Understanding when to fall back to manual event dispatching
 *
 * NOTE: The Internet's drag-and-drop uses HTML5 Drag API which requires
 * dispatching native DragEvent objects. This is a common real-world challenge.
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/drag_and_drop
 * DOCS: https://playwright.dev/docs/input#drag-and-drop
 */

import { test, expect } from '@playwright/test';
import { DragAndDropPage } from '../../../pages/drag-and-drop.page.js';

test.describe('Drag and Drop', () => {
  let dragAndDropPage: DragAndDropPage;

  test.beforeEach(async ({ page }) => {
    dragAndDropPage = new DragAndDropPage(page);
    await dragAndDropPage.goto();
  });

  test('should swap columns when dragging A to B @interactions', async () => {
    await expect(dragAndDropPage.columnA).toContainText('A');
    await expect(dragAndDropPage.columnB).toContainText('B');

    await dragAndDropPage.dragAToB();

    await expect(dragAndDropPage.columnA).toContainText('B');
    await expect(dragAndDropPage.columnB).toContainText('A');
  });
});
