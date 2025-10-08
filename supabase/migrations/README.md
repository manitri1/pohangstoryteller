# 포항 스토리 텔러 Supabase Migration 가이드

## 📌 Migration 파일 구조

```
supabase/migrations/
├── 20241219_initial_schema.sql           # 초기 데이터베이스 스키마
├── 20241219_sample_data.sql              # 기본 샘플 데이터
├── 20241219_expanded_sample_data.sql     # 확장된 샘플 데이터
├── 20241219_user_engagement_data.sql    # 사용자 참여 데이터
└── README.md                             # 이 파일
```

## 📌 Migration 실행 방법

### 1. Supabase CLI 설치

```bash
npm install -g supabase
```

### 2. Supabase 프로젝트 초기화

```bash
supabase init
```

### 3. Supabase 로그인

```bash
supabase login
```

### 4. Migration 실행

```bash
# 로컬 개발 환경에서 실행
supabase db reset

# 또는 특정 migration만 실행
supabase db push
```

## 📌 데이터베이스 스키마 개요

### 🗂️ 주요 테이블

#### 사용자 관련

- `profiles`: 사용자 프로필 정보
- `user_preferences`: 사용자 선호도 설정

#### 코스 및 스토리 관련

- `course_categories`: 코스 카테고리 (맛집탐방, 역사여행, 자연경관, 골목산책)
- `courses`: 코스 정보
- `locations`: 방문지 정보
- `course_locations`: 코스-방문지 연결
- `routes`: 경로 정보

#### 스탬프 및 경험 기록

- `stamps`: 스탬프 획득 기록
- `albums`: 앨범 정보
- `album_items`: 앨범 아이템

#### 커뮤니티 관련

- `posts`: 게시물
- `likes`: 좋아요
- `comments`: 댓글
- `shares`: 공유

#### DIY 기념품 관련

- `templates`: 템플릿
- `orders`: 주문
- `order_items`: 주문 아이템

#### AI 챗봇 관련

- `chat_sessions`: 채팅 세션
- `chat_messages`: 채팅 메시지

## 📌 보안 설정

### RLS (Row Level Security) 정책

- 모든 테이블에 RLS 활성화
- 사용자별 데이터 접근 제어
- 공개 데이터와 개인 데이터 분리

### 주요 정책

- **사용자 프로필**: 본인 데이터만 접근 가능
- **코스/방문지**: 공개 데이터로 모든 사용자 접근 가능
- **스탬프/앨범**: 본인 데이터만 접근 가능
- **게시물**: 공개 게시물은 모든 사용자 접근 가능
- **주문**: 본인 주문만 접근 가능

## 📌 인덱스 최적화

### 성능 최적화 인덱스

- `courses`: 카테고리, 추천 여부, 활성 상태
- `locations`: 좌표 (GIST 인덱스)
- `stamps`: 사용자, 방문지
- `posts`: 작성자, 공개 여부, 해시태그 (GIN 인덱스)
- `orders`: 사용자, 상태

## 📌 샘플 데이터

### 포함된 샘플 데이터

#### 기본 샘플 데이터 (20241219_sample_data.sql)

- **방문지**: 영일대 해수욕장, 포항운하, 포항시립미술관 등 8개
- **코스**: 7개의 다양한 테마 코스
- **카테고리**: 맛집탐방, 역사여행, 자연경관, 골목산책
- **템플릿**: 포항4컷, 롤링페이퍼, 포토북 기본 템플릿

#### 확장된 샘플 데이터 (20241219_expanded_sample_data.sql)

- **방문지**: 20개의 다양한 포항 관광지
- **코스**: 15개의 상세한 테마 코스
- **경로**: 각 코스별 상세 경로 데이터
- **연결**: 코스-방문지 연결 관계

#### 사용자 참여 데이터 (20241219_user_engagement_data.sql)

- **사용자**: 5명의 개발용 사용자 프로필
- **스탬프**: 사용자별 스탬프 획득 기록
- **앨범**: 사용자별 여행 앨범 및 아이템
- **게시물**: 커뮤니티 게시물 및 상호작용
- **주문**: DIY 기념품 주문 데이터
- **채팅**: AI 챗봇 대화 기록

## 📌 개발 환경 설정

### 환경 변수 설정

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Supabase 클라이언트 설정

```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## 📌 주의사항

### Migration 실행 전

1. **백업**: 중요한 데이터가 있다면 미리 백업
2. **환경 확인**: 개발/스테이징/프로덕션 환경 구분
3. **권한 확인**: Supabase 프로젝트 관리자 권한 필요

### Migration 실행 후

1. **RLS 정책 확인**: 보안 정책이 올바르게 적용되었는지 확인
2. **인덱스 확인**: 성능 최적화 인덱스가 생성되었는지 확인
3. **샘플 데이터 확인**: 개발용 데이터가 올바르게 삽입되었는지 확인

## 📌 문제 해결

### 일반적인 문제

1. **권한 오류**: Supabase 프로젝트 권한 확인
2. **RLS 정책 오류**: 정책이 너무 제한적인지 확인
3. **인덱스 오류**: 복합 인덱스 생성 시 순서 확인

### 로그 확인

```bash
# Supabase 로그 확인
supabase logs

# 특정 테이블 로그 확인
supabase logs --table=profiles
```

## 📌 추가 Migration

### 새로운 Migration 생성

```bash
supabase migration new add_new_feature
```

### Migration 파일 작성 시 주의사항

1. **순서**: 테이블 생성 → 인덱스 → RLS 정책 → 데이터 삽입
2. **롤백**: DROP 문은 주의해서 사용
3. **의존성**: 외래키 관계 고려
4. **성능**: 대용량 데이터 삽입 시 배치 처리

---

✅ **Migration 완료 후**: 애플리케이션에서 Supabase 클라이언트를 통해 데이터베이스에 접근할 수 있습니다.
