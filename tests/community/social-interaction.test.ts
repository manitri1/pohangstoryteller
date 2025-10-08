import { test, expect } from '@playwright/test';

test.describe('소셜 상호작용 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community');
  });

  test('TC-SOCIAL-001: 좋아요 기능', async ({ page }) => {
    // 1. 게시물의 좋아요 버튼 클릭
    const likeButton = page.locator('[data-testid="like-button"]').first();
    const likeCount = page.locator('[data-testid="like-count"]').first();

    // 초기 좋아요 수 확인
    const initialCount = await likeCount.textContent();

    // 좋아요 클릭
    await likeButton.click();

    // 좋아요 수 증가 확인
    await expect(likeCount).toContainText(
      (parseInt(initialCount!) + 1).toString()
    );

    // 좋아요 버튼 상태 변경 확인
    await expect(likeButton).toHaveClass(/liked/);

    // 다시 클릭하여 취소
    await likeButton.click();

    // 좋아요 수 원래대로 돌아가는지 확인
    await expect(likeCount).toContainText(initialCount!);
  });

  test('TC-SOCIAL-001: 북마크 기능', async ({ page }) => {
    // 1. 게시물의 북마크 버튼 클릭
    const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();

    // 북마크 클릭
    await bookmarkButton.click();

    // 북마크 버튼 상태 변경 확인
    await expect(bookmarkButton).toHaveClass(/bookmarked/);

    // 북마크 목록에서 확인
    await page.click('[data-testid="bookmarks-tab"]');
    await expect(page.locator('[data-testid="bookmarked-post"]')).toBeVisible();

    // 북마크 취소
    await page.click('[data-testid="bookmark-button"]');
    await expect(bookmarkButton).not.toHaveClass(/bookmarked/);
  });

  test('TC-SOCIAL-002: 댓글 작성 및 수정', async ({ page }) => {
    // 1. 댓글 버튼 클릭
    await page.locator('[data-testid="comment-button"]').first().click();

    // 2. 댓글 작성
    await page.fill('[data-testid="comment-input"]', '정말 아름다운 곳이네요!');
    await page.click('[data-testid="submit-comment"]');

    // 3. 댓글 표시 확인
    await expect(page.locator('[data-testid="comment-content"]')).toContainText(
      '정말 아름다운 곳이네요!'
    );

    // 4. 댓글 수정
    await page.click('[data-testid="edit-comment"]');
    await page.fill('[data-testid="comment-input"]', '수정된 댓글입니다.');
    await page.click('[data-testid="save-comment"]');

    // 5. 수정된 댓글 확인
    await expect(page.locator('[data-testid="comment-content"]')).toContainText(
      '수정된 댓글입니다.'
    );
  });

  test('TC-SOCIAL-003: 공유 기능 (내부)', async ({ page }) => {
    // 1. 공유 버튼 클릭
    await page.locator('[data-testid="share-button"]').first().click();

    // 2. 내부 공유 선택
    await page.click('[data-testid="internal-share"]');

    // 3. 공유할 사용자 선택
    await page.click('[data-testid="user-select"]');
    await page.click('[data-testid="user-option"]');

    // 4. 공유 메시지 작성
    await page.fill('[data-testid="share-message"]', '이 게시물을 공유합니다.');
    await page.click('[data-testid="confirm-share"]');

    // 5. 공유 성공 메시지 확인
    await expect(page.locator('[data-testid="share-success"]')).toBeVisible();
  });

  test('TC-SOCIAL-003: 공유 기능 (외부)', async ({ page }) => {
    // 1. 공유 버튼 클릭
    await page.locator('[data-testid="share-button"]').first().click();

    // 2. 외부 공유 선택
    await page.click('[data-testid="external-share"]');

    // 3. 소셜 미디어 선택
    await page.click('[data-testid="social-share-facebook"]');

    // 4. 새 탭에서 공유 페이지 열림 확인
    const newPage = await page.waitForEvent('popup');
    await expect(newPage).toHaveURL(/facebook.com/);
  });

  test('TC-SOCIAL-004: 팔로우/언팔로우 기능', async ({ page }) => {
    // 1. 사용자 프로필 클릭
    await page.locator('[data-testid="user-profile"]').first().click();

    // 2. 팔로우 버튼 클릭
    const followButton = page.locator('[data-testid="follow-button"]');
    await followButton.click();

    // 3. 팔로우 상태 변경 확인
    await expect(followButton).toContainText('팔로잉');

    // 4. 팔로잉 목록에서 확인
    await page.click('[data-testid="following-tab"]');
    await expect(page.locator('[data-testid="following-user"]')).toBeVisible();

    // 5. 언팔로우
    await followButton.click();
    await expect(followButton).toContainText('팔로우');
  });

  test('TC-SOCIAL-005: 실시간 알림 시스템', async ({ page, context }) => {
    // 1. 두 개의 브라우저 컨텍스트 생성 (다른 사용자 시뮬레이션)
    const user1Page = page;
    const user2Page = await context.newPage();

    // 2. 사용자 1이 게시물 작성
    await user1Page.goto('/community');
    await user1Page.click('[data-testid="create-post-button"]');
    await user1Page.fill('[data-testid="post-content"]', '새로운 게시물입니다.');
    await user1Page.click('[data-testid="publish-post"]');

    // 3. 사용자 2가 팔로우한 상태에서 알림 확인
    await user2Page.goto('/community');

    // 4. 알림 아이콘 클릭
    await user2Page.click('[data-testid="notification-bell"]');

    // 5. 새 알림 확인
    await expect(
      user2Page.locator('[data-testid="notification-item"]')
    ).toContainText('새로운 게시물');

    // 6. 알림 읽음 처리
    await user2Page.click('[data-testid="mark-as-read"]');
    await expect(
      user2Page.locator('[data-testid="notification-item"]')
    ).toHaveClass(/read/);
  });
});