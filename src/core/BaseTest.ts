import { test as base, Page, Browser, BrowserContext } from '@playwright/test';

/**
 * Extended test fixture with common setup/teardown functionality
 */
export const test = base.extend<{
  pageFixture: Page;
  browserFixture: Browser;
}>({
  pageFixture: async ({ page }, use) => {
    // Setup before test
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Use the fixture
    await use(page);
    
    // Teardown after test
    await page.close();
  },
  
  browserFixture: async ({ browser }, use) => {
    // Use the fixture
    await use(browser);
    
    // Teardown after test
    await browser.close();
  },
});

export { expect } from '@playwright/test';
