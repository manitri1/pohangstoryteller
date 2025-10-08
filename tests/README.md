# 포항 스토리텔러 테스트 가이드

## 🧪 테스트 실행 방법

### 1. 환경 설정

```bash
# 의존성 설치
npm install

# Playwright 설치
npx playwright install

# 테스트 데이터베이스 설정
npm run test:setup
```

### 2. 커뮤니티 기능 테스트 실행

```bash
# 전체 커뮤니티 테스트 실행
npm run test:community

# 특정 테스트 케이스 실행
npx playwright test tests/community/post-creation.test.ts
npx playwright test tests/community/media-attachment.test.ts
npx playwright test tests/community/social-interaction.test.ts

# UI 모드로 테스트 실행 (디버깅용)
npm run test:ui

# 헤드 모드로 테스트 실행 (브라우저 창 표시)
npm run test:headed

# 디버그 모드로 테스트 실행
npm run test:debug
```

### 3. 테스트 결과 확인

```bash
# 테스트 리포트 보기
npm run test:report

# JSON 결과 파일 확인
cat test-results/results.json

# JUnit 결과 파일 확인
cat test-results/results.xml
```

## 📋 테스트 케이스별 실행 방법

### TC-POST-001: 게시물 작성 및 수정

```bash
npx playwright test tests/community/post-creation.test.ts --grep "TC-POST-001"
```

### TC-POST-002: 미디어 첨부 기능

```bash
npx playwright test tests/community/media-attachment.test.ts --grep "TC-POST-002"
```

### TC-SOCIAL-001: 좋아요/북마크 기능

```bash
npx playwright test tests/community/social-interaction.test.ts --grep "TC-SOCIAL-001"
```

### TC-SOCIAL-002: 댓글 작성 및 수정

```bash
npx playwright test tests/community/social-interaction.test.ts --grep "TC-SOCIAL-002"
```

### TC-SOCIAL-003: 공유 기능

```bash
npx playwright test tests/community/social-interaction.test.ts --grep "TC-SOCIAL-003"
```

### TC-SOCIAL-004: 팔로우/언팔로우 기능

```bash
npx playwright test tests/community/social-interaction.test.ts --grep "TC-SOCIAL-004"
```

### TC-SOCIAL-005: 실시간 알림 시스템

```bash
npx playwright test tests/community/social-interaction.test.ts --grep "TC-SOCIAL-005"
```

## 🔧 테스트 데이터 설정

### 1. 테스트 사용자 생성

```typescript
// tests/fixtures/test-users.json
{
  "users": [
    {
      "id": "test-user-1",
      "email": "user1@test.com",
      "name": "테스트 사용자 1",
      "avatar": "https://picsum.photos/100/100?random=1",
      "verified": true
    }
  ]
}
```

### 2. 테스트 미디어 파일

```bash
# 테스트 이미지 생성
mkdir -p tests/fixtures
# 테스트 이미지 파일들을 tests/fixtures/ 디렉토리에 배치
```

### 3. 테스트 데이터베이스 설정

```sql
-- Supabase 테스트 데이터베이스에 샘플 데이터 삽입
INSERT INTO profiles (id, email, name, avatar_url, is_verified) VALUES
('test-user-1', 'user1@test.com', '테스트 사용자 1', 'https://picsum.photos/100/100?random=1', true);

INSERT INTO posts (id, author_id, content, post_type, hashtags, is_public) VALUES
('test-post-1', 'test-user-1', '테스트 게시물', 'text', ARRAY['테스트'], true);
```

## 📊 테스트 결과 분석

### 1. 성공률 확인

- 전체 테스트 케이스 중 통과한 비율
- 실패한 테스트 케이스의 원인 분석

### 2. 성능 지표

- 각 테스트 케이스의 실행 시간
- 메모리 사용량
- 네트워크 요청 수

### 3. 버그 리포트

- 실패한 테스트 케이스의 스크린샷
- 에러 로그 및 스택 트레이스
- 재현 단계

## 🚀 CI/CD 통합

### GitHub Actions 설정

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install
      - run: npm run test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📝 테스트 보고서 작성

### 1. 일일 테스트 보고서

- 실행한 테스트 케이스 수
- 통과/실패 현황
- 발견된 버그 목록
- 다음 날 계획

### 2. 주간 테스트 보고서

- 전체 테스트 진행률
- 주요 이슈 및 해결 방안
- 성능 분석 결과
- 사용자 피드백

### 3. 최종 테스트 보고서

- 전체 테스트 결과 요약
- 성능 및 품질 지표
- 발견된 이슈 및 해결 상태
- 프로덕션 배포 권고사항
