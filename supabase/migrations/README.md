# 포항 스토리텔러 마이그레이션 가이드

## 📋 개요

포항 스토리텔러 프로젝트의 Supabase 데이터베이스 마이그레이션 파일들을 관리하는 가이드입니다.

## 🗂️ 마이그레이션 파일 구조

### 📁 통합 마이그레이션 파일 (2025-01-10)

| 파일명                                          | 설명                              | 의존성                   |
| ----------------------------------------------- | --------------------------------- | ------------------------ |
| `20250110_000_cleanup_existing_tables.sql`      | 기존 테이블 정리 (선택사항)       | 없음                     |
| `20250110_001_initial_schema.sql`               | 기본 스키마 (테이블, 인덱스, RLS) | 없음                     |
| `20250110_002_sample_data.sql`                  | 샘플 데이터 삽입                  | `001_initial_schema.sql` |
| `20250110_003_community_functions.sql`          | 커뮤니티 함수들                   | `001_initial_schema.sql` |
| `20250110_004_ai_recommendation_system.sql`     | AI 추천 시스템                    | `001_initial_schema.sql` |
| `20250110_010_album_system.sql`                 | 앨범 시스템 완전 구현             | `001_initial_schema.sql` |
| `20250110_011_fix_existing_album_templates.sql` | 기존 테이블 호환성 수정           | `010_album_system.sql`   |
| `20250110_005_execution_guide.sql`              | 실행 가이드 및 검증               | 모든 파일                |

### 📁 제거된 임시 파일들

> ⚠️ **주의**: 다음 파일들은 개발 중 임시 해결책이었으며 제거되었습니다.

- `20250110_006_fix_rls_policies.sql` - RLS 정책 수정 (임시 해결책)
- `20250110_007_auth_integration.sql` - Next-Auth 통합 (임시 해결책)
- `20250110_008_disable_rls_temporarily.sql` - 임시 RLS 비활성화
- `20250110_009_emergency_disable_rls.sql` - 긴급 RLS 비활성화

### 📁 레거시 마이그레이션 파일 (보관용)

> ⚠️ **주의**: 다음 파일들은 통합되었으며 더 이상 사용하지 않습니다.

- `004_courses_data.sql` → `20250110_002_sample_data.sql`에 통합
- `202510109_000_drop_all_tables.sql` → `20250110_001_initial_schema.sql`에 통합
- `202510109_001_initial_schema.sql` → `20250110_001_initial_schema.sql`에 통합
- `202510109_002_course_categories.sql` → `20250110_002_sample_data.sql`에 통합
- `202510109_003_locations_data.sql` → `20250110_002_sample_data.sql`에 통합
- `202510109_004_courses_data.sql` → `20250110_002_sample_data.sql`에 통합
- `202510109_005_templates_data.sql` → `20250110_002_sample_data.sql`에 통합
- `202510109_006_user_engagement_data.sql` → `20250110_002_sample_data.sql`에 통합
- `202510109_007_community_functions.sql` → `20250110_003_community_functions.sql`에 통합
- `202510109_008_stamp_system.sql` → `20250110_001_initial_schema.sql`에 통합
- `202510109_009_album_system.sql` → `20250110_001_initial_schema.sql`에 통합
- `202510109_010_souvenir_system.sql` → `20250110_001_initial_schema.sql`에 통합
- `202510109_011_community_enhancements.sql` → `20250110_001_initial_schema.sql`에 통합
- `202510109_012_final_cleanup.sql` → `20250110_001_initial_schema.sql`에 통합
- `202510109_013_course_recommendation_enhancement.sql` → `20250110_004_ai_recommendation_system.sql`에 통합

## 🚀 실행 방법

### 방법 1: Supabase Dashboard (권장)

1. **Supabase Dashboard** → **SQL Editor**로 이동
2. 다음 순서로 마이그레이션 파일들을 실행:

