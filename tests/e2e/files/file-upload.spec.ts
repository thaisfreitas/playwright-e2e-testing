/**
 * File Upload Tests
 * ==================
 *
 * CONCEPT: Uploading files with setInputFiles() and FileChooser.
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - setInputFiles() — set files directly on input[type="file"]
 * - page.waitForEvent('filechooser') — handle file chooser dialog
 * - Path resolution for test data files
 *
 * setInputFiles() vs FileChooser:
 * - setInputFiles(): works when there's an <input type="file"> in the DOM.
 *   Fastest and most reliable — no dialog interaction needed.
 * - FileChooser: works when a button click opens the OS file dialog.
 *   Needed for custom upload widgets that hide the native input.
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/upload
 * DOCS: https://playwright.dev/docs/input#upload-files
 */

import { test, expect } from '@playwright/test';
import { FileUploadPage } from '../../../pages/file-upload.page.js';
import path from 'path';

test.describe('File Upload', () => {
  let fileUploadPage: FileUploadPage;

  test.beforeEach(async ({ page }) => {
    fileUploadPage = new FileUploadPage(page);
    await fileUploadPage.goto();
  });

  test('should upload a file using setInputFiles @smoke @files', async () => {
    const filePath = path.resolve('test-data/sample-upload.txt');
    await fileUploadPage.uploadFile(filePath);

    await expect(fileUploadPage.uploadedFileName).toContainText('sample-upload.txt');
  });

  test('should upload a file using FileChooser event @files', async ({ page }) => {
    const filePath = path.resolve('test-data/sample-upload.txt');

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      fileUploadPage.fileInput.click(),
    ]);

    await fileChooser.setFiles(filePath);
    await fileUploadPage.uploadButton.click();

    await expect(fileUploadPage.uploadedFileName).toContainText('sample-upload.txt');
  });
});
