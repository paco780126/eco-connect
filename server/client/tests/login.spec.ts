import { test, expect } from '@playwright/test';

// 테스트 그룹: '로그인 기능'
test.describe('Login Functionality', () => {

  // 테스트 케이스: '성공적인 로그인'
  test('should allow a user to log in successfully', async ({ page }) => {
    // 1. 로그인 페이지로 이동
    await page.goto('/login');

    // 2. 이메일과 비밀번호 입력
    await page.getByLabel('이메일').fill('user@test.com');
    await page.getByLabel('비밀번호').fill('password123');

    // 3. 로그인 버튼 클릭
    await page.getByRole('button', { name: '로그인' }).click();

    // 4. 페이지 이동 확인: 마이페이지에 있는 '내 정보 수정' 제목이 보이는지 확인
    await expect(page.getByRole('heading', { name: '내 정보 수정' })).toBeVisible();
  });

});