```sql
-- 0단계: 기존 테이블 정리 (선택사항)
-- 20250110_000_cleanup_existing_tables.sql 실행

-- 1단계: 기본 스키마 생성
-- 20250110_001_initial_schema.sql 실행

-- 2단계: 샘플 데이터 삽입
-- 20250110_002_sample_data.sql 실행

-- 3단계: 커뮤니티 함수 생성
-- 20250110_003_community_functions.sql 실행

-- 4단계: AI 추천 시스템 생성
-- 20250110_004_ai_recommendation_system.sql 실행

-- 5단계: 앨범 시스템 구현
-- 20250110_010_album_system.sql 실행

-- 6단계: 기존 테이블 호환성 수정 (필요시)
-- 20250110_011_fix_existing_album_templates.sql 실행

-- 7단계: 실행 가이드 및 검증
-- 20250110_005_execution_guide.sql 실행
```

### 방법 2: Supabase CLI

```bash
# 프로젝트 루트에서 실행
supabase db reset
supabase db push
```

### 방법 3: 개별 실행

각 마이그레이션 파일을 개별적으로 실행할 수 있습니다.

## 📊 데이터베이스 스키마

### 🏗️ 주요 테이블

#### 사용자 관련

- `profiles` - 사용자 프로필
- `user_preferences` - 사용자 선호도

#### 코스 및 스토리 관련

- `course_categories` - 코스 카테고리
- `courses` - 코스 정보
- `locations` - 방문지 정보
- `course_locations` - 코스-방문지 연결
- `routes` - 경로 정보

#### 스탬프 시스템

- `stamps` - 스탬프 정보
- `user_stamps` - 사용자 스탬프
- `stamp_acquisitions` - 스탬프 획득 기록
- `stamp_collections` - 스탬프 컬렉션
- `collection_stamps` - 컬렉션 아이템
- `stamp_achievements` - 스탬프 업적

#### 앨범 시스템

- `albums` - 앨범
- `album_items` - 앨범 아이템
- `album_templates` - 앨범 템플릿
- `album_shares` - 앨범 공유
- `media_files` - 미디어 파일

#### 커뮤니티 시스템

- `posts` - 게시물
- `likes` - 좋아요
- `comments` - 댓글
- `bookmarks` - 북마크
- `comment_likes` - 댓글 좋아요

#### 기념품 시스템

- `souvenirs` - 기념품 정보
- `souvenir_orders` - 기념품 주문

#### AI 추천 시스템

- `user_course_interactions` - 사용자 코스 상호작용
- `course_recommendations` - 코스 추천
- `user_preferences` - 사용자 선호도

### 🔐 보안 (RLS)

모든 테이블에 Row Level Security (RLS)가 적용되어 있습니다:

- **사용자 데이터**: 본인 데이터만 접근 가능
- **공개 데이터**: 모든 사용자가 읽기 가능
- **커뮤니티**: 공개 게시물은 모든 사용자가 읽기 가능

## 🛠️ 함수 및 기능

### 🔍 커뮤니티 함수

- `search_posts()` - 게시물 검색
- `get_popular_posts()` - 인기 게시물 조회
- `get_user_activity_stats()` - 사용자 활동 통계
- `get_location_post_stats()` - 위치별 게시물 통계
- `get_post_details()` - 게시물 상세 정보
- `get_post_comments()` - 게시물 댓글 조회
- `get_user_feed()` - 사용자 피드

### 🤖 AI 추천 함수

- `get_collaborative_recommendations()` - 협업 필터링 추천
- `get_content_based_recommendations()` - 콘텐츠 기반 추천
- `get_hybrid_recommendations()` - 하이브리드 추천
- `log_recommendation()` - 추천 로그 기록
- `update_user_preferences()` - 사용자 선호도 업데이트
- `analyze_recommendation_performance()` - 추천 성능 분석

## 📈 샘플 데이터

### 🏷️ 카테고리 (6개)

- 자연경관, 역사여행, 골목산책, 맛집탐방, 가족여행, 커플여행

### 📍 방문지 (10개)

