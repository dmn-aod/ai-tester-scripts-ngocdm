const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { SecurePage } = require('../pages/SecurePage');

// Mô tả chung của bộ test cho tính năng đăng nhập
test.describe('Tính năng Login trên the-internet.herokuapp.com', () => {
  // Trước mỗi test, mở trang login để về trạng thái bắt đầu
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open(); // Điều hướng đến trang login
  });

  test('Test case 1: Đăng nhập thành công', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const securePage = new SecurePage(page);

    await loginPage.login('tomsmith', 'SuperSecretPassword!'); // Thực hiện đăng nhập với thông tin hợp lệ

    await securePage.waitForSecureArea(); // Chờ trang chuyển hướng đến Secure Area
    await securePage.expectSecureAreaVisible(); // Xác nhận tiêu đề trang Secure Area xuất hiện
    await securePage.expectFlashMessageToContain('You logged into a secure area!'); // Xác nhận thông báo chào mừng đăng nhập thành công
  });

  test('Test case 2: Đăng nhập với Username sai', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('invaliduser', 'SuperSecretPassword!'); // Thực hiện đăng nhập với username sai

    await loginPage.getFlashMessage().waitFor(); // Chờ flash message xuất hiện
    await loginPage.expectFlashMessageToContain('Your username is invalid!'); // Xác nhận hiển thị thông báo username không hợp lệ
  });

  test('Test case 3: Đăng nhập với Password sai', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('tomsmith', 'wrongpassword'); // Thực hiện đăng nhập với password sai

    await loginPage.getFlashMessage().waitFor(); // Chờ flash message xuất hiện
    await loginPage.expectFlashMessageToContain('Your password is invalid!'); // Xác nhận thông báo password không hợp lệ
  });

  test('Test case 4: Để trống Username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.enterPassword('SuperSecretPassword!'); // Nhập password hợp lệ
    await loginPage.clickLogin(); // Nhấn nút Login mà không nhập username

    await loginPage.expectFlashMessageToContain('Your username is invalid!'); // Xác nhận thông báo username không hợp lệ
  });

  test('Test case 5: Để trống Password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.enterUsername('tomsmith'); // Nhập username hợp lệ
    await loginPage.clickLogin(); // Nhấn nút Login mà không nhập password

    await loginPage.getFlashMessage().waitFor(); // Chờ flash message xuất hiện
    await loginPage.expectFlashMessageToContain('Your password is invalid!'); // Xác nhận thông báo password không hợp lệ
  });

  test('Test case 6: Để trống cả hai trường', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.clickLogin(); // Nhấn nút Login mà không nhập username và password

    await loginPage.expectFlashMessageToContain('Your username is invalid!'); // Xác nhận thông báo username không hợp lệ
  });

  test('Test case 7: Kiểm tra nút Login luôn enable', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await expect(loginPage.loginButton).toBeEnabled(); // Xác nhận nút Login luôn có thể bấm ở trạng thái ban đầu
    await loginPage.expectLoginButtonEnabled(); // Gọi helper từ Page Object để kiểm tra trạng thái nút Login
  });

  test('Test case 8: Có thể đăng nhập lại ngay sau khi đăng xuất', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const securePage = new SecurePage(page);

    await loginPage.login('tomsmith', 'SuperSecretPassword!'); // Đăng nhập lần đầu
    await securePage.waitForSecureArea(); // Chờ chuyển sang Secure Area
    await securePage.logout(); // Thực hiện đăng xuất

    await loginPage.open(); // Mở lại trang đăng nhập sau khi đăng xuất
    await loginPage.login('tomsmith', 'SuperSecretPassword!'); // Đăng nhập lại ngay lập tức

    await securePage.waitForSecureArea(); // Chờ lại trang Secure Area
    await securePage.expectSecureAreaVisible(); // Xác nhận đăng nhập lại thành công
  });
});
