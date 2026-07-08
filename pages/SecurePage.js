const { expect } = require('@playwright/test');

class SecurePage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Secure Area', exact: true });
    this.flashMessage = page.locator('#flash');
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  // Chờ đến trang Secure Area sau khi đăng nhập thành công
  async waitForSecureArea() {
    await this.page.waitForURL(/\/secure/);
  }

  // Kiểm tra tiêu đề Secure Area hiển thị
  async expectSecureAreaVisible() {
    await expect(this.heading).toBeVisible();
  }

  // Kiểm tra thông báo flash message
  async expectFlashMessageToContain(text) {
    await expect(this.flashMessage).toContainText(text);
  }

  // Thực hiện đăng xuất khỏi Secure Area
  async logout() {
    await this.logoutLink.click();
  }
}

module.exports = { SecurePage };
