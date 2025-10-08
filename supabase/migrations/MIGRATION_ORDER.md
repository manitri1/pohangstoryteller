# 📋 포항 스토리 텔러 마이그레이션 순서 가이드

## 🎯 **정리된 마이그레이션 파일 목록**

### ✅ **필수 마이그레이션 파일들 (순서대로 실행)**

1. **`20241219_000_drop_all_tables.sql`** - 개발용 테이블 삭제
   - 모든 기존 테이블과 데이터를 삭제
   - 개발 환경에서만 사용
   - ⚠️ **주의**: 프로덕션 환경에서는 절대 사용하지 마세요

2. **`20241219_001_initial_schema.sql`** - 기본 스키마 생성
   - 모든 테이블, 인덱스, RLS 정책 생성
   - PostGIS 확장 활성화
   - 기본 템플릿 데이터 삽입

3. **`20241219_002_sample_data.sql`** - 샘플 데이터 삽입
   - 기본 관광지 및 코스 데이터
   - PostGIS 좌표 타입 오류 수정됨
   - 경로 description 포함

4. **`20241219_003_pohang_tourist_spots.sql`** - 추가 관광지 데이터
   - 포항의 추가 관광지들
   - PostGIS 좌표 타입 오류 수정됨
   - 중복 방지 로직 포함

5. **`20241219_004_dev_users.sql`** - 개발용 사용자 생성
   - auth.users 테이블에 개발용 사용자 5명 생성
   - 비밀번호: `password123`
   - 개발 환경에서만 사용

6. **`20241219_005_user_engagement_data.sql`** - 사용자 참여 데이터
   - 프로필, 스탬프, 앨범, 게시물 등 사용자 데이터
   - 20241219_004_dev_users.sql 이후에 실행 필요

7. **`20241219_006_add_routes_description.sql`** - routes 테이블 description 컬럼 추가
   - API에서 사용하는 description 컬럼 추가
   - 기존 데이터에 기본 설명 설정

## 🚀 **실행 방법**

### **방법 1: 개별 파일 실행 (권장)**

Supabase 대시보드의 SQL Editor에서 다음 순서대로 실행:

```sql
-- 1단계: 개발 환경 초기화 (선택사항)
-- 20241219_000_drop_all_tables.sql 내용 복사하여 실행

-- 2단계: 기본 스키마 생성
-- 20241219_001_initial_schema.sql 내용 복사하여 실행

-- 3단계: 샘플 데이터 삽입
-- 20241219_002_sample_data.sql 내용 복사하여 실행

-- 4단계: 추가 관광지 데이터
-- 20241219_003_pohang_tourist_spots.sql 내용 복사하여 실행

-- 5단계: 개발용 사용자 생성
-- 20241219_004_dev_users.sql 내용 복사하여 실행

-- 6단계: 사용자 참여 데이터
-- 20241219_005_user_engagement_data.sql 내용 복사하여 실행

-- 7단계: routes description 컬럼 추가
-- 20241219_006_add_routes_description.sql 내용 복사하여 실행
```

### **방법 2: 통합 실행 (고급)**

모든 파일을 하나의 SQL 파일로 통합하여 실행할 수도 있습니다.

## ⚠️ **주의사항**

### **실행 순서 중요**

- 파일들은 반드시 번호 순서대로 실행해야 합니다
- 순서를 바꾸면 외래키 제약조건 오류가 발생할 수 있습니다

### **개발 vs 프로덕션**

- `20241219_000_drop_all_tables.sql`: 개발 환경에서만 사용
- `20241219_004_dev_users.sql`: 개발 환경에서만 사용
- 나머지 파일들은 프로덕션에서도 사용 가능

### **PostGIS 좌표 타입**

- 모든 좌표 데이터는 `ST_GeomFromText('POINT(경도 위도)', 4326)` 형식 사용
- `POINT(경도, 위도)` 형식은 오류 발생

## 🔧 **문제 해결**

### **PostGIS 좌표 오류**

```
ERROR: 42804: column "coordinates" is of type geometry but expression is of type point
```

- **해결**: `ST_GeomFromText('POINT(경도 위도)', 4326)` 형식 사용

### **마이그레이션 순서 오류**

```
ERROR: P0001: 필수 관광지 데이터가 없습니다. 이전 마이그레이션 파일들을 먼저 실행하세요.
```

- **해결**: 파일들을 번호 순서대로 실행

### **외래키 제약조건 오류**

```
ERROR: 23503: insert or update on table "profiles" violates foreign key constraint
```

- **해결**: `20241219_004_dev_users.sql`을 먼저 실행

## 📊 **완료 후 확인사항**

마이그레이션 완료 후 다음 쿼리로 데이터 확인:

```sql
-- 데이터 개수 확인
SELECT
    'locations' as table_name, COUNT(*) as count FROM locations
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'routes', COUNT(*) FROM routes
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles;

-- 좌표 데이터 확인
SELECT name, ST_AsText(coordinates) as coordinates
FROM locations
LIMIT 5;
```

## 🎉 **완료**

모든 마이그레이션이 성공적으로 완료되면:

- ✅ PostGIS 좌표 타입 오류 해결
- ✅ 모든 테이블과 데이터 생성
- ✅ API에서 실제 데이터베이스 사용 가능
- ✅ 프론트엔드와 백엔드 완전 연동
