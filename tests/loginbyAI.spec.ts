import { test, expect } from '@playwright/test';

const loginUrl = 'https://the-internet.herokuapp.com/login';

// Mô tả chung của bộ test cho tính năng đăng nhập
test.describe('Tính năng Login trên the-internet.herokuapp.com', () => {
  // Trước mỗi test, mở trang login để về trạng thái bắt đầu
  test.beforeEach(async ({ page }) => {
    await page.goto(loginUrl); // Điều hướng đến trang login
  });

  test('Test case 1: Đăng nhập thành công', async ({ page }) => {
    await page.getByLabel('Username').fill('tomsmith'); // Nhập username hợp lệ
    await page.getByLabel('Password').fill('SuperSecretPassword!'); // Nhập password hợp lệ
    await page.getByRole('button', { name: 'Login' }).click(); // Nhấn nút Login

    await page.waitForURL(/\/secure/); // Chờ trang chuyển hướng đến Secure Area
    await expect(page.getByRole('heading', { name: 'Secure Area', exact: true })).toBeVisible(); // Xác nhận tiêu đề trang Secure Area xuất hiện
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!'); // Xác nhận thông báo chào mừng đăng nhập thành công
  });

  test('Test case 2: Đăng nhập với Username sai', async ({ page }) => {
    await page.getByLabel('Username').fill('invaliduser'); // Nhập username sai
    await page.getByLabel('Password').fill('SuperSecretPassword!'); // Nhập password hợp lệ
    await page.getByRole('button', { name: 'Login' }).click(); // Nhấn nút Login

    await expect(page.locator('#flash')).toBeVisible(); // Chờ flash message xuất hiện
    await expect(page.locator('#flash')).toContainText('Your username is invalid!'); // Xác nhận hiển thị thông báo username không hợp lệ
  });

  test('Test case 3: Đăng nhập với Password sai', async ({ page }) => {
    await page.getByLabel('Username').fill('tomsmith'); // Nhập username hợp lệ
    await page.getByLabel('Password').fill('wrongpassword'); // Nhập password sai
    await page.getByRole('button', { name: 'Login' }).click(); // Nhấn nút Login

    await expect(page.locator('#flash')).toBeVisible(); // Chờ flash message xuất hiện
    await expect(page.locator('#flash')).toContainText('Your password is invalid!'); // Xác nhận thông báo password không hợp lệ
  });

  test('Test case 4: Để trống Username', async ({ page }) => {
    await page.getByLabel('Password').fill('SuperSecretPassword!'); // Nhập password hợp lệ
    await page.getByRole('button', { name: 'Login' }).click(); // Nhấn nút Login mà không nhập username

    await expect(page.locator('#flash')).toContainText('Your username is invalid!'); // Xác nhận thông báo username không hợp lệ
  });

  test('Test case 5: Để trống Password', async ({ page }) => {
    await page.getByLabel('Username').fill('tomsmith'); // Nhập username hợp lệ
    await page.getByRole('button', { name: 'Login' }).click(); // Nhấn nút Login mà không nhập password

    await expect(page.locator('#flash')).toBeVisible(); // Chờ flash message xuất hiện
    await expect(page.locator('#flash')).toContainText('Your password is invalid!'); // Xác nhận thông báo password không hợp lệ
  });

  test('Test case 6: Để trống cả hai trường', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click(); // Nhấn nút Login mà không nhập username và password

    await expect(page.locator('#flash')).toContainText('Your username is invalid!'); // Xác nhận thông báo username không hợp lệ
  });
});
