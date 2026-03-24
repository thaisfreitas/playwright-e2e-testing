/**
 * File Upload Page Object
 * ========================
 *
 * CONCEPT: File upload with setInputFiles() and the FileChooser event.
 *
 * Playwright provides two approaches for file uploads:
 * 1. setInputFiles() — directly sets files on an <input type="file"> element.
 *    This is the simplest and most reliable approach.
 * 2. FileChooser event — listens for the file chooser dialog. Use this when
 *    the upload is triggered by a button click (not a visible file input).
 *
 * WHEN TO USE EACH:
 * - setInputFiles(): when there's a visible or hidden <input type="file">
 * - FileChooser: when clicking a button opens a file dialog (no input element)
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/upload
 * DOCS: https://playwright.dev/docs/input#upload-files
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { URLS } from '../utils/test-data.js';

export class FileUploadPage extends BasePage {
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly uploadedFileName: Locator;

  constructor(page: Page) {
    super(page);
    this.fileInput = page.locator('#file-upload');
    this.uploadButton = page.locator('#file-submit');
    this.uploadedFileName = page.locator('#uploaded-files');
  }

  async goto(): Promise<void> {
    await this.navigate(URLS.fileUpload);
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
    await this.uploadButton.click();
  }
}
