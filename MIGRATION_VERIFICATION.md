# 🔍 마이그레이션 실행 확인 가이드

## 현재 상황

- 마이그레이션을 실행했지만 여전히 목업 데이터가 표시됨
- API가 데이터베이스에서 코스 데이터를 찾지 못함

## 단계별 확인 방법

### 1단계: Supabase 대시보드에서 직접 확인

1. **Supabase 대시보드** → **Table Editor** 접속
2. 다음 테이블들이 존재하는지 확인:
   - `courses` 테이블
   - `locations` 테이블
   - `routes` 테이블

### 2단계: 데이터 존재 여부 확인

**Table Editor**에서 각 테이블을 클릭하여 데이터가 있는지 확인:

```sql
-- courses 테이블 데이터 확인
SELECT COUNT(*) FROM courses;

-- locations 테이블 데이터 확인
SELECT COUNT(*) FROM locations;

-- routes 테이블 데이터 확인
SELECT COUNT(*) FROM routes;
```

### 3단계: 마이그레이션 재실행

만약 테이블이 없거나 데이터가 없다면:

1. **SQL Editor** 접속
2. 다음 순서로 마이그레이션 재실행:

```sql
-- 1. 모든 테이블 삭제 (주의!)
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS course_locations CASCADE;
DROP TABLE IF EXISTS course_categories CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 2. 기본 스키마 생성
-- 파일: 20241219_001_initial_schema.sql 내용 복사해서 실행

-- 3. 샘플 데이터 삽입
-- 파일: 20241219_002_sample_data.sql 내용 복사해서 실행

-- 4. 포항 관광지 데이터
-- 파일: 20241219_003_pohang_tourist_spots.sql 내용 복사해서 실행
```

### 4단계: 환경 변수 확인

`.env.local` 파일에 다음 변수들이 설정되어 있는지 확인:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 5단계: 개발 서버 재시작

```bash
# 개발 서버 완전 종료 후 재시작
npm run dev
```

## 예상 결과

마이그레이션이 성공적으로 실행되면:

- ✅ `courses` 테이블에 10개 이상의 코스 데이터
- ✅ `locations` 테이블에 20개 이상의 관광지 데이터
- ✅ API가 데이터베이스 데이터를 반환

## 문제가 계속되는 경우

1. **Supabase 프로젝트 설정** 확인
2. **RLS (Row Level Security)** 정책 확인
3. **API 키 권한** 확인
4. **네트워크 연결** 상태 확인
