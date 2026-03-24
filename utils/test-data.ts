/**
 * Centralized Test Data
 * ======================
 *
 * All test constants, credentials, URLs, and expected text values live here.
 * Centralizing test data provides several benefits:
 *
 * 1. SINGLE SOURCE OF TRUTH: if credentials or URLs change, update one file
 *    instead of hunting through dozens of spec files.
 * 2. READABILITY: tests reference named constants (`CREDENTIALS.valid.username`)
 *    instead of magic strings scattered throughout.
 * 3. ENVIRONMENT FLEXIBILITY: constants can be overridden via environment
 *    variables when needed (see BASE_URL in playwright.config.ts).
 * 4. TYPE SAFETY: TypeScript ensures you can't reference a non-existent field.
 *
 * PATTERN: This mirrors the `lib/data/test-data.ts` file in the sibling
 * playwright-api-testing project.
 *
 * DOCS: https://playwright.dev/docs/test-parameterize
 */

/**
 * Credentials for The Internet's Form Authentication page.
 * These are publicly documented on the login page itself.
 */
export const CREDENTIALS = {
  valid: {
    username: 'tomsmith',
    password: 'SuperSecretPassword!',
  },
  invalid: {
    username: 'invaliduser',
    password: 'wrongpassword',
  },
} as const;

/**
 * Credentials for HTTP Basic Auth page.
 * The Internet uses admin/admin for its Basic Auth example.
 */
export const BASIC_AUTH_CREDENTIALS = {
  username: 'admin',
  password: 'admin',
} as const;

/**
 * All page paths relative to baseURL. Using a central object prevents typos
 * and makes it easy to find which paths the project tests.
 */
export const URLS = {
  login: '/login',
  secure: '/secure',
  basicAuth: '/basic_auth',
  checkboxes: '/checkboxes',
  dropdown: '/dropdown',
  inputs: '/inputs',
  keyPresses: '/key_presses',
  dynamicControls: '/dynamic_controls',
  dynamicLoading1: '/dynamic_loading/1',
  dynamicLoading2: '/dynamic_loading/2',
  disappearingElements: '/disappearing_elements',
  notificationMessage: '/notification_message',
  dragAndDrop: '/drag_and_drop',
  hovers: '/hovers',
  contextMenu: '/context_menu',
  horizontalSlider: '/horizontal_slider',
  sortableTables: '/tables',
  fileUpload: '/upload',
  fileDownload: '/download',
  iframe: '/iframe',
  nestedFrames: '/nested_frames',
  shadowDom: '/shadowdom',
  infiniteScroll: '/infinite_scroll',
  multipleWindows: '/windows',
  javascriptAlerts: '/javascript_alerts',
  geolocation: '/geolocation',
  brokenImages: '/broken_images',
  redirector: '/redirector',
  statusCodes: '/status_codes',
  floatingMenu: '/floating_menu',
  addRemoveElements: '/add_remove_elements/',
} as const;

/**
 * Expected text values used in assertions. Keeping them here avoids duplicating
 * magic strings across multiple test files and makes updates trivial.
 */
export const EXPECTED_TEXT = {
  loginSuccess: 'You logged into a secure area!',
  loginError: 'Your username is invalid!',
  loginPasswordError: 'Your password is invalid!',
  logoutSuccess: 'You logged out of the secure area!',
  basicAuthSuccess: 'Congratulations! You must have the proper credentials.',
  securePageHeading: 'Secure Area',
  loginPageHeading: 'Login Page',
} as const;
