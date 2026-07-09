import { Page, Locator, expect } from '@playwright/test';

class LoginPage {
  readonly page: Page;
  readonly url: string;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.url = 'https://the-internet.herokuapp.com/login';
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.flashMessage = page.locator('#flash');
  }

  // Mở trang đăng nhập
  async open(): Promise<void> {
    await this.page.goto(this.url);
  }

  // Nhập tên đăng nhập
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  // Nhập mật khẩu
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  // Nhấn nút đăng nhập
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  // Thực hiện toàn bộ thao tác đăng nhập
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // Lấy thông báo flash phía trên trang
  getFlashMessage(): Locator {
    return this.flashMessage;
  }

  // Kiểm tra nội dung flash message
  async expectFlashMessageToContain(text: string): Promise<void> {
    await expect(this.getFlashMessage()).toContainText(text);
  }

  // Kiểm tra nút Login có thể bấm
  async expectLoginButtonEnabled(): Promise<void> {
    await expect(this.loginButton).toBeEnabled();
  }
}

export { LoginPage };