- 죽도시장, 호미곶, 포항제철소, 포항공과대학교, 포항시립미술관, 영일대해수욕장, 포항야생탐사관, 포항운하, 포항시청, 포항역

### 🗺️ 코스 (6개)

- 포항 해안선 드라이브, 포항 역사 탐방, 포항 골목길 산책, 포항 맛집 투어, 포항 가족 체험, 포항 로맨틱 데이트

### 🎁 기념품 템플릿 (4개)

- 포항 스탬프 앨범, 호미곶 엽서 세트, 포항 맛집 가이드북, 포항 야생탐사관 스티커팩

### 📚 앨범 템플릿 (3개)

- 기본 그리드, 타임라인, 여행 앨범

## 🔧 문제 해결

### 일반적인 오류

#### "relation does not exist"

- **원인**: 마이그레이션 순서 문제
- **해결**: 의존성 있는 테이블이 먼저 생성되었는지 확인

#### "permission denied"

- **원인**: 권한 부족
- **해결**: Supabase에서 적절한 권한 설정 확인

#### "duplicate key value violates unique constraint"

- **원인**: 중복 데이터 삽입
- **해결**: `ON CONFLICT DO NOTHING` 적용 확인

#### "ON CONFLICT specification mismatch"

- **원인**: `ON CONFLICT` 절에서 참조하는 컬럼이 UNIQUE 제약조건이 없음
- **해결**: 테이블에 적절한 UNIQUE 제약조건 추가 또는 `IF NOT EXISTS` 조건문 사용

#### "template_type column does not exist"

- **원인**: 기존 테이블에 `template_type` 컬럼이 없음
- **해결**: `20250110_011_fix_existing_album_templates.sql` 실행하여 누락된 컬럼 추가

#### "policy already exists"

- **원인**: RLS 정책이 이미 존재함
- **해결**: `DROP POLICY IF EXISTS` 문을 `CREATE POLICY` 전에 추가

#### "column does not exist"

- **원인**: 존재하지 않는 컬럼 참조
- **해결**: 테이블 스키마 확인 후 올바른 컬럼명 사용

#### "syntax error at or near 'week'"

- **원인**: PostgreSQL에서 `INTERVAL '1 week'` 구문 지원 안함
- **해결**: `INTERVAL '7 days'` 사용

#### "parameter name used more than once"

- **원인**: 함수 파라미터와 반환 컬럼명이 동일
- **해결**: 반환 컬럼명을 다른 이름으로 변경

### 데이터 정합성 확인

```sql
-- 테이블 생성 확인
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;

-- 샘플 데이터 확인
SELECT 'courses' as table_name, COUNT(*) as record_count FROM courses
UNION ALL
SELECT 'locations', COUNT(*) FROM locations
UNION ALL
SELECT 'course_categories', COUNT(*) FROM course_categories
UNION ALL
SELECT 'stamps', COUNT(*) FROM stamps
UNION ALL
SELECT 'souvenirs', COUNT(*) FROM souvenirs
UNION ALL
SELECT 'albums', COUNT(*) FROM albums
UNION ALL
SELECT 'album_templates', COUNT(*) FROM album_templates;

-- 함수 생성 확인
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' ORDER BY routine_name;

-- RLS 정책 확인
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## 📚 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [PostGIS 공식 문서](https://postgis.net/documentation/)

## 🤝 기여

마이그레이션 파일을 수정하거나 새로운 기능을 추가할 때는 다음 사항을 준수해주세요:

1. **Supabase Migration SQL Guideline** 준수
2. **의존성 순서** 확인
3. **RLS 정책** 적용
4. **인덱스 최적화** 고려
5. **샘플 데이터** 포함

## 📞 지원

문제가 발생하거나 질문이 있으시면 다음을 확인해주세요:

1. 이 README 파일의 문제 해결 섹션
2. `20250110_005_execution_guide.sql` 파일의 실행 가이드
3. Supabase Dashboard의 로그 확인

---

**포항 스토리텔러 팀**  
_2025년 1월 10일_
