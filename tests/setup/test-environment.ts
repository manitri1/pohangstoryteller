import { test as base, expect, Page } from '@playwright/test';

// 테스트 데이터 인터페이스
interface TestUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  verified?: boolean;
}

interface TestPost {
  id: string;
  content: string;
  author: TestUser;
  images?: string[];
  hashtags?: string[];
  location?: string;
}

// 테스트 픽스처
export const test = base.extend<{
  testUser: TestUser;
  testPost: TestPost;
  authenticatedPage: Page;
}>({
  // 테스트 사용자 생성
  testUser: async ({ page }, use) => {
    const user: TestUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      name: '테스트 사용자',
      avatar: 'https://picsum.photos/100/100?random=test',
      verified: true,
    };

    // 사용자 로그인 시뮬레이션
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', user.email);
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    await use(user);
  },

  // 테스트 게시물 생성
  testPost: async ({ testUser }, use) => {
    const post: TestPost = {
      id: 'test-post-123',
      content: '테스트 게시물입니다.',
      author: testUser,
      images: ['https://picsum.photos/400/300?random=1'],
      hashtags: ['테스트', '포항'],
      location: '영일대 해수욕장',
    };

    await use(post);
  },

  // 인증된 페이지
  authenticatedPage: async ({ page, testUser }, use) => {
    // 로그인 상태 설정
    await page.goto('/community');

    // 로컬 스토리지에 사용자 정보 저장
    await page.evaluate((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('auth-token', 'mock-auth-token');
    }, testUser);

    await use(page);
  },
});

// 테스트 데이터베이스 설정
export async function setupTestDatabase() {
  // Supabase 테스트 데이터베이스 설정
  const testData = {
    users: [
      {
        id: 'test-user-1',
        email: 'user1@test.com',
        name: '테스트 사용자 1',
        avatar: 'https://picsum.photos/100/100?random=1',
        is_verified: true,
      },
      {
        id: 'test-user-2',
        email: 'user2@test.com',
        name: '테스트 사용자 2',
        avatar: 'https://picsum.photos/100/100?random=2',
        is_verified: false,
      },
    ],
    posts: [
      {
        id: 'test-post-1',
        author_id: 'test-user-1',
        content: '첫 번째 테스트 게시물',
        post_type: 'text',
        hashtags: ['테스트', '포항'],
        is_public: true,
        like_count: 5,
        comment_count: 2,
        share_count: 1,
        bookmark_count: 3,
      },
      {
        id: 'test-post-2',
        author_id: 'test-user-2',
        content: '두 번째 테스트 게시물',
        post_type: 'image',
        hashtags: ['바다', '여행'],
        is_public: true,
        like_count: 10,
        comment_count: 5,
        share_count: 2,
        bookmark_count: 7,
      },
    ],
    comments: [
      {
        id: 'test-comment-1',
        post_id: 'test-post-1',
        author_id: 'test-user-2',
        content: '좋은 게시물이네요!',
        like_count: 2,
      },
    ],
  };

  return testData;
}

// 테스트 데이터 정리
export async function cleanupTestDatabase() {
  // 테스트 데이터 삭제
  console.log('테스트 데이터 정리 중...');
}

// 테스트 헬퍼 함수들
export const testHelpers = {
  // 게시물 생성
  async createPost(
    page: Page,
    content: string,
    options?: {
      images?: string[];
      hashtags?: string[];
      location?: string;
    }
  ) {
    await page.click('[data-testid="create-post-button"]');
    await page.fill('[data-testid="post-content"]', content);

    if (options?.hashtags) {
      for (const tag of options.hashtags) {
        await page.fill('[data-testid="hashtag-input"]', tag);
        await page.press('[data-testid="hashtag-input"]', 'Enter');
      }
    }

    if (options?.location) {
      await page.fill('[data-testid="location-input"]', options.location);
    }

    if (options?.images) {
      await page.setInputFiles('[data-testid="file-input"]', options.images);
    }

    await page.click('[data-testid="publish-post"]');
  },

  // 좋아요 토글
  async toggleLike(page: Page, postId: string) {
    await page.click(`[data-testid="like-button-${postId}"]`);
  },

  // 댓글 작성
  async addComment(page: Page, postId: string, content: string) {
    await page.click(`[data-testid="comment-button-${postId}"]`);
    await page.fill('[data-testid="comment-input"]', content);
    await page.click('[data-testid="submit-comment"]');
  },

  // 북마크 토글
  async toggleBookmark(page: Page, postId: string) {
    await page.click(`[data-testid="bookmark-button-${postId}"]`);
  },

  // 공유
  async sharePost(
    page: Page,
    postId: string,
    platform: 'internal' | 'facebook' | 'twitter' | 'kakao'
  ) {
    await page.click(`[data-testid="share-button-${postId}"]`);
    await page.click(`[data-testid="share-${platform}"]`);
  },
};

export { expect };