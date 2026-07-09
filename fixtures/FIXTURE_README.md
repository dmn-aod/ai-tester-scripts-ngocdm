# Custom Playwright Fixture - Auth Fixture

## Mô tả

Fixture `auth.fixture.ts` cung cấp một custom fixture Playwright tên là `loggedInPage` để tự động đăng nhập trước khi chạy test.

## Cách hoạt động

### AuthFixtures Interface

```typescript
interface AuthFixtures {
  loggedInPage: Page;
}
```

- **AuthFixtures**: Interface định nghĩa các custom fixture được sử dụng trong test
- **Generic type `T` được ràng buộc với TestArgs**: Cho phép mở rộng fixtures mặc định của Playwright
- **`loggedInPage: Page`**: Fixture này cung cấp một Page object đã được xác thực (đã đăng nhập)

### Quy trình tự động của Fixture

Khi sử dụng fixture `loggedInPage`, nó sẽ tự động thực hiện:

1. Mở trang login: `https://the-internet.herokuapp.com/login`
2. Đăng nhập với credentials:
   - Username: `tomsmith`
   - Password: `SuperSecretPassword!`
3. Chờ điều hướng đến trang `/secure`
4. Cung cấp authenticated Page object cho test

## Cách sử dụng

### Import fixture

```typescript
import { test, expect } from '../fixtures/auth.fixture';
```

### Sử dụng trong test

```typescript
test('example test with auth', async ({ loggedInPage }) => {
  // loggedInPage là một Page object đã được đăng nhập
  await expect(loggedInPage).toHaveURL(/.*\/secure.*/);
  // Viết assertions khác ở đây
});
```

## Cấu trúc file

```
fixtures/
  └── auth.fixture.ts          # Custom fixture definition
pages/
  └── LoginPage.ts             # TypeScript version of LoginPage
tests/
  ├── loginbyAI.spec.ts        # Existing login tests
  ├── loginWithFixture.spec.ts # Example tests using fixture
  └── login.spec.ts            # Original tests
playwright.config.ts           # Playwright configuration
```

## Tệp liên quan

- **fixtures/auth.fixture.ts**: Định nghĩa custom fixture `loggedInPage`
- **pages/LoginPage.ts**: TypeScript class để xử lý login page interactions
- **tests/loginWithFixture.spec.ts**: Ví dụ về cách sử dụng fixture

## Lợi ích của Fixture

✅ **Giảm code trùng lặp**: Không cần viết login logic trong mỗi test
✅ **Dễ bảo trì**: Thay đổi login process chỉ cần sửa 1 chỗ
✅ **Tách biệt concern**: Login logic tách biệt khỏi test logic
✅ **Reusable**: Có thể mở rộng fixture cho các authentication khác

## Ghi chú

- Fixture tự động cleanup sau khi test hoàn thành
- Có thể kết hợp `loggedInPage` fixture với fixtures khác của Playwright
- Để sử dụng fixture này, import từ `../fixtures/auth.fixture` thay vì `@playwright/test`
