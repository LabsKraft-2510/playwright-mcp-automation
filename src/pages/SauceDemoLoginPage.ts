import { BasePage } from '../core/BasePage';

/**
 * Sauce Demo Login Page Object
 * Uses: https://www.saucedemo.com/
 * Credentials: username: standard_user, password: secret_sauce
 */
export class SauceDemoLoginPage extends BasePage {
  readonly usernameInput = '#user-name';
  readonly passwordInput = '#password';
  readonly loginButton = '#login-button';
  readonly errorMessage = '[data-test="error"]';
  readonly inventoryContainer = '.inventory_container';
  readonly productNames = '.inventory_item_name';
  readonly menuButton = '#react-burger-menu-btn';
  readonly logoutLink = '#logout_sidebar_link';

  constructor(page: any) {
    super(page);
  }

  async navigateToLoginPage(): Promise<void> {
    await this.navigate('');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForElement(this.inventoryContainer).catch(() => {});
  }

  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.inventoryContainer);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async clearUsername(): Promise<void> {
    await this.page.fill(this.usernameInput, '');
  }

  async clearPassword(): Promise<void> {
    await this.page.fill(this.passwordInput, '');
  }

  async logout(): Promise<void> {
    await this.click(this.menuButton);
    await this.waitForElement(this.logoutLink);
    await this.click(this.logoutLink);
  }

  async getProductNames(): Promise<string[]> {
    return await this.page.$$eval(this.productNames, (els: any[]) => els.map(e => e.textContent?.trim() || ''));
  }
}
