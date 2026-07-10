// Script này có 3 lỗi — hãy debug với AI
// Mục tiêu: Login thành công vào the-internet.herokuapp.com/login
const { test, expect } = require('@playwright/test');

test('Login test with bugs', async ({ page }) => {
  // Điều hướng đến trang login
  await page.goto('https://the-internet.herokuapp.com/login');

  // Lỗi 1: Selector sai — trang không có class .username-field
  // Class thực tế là #username (ID) hoặc input[name="username"]
  await page.locator('#username').fill('tomsmith');

  // Điền password — dòng này đúng
  await page.locator('#password').fill('SuperSecretPassword!');

  // Lỗi 2: Thiếu await — click() trả về Promise nhưng không được await
  // Playwright sẽ không chờ click hoàn tất trước khi chạy dòng tiếp theo
  await page.click('button[type=submit]');

  // Lỗi 3: Thiếu await cho assertion
  // expect(page.url()) sẽ lấy URL tại thời điểm hiện tại (có thể chưa navigate xong)
  await expect(page).toHaveURL(/.*\/secure/);
});