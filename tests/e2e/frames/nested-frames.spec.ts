/**
 * Nested Frames Tests
 * =====================
 *
 * CONCEPT: Accessing content in frames nested within other frames.
 *
 * The Internet's nested frames page has this structure:
 *   <frameset>
 *     <frame name="frame-top">
 *       <frameset>
 *         <frame name="frame-left">    → "LEFT"
 *         <frame name="frame-middle">  → "MIDDLE"
 *         <frame name="frame-right">   → "RIGHT"
 *       </frameset>
 *     </frame>
 *     <frame name="frame-bottom">      → "BOTTOM"
 *   </frameset>
 *
 * To reach "MIDDLE", you must: page → frame-top → frame-middle.
 *
 * PATTERN: Use frame() (not frameLocator) for <frameset> pages because
 * frameLocator works with <iframe> elements. For <frame> elements within
 * <frameset>, use page.frame({ name: '...' }).
 *
 * PLAYWRIGHT FEATURES DEMONSTRATED:
 * - page.frame({ name }) — access frames by name attribute
 * - Chaining frame access for nested structures
 * - Limitations of frameLocator with <frameset> (legacy HTML)
 *
 * TARGET PAGE: https://the-internet.herokuapp.com/nested_frames
 * DOCS: https://playwright.dev/docs/frames
 */

import { test, expect } from '@playwright/test';
import { URLS } from '../../../utils/test-data.js';

test.describe('Nested Frames', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.nestedFrames);
  });

  test('should read content from bottom frame @frames', async ({ page }) => {
    const bottomFrame = page.frame({ name: 'frame-bottom' });
    expect(bottomFrame).not.toBeNull();

    const text = await bottomFrame!.locator('body').textContent();
    expect(text?.trim()).toBe('BOTTOM');
  });

  test('should read content from nested middle frame @frames', async ({ page }) => {
    const topFrame = page.frame({ name: 'frame-top' });
    expect(topFrame).not.toBeNull();

    const middleFrame = topFrame!.childFrames().find(f => f.name() === 'frame-middle');
    expect(middleFrame).toBeDefined();

    const text = await middleFrame!.locator('body').textContent();
    expect(text?.trim()).toBe('MIDDLE');
  });

  test('should access all nested frames @frames', async ({ page }) => {
    const topFrame = page.frame({ name: 'frame-top' });
    const childFrames = topFrame!.childFrames();

    const expectedContent: Record<string, string> = {
      'frame-left': 'LEFT',
      'frame-middle': 'MIDDLE',
      'frame-right': 'RIGHT',
    };

    for (const frame of childFrames) {
      const name = frame.name();
      if (expectedContent[name]) {
        const text = await frame.locator('body').textContent();
        expect(text?.trim()).toBe(expectedContent[name]);
      }
    }
  });
});
