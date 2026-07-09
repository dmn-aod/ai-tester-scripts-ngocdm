import { test, expect } from '@playwright/test';

// ============================================================================
// INTERFACES - Định nghĩa cấu trúc dữ liệu cho response từ API
// ============================================================================

/**
 * Interface cho User object
 * - id: Mã định danh duy nhất của user
 * - email: Địa chỉ email của user
 * - first_name: Tên của user
 * - last_name: Họ của user
 * - avatar: URL avatar của user
 */
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

/**
 * Interface cho Pagination metadata
 * - page: Trang hiện tại
 * - per_page: Số lượng items trên mỗi trang
 * - total: Tổng số items
 * - total_pages: Tổng số trang
 */
interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/**
 * Interface cho GET /api/users response
 * - data: Mảng các user objects
 * - support: Support information từ server
 */
interface GetUsersResponse {
  data: User[];
  support: {
    url: string;
    text: string;
  };
}

/**
 * Interface cho GET /api/users?page=2 response đầy đủ (bao gồm pagination)
 * - page: Trang hiện tại
 * - per_page: Số lượng items trên mỗi trang
 * - total: Tổng số items
 * - total_pages: Tổng số trang
 * - data: Mảng các user objects
 */
interface PaginatedUsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: {
    url: string;
    text: string;
  };
}

/**
 * Interface cho POST /api/users request body
 * - name: Tên của user mới
 * - job: Vị trí công việc của user
 */
interface CreateUserRequest {
  name: string;
  job: string;
}

/**
 * Interface cho POST /api/users response
 * - name: Tên user được tạo
 * - job: Vị trí công việc được tạo
 * - id: ID được server gán cho user mới
 * - createdAt: Timestamp khi user được tạo
 */
interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

// ============================================================================
// TESTS - Các bài test API cho ReqRes endpoints
// ============================================================================

const BASE_URL = 'https://reqres.in';

test.describe('ReqRes API Tests - Users Endpoints', () => {
  /**
   * Test 1: GET /api/users?page=2
   * Kiểm tra:
   * - Status code là 200
   * - Response chứa pagination fields (page, per_page, total, total_pages)
   * - Data là array và có users
   * - Mỗi user có các field bắt buộc (id, email, first_name, last_name, avatar)
   */
  test('GET /api/users?page=2 - Kiểm tra pagination và user list', async ({ request }) => {
    // Gửi request GET đến endpoint với API key
    const response = await request.get(`${BASE_URL}/api/users?page=2`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Playwright-Test',
        'X-API-Key': 'free_user_3GGLh9W61VtD8Lbaom6qJaKnQ0m',
      },
    });

    // Verify status code là 200 OK
    expect(response.status()).toBe(200);

    // Parse response body
    const data: PaginatedUsersResponse = await response.json();

    // Verify pagination fields tồn tại và có giá trị hợp lệ
    expect(data).toHaveProperty('page');
    expect(data).toHaveProperty('per_page');
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('total_pages');

    // Verify page = 2 (theo query param)
    expect(data.page).toBe(2);

    // Verify per_page là số nguyên dương
    expect(data.per_page).toBeGreaterThan(0);

    // Verify total_pages là số nguyên
    expect(typeof data.total_pages).toBe('number');

    // Verify data là array
    expect(Array.isArray(data.data)).toBe(true);

    // Verify data array có ít nhất 1 user
    expect(data.data.length).toBeGreaterThan(0);

    // Verify mỗi user trong array có các field bắt buộc
    data.data.forEach((user: User) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
      expect(user).toHaveProperty('avatar');

      // Verify kiểu dữ liệu
      expect(typeof user.id).toBe('number');
      expect(typeof user.email).toBe('string');
      expect(typeof user.first_name).toBe('string');
      expect(typeof user.last_name).toBe('string');
      expect(typeof user.avatar).toBe('string');

      // Verify email không rỗng
      expect(user.email.length).toBeGreaterThan(0);
    });
  });

  /**
   * Test 2: POST /api/users
   * Kiểm tra:
   * - Status code là 201 Created
   * - Response chứa id được server tạo
   * - name và job trong response khớp với request
   * - createdAt timestamp tồn tại
   */
  test('POST /api/users - Kiểm tra tạo user mới', async ({ request }) => {
    // Prepare request payload
    const requestBody: CreateUserRequest = {
      name: 'AI Tester',
      job: 'QA Engineer',
    };

    // Gửi request POST với API key
    const response = await request.post(`${BASE_URL}/api/users`, {
      headers: {
        'X-API-Key': 'free_user_3GGLh9W61VtD8Lbaom6qJaKnQ0m',
      },
      data: requestBody,
    });

    // Verify status code là 201 Created
    expect(response.status()).toBe(201);

    // Parse response body
    const data: CreateUserResponse = await response.json();

    // Verify name trong response khớp với request
    expect(data.name).toBe(requestBody.name);

    // Verify job trong response khớp với request
    expect(data.job).toBe(requestBody.job);

    // Verify id được tạo (server gán)
    expect(data).toHaveProperty('id');
    expect(data.id).toBeTruthy();

    // Verify createdAt timestamp tồn tại
    expect(data).toHaveProperty('createdAt');
    expect(data.createdAt).toBeTruthy();

    // Verify createdAt là valid ISO date string
    const createdDate = new Date(data.createdAt);
    expect(createdDate.toString()).not.toBe('Invalid Date');
  });

  /**
   * Test 3: DELETE /api/users/2
   * Kiểm tra:
   * - Status code là 204 No Content
   * - Response body trống (hoặc không chứa dữ liệu)
   */
  test('DELETE /api/users/2 - Kiểm tra xóa user', async ({ request }) => {
    // Gửi request DELETE với API key
    const response = await request.delete(`${BASE_URL}/api/users/2`, {
      headers: {
        'X-API-Key': 'free_user_3GGLh9W61VtD8Lbaom6qJaKnQ0m',
      },
    });

    // Verify status code là 204 No Content
    expect(response.status()).toBe(204);

    // Verify response body trống khi status 204
    const responseText = await response.text();
    expect(responseText).toBe('');
  });
});
