import { test, expect } from '@playwright/test';

test.describe('게시물 작성 및 수정 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태 설정
    await page.goto('/community');
    // 로그인 로직 (실제 구현에 따라 수정)
  });

  test('TC-POST-001: 게시물 작성 성공', async ({ page }) => {
    // 1. 게시물 작성 버튼 클릭
    await page.click('[data-testid="create-post-button"]');

    // 2. 게시물 내용 입력
    await page.fill(
      '[data-testid="post-content"]',
      '포항의 아름다운 바다를 소개합니다! 🌊'
    );

    // 3. 해시태그 추가
    await page.fill('[data-testid="hashtag-input"]', '포항 바다 여행');
    await page.press('[data-testid="hashtag-input"]', 'Enter');

    // 4. 위치 정보 추가
    await page.fill('[data-testid="location-input"]', '영일대 해수욕장');

    // 5. 게시물 발행
    await page.click('[data-testid="publish-post"]');

    // 6. 성공 메시지 확인
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // 7. 게시물이 피드에 표시되는지 확인
    await expect(page.locator('[data-testid="post-content"]')).toContainText(
      '포항의 아름다운 바다를 소개합니다!'
    );
  });

  test('TC-POST-001: 게시물 수정 성공', async ({ page }) => {
    // 1. 기존 게시물의 수정 버튼 클릭
    await page.click('[data-testid="edit-post-button"]');

    // 2. 내용 수정
    await page.fill(
      '[data-testid="post-content"]',
      '수정된 내용: 포항의 아름다운 바다를 소개합니다! 🌊✨'
    );

    // 3. 수정 완료
    await page.click('[data-testid="save-edit"]');

    // 4. 수정된 내용 확인
    await expect(page.locator('[data-testid="post-content"]')).toContainText(
      '수정된 내용'
    );
  });

  test('TC-POST-001: 게시물 작성 실패 (빈 내용)', async ({ page }) => {
    // 1. 게시물 작성 버튼 클릭
    await page.click('[data-testid="create-post-button"]');

    // 2. 빈 내용으로 발행 시도
    await page.click('[data-testid="publish-post"]');

    // 3. 에러 메시지 확인
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      '내용을 입력해주세요'
    );
  });
});