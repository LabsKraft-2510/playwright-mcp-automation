import { test, expect } from '@playwright/test';
import { SauceDemoLoginPage } from '../src/pages/SauceDemoLoginPage';

// Tests for https://www.saucedemo.com/
// Credentials: standard_user / secret_sauce

test.describe('Sauce Demo - Login Tests', () => {
  let pageObj: SauceDemoLoginPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    pageObj = new SauceDemoLoginPage(page);
    await page.waitForSelector('#user-name');
  });

  test('TC_001 Successful login with valid credentials', async ({ page }) => {
    await pageObj.login('standard_user', 'secret_sauce');
    expect(await pageObj.isLoggedIn()).toBeTruthy();
  });

  test('TC_002 Login fails with invalid credentials', async ({ page }) => {
    await pageObj.login('locked_out_user', 'wrong_password');
    // Expect error message visible
    const err = await pageObj.getErrorMessage();
    expect(err.length).toBeGreaterThan(0);
  });

  test('TC_003 Logout after login', async ({ page }) => {
    await pageObj.login('standard_user', 'secret_sauce');
    expect(await pageObj.isLoggedIn()).toBeTruthy();
    await pageObj.logout();
    // After logout, should be back on login form
    expect(await page.isVisible('#login-button')).toBeTruthy();
  });

  test('TC_004 Inventory items visible after login', async ({ page }) => {
    await pageObj.login('standard_user', 'secret_sauce');
    const products = await pageObj.getProductNames();
    expect(products.length).toBeGreaterThan(0);
  });
});
