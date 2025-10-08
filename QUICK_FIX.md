# 🚀 빠른 해결 방법

## 현재 상황

- API가 목업 데이터를 반환하고 있음
- 데이터베이스에 실제 코스 데이터가 없음

## 해결 방법

### 1단계: Supabase 대시보드 접속

1. [Supabase 대시보드](https://supabase.com/dashboard) 로그인
2. 프로젝트 선택
3. 좌측 메뉴 → **"SQL Editor"** 클릭

### 2단계: 마이그레이션 실행

다음 파일들을 **순서대로** 실행:

```sql
-- 1. 기본 스키마 생성
-- 파일: supabase/migrations/20241219_001_initial_schema.sql
-- 내용을 복사해서 실행

-- 2. 샘플 데이터 삽입
-- 파일: supabase/migrations/20241219_002_sample_data.sql
-- 내용을 복사해서 실행

-- 3. 포항 관광지 데이터
-- 파일: supabase/migrations/20241219_003_pohang_tourist_spots.sql
-- 내용을 복사해서 실행
```

### 3단계: 확인

실행 후 다음 쿼리로 확인:

```sql
SELECT COUNT(*) FROM courses;
SELECT COUNT(*) FROM locations;
```

### 4단계: 개발 서버 재시작

```bash
npm run dev
```

## 예상 결과

- ✅ 데이터베이스의 실제 코스 데이터 표시
- ✅ 목업 데이터 대신 실제 포항 관광지 정보 표시
- ✅ 사용자 선택에 따른 맞춤형 코스 제공

## 문제가 계속되는 경우

1. 브라우저 캐시 삭제
2. 개발 서버 완전 재시작
3. Supabase 연결 상태 확인
