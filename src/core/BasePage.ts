import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage: Base class for all Page Object Model (POM) pages
 * Provides common functionality for page interactions, waits, and element handling
 */
export class BasePage {
  protected page: Page;
  protected baseURL: string = 'http://localhost:3000';

  constructor(page: Page, baseURL?: string) {
    this.page = page;
    if (baseURL) this.baseURL = baseURL;
  }

  /**
   * Navigate to a specific URL
   */
  async navigate(path: string = ''): Promise<void> {
    const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
    await this.page.goto(url);
  }

  /**
   * Get element by selector
   */
  protected getElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Get multiple elements by selector
   */
  protected getElements(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Click on an element
   */
  async click(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  /**
   * Fill text input
   */
  async fill(selector: string, text: string): Promise<void> {
    await this.page.locator(selector).fill(text);
  }

  /**
   * Type text with delay
   */
  async type(selector: string, text: string, delayMs: number = 0): Promise<void> {
    await this.page.locator(selector).type(text, { delay: delayMs });
  }

  /**
   * Get text content from element
   */
  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  /**
   * Get input value
   */
  async getInputValue(selector: string): Promise<string> {
    return await this.page.locator(selector).inputValue();
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).selectOption(value);
  }

  /**
   * Check/Uncheck checkbox
   */
  async setCheckbox(selector: string, checked: boolean): Promise<void> {
    const element = this.page.locator(selector);
    const isChecked = await element.isChecked();
    if (isChecked !== checked) {
      await element.click();
    }
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if element exists
   */
  async isElementPresent(selector: string): Promise<boolean> {
    const count = await this.page.locator(selector).count();
    return count > 0;
  }

  /**
   * Assert element contains text
   */
  async assertTextContains(selector: string, expectedText: string): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(expectedText);
  }

  /**
   * Assert element equals text
   */
  async assertTextEquals(selector: string, expectedText: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(expectedText);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for specific timeout
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Reload page
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Execute JavaScript
   */
  async executeScript<T = any>(script: string): Promise<T> {
    return await this.page.evaluate((eval(script)));
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `./screenshots/${name}.png` });
  }

  /**
   * Get page HTML
   */
  async getPageSource(): Promise<string> {
    return await this.page.content();
  }

  /**
   * Switch to frame
   */
  async switchToFrame(selector: string): Promise<Page> {
    const frameHandle = await this.page.$(selector);
    return await frameHandle?.contentFrame() || this.page;
  }

  /**
   * Close page
   */
  async closePage(): Promise<void> {
    await this.page.close();
  }
}
