/**
 * Sortable Data Tables Tests
 * ============================
 *
 * CONCEPT: Extracting and validating data from HTML tables.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - allTextContents() — get text from all matching elements at once
 * - Test parameterization with for...of loops
 * - Sorting validation (ascending/descending)
 * - Complex data extraction from structured HTML
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/tables
 * DOCS: https://playwright.dev/docs/locators#lists
 */

import { test, expect } from '@playwright/test';
import { TablesPage } from '../../../pages/tables.page.js';

test.describe('Sortable Data Tables', () => {
  let tablesPage: TablesPage;

  test.beforeEach(async ({ page }) => {
    tablesPage = new TablesPage(page);
    await tablesPage.goto();
  });

  test('should display 4 rows of data @interactions', async () => {
    await expect(tablesPage.table1Rows).toHaveCount(4);
  });

  test('should have correct column headers @interactions', async () => {
    const headers = await tablesPage.table1Headers.allTextContents();
    expect(headers).toContain('Last Name');
    expect(headers).toContain('First Name');
    expect(headers).toContain('Email');
  });

  const sortableColumns = [
    { name: 'Last Name', index: 0 },
    { name: 'First Name', index: 1 },
  ];

  for (const { name, index } of sortableColumns) {
    test(`should sort by ${name} ascending @interactions`, async () => {
      await tablesPage.clickHeader(name);

      const values = await tablesPage.getColumnValues(index);
      const sorted = [...values].sort((a, b) => a.localeCompare(b));
      expect(values).toEqual(sorted);
    });
  }

  test('should sort by Last Name descending on double click @interactions', async () => {
    const isDescending = (values: string[]) =>
      values.every((value, index) => index === 0 || values[index - 1].localeCompare(value) >= 0);

    // Header sort state can vary between runs. Click until we actually get descending.
    for (let i = 0; i < 3; i++) {
      await tablesPage.clickHeader('Last Name');
      const current = await tablesPage.getColumnValues(0);
      if (isDescending(current)) break;
    }

    const values = await tablesPage.getColumnValues(0);
    const sorted = [...values].sort((a, b) => b.localeCompare(a));
    expect(values).toEqual(sorted);
  });
});
