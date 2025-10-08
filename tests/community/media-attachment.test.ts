import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('미디어 첨부 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community');
  });

  test('TC-POST-002: 이미지 첨부 성공', async ({ page }) => {
    // 1. 게시물 작성 모달 열기
    await page.click('[data-testid="create-post-button"]');

    // 2. 이미지 업로드 버튼 클릭
    await page.click('[data-testid="upload-image-button"]');

    // 3. 이미지 파일 선택
    const imagePath = path.join(__dirname, '../fixtures/test-image.jpg');
    await page.setInputFiles('[data-testid="file-input"]', imagePath);

    // 4. 이미지 미리보기 확인
    await expect(page.locator('[data-testid="image-preview"]')).toBeVisible();

    // 5. 게시물 발행
    await page.fill(
      '[data-testid="post-content"]',
      '테스트 이미지가 첨부된 게시물'
    );
    await page.click('[data-testid="publish-post"]');

    // 6. 게시물에 이미지가 표시되는지 확인
    await expect(page.locator('[data-testid="post-image"]')).toBeVisible();
  });

  test('TC-POST-002: 다중 이미지 첨부', async ({ page }) => {
    await page.click('[data-testid="create-post-button"]');

    // 여러 이미지 업로드
    const imagePaths = [
      path.join(__dirname, '../fixtures/test-image-1.jpg'),
      path.join(__dirname, '../fixtures/test-image-2.jpg'),
      path.join(__dirname, '../fixtures/test-image-3.jpg'),
    ];

    await page.setInputFiles('[data-testid="file-input"]', imagePaths);

    // 이미지 개수 확인
    await expect(page.locator('[data-testid="image-preview"]')).toHaveCount(3);

    // +2 표시 확인 (4개 이상일 때)
    await expect(
      page.locator('[data-testid="more-images-indicator"]')
    ).toContainText('+2');
  });

  test('TC-POST-002: 비디오 첨부', async ({ page }) => {
    await page.click('[data-testid="create-post-button"]');

    // 비디오 업로드
    const videoPath = path.join(__dirname, '../fixtures/test-video.mp4');
    await page.setInputFiles('[data-testid="file-input"]', videoPath);

    // 비디오 미리보기 확인
    await expect(page.locator('[data-testid="video-preview"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="video-play-button"]')
    ).toBeVisible();
  });

  test('TC-POST-002: 파일 크기 제한 테스트', async ({ page }) => {
    await page.click('[data-testid="create-post-button"]');

    // 큰 파일 업로드 시도
    const largeImagePath = path.join(__dirname, '../fixtures/large-image.jpg');
    await page.setInputFiles('[data-testid="file-input"]', largeImagePath);

    // 에러 메시지 확인
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      '파일 크기가 너무 큽니다'
    );
  });

  test('TC-POST-002: 지원하지 않는 파일 형식', async ({ page }) => {
    await page.click('[data-testid="create-post-button"]');

    // 지원하지 않는 파일 업로드
    const unsupportedPath = path.join(__dirname, '../fixtures/test-file.txt');
    await page.setInputFiles('[data-testid="file-input"]', unsupportedPath);

    // 에러 메시지 확인
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      '지원하지 않는 파일 형식입니다'
    );
  });
});