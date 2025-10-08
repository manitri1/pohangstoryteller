# 포항 스토리 텔러 데이터베이스 설계서

## 📋 개요

포항 스토리 텔러는 포항의 관광지를 탐방하고 스토리를 공유하는 플랫폼입니다. 사용자들이 관광지를 방문하여 스탬프를 수집하고, 여행 경험을 공유하며, DIY 기념품을 제작할 수 있는 기능을 제공합니다.

## 🗂️ 마이그레이션 파일 구조

### 실행 순서

```
1. 20241219_000_drop_all_tables.sql (선택사항 - 개발/테스트용)
2. 20241219_001_initial_schema.sql (스키마 생성)
3. 20241219_002_sample_data.sql (기본 샘플 데이터)
4. 20241219_003_pohang_tourist_spots.sql (관광지 데이터)
5. 20241219_004_dev_users.sql (개발용 사용자)
6. 20241219_005_user_engagement_data.sql (사용자 참여 데이터)
```

## 🏗️ 데이터베이스 스키마

### 핵심 테이블 구조

#### 1. 사용자 관련 테이블

##### `profiles` - 사용자 프로필

```sql
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 사용자 고유 식별자 (auth.users 테이블과 연결)
- `email`: 사용자 이메일 주소 (고유값)
- `name`: 사용자 실명 또는 닉네임
- `avatar_url`: 프로필 이미지 URL
- `preferences`: 사용자 설정 정보 (JSON 형태)
- `created_at`: 계정 생성 시간
- `updated_at`: 마지막 수정 시간

##### `user_preferences` - 사용자 선호도

```sql
CREATE TABLE user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    interests TEXT[] DEFAULT '{}',
    travel_style TEXT CHECK (travel_style IN ('relaxed', 'active', 'cultural')),
    budget_range TEXT CHECK (budget_range IN ('low', 'medium', 'high')),
    language TEXT DEFAULT 'ko',
    notifications_enabled BOOLEAN DEFAULT true,
    privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'private')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 선호도 설정 고유 식별자
- `user_id`: 사용자 ID (profiles 테이블 참조)
- `interests`: 관심사 배열 (예: ['자연경관', '맛집탐방'])
- `travel_style`: 여행 스타일 ('relaxed': 여유로운, 'active': 활동적인, 'cultural': 문화적인)
- `budget_range`: 예산 범위 ('low': 저렴, 'medium': 보통, 'high': 고가)
- `language`: 선호 언어 (기본값: 'ko')
- `notifications_enabled`: 알림 수신 여부
- `privacy_level`: 개인정보 공개 수준 ('public': 공개, 'private': 비공개)
- `created_at`: 설정 생성 시간
- `updated_at`: 마지막 수정 시간

#### 2. 코스 및 관광지 관련 테이블

##### `course_categories` - 코스 카테고리

```sql
CREATE TABLE course_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 카테고리 고유 식별자
- `name`: 카테고리 이름 (고유값, 예: '자연경관', '맛집탐방')
- `description`: 카테고리 설명
- `icon_url`: 카테고리 아이콘 이미지 URL
- `color`: 카테고리 색상 코드 (기본값: '#3B82F6')
- `created_at`: 카테고리 생성 시간

**기본 카테고리:**

- 맛집탐방 (음식과 카페 탐방)
- 역사여행 (역사와 문화 탐험)
- 자연경관 (자연 명소 탐방)
- 골목산책 (숨겨진 골목과 지역 문화)

##### `courses` - 여행 코스

```sql
CREATE TABLE courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES course_categories(id),
    duration_minutes INTEGER,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    distance_km DECIMAL(5,2),
    estimated_cost INTEGER,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 코스 고유 식별자
- `title`: 코스 제목 (예: '포항 바다와 일몰의 만남')
- `description`: 코스 상세 설명
- `category_id`: 카테고리 ID (course_categories 테이블 참조)
- `duration_minutes`: 예상 소요 시간 (분)
- `difficulty`: 난이도 ('easy': 쉬움, 'medium': 보통, 'hard': 어려움)
- `distance_km`: 총 거리 (킬로미터, 소수점 2자리)
- `estimated_cost`: 예상 비용 (원)
- `image_url`: 코스 대표 이미지 URL
- `is_featured`: 추천 코스 여부
- `is_active`: 활성 상태 여부
- `view_count`: 조회 수
- `like_count`: 좋아요 수
- `created_at`: 코스 생성 시간
- `updated_at`: 마지막 수정 시간

**주요 코스:**

- 포항 바다와 일몰의 만남 (영일대 → 구룡포)
- 포항 자연과 역사 탐방 (내연산 12폭포 → 보경사)
- 호미곶 일출 투어
- 포항 해수욕장 완전정복
- 포항 산악 트레킹

##### `locations` - 관광지

```sql
CREATE TABLE locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    coordinates POINT NOT NULL,  -- PostGIS POINT 타입
    address TEXT,
    qr_code TEXT UNIQUE,
    image_url TEXT,
    stamp_image_url TEXT,
    visit_duration_minutes INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 관광지 고유 식별자
- `name`: 관광지 이름 (예: '영일대 해수욕장')
- `description`: 관광지 상세 설명
- `coordinates`: GPS 좌표 (PostGIS POINT 타입, 예: POINT(129.3656, 36.0194))
- `address`: 주소 (예: '경상북도 포항시 북구 흥해읍')
- `qr_code`: QR 코드 (고유값, 예: 'QR_YEONGILDAE_001')
- `image_url`: 관광지 이미지 URL
- `stamp_image_url`: 스탬프 이미지 URL
- `visit_duration_minutes`: 권장 방문 시간 (분, 기본값: 30)
- `is_active`: 활성 상태 여부
- `created_at`: 관광지 등록 시간
- `updated_at`: 마지막 수정 시간

**주요 관광지 (총 78개):**

- **해수욕장**: 영일대, 월포, 칠포, 화진, 용한, 대진간이, 신청
- **산악**: 봉화산, 도음산, 비학산, 운제산, 내연산
- **문화시설**: 국립등대박물관, 포항시립중앙아트홀, 포항문화예술회관
- **전통시장**: 포항시장, 청하 공진시장, 흥해시장, 기계시장
- **특별명소**: 호미곶, 구룡포, 상생의 손, 독수리바위

##### `course_locations` - 코스-관광지 연결

```sql
CREATE TABLE course_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, location_id),
    UNIQUE(course_id, order_index)
);
```

**컬럼 설명:**

- `id`: 연결 고유 식별자
- `course_id`: 코스 ID (courses 테이블 참조)
- `location_id`: 관광지 ID (locations 테이블 참조)
- `order_index`: 코스 내 방문 순서 (1부터 시작)
- `is_required`: 필수 방문지 여부 (기본값: true)
- `created_at`: 연결 생성 시간

##### `routes` - 경로 정보

```sql
CREATE TABLE routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    waypoints JSONB NOT NULL,  -- [{lat: number, lng: number}, ...]
    color TEXT DEFAULT '#3B82F6',
    stroke_weight INTEGER DEFAULT 3,
    stroke_opacity DECIMAL(3,2) DEFAULT 0.8,
    is_main_route BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 경로 고유 식별자
- `course_id`: 코스 ID (courses 테이블 참조)
- `name`: 경로 이름 (예: '영일대-구룡포 경로')
- `waypoints`: 경로 좌표 배열 (JSON 형태, 예: [{"lat": 36.0194, "lng": 129.3656}])
- `color`: 경로 색상 코드 (기본값: '#3B82F6')
- `stroke_weight`: 경로 선 굵기 (기본값: 3)
- `stroke_opacity`: 경로 선 투명도 (0.0-1.0, 기본값: 0.8)
- `is_main_route`: 메인 경로 여부 (기본값: false)
- `created_at`: 경로 생성 시간

#### 3. 스탬프 및 경험 기록 테이블

##### `stamps` - 스탬프 수집

