import { BasePage } from '../core/BasePage';
import { Page } from '@playwright/test';

/**
 * DashboardPage: Page Object for dashboard functionality
 * Extends BasePage for common interactions
 */
export class DashboardPage extends BasePage {
  // Locators
  private welcomeMessage = '[data-testid="welcome-message"]';
  private userProfileButton = '[data-testid="user-profile"]';
  private logoutButton = '[data-testid="logout-button"]';
  private mainContent = 'main';
  private sidebarMenu = '[data-testid="sidebar-menu"]';
  private menuItems = '[data-testid="menu-item"]';
  private searchInput = '[data-testid="search-box"]';
  private notificationBell = '[data-testid="notifications"]';
  private datatable = '[data-testid="data-table"]';
  private tableRows = '[data-testid="data-table"] tbody tr';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getText(this.welcomeMessage);
  }

  /**
   * Click user profile button
   */
  async clickUserProfile(): Promise<void> {
    await this.click(this.userProfileButton);
  }

  /**
   * Click logout button
   */
  async logout(): Promise<void> {
    await this.click(this.logoutButton);
  }

  /**
   * Check if dashboard is loaded
   */
  async isDashboardLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.mainContent);
  }

  /**
   * Search for item
   */
  async search(query: string): Promise<void> {
    await this.fill(this.searchInput, query);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Get number of menu items
   */
  async getMenuItemCount(): Promise<number> {
    return await this.page.locator(this.menuItems).count();
  }

  /**
   * Click menu item by text
   */
  async clickMenuItem(itemName: string): Promise<void> {
    await this.page.locator(this.menuItems, { hasText: itemName }).click();
  }

  /**
   * Get table row count
   */
  async getTableRowCount(): Promise<number> {
    return await this.page.locator(this.tableRows).count();
  }

  /**
   * Get table data
   */
  async getTableData(): Promise<Record<string, string>[]> {
    const rows = await this.page.locator(this.tableRows).all();
    const data: Record<string, string>[] = [];

    for (const row of rows) {
      const cells = await row.locator('td').all();
      const rowData: Record<string, string> = {};

      for (let i = 0; i < cells.length; i++) {
        rowData[`cell_${i}`] = await cells[i].textContent() || '';
      }

      data.push(rowData);
    }

    return data;
  }

  /**
   * Click notification bell
   */
  async clickNotifications(): Promise<void> {
    await this.click(this.notificationBell);
  }

  /**
   * Wait for dashboard to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForElement(this.mainContent);
  }

  /**
   * Check if sidebar is visible
   */
  async isSidebarVisible(): Promise<boolean> {
    return await this.isElementVisible(this.sidebarMenu);
  }
}

export default DashboardPage;
