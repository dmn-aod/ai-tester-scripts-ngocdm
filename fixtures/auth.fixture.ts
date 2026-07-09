import { test as base, Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// AuthFixtures interface - Định nghĩa các fixtures custom được sử dụng trong test.
// Generic type T được ràng buộc với TestArgs để cho phép mở rộng fixtures mặc định.
// Fixture 'loggedInPage' là một Page đã được xác thực (đã đăng nhập) sẵn sàng cho test.
interface AuthFixtures {
  loggedInPage: Page;
}

// Tạo test fixture mới với autouse custom fixture
// Kế thừa từ base fixture của Playwright và thêm AuthFixtures
export const test = base.extend<AuthFixtures>({
  loggedInPage: async ({ page }, use) => {
    // Khởi tạo LoginPage với page object hiện tại
    const loginPage = new LoginPage(page);

    // Mở trang đăng nhập
    await loginPage.open();

    // Thực hiện đăng nhập tự động với tài khoản mặc định
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    // Chờ cho đến khi điều hướng hoàn tất (kiểm tra URL thay đổi)
    await page.waitForURL(/.*\/secure.*/);

    // Cung cấp page đã đăng nhập cho test
    await use(page);

    // Cleanup (nếu cần thiết) - không cần trong trường hợp này vì context sẽ đóng
  },
});

// Export expect để sử dụng trong test files
export { expect };
