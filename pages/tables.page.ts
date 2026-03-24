/**
 * Sortable Tables Page Object
 * =============================
 *
 * CONCEPT: Extracting and validating data from HTML tables.
 *
 * HTML tables are common in enterprise apps (dashboards, admin panels, reports).
 * Testing them requires:
 * 1. Selecting rows and cells with locators
 * 2. Extracting text content from cells
 * 3. Validating sort order, filtering, and data integrity
 *
 * The Internet has two tables — we focus on Table 1 (sortable by clicking headers).
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/tables
 * DOCS: https://playwright.dev/docs/locators#filtering-locators
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { URLS } from '../utils/test-data.js';

export class TablesPage extends BasePage {
  readonly table1: Locator;
  readonly table1Headers: Locator;
  readonly table1Rows: Locator;

  constructor(page: Page) {
    super(page);
    this.table1 = page.locator('#table1');
    this.table1Headers = this.table1.locator('thead th');
    this.table1Rows = this.table1.locator('tbody tr');
  }

  async goto(): Promise<void> {
    await this.navigate(URLS.sortableTables);
  }

  async clickHeader(headerName: string): Promise<void> {
    await this.table1.locator('thead th span').filter({ hasText: headerName }).click();
  }

  async getColumnValues(columnIndex: number): Promise<string[]> {
    const cells = this.table1Rows.locator(`td:nth-child(${columnIndex + 1})`);
    return cells.allTextContents();
  }
}