```sql
CREATE TABLE stamps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    qr_code_scanned TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 스탬프 고유 식별자
- `user_id`: 사용자 ID (profiles 테이블 참조)
- `location_id`: 관광지 ID (locations 테이블 참조)
- `course_id`: 코스 ID (courses 테이블 참조)
- `acquired_at`: 스탬프 획득 시간
- `qr_code_scanned`: 스캔한 QR 코드
- `is_verified`: 검증 여부 (기본값: false)
- `created_at`: 스탬프 생성 시간

##### `albums` - 여행 앨범

```sql
CREATE TABLE albums (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    theme TEXT CHECK (theme IN ('nature', 'history', 'food', 'culture', 'mixed')),
    cover_image_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 앨범 고유 식별자
- `user_id`: 사용자 ID (profiles 테이블 참조)
- `title`: 앨범 제목 (예: '포항 바다 여행')
- `description`: 앨범 설명
- `theme`: 앨범 테마 ('nature': 자연, 'history': 역사, 'food': 음식, 'culture': 문화, 'mixed': 혼합)
- `cover_image_url`: 앨범 커버 이미지 URL
- `is_public`: 공개 여부 (기본값: false)
- `created_at`: 앨범 생성 시간
- `updated_at`: 마지막 수정 시간

##### `album_items` - 앨범 아이템

```sql
CREATE TABLE album_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    item_type TEXT CHECK (item_type IN ('stamp', 'photo', 'video', 'text')),
    content TEXT,
    media_url TEXT,
    metadata JSONB DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 아이템 고유 식별자
- `album_id`: 앨범 ID (albums 테이블 참조)
- `item_type`: 아이템 타입 ('stamp': 스탬프, 'photo': 사진, 'video': 비디오, 'text': 텍스트)
- `content`: 아이템 내용/설명
- `media_url`: 미디어 파일 URL
- `metadata`: 추가 메타데이터 (JSON 형태)
- `order_index`: 앨범 내 순서 (기본값: 0)
- `created_at`: 아이템 생성 시간

#### 4. 커뮤니티 관련 테이블

##### `posts` - 게시물

```sql
CREATE TABLE posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT,
    media_urls TEXT[] DEFAULT '{}',
    hashtags TEXT[] DEFAULT '{}',
    location_data JSONB,
    mood TEXT,
    is_public BOOLEAN DEFAULT true,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 게시물 고유 식별자
- `author_id`: 작성자 ID (profiles 테이블 참조)
- `content`: 게시물 내용/텍스트
- `media_urls`: 첨부 미디어 URL 배열 (사진, 비디오 등)
- `hashtags`: 해시태그 배열 (예: ['포항', '영일대', '일몰'])
- `location_data`: 위치 정보 (JSON 형태, 예: {"name": "영일대 해수욕장", "coordinates": [129.3656, 36.0194]})
- `mood`: 기분/상태 (예: 'happy', 'peaceful', 'amazed')
- `is_public`: 공개 여부 (기본값: true)
- `like_count`: 좋아요 수 (기본값: 0)
- `comment_count`: 댓글 수 (기본값: 0)
- `share_count`: 공유 수 (기본값: 0)
- `created_at`: 게시물 작성 시간
- `updated_at`: 마지막 수정 시간

##### `likes` - 좋아요

```sql
CREATE TABLE likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);
```

**컬럼 설명:**

- `id`: 좋아요 고유 식별자
- `user_id`: 사용자 ID (profiles 테이블 참조)
- `post_id`: 게시물 ID (posts 테이블 참조)
- `created_at`: 좋아요 누른 시간

##### `comments` - 댓글

```sql
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 댓글 고유 식별자
- `post_id`: 게시물 ID (posts 테이블 참조)
- `author_id`: 댓글 작성자 ID (profiles 테이블 참조)
- `content`: 댓글 내용 (필수)
- `parent_id`: 부모 댓글 ID (대댓글용, comments 테이블 참조)
- `like_count`: 댓글 좋아요 수 (기본값: 0)
- `created_at`: 댓글 작성 시간
- `updated_at`: 마지막 수정 시간

##### `shares` - 공유

```sql
CREATE TABLE shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    platform TEXT CHECK (platform IN ('instagram', 'facebook', 'twitter', 'kakao')),
    share_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 공유 고유 식별자
- `post_id`: 게시물 ID (posts 테이블 참조)
- `user_id`: 공유한 사용자 ID (profiles 테이블 참조)
- `platform`: 공유 플랫폼 ('instagram': 인스타그램, 'facebook': 페이스북, 'twitter': 트위터, 'kakao': 카카오)
- `share_url`: 공유 URL
- `created_at`: 공유 시간

#### 5. DIY 기념품 관련 테이블

##### `templates` - 템플릿

```sql
CREATE TABLE templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('포항4컷', '롤링페이퍼', '포토북')),
    layout_config JSONB NOT NULL,
    price INTEGER NOT NULL,
    preview_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 템플릿 고유 식별자
- `name`: 템플릿 이름 (예: '포항4컷 기본')
- `type`: 템플릿 타입 ('포항4컷': 4컷 사진, '롤링페이퍼': 롤링페이퍼, '포토북': 포토북)
- `layout_config`: 레이아웃 설정 (JSON 형태, 슬롯 정보 포함)
- `price`: 가격 (원)
- `preview_url`: 미리보기 이미지 URL
- `is_active`: 활성 상태 여부 (기본값: true)
- `created_at`: 템플릿 생성 시간

**기본 템플릿:**

- 포항4컷 기본 (5,000원)
- 롤링페이퍼 기본 (3,000원)
- 포토북 기본 (15,000원)

##### `orders` - 주문

```sql
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    total_amount INTEGER NOT NULL,
    status TEXT CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    payment_method TEXT,
    payment_id TEXT,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 주문 고유 식별자
- `user_id`: 주문자 ID (profiles 테이블 참조)
- `total_amount`: 총 주문 금액 (원)
- `status`: 주문 상태 ('pending': 대기, 'paid': 결제완료, 'processing': 처리중, 'shipped': 배송중, 'delivered': 배송완료, 'cancelled': 취소)
- `payment_method`: 결제 방법
- `payment_id`: 결제 ID
- `shipping_address`: 배송 주소 (JSON 형태)
- `created_at`: 주문 생성 시간
- `updated_at`: 마지막 수정 시간

##### `order_items` - 주문 아이템

```sql
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    template_id UUID REFERENCES templates(id),
    quantity INTEGER DEFAULT 1,
    customization_data JSONB,
    price INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 주문 아이템 고유 식별자
- `order_id`: 주문 ID (orders 테이블 참조)
- `template_id`: 템플릿 ID (templates 테이블 참조)
- `quantity`: 수량 (기본값: 1)
- `customization_data`: 커스터마이징 데이터 (JSON 형태, 예: {"photos": ["photo1.jpg", "photo2.jpg"]})
- `price`: 아이템 가격 (원)
- `created_at`: 아이템 생성 시간

#### 6. AI 챗봇 관련 테이블

##### `chat_sessions` - 채팅 세션

```sql
CREATE TABLE chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 채팅 세션 고유 식별자
- `user_id`: 사용자 ID (profiles 테이블 참조)
- `session_name`: 세션 이름 (예: '포항 여행 상담')
- `created_at`: 세션 생성 시간
- `updated_at`: 마지막 수정 시간

##### `chat_messages` - 채팅 메시지

```sql
CREATE TABLE chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**

- `id`: 메시지 고유 식별자
- `session_id`: 채팅 세션 ID (chat_sessions 테이블 참조)
- `role`: 메시지 역할 ('user': 사용자, 'assistant': AI 어시스턴트)
- `content`: 메시지 내용 (필수)
- `metadata`: 추가 메타데이터 (JSON 형태, 예: {"intent": "travel_planning"})
- `created_at`: 메시지 생성 시간

## 🔗 테이블 관계도

```
auth.users (Supabase Auth)
    ↓
profiles
    ↓
user_preferences, stamps, albums, posts, orders, chat_sessions

course_categories
    ↓
courses
    ↓
course_locations, routes

locations
    ↓
course_locations, stamps

templates
    ↓
order_items
```

## 📊 데이터 통계

### 샘플 데이터 규모

- **관광지**: 78개 (해수욕장, 산악, 문화시설, 시장, 특별명소)
- **코스**: 14개 (자연경관, 역사여행, 맛집탐방, 골목산책)
- **사용자**: 5명 (개발용)
- **게시물**: 10개
- **스탬프**: 10개
- **앨범**: 5개
- **주문**: 5개

### 주요 관광지 분류

- **해수욕장**: 7개 (영일대, 월포, 칠포, 화진, 용한, 대진간이, 신청)
- **산악**: 5개 (봉화산, 도음산, 비학산, 운제산, 내연산)
- **문화시설**: 8개 (아트홀, 도서관, 체험관, 공원 등)
- **전통시장**: 8개 (포항시장, 청하 공진시장, 흥해시장 등)
- **특별명소**: 50개 (호미곶, 구룡포, 상생의 손 등)

## 🛡️ 보안 및 권한

### RLS (Row Level Security) 정책

- **사용자 데이터**: 본인 데이터만 접근 가능
- **공개 데이터**: 코스, 관광지, 공개 게시물은 모든 사용자 접근 가능
- **커뮤니티**: 공개 게시물은 모든 사용자 조회 가능, 작성자는 본인 게시물 관리 가능

### 인덱스 최적화

- **공간 인덱스**: `locations.coordinates` (GIST)
- **QR 코드**: `locations.qr_code` (B-tree)
- **검색 최적화**: `posts.hashtags` (GIN)
- **성능 최적화**: 주요 조회 컬럼들에 인덱스 설정

## 🚀 마이그레이션 실행 가이드

### 1. 개발 환경 초기화

```sql
-- 모든 테이블 삭제 (개발/테스트용)
-- 20241219_000_drop_all_tables.sql
```

### 2. 스키마 생성

```sql
-- 기본 스키마 및 테이블 생성
-- 20241219_001_initial_schema.sql
```

### 3. 기본 데이터 삽입

```sql
-- 관광지, 코스, 카테고리 데이터
-- 20241219_002_sample_data.sql
```

### 4. 추가 관광지 데이터

```sql
-- 포항 관광지 추가 데이터
-- 20241219_003_pohang_tourist_spots.sql
```

### 5. 개발용 사용자 생성

```sql
-- auth.users 테이블에 개발용 사용자 생성
-- 20241219_004_dev_users.sql
```

### 6. 사용자 참여 데이터

```sql
-- 프로필, 스탬프, 앨범, 게시물 등 사용자 데이터
-- 20241219_005_user_engagement_data.sql
```

## ⚠️ 주의사항

### 실행 순서 중요

- `20241219_004_dev_users.sql`은 `20241219_005_user_engagement_data.sql`보다 먼저 실행되어야 함
- 사용자 데이터가 없으면 외래키 제약조건 오류 발생

### 데이터 중복 방지

- `ON CONFLICT` 절을 사용하여 중복 데이터 삽입 방지
- QR 코드는 고유해야 함

### 성능 고려사항

- PostGIS 확장을 사용한 공간 데이터 처리
- 대량 데이터 삽입 시 배치 처리 권장
- 인덱스 생성으로 조회 성능 최적화

## 🔧 확장 가능성

### 추가 기능 고려사항

- **실시간 알림**: WebSocket을 통한 실시간 업데이트
- **추천 시스템**: 사용자 선호도 기반 관광지 추천
- **소셜 기능**: 친구 추가, 그룹 여행 계획
- **모바일 앱**: React Native 또는 Flutter 앱 개발
- **AI 기능**: 자연어 처리 기반 여행 계획 도우미

### 데이터 마이그레이션

- 기존 관광지 데이터 추가 시 `20241219_003_pohang_tourist_spots.sql` 패턴 사용
- 새로운 기능 추가 시 별도 마이그레이션 파일 생성
- 버전 관리 및 롤백 전략 수립

---

**생성일**: 2024-12-19  
**버전**: 1.0  
**작성자**: 포항 스토리 텔러 개발팀
