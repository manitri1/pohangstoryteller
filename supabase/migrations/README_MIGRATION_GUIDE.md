# Supabase 마이그레이션 적용 가이드

## 🚨 현재 상황

- API에서 `PGRST205` 오류 발생
- `public.courses` 테이블을 찾을 수 없음
- 마이그레이션 파일이 데이터베이스에 적용되지 않음

## 📋 해결 단계

### 1. Supabase 대시보드 접속

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `dfnqxobgwxmxywlpwvov`
3. SQL Editor 메뉴 클릭

### 2. 마이그레이션 파일 순서대로 적용

다음 순서로 SQL 파일을 복사하여 실행:

#### 순서 1: 테이블 삭제 (필요시)

```sql
-- 20241219_000_drop_all_tables.sql 내용 복사
```

#### 순서 2: 스키마 생성

```sql
-- 20241219_001_initial_schema.sql 내용 복사
```

#### 순서 3: 샘플 데이터

```sql
-- 20241219_002_sample_data.sql 내용 복사
```

#### 순서 4: 관광지 데이터

```sql
-- 20241219_003_pohang_tourist_spots.sql 내용 복사
```

#### 순서 5: 개발자 사용자

```sql
-- 20241219_004_dev_users.sql 내용 복사
```

#### 순서 6: 사용자 참여 데이터

```sql
-- 20241219_005_user_engagement_data.sql 내용 복사
```

### 3. 실행 후 확인

- Table Editor에서 `courses` 테이블 확인
- 데이터가 정상적으로 삽입되었는지 확인

## ⚠️ 주의사항

- 각 마이그레이션을 순서대로 실행
- 오류 발생 시 이전 단계부터 다시 실행
- 데이터가 이미 있는 경우 중복 오류 발생 가능

## 🔧 대안 방법

Supabase CLI 사용 (권장):

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 마이그레이션 적용
supabase db push
```
