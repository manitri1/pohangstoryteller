# 🚨 긴급 마이그레이션 수정 가이드

## 현재 상황

- API가 데이터베이스에 연결되지 않음
- UUID 형식 오류 발생
- 테이블이 존재하지 않거나 데이터가 없음

## 즉시 해결 방법

### 1단계: Supabase 대시보드 접속

1. [Supabase 대시보드](https://supabase.com/dashboard) 로그인
2. 프로젝트 선택
3. 좌측 메뉴 → **"SQL Editor"** 클릭

### 2단계: 모든 테이블 삭제 후 재생성

```sql
-- 기존 테이블 모두 삭제
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS course_locations CASCADE;
DROP TABLE IF EXISTS course_categories CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS stamps CASCADE;
DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS shares CASCADE;

-- 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

### 3단계: 기본 스키마 생성

```sql
-- 파일: 20241219_001_initial_schema.sql
-- 전체 내용을 복사해서 실행
```

### 4단계: 샘플 데이터 삽입

```sql
-- 파일: 20241219_002_sample_data.sql
-- 전체 내용을 복사해서 실행
```

### 5단계: 포항 관광지 데이터

```sql
-- 파일: 20241219_003_pohang_tourist_spots.sql
-- 전체 내용을 복사해서 실행
```

## 실행 후 확인

### 1. 테이블 생성 확인

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 2. 데이터 확인

```sql
-- 코스 데이터 확인
SELECT COUNT(*) FROM courses;

-- 관광지 데이터 확인
SELECT COUNT(*) FROM locations;

-- 경로 데이터 확인
SELECT COUNT(*) FROM routes;
```

### 3. 개발 서버 재시작

```bash
npm run dev
```

## 예상 결과

- ✅ API가 데이터베이스 데이터를 반환
- ✅ UUID 형식 오류 해결
- ✅ 목업 데이터 대신 실제 데이터 표시

## 문제가 계속되는 경우

1. Supabase 프로젝트 설정 확인
2. 환경 변수 재설정
3. 브라우저 캐시 삭제
4. 개발 서버 완전 재시작
