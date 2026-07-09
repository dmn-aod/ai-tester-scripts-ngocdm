import { test, expect } from '../fixtures/auth.fixture';

// Ví dụ sử dụng custom fixture loggedInPage
// AuthFixtures interface cung cấp fixture 'loggedInPage' - một Page object đã được xác thực
test.describe('Sử dụng custom auth fixture', () => {
  // Ví dụ 1: Kiểm tra trang secure area sau khi đăng nhập tự động
  test('should display secure page after auto login', async ({ loggedInPage }) => {
    // fixture loggedInPage đã tự động:
    // 1. Mở trang login
    // 2. Nhập credentials (tomsmith / SuperSecretPassword!)
    // 3. Nhấn login
    // 4. Chờ điều hướng đến trang secure

    // Kiểm tra URL hiện tại
    await expect(loggedInPage).toHaveURL(/.*\/secure.*/);

    // Kiểm tra element trên trang secure
    const title = loggedInPage.locator('h2');
    await expect(title).toContainText('Secure Area');
  });

  // Ví dụ 2: Kiểm tra thông báo đăng nhập thành công
  test('should show success message', async ({ loggedInPage }) => {
    const flashMessage = loggedInPage.locator('#flash');
    await expect(flashMessage).toContainText('You logged into a secure area!');
  });

  // Ví dụ 3: Kiểm tra logout functionality
  test('should be able to logout', async ({ loggedInPage }) => {
    const logoutButton = loggedInPage.locator('a:has-text("Logout")');
    await logoutButton.click();

    // Sau khi logout, trang phải quay về login
    await expect(loggedInPage).toHaveURL(/.*\/login/);
  });
});
