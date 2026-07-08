const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.url = 'https://the-internet.herokuapp.com/login';
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.flashMessage = page.locator('#flash');
  }

  // Mở trang đăng nhập
  async open() {
    await this.page.goto(this.url);
  }

  // Nhập tên đăng nhập
  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  // Nhập mật khẩu
  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  // Nhấn nút đăng nhập
  async clickLogin() {
    await this.loginButton.click();
  }

  // Thực hiện toàn bộ thao tác đăng nhập
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // Lấy thông báo flash phía trên trang
  getFlashMessage() {
    return this.flashMessage;
  }

  // Kiểm tra nội dung flash message
  async expectFlashMessageToContain(text) {
    await expect(this.getFlashMessage()).toContainText(text);
  }

  // Kiểm tra nút Login có thể bấm
  async expectLoginButtonEnabled() {
    await expect(this.loginButton).toBeEnabled();
  }
}

module.exports = { LoginPage };
