# 포항 스토리텔러 기능별 사용 사례 (Use Cases)

이 문서는 포항 스토리텔러 애플리케이션의 주요 기능 카드별 사용 사례를 단계별로 상세히 설명합니다.

---

## 0. 회원가입 및 로그인 (Authentication) ✅ **완료**

**아이콘:** 🔐 자물쇠  
**설명:** 포항 스토리텔러의 모든 개인화 기능을 이용하기 위해 계정을 만들어보세요.

### 📋 전제 조건 (Prerequisites)

#### **시스템 요구사항:**

- ✅ Next.js 애플리케이션이 정상 실행 중
- ✅ Supabase 데이터베이스 연결 상태 양호
- ✅ Next-Auth 인증 시스템 활성화
- ✅ 간단한 테스트용 인증 시스템 구현

#### **인증 요구사항:**

- ✅ **회원가입**: 이메일, 비밀번호, 이름 필수
- ✅ **로그인**: 이메일과 비밀번호로 인증
- ✅ **세션 관리**: 자동 로그인 유지
- ✅ **보안**: 비밀번호 암호화 및 세션 보안

### 단계별 실행 가이드

#### 1단계: 메인 화면에서 "로그인" 버튼 클릭

- 홈 화면 우측 상단의 "로그인" 버튼 클릭
- 로그인 페이지로 이동
- "회원가입하기" 링크 클릭하여 회원가입 페이지로 이동

#### 2단계: 회원가입 정보 입력

- **이름**: 실명 또는 닉네임 입력 (필수)
- **이메일**: 유효한 이메일 주소 입력 (필수)
- **비밀번호**: 8자 이상의 안전한 비밀번호 입력 (필수)
- **비밀번호 확인**: 비밀번호 재입력 (필수)

#### 3단계: 개인화 설정 (선택사항)

- **관심사 선택** (복수 선택 가능):
  - **자연경관**: 바다, 산, 공원 등 자연을 만끽하는 여행
  - **역사여행**: 문화재, 박물관, 역사적 장소 탐방
  - **맛집탐방**: 로컬 맛집, 시장, 특색 있는 음식
  - **골목산책**: 지역 특색, 골목길, 로컬 문화 체험
- **여행 기간 선호도**:
  - **반나절 (2-3시간)**: 짧은 시간 투어
  - **하루 (4-6시간)**: 하루 종일 투어
  - **주말 (1-2일)**: 주말 여행
  - **장기 (3일 이상)**: 장기 체류
- **동반자 선호도**:
  - **혼자**: 혼자만의 시간을 즐기는 여행
  - **연인**: 로맨틱한 데이트 코스
  - **가족**: 모든 연령대가 즐길 수 있는 코스
  - **친구**: 활발하고 재미있는 그룹 여행

#### 4단계: 회원가입 완료

- "회원가입하기" 버튼 클릭
- 회원가입 성공 페이지로 이동
- 계정 생성 완료 및 로그인 상태 활성화 확인

#### 5단계: 로그인 (기존 사용자)

- 이메일과 비밀번호 입력
- "로그인" 버튼 클릭
- 로그인 성공 시 메인 페이지로 리다이렉트

### 📊 데이터베이스 반영 및 확인 방법

#### **데이터베이스 반영 내용:**

- `profiles` 테이블: 사용자 프로필 정보 저장
- `auth.users` 테이블: Supabase Auth 사용자 정보
- 사용자 선호도 데이터 저장
- 세션 정보 관리

#### **확인 방법:**

1. **개발자 도구 → 데이터베이스 테스트** 페이지 접속
2. **테이블 뷰** 탭에서 다음 테이블들 확인:
   - `profiles`: 사용자 프로필 정보
   - `auth.users`: 인증 사용자 정보
3. **커스텀 쿼리** 탭에서 다음 SQL로 상세 확인:

   ```sql
   -- 사용자 프로필 정보 확인
   SELECT id, email, name, preferences, created_at
   FROM profiles
   ORDER BY created_at DESC;

   -- 사용자 선호도 분석
   SELECT
     preferences->>'interests' as 관심사,
     preferences->>'travelDuration' as 여행기간,
     preferences->>'companion' as 동반자,
     COUNT(*) as 사용자수
   FROM profiles
   WHERE preferences IS NOT NULL
   GROUP BY preferences->>'interests', preferences->>'travelDuration', preferences->>'companion';

   -- 최근 가입자 현황
   SELECT
     DATE(created_at) as 가입일,
     COUNT(*) as 신규가입자수
   FROM profiles
   WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
   GROUP BY DATE(created_at)
   ORDER BY 가입일 DESC;
   ```

### 실제 사용 예시

**"포항 여행 애호가" 회원가입 시:**

1. **기본 정보**: 이름 "김포항", 이메일 "pohang@example.com"
2. **관심사**: 자연경관, 맛집탐방 선택
3. **여행 선호도**: 하루(4-6시간), 가족 선택
4. **가입 완료**: 개인화된 포항 여행 추천 서비스 이용 가능
5. **즉시 이용**: QR 스탬프, 커뮤니티, 앨범 등 모든 기능 접근 가능

### 🔐 **보안 및 개인정보 보호**

#### **데이터 보호:**

- 비밀번호 해시 암호화 저장
- 개인정보 최소 수집 원칙
- GDPR 준수 데이터 처리

#### **세션 관리:**

- JWT 토큰 기반 인증
- 자동 로그아웃 (30일)
- 보안 세션 관리

#### **접근 제어:**

- RLS(Row Level Security) 적용
- 사용자별 데이터 격리
- 권한 기반 기능 접근

---

## 1. 스토리 탐험 (Story Exploration) ✅ **완료**

**아이콘:** 📖 열린 책  
**설명:** 포항의 매력을 담은 스토리 기반 여행 코스를 탐험해보세요.

### 📋 전제 조건 (Prerequisites)

#### **시스템 요구사항:**

- Next.js 애플리케이션이 정상 실행 중
- Supabase 데이터베이스 연결 상태 양호
- Kakao Maps API 키 설정 완료
- 사용자 인증 시스템 활성화 (선택적 로그인)

#### **인증 요구사항:**

- **기본 탐색**: 로그인 없이 가능
- **개인화 기능**: 로그인 필요 (즐겨찾기, 추천, 진행률 저장)
- **상호작용**: 로그인 필요 (좋아요, 북마크, 댓글)

#### **사전 데이터베이스 구성 조건:**

1. **기본 테이블 데이터 준비:**

   ```sql
   -- 코스 카테고리 데이터
   INSERT INTO course_categories (name, description, icon) VALUES
   ('자연경관', '바다, 산, 공원 등 자연을 만끽하는 여행', '🌊'),
   ('역사여행', '문화재, 박물관, 역사적 장소 탐방', '🏛️'),
   ('맛집탐방', '로컬 맛집, 시장, 특색 있는 음식', '🍽️'),
   ('골목산책', '지역 특색, 골목길, 로컬 문화 체험', '🚶');

   -- 관광지 데이터
   INSERT INTO locations (name, description, coordinates, address) VALUES
   ('호미곶', '한반도 최동단 일출 명소', ST_GeomFromText('POINT(129.5844 36.0761)', 4326), '경북 포항시 남구 호미곶면'),
   ('영일대 해수욕장', '포항의 대표 해수욕장', ST_GeomFromText('POINT(129.3650 36.0194)', 4326), '경북 포항시 북구 흥해읍'),
   ('죽도시장', '포항의 대표 전통시장', ST_GeomFromText('POINT(129.3650 36.0194)', 4326), '경북 포항시 북구 죽도동');

   -- 스토리 코스 데이터 (category_id는 실제 UUID로 대체 필요)
   INSERT INTO courses (title, description, duration_minutes, difficulty, category_id) VALUES
   ('포항 바다와 일출의 만남', '호미곶에서 영일대까지 바다를 따라가는 코스', 360, 'medium', (SELECT id FROM course_categories WHERE name = '자연경관' LIMIT 1)),
   ('포항 역사 탐방', '포항의 역사와 문화를 만나는 코스', 240, 'easy', (SELECT id FROM course_categories WHERE name = '역사여행' LIMIT 1)),
   ('포항 맛집 투어', '과메기, 회 등 포항 특색 음식 맛보기', 180, 'easy', (SELECT id FROM course_categories WHERE name = '맛집탐방' LIMIT 1));
   ```

2. **사용자 선호도 데이터:**

   ```sql
   -- 사용자 선호도 테이블에 기본 데이터 (인증된 사용자만 가능)
   -- 주의: auth.uid()는 로그인된 사용자에게만 작동합니다
   INSERT INTO user_preferences (user_id, interests, travel_style, budget_range) VALUES
   (auth.uid(), ARRAY['자연경관', '맛집탐방'], 'relaxed', 'medium');
   ```

3. **AI 추천 시스템 데이터:**
   ```sql
   -- 코스 메타데이터 추가
   ALTER TABLE courses ADD COLUMN IF NOT EXISTS tags TEXT[];
   ALTER TABLE courses ADD COLUMN IF NOT EXISTS target_audience TEXT[];
   ALTER TABLE courses ADD COLUMN IF NOT EXISTS season_suitability TEXT[];
   ALTER TABLE courses ADD COLUMN IF NOT EXISTS weather_suitability TEXT[];
   ALTER TABLE courses ADD COLUMN IF NOT EXISTS activity_level TEXT;
   ALTER TABLE courses ADD COLUMN IF NOT EXISTS popularity_score DECIMAL(3,2) DEFAULT 0.0;
   ALTER TABLE courses ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0;
   ALTER TABLE courses ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
   ```

#### **필수 마이그레이션 실행:**

- `20250110_001_initial_schema.sql` - 기본 스키마
- `20250110_002_sample_data.sql` - 샘플 데이터 (카테고리, 관광지, 코스)
- `20250110_004_ai_recommendation_system.sql` - AI 추천 시스템
- `20250110_010_album_system.sql` - 앨범 시스템 (완전 구현)
- `20250110_011_fix_existing_album_templates.sql` - 기존 테이블 호환성 수정 (필요시)

### 단계별 실행 가이드

#### 1단계: 메인 화면에서 "스토리 탐험" 카드 클릭

- 홈 화면에서 📖 아이콘이 있는 "스토리 탐험" 카드를 클릭
- 화면이 스토리 탐험 페이지로 전환됨

#### 2단계: 취향 선택

- **관심사 선택** (복수 선택 가능):
  - **자연경관**: 바다, 산, 공원 등 자연을 만끽하는 여행
  - **역사여행**: 문화재, 박물관, 역사적 장소 탐방
  - **맛집탐방**: 로컬 맛집, 시장, 특색 있는 음식
  - **골목산책**: 지역 특색, 골목길, 로컬 문화 체험
- **여행 기간 선택**:
  - **반나절 (2-3시간)**: 짧은 시간 투어
  - **하루 (4-6시간)**: 하루 종일 투어
  - **주말 (1-2일)**: 주말 여행
  - **장기 (3일 이상)**: 장기 체류
- **동반자 선택**:
  - **혼자**: 혼자만의 시간을 즐기는 여행
  - **연인**: 로맨틱한 데이트 코스
  - **가족**: 모든 연령대가 즐길 수 있는 코스
  - **친구**: 활발하고 재미있는 그룹 여행

**💡 로그인 안내**: 개인화된 추천과 진행률 저장을 원한다면 로그인을 권장합니다.

#### 3단계: 맞춤형 코스 추천 받기

- 선택한 취향을 바탕으로 AI가 추천하는 맞춤형 코스 목록 표시
- 각 코스마다 다음 정보 확인:
  - 코스 제목 및 간단한 설명
  - 예상 소요 시간
  - 방문할 장소 목록
  - 난이도 (쉬움/보통/어려움)
  - 평점 및 후기

#### 4단계: 코스 시작하기

- 관심 있는 코스를 선택하고 "시작하기" 버튼 클릭
- 첫 번째 장소로 이동하는 지도와 길찾기 정보 제공
- 코스 진행 상황을 실시간으로 추적
- "다른 추천 보기" 버튼으로 추가 추천 코스 확인 가능

#### 5단계: 각 장소에서 코스 체험

- 방문한 장소에서 QR 코드 스캔 또는 위치 확인
- 해당 장소와 관련된 정보 및 스토리 자동 표시
- 사진 촬영 및 메모 작성 기능 제공
- 취향에 맞는 추가 추천 장소 안내

### 📊 데이터베이스 반영 및 확인 방법

#### **데이터베이스 반영 내용:**

- `courses` 테이블: 스토리 코스 정보 저장
- `course_locations` 테이블: 코스별 방문 장소 연결
- `user_stamps` 테이블: 사용자 스탬프 수집 기록
- `posts` 테이블: 스토리 체험 후기 및 사진
- `albums` 테이블: 스토리 관련 앨범 생성

#### **확인 방법:**

1. **개발자 도구 → 데이터베이스 테스트** 페이지 접속
2. **테이블 뷰** 탭에서 다음 테이블들 확인:
   - `courses`: 스토리 코스 목록 조회
   - `course_locations`: 코스-장소 연결 관계 확인
   - `user_stamps`: 사용자별 스탬프 수집 현황
   - `posts`: 스토리 체험 후기 게시글
   - `albums`: 생성된 앨범 목록
3. **커스텀 쿼리** 탭에서 다음 SQL로 상세 확인:

   ```sql
   -- 사용자별 스토리 진행 현황
   SELECT u.id, u.name, COUNT(us.id) as stamp_count
   FROM profiles u
   LEFT JOIN user_stamps us ON u.id = us.user_id
   GROUP BY u.id, u.name;

   -- 스토리별 방문 통계
   SELECT c.title, COUNT(cl.location_id) as location_count
   FROM courses c
   LEFT JOIN course_locations cl ON c.id = cl.course_id
   GROUP BY c.id, c.title;
   ```

### 실제 사용 예시

**"자연경관 + 하루 + 가족" 취향 선택 시:**

1. **취향 입력**: 자연경관, 하루(4-6시간), 가족 선택
2. **AI 추천**: "포항 바다와 일출의 만남", "호미곶 일출 투어", "포항 해수욕장 완전정복" 등 추천
3. **코스 선택**: "포항 바다와 일출의 만남" 코스 선택
4. **체험 시작**: 영일대 해수욕장부터 구룡포까지, 포항의 바다를 만끽하는 코스 진행
5. **추가 추천**: 가족이 즐길 수 있는 추가 자연 명소 안내

---

## 2. QR 스탬프 (QR Stamp) ✅ **완료**

**아이콘:** 📱 QR 코드  
**설명:** QR 스탬프 투어로 여행의 추억을 디지털로 남겨보세요.

### 📋 전제 조건 (Prerequisites)

#### **시스템 요구사항:**

- Next.js 애플리케이션이 정상 실행 중
- Supabase 데이터베이스 연결 상태 양호
- 카메라 권한 허용 (QR 코드 스캔용)
- 위치 서비스 활성화 (GPS 기반 스탬프 수집)
- **사용자 인증 시스템 활성화 (로그인 필수)**

#### **인증 요구사항:**

- **모든 기능**: 로그인 필수
- **스탬프 수집**: 개인 계정에 저장
- **진행률 추적**: 사용자별 데이터 관리
- **앨범 생성**: 개인화된 앨범 관리

#### **사전 데이터베이스 구성 조건:**

1. **스탬프 시스템 기본 데이터:**

   ```sql
   -- 사용자 스탬프 수집 기록 (실제 스탬프 수집 시 생성)
   -- 주의: auth.uid()는 로그인된 사용자에게만 작동합니다
   INSERT INTO user_stamps (user_id, location_id, acquired_at, points, rarity, is_verified) VALUES
   (auth.uid(), (SELECT id FROM locations WHERE name = '호미곶'), NOW(), 20, 'rare', true),
   (auth.uid(), (SELECT id FROM locations WHERE name = '영일대 해수욕장'), NOW(), 15, 'common', true),
   (auth.uid(), (SELECT id FROM locations WHERE name = '죽도시장'), NOW(), 10, 'common', true);

   -- 스탬프 컬렉션 생성
   -- 주의: auth.uid()는 로그인된 사용자에게만 작동합니다
   INSERT INTO stamp_collections (name, description, user_id, is_public) VALUES
   ('포항 해안 투어', '포항의 바다를 따라가는 스탬프 컬렉션', auth.uid(), true),
   ('포항 맛집 투어', '포항의 특색 음식을 찾아가는 투어', auth.uid(), true);
   ```

2. **스탬프 업적 시스템:**

   ```sql
   -- 스탬프 업적 데이터 (사용자별 업적 기록)
   -- 주의: auth.uid()는 로그인된 사용자에게만 작동합니다
   INSERT INTO stamp_achievements (user_id, achievement_type, achievement_name, description, points_awarded, badge_image_url) VALUES
   (auth.uid(), 'location_master', '포항 마스터', '포항의 모든 주요 장소를 방문한 사용자', 100, 'https://example.com/badges/master.png'),
   (auth.uid(), 'sunrise_lover', '일출 애호가', '일출 명소 3곳 이상 방문', 50, 'https://example.com/badges/sunrise.png'),
   (auth.uid(), 'food_explorer', '맛집 탐험가', '맛집 스탬프 5개 이상 수집', 75, 'https://example.com/badges/food.png');
   ```

3. **사용자 스탬프 상호작용 테이블:**
   ```sql
   -- 사용자-스탬프 상호작용 기록
   -- 주의: auth.uid()는 로그인된 사용자에게만 작동합니다
   INSERT INTO user_course_interactions (user_id, course_id, interaction_type, created_at) VALUES
   (auth.uid(), (SELECT id FROM courses WHERE title = '포항 바다와 일출의 만남'), 'view', NOW()),
   (auth.uid(), (SELECT id FROM courses WHERE title = '포항 바다와 일출의 만남'), 'start', NOW());
   ```

#### **필수 마이그레이션 실행:**

- `20250110_001_initial_schema.sql` - 기본 스키마
- `20250110_002_sample_data.sql` - 샘플 데이터 (관광지, 코스)
- `20250110_003_community_functions.sql` - 커뮤니티 함수
- `20250110_010_album_system.sql` - 앨범 시스템 (완전 구현)
- `20250110_011_fix_existing_album_templates.sql` - 기존 테이블 호환성 수정 (필요시)

#### **물리적 QR 코드 준비:**

- 각 관광지에 실제 QR 코드 스티커 설치
- QR 코드는 고유한 식별자 포함
- 스마트폰 카메라로 스캔 가능한 크기와 품질

### 단계별 실행 가이드

#### 1단계: 메인 화면에서 "QR 스탬프" 카드 클릭

- 홈 화면에서 📱 아이콘이 있는 "QR 스탬프" 카드를 클릭
- **로그인 확인**: 로그인되지 않은 경우 로그인 페이지로 리다이렉트
- QR 스탬프 메인 페이지로 이동

#### 2단계: 스탬프 투어 선택

- **호미곶 일출 투어**: 한반도 최동단의 일출 명소
- **포항 시내 맛집 투어**: 과메기, 회 등 포항 특색 음식
- **포항제철소 견학 투어**: 산업 도시 포항의 상징
- **영일대 해수욕장 투어**: 포항의 대표 해수욕장

#### 3단계: 스탬프 수집 시작

- 선택한 투어의 첫 번째 장소로 이동
- 해당 장소에 설치된 QR 코드를 스마트폰 카메라로 스캔
- 앱이 자동으로 QR 코드를 인식하고 스탬프 수집

#### 4단계: 스탬프 정보 확인

- 수집된 스탬프의 상세 정보 표시:
  - 장소명 및 방문 시간
  - 해당 장소의 특별한 정보나 전설
  - 다음 방문 장소 안내
- 스탬프 수집 현황 바에서 진행률 확인

#### 5단계: 스탬프 컬렉션 관리

- "나의 스탬프" 메뉴에서 수집한 스탬프 전체 확인
- 각 스탬프를 클릭하여 상세 정보 및 사진 재확인
- 스탬프별 방문 사진 추가 및 메모 작성

### 📊 데이터베이스 반영 및 확인 방법

#### **데이터베이스 반영 내용:**

- `stamps` 테이블: QR 스탬프 기본 정보
- `user_stamps` 테이블: 사용자별 스탬프 수집 기록
- `stamp_acquisitions` 테이블: 스탬프 획득 상세 정보
- `stamp_collections` 테이블: 사용자별 스탬프 컬렉션
- `collection_stamps` 테이블: 컬렉션-스탬프 연결
- `stamp_achievements` 테이블: 스탬프 관련 업적

#### **확인 방법:**

1. **개발자 도구 → 데이터베이스 테스트** 페이지 접속
2. **테이블 뷰** 탭에서 다음 테이블들 확인:
   - `stamps`: QR 스탬프 목록 및 위치 정보
   - `user_stamps`: 사용자별 수집한 스탬프
   - `stamp_acquisitions`: 스탬프 획득 시간 및 상세 정보
   - `stamp_collections`: 사용자별 스탬프 컬렉션
3. **커스텀 쿼리** 탭에서 다음 SQL로 상세 확인:

   ```sql
   -- 사용자별 스탬프 수집 현황
   SELECT u.name, COUNT(us.id) as collected_stamps,
          COUNT(DISTINCT us.location_id) as visited_locations
   FROM profiles u
   LEFT JOIN user_stamps us ON u.id = us.user_id
   GROUP BY u.id, u.name;

   -- 스탬프별 수집 통계
   SELECT s.name, COUNT(us.id) as collection_count
   FROM stamps s
   LEFT JOIN user_stamps us ON s.id = us.stamp_id
   GROUP BY s.id, s.name
   ORDER BY collection_count DESC;

   -- 사용자별 스탬프 컬렉션
   SELECT u.name, sc.name as collection_name, COUNT(cs.stamp_id) as stamps_in_collection
   FROM profiles u
   JOIN stamp_collections sc ON u.id = sc.user_id
   LEFT JOIN collection_stamps cs ON sc.id = cs.collection_id
   GROUP BY u.id, u.name, sc.id, sc.name;
   ```

### 실제 사용 예시

**호미곶 일출 투어 진행 시:**

1. 호미곶 일출 광장에서 QR 코드 스캔
2. "한반도 최동단 방문" 스탬프 획득
3. 일출 명소 정보 및 촬영 팁 제공
4. 다음 장소인 "호미곶 등대" 안내
5. 투어 완료 시 "호미곶 마스터" 특별 스탬프 획득

---

## 3. 커뮤니티 (Community) ✅ **완료**

**아이콘:** 👥 사람들  
**설명:** 다른 여행자들과 경험을 공유하고 소통해보세요.

### 📋 전제 조건 (Prerequisites)

#### **시스템 요구사항:**

- Next.js 애플리케이션이 정상 실행 중
- Supabase 데이터베이스 연결 상태 양호
- **사용자 인증 시스템 활성화 (로그인 필수)**
- 파일 업로드 기능 활성화 (이미지 업로드용)

#### **인증 요구사항:**

- **모든 기능**: 로그인 필수
- **게시글 작성**: 개인 계정으로 작성
- **상호작용**: 좋아요, 댓글, 북마크 기능
- **프로필 관리**: 개인 프로필 및 설정

#### **사전 데이터베이스 구성 조건:**

1. **커뮤니티 기본 데이터:**

   ```sql
   -- 게시글 카테고리 설정
   UPDATE posts SET post_type = 'general' WHERE post_type IS NULL;

   -- 샘플 게시글 데이터 (테스트용) - 안전한 버전
   DO $$
   DECLARE
       test_user_id UUID := '00000000-0000-0000-0000-000000000001';
       jukdo_location_id UUID;
       homigot_location_id UUID;
   BEGIN
       -- 위치 ID 조회
       SELECT id INTO jukdo_location_id FROM locations WHERE name = '죽도시장' LIMIT 1;
       SELECT id INTO homigot_location_id FROM locations WHERE name = '호미곶' LIMIT 1;

       -- 테스트 사용자 프로필 생성 (외래키 제약조건 우회)
       BEGIN
           -- 외래키 제약조건을 임시로 비활성화
           SET session_replication_role = replica;

           INSERT INTO profiles (id, email, name, username, preferences)
           VALUES (
               test_user_id,
               'test@example.com',
               '테스트 사용자',
               'testuser',
               '{"bio": "테스트용 사용자입니다", "interests": ["자연경관", "맛집탐방"]}'::jsonb
           ) ON CONFLICT (id) DO NOTHING;

           -- 외래키 제약조건 다시 활성화
           SET session_replication_role = DEFAULT;

           RAISE NOTICE '테스트 사용자 프로필이 생성되었습니다.';
       EXCEPTION
           WHEN OTHERS THEN
               -- 오류 발생 시 외래키 제약조건 다시 활성화
               SET session_replication_role = DEFAULT;
               RAISE NOTICE '테스트 사용자 프로필 생성 중 오류 발생: %', SQLERRM;
       END;

       -- 게시글 삽입
       IF jukdo_location_id IS NOT NULL THEN
           INSERT INTO posts (author_id, content, post_type, location_data, hashtags, is_public)
           VALUES (
               test_user_id,
               '포항 과메기 맛집 추천해주세요!',
               'question',
               jsonb_build_object('location_id', jukdo_location_id),
               ARRAY['맛집', '과메기', '포항'],
               true
           );
       END IF;

       IF homigot_location_id IS NOT NULL THEN
           INSERT INTO posts (author_id, content, post_type, location_data, hashtags, is_public)
           VALUES (
               test_user_id,
               '호미곶 일출 정말 아름다웠어요 🌅',
               'review',
               jsonb_build_object('location_id', homigot_location_id),
               ARRAY['일출', '호미곶', '포항여행'],
               true
           );
       END IF;
   END $$;
   ```

2. **사용자 프로필 데이터:**

   ```sql
   -- 사용자 프로필 정보 (이미 위에서 처리됨)
   -- 테스트 사용자 프로필이 이미 생성되었습니다.
   ```

3. **커뮤니티 상호작용 데이터:**

   ```sql
   -- 좋아요, 댓글, 북마크 시스템 활성화 (안전한 버전)
   DO $$
   DECLARE
       test_user_id UUID := '00000000-0000-0000-0000-000000000001';
       gomagi_post_id UUID;
       sunrise_post_id UUID;
   BEGIN
       -- 게시글 ID 조회
       SELECT id INTO gomagi_post_id FROM posts WHERE content LIKE '%과메기%' LIMIT 1;
       SELECT id INTO sunrise_post_id FROM posts WHERE content LIKE '%일출%' LIMIT 1;

       -- 좋아요 추가 (tweet_id 컬럼 포함)
       IF gomagi_post_id IS NOT NULL THEN
           INSERT INTO likes (user_id, post_id, tweet_id, created_at)
           VALUES (test_user_id, gomagi_post_id, uuid_generate_v4(), NOW())
           ON CONFLICT (user_id, post_id) DO NOTHING;
       END IF;

       -- 댓글 추가 (user_id, tweet_id 컬럼 포함)
       IF gomagi_post_id IS NOT NULL THEN
           INSERT INTO comments (post_id, author_id, content, user_id, tweet_id, created_at)
           VALUES (gomagi_post_id, test_user_id, '저도 과메기 맛집 찾고 있어요!', test_user_id, uuid_generate_v4(), NOW());
       END IF;

       -- 북마크 추가
       IF sunrise_post_id IS NOT NULL THEN
           INSERT INTO bookmarks (user_id, post_id, created_at)
           VALUES (test_user_id, sunrise_post_id, NOW())
           ON CONFLICT (user_id, post_id) DO NOTHING;
       END IF;
   END $$;
   ```

4. **해시태그 및 검색 시스템:**
   ```sql
   -- 해시태그 인덱스 생성
   CREATE INDEX IF NOT EXISTS idx_posts_hashtags ON posts USING gin(hashtags);
   CREATE INDEX IF NOT EXISTS idx_posts_content_search ON posts USING gin(to_tsvector('simple', content));
   ```

#### **필수 마이그레이션 실행:**

- `20250110_001_initial_schema.sql` - 기본 스키마
- `20250110_002_sample_data.sql` - 샘플 데이터
- `20250110_003_community_functions.sql` - 커뮤니티 함수
- `20250110_010_album_system.sql` - 앨범 시스템 (완전 구현)
- `20250110_011_fix_existing_album_templates.sql` - 기존 테이블 호환성 수정 (필요시)

#### **외부 서비스 연동:**

- 이미지 업로드를 위한 Supabase Storage 설정
- 파일 크기 제한: 10MB (이미지), 100MB (영상)
- 지원 파일 형식: JPG, PNG, GIF, MP4, MOV

### 단계별 실행 가이드

#### 1단계: 메인 화면에서 "커뮤니티" 카드 클릭

- 홈 화면에서 👥 아이콘이 있는 "커뮤니티" 카드를 클릭
- **로그인 확인**: 로그인되지 않은 경우 로그인 페이지로 리다이렉트
- 커뮤니티 메인 페이지로 이동

#### 2단계: 게시글 카테고리 선택

- **전체**: 모든 게시글 보기
- **맛집 추천**: 포항 맛집 정보 공유
- **관광지 후기**: 관광지 방문 후기 및 사진
- **질문과 답변**: 포항 여행 관련 질문
- **일정 공유**: 여행 일정 및 코스 공유

#### 3단계: 게시글 작성하기

- 우측 상단의 "글쓰기" 버튼 클릭
- 게시글 작성 모달에서 다음 정보 입력:
  - 내용: 상세한 설명 및 경험 공유
  - 사진: 드래그 앤 드롭으로 최대 5장까지 업로드
  - 해시태그: #포항 #여행 #맛집 등 태그 추가
  - 위치: 방문한 장소 태그
  - 기분: 이모지로 현재 기분 표현

#### 4단계: 게시글 게시 및 상호작용

- "게시하기" 버튼으로 게시글 공개
- 다른 사용자들의 댓글 및 좋아요 확인
- 댓글 모달에서 실시간 댓글 작성 및 소통
- 좋아요, 북마크 기능으로 관심 게시글 관리

#### 5단계: 다른 사용자 게시글 탐색

- 인기 게시글, 최신 게시글, 추천 게시글 확인
- 관심 있는 게시글에 좋아요 및 댓글 달기
- 유용한 정보는 북마크로 저장
- 해시태그 클릭으로 관련 게시글 탐색

### 📊 데이터베이스 반영 및 확인 방법

#### **데이터베이스 반영 내용:**

- `posts` 테이블: 커뮤니티 게시글 정보
- `likes` 테이블: 게시글 좋아요 기록
- `comments` 테이블: 댓글 정보
- `comment_likes` 테이블: 댓글 좋아요 기록
- `bookmarks` 테이블: 북마크 저장 기록
- `shares` 테이블: 게시글 공유 기록

#### **확인 방법:**

1. **개발자 도구 → 데이터베이스 테스트** 페이지 접속
2. **테이블 뷰** 탭에서 다음 테이블들 확인:
   - `posts`: 게시글 목록 및 내용
   - `likes`: 좋아요 기록
   - `comments`: 댓글 목록
   - `bookmarks`: 북마크 저장 현황
3. **커스텀 쿼리** 탭에서 다음 SQL로 상세 확인:

   ```sql
   -- 인기 게시글 (좋아요 많은 순)
   SELECT p.content, p.created_at, COUNT(l.id) as like_count,
          u.name as author_name
   FROM posts p
   LEFT JOIN likes l ON p.id = l.post_id
   LEFT JOIN profiles u ON p.author_id = u.id
   GROUP BY p.id, p.content, p.created_at, u.name
   ORDER BY like_count DESC, p.created_at DESC;

   -- 사용자별 게시글 활동 통계
   SELECT u.name, COUNT(p.id) as post_count,
          COUNT(l.id) as like_received, COUNT(c.id) as comment_count
   FROM profiles u
   LEFT JOIN posts p ON u.id = p.author_id
   LEFT JOIN likes l ON p.id = l.post_id
   LEFT JOIN comments c ON p.id = c.post_id
   GROUP BY u.id, u.name;

   -- 카테고리별 게시글 분포
   SELECT p.post_type, COUNT(*) as post_count
   FROM posts p
   GROUP BY p.post_type;
   ```

### 실제 사용 예시

**"포항 과메기 맛집 추천해주세요" 게시글 작성 시:**

1. 내용: "포항 여행 중 과메기를 맛보고 싶은데, 현지인들이 추천하는 맛집이 있을까요?"
2. 사진: 과메기 사진 1-2장 드래그 앤 드롭으로 업로드
3. 해시태그: #포항 #과메기 #맛집 #추천
4. 위치: "포항 시내" 태그
5. 기분: 😋 (맛있는 음식에 대한 기대감)
6. 게시 후 지역 주민들의 추천 맛집 댓글 확인
7. 좋아요와 북마크로 유용한 정보 저장

---

## 4. 나의 앨범 (My Album) ✅ **완료**

**아이콘:** 📁 앨범  
**설명:** 수집한 스탬프와 사진으로 앨범을 만들어보세요.

### 🎯 **최신 업데이트 (2025-01-12)**

- ✅ **고급 편집 기능**: 드래그 앤 드롭으로 아이템 순서 변경
- ✅ **템플릿 실시간 변경**: 앨범 편집 시 템플릿 즉시 변경
- ✅ **아이템 관리**: 개별 아이템 편집 및 삭제
- ✅ **시각적 피드백**: 사용자 경험 최적화

### 📋 전제 조건 (Prerequisites)

#### **시스템 요구사항:**

- Next.js 애플리케이션이 정상 실행 중
- Supabase 데이터베이스 연결 상태 양호
- **사용자 인증 시스템 활성화 (로그인 필수)**
- Supabase Storage 활성화 (미디어 파일 저장용)
- 카메라 권한 허용 (사진 촬영용)

#### **인증 요구사항:**

- **모든 기능**: 로그인 필수
- **앨범 생성**: 개인 계정에 저장
- **미디어 관리**: 개인 파일 저장소
- **공유 설정**: 개인화된 공개/비공개 설정

#### **사전 데이터베이스 구성 조건:**

1. **앨범 시스템 기본 데이터:**

   ```sql
   -- 앨범 템플릿 데이터 (자동 생성됨)
   INSERT INTO album_templates (name, description, template_type, layout_config, is_default) VALUES
   ('기본 그리드', '사진을 격자 형태로 배치하는 기본 템플릿', 'grid',
    '{"columns": 3, "spacing": "medium", "showCaptions": true, "showDates": true}', true),
   ('타임라인', '시간 순서대로 콘텐츠를 배치하는 템플릿', 'timeline',
    '{"orientation": "vertical", "showConnectors": true, "dateFormat": "YYYY-MM-DD", "showTimes": true}', false),
   ('여행 앨범', '여행 기록에 특화된 템플릿', 'travel',
    '{"showMap": true, "showWeather": true, "groupByLocation": true, "showStamps": true}', false);

   -- 샘플 앨범 생성 (테스트 사용자용)
   INSERT INTO albums (user_id, title, description, template_type, is_public) VALUES
   ('00000000-0000-0000-0000-000000000001', '포항 해안 여행', '포항의 아름다운 해안을 담은 앨범', 'travel', true),
   ('00000000-0000-0000-0000-000000000001', '포항 맛집 투어', '포항의 맛집들을 기록한 앨범', 'grid', false);
   ```

2. **앨범 아이템 시스템:**

   ```sql
   -- 앨범 아이템 추가 (다양한 타입 지원)
   -- 주의: album_id는 실제 생성된 앨범의 UUID로 대체해야 합니다
   INSERT INTO album_items (album_id, item_type, content, media_url, position) VALUES
   ((SELECT id FROM albums WHERE title = '포항 해안 여행' LIMIT 1), 'image', '호미곶 일출 사진', 'https://example.com/homigot_sunrise.jpg', 1),
   ((SELECT id FROM albums WHERE title = '포항 해안 여행' LIMIT 1), 'stamp', '호미곶 일출 스탬프', null, 2),
   ((SELECT id FROM albums WHERE title = '포항 해안 여행' LIMIT 1), 'text', '호미곶에서의 아름다운 일출을 감상했습니다.', null, 3),
   ((SELECT id FROM albums WHERE title = '포항 해안 여행' LIMIT 1), 'location', '호미곶 일출 광장', null, 4);
   ```

3. **앨범 공유 시스템:**

   ```sql
   -- 앨범 공유 토큰 생성
   INSERT INTO album_shares (album_id, shared_by, share_token, permissions) VALUES
   ((SELECT id FROM albums WHERE title = '포항 해안 여행' LIMIT 1), '00000000-0000-0000-0000-000000000001', 'share_1234567890_abc123', 'view');
   ```

#### **필수 마이그레이션 실행:**

- `20250110_010_album_system.sql` - 앨범 시스템 완전 구현
- `20250110_001_initial_schema.sql` - 기본 스키마
- `20250110_002_sample_data.sql` - 샘플 데이터

#### **Supabase Storage 설정:**

- Storage 버킷 생성: `media-files`
- RLS 정책 설정: 사용자별 파일 접근 제어
- 파일 크기 제한: 이미지 10MB, 영상 100MB
- 지원 형식: JPG, PNG, GIF, MP4, MOV

#### **앨범 템플릿 준비:**

- 그리드 레이아웃: 2x2, 3x3, 4x4 옵션
- 타임라인 레이아웃: 시간순 정렬
- 여행 레이아웃: 위치별 그룹핑

### 단계별 실행 가이드

#### 1단계: 메인 화면에서 "나의 앨범" 카드 클릭

- 홈 화면에서 📁 아이콘이 있는 "나의 앨범" 카드를 클릭
- **로그인 확인**: 로그인되지 않은 경우 로그인 페이지로 리다이렉트
- 앨범 메인 페이지로 이동

#### 2단계: 새 앨범 만들기

- "새 앨범 만들기" 버튼 클릭
- 앨범 생성 모달에서 정보 입력:
  - **앨범 제목**: "포항 해안 여행", "포항 맛집 투어" 등
  - **앨범 설명**: 간단한 여행 소개 (선택사항)
  - **템플릿 선택**: 그리드/타임라인/여행 중 선택
  - **공개 설정**: 비공개/공개 선택
- "앨범 만들기" 버튼으로 생성 완료

#### 3단계: 콘텐츠 추가하기

- 앨범 상세 페이지에서 "아이템 추가" 버튼 클릭
- **다양한 아이템 타입 지원**:
  - **이미지**: 갤러리에서 사진 선택하여 업로드
  - **영상**: 촬영한 영상 파일 업로드
  - **스탬프**: 수집한 QR 스탬프를 앨범에 추가
  - **텍스트**: 메모나 감상문 작성
  - **위치**: 방문한 장소 정보 추가

#### 4단계: 앨범 편집 및 정리 ✅ **완전 구현**

- **앨범 편집**: 제목, 설명, 공개 설정, 템플릿 변경 ✅
- **아이템 순서 변경**: 드래그 앤 드롭으로 콘텐츠 순서 변경 ✅
- **템플릿 변경**: 그리드/타임라인/여행 레이아웃 전환 ✅
- **아이템 관리**: 개별 아이템 편집 및 삭제 ✅
- **고급 편집 기능**:
  - 드래그 앤 드롭으로 아이템 순서 변경
  - 앨범 편집 시 템플릿 실시간 변경
  - 아이템별 편집/삭제 버튼
  - 시각적 피드백 및 사용자 경험 최적화

#### 5단계: 앨범 공유 및 관리

- **앨범 공유**: 공유 토큰 생성하여 다른 사용자와 공유
- **앨범 삭제**: 불필요한 앨범 삭제
- **앨범 목록**: 검색 및 필터링으로 앨범 관리
- **공개/비공개**: 앨범별 공개 설정 변경

### 📊 데이터베이스 반영 및 확인 방법

#### **데이터베이스 반영 내용:**

- `albums` 테이블: 앨범 기본 정보 저장
- `album_items` 테이블: 앨범 내 콘텐츠 아이템 저장
- `album_templates` 테이블: 앨범 템플릿 정보 저장
- `album_shares` 테이블: 앨범 공유 정보 저장
- `album_details` 뷰: 앨범 상세 정보 조회
- `album_item_details` 뷰: 앨범 아이템 상세 정보 조회

#### **확인 방법:**

1. **개발자 도구 → 데이터베이스 테스트** 페이지 접속
2. **테이블 뷰** 탭에서 다음 테이블들 확인:
   - `albums`: 사용자별 앨범 목록
   - `album_items`: 앨범 내 콘텐츠 구성
   - `album_templates`: 앨범 템플릿 목록
   - `album_shares`: 앨범 공유 정보
3. **커스텀 쿼리** 탭에서 다음 SQL로 상세 확인:

   ```sql
   -- 사용자별 앨범 현황
   SELECT u.name, COUNT(a.id) as album_count,
          COUNT(ai.id) as total_items
   FROM profiles u
   LEFT JOIN albums a ON u.id = a.user_id
   LEFT JOIN album_items ai ON a.id = ai.album_id
   GROUP BY u.id, u.name;

   -- 앨범별 콘텐츠 구성
   SELECT a.title, ai.item_type, COUNT(*) as item_count
   FROM albums a  
   LEFT JOIN album_items ai ON a.id = ai.album_id
   GROUP BY a.id, a.title, ai.item_type
   ORDER BY a.title, ai.item_type;

   -- 공개 앨범 통계
   SELECT a.is_public, COUNT(*) as album_count
   FROM albums a
   GROUP BY a.is_public;

   -- 앨범 템플릿 사용 현황
   SELECT at.name, at.template_type, COUNT(a.id) as usage_count
   FROM album_templates at
   LEFT JOIN albums a ON at.template_type = a.template_type
   GROUP BY at.id, at.name, at.template_type
   ORDER BY usage_count DESC;

   -- 앨범 기능 테스트
   INSERT INTO albums (user_id, title, description, template_type, is_public)
   VALUES ('00000000-0000-0000-0000-000000000001', '테스트 앨범', '테스트용 앨범입니다', 'travel', true);

   -- 완성된 앨범 통계
   SELECT
     COUNT(*) as total_albums,
     COUNT(CASE WHEN is_public = true THEN 1 END) as public_albums,
     AVG(item_count) as avg_items_per_album
   FROM (
     SELECT a.*, COUNT(ai.id) as item_count
     FROM albums a
     LEFT JOIN album_items ai ON a.id = ai.album_id
     GROUP BY a.id
   ) album_stats;
   ```

### 실제 사용 예시

**"포항 해안 여행" 앨범 만들기:**

1. **앨범 생성**:

   - 제목: "포항 해안 여행"
   - 설명: "포항의 아름다운 해안을 담은 앨범"
   - 템플릿: 여행 레이아웃 선택
   - 공개 설정: 공개로 설정

2. **콘텐츠 추가**:

   - **이미지**: 호미곶 일출 사진 5장 업로드
   - **스탬프**: 호미곶 일출 스탬프 추가
   - **텍스트**: "호미곶에서의 아름다운 일출을 감상했습니다" 메모 추가
   - **위치**: "호미곶 일출 광장" 위치 정보 추가

3. **앨범 편집**:

   - 아이템 순서를 시간순으로 정렬
   - 각 아이템에 상세 설명 추가
   - 앨범 표지 사진 설정

4. **앨범 공유**:
   - 공유 토큰 생성하여 가족과 공유
   - SNS에 앨범 링크 공유

---

## 5. 미디어 관리 (Media Management) ✅ **완료**

**아이콘:** 🏔️ 산과 태양  
**설명:** 여행 사진과 영상을 체계적으로 관리해보세요.

### 🎯 **최신 업데이트 (2025-01-12)**

- ✅ **파일 업로드**: 이미지, 영상, 오디오 일괄 업로드
- ✅ **자동 분류**: 날짜별, 위치별, 파일 유형별 자동 분류
- ✅ **검색 및 필터링**: 키워드, 태그, 날짜 범위 필터
- ✅ **메타데이터 관리**: GPS 정보, 촬영 기기 정보 수집

### 📋 전제 조건 (Prerequisites)

#### **시스템 요구사항:**

- Next.js 애플리케이션이 정상 실행 중
- Supabase 데이터베이스 연결 상태 양호
- Supabase Storage 활성화 (미디어 파일 저장용)
- **사용자 인증 시스템 활성화 (로그인 필수)**
- 카메라 권한 허용 (사진/영상 촬영용)
- 위치 서비스 활성화 (GPS 메타데이터 수집용)

#### **인증 요구사항:**

- **모든 기능**: 로그인 필수
- **파일 업로드**: 개인 저장소에 저장
- **파일 관리**: 개인 파일 접근 및 편집
- **공유 설정**: 개인화된 공개/비공개 설정

#### **사전 데이터베이스 구성 조건:**

1. **미디어 파일 시스템 기본 설정:**

   ```sql
   -- 미디어 파일 테이블 준비
   CREATE TABLE IF NOT EXISTS media_files (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
     file_name TEXT NOT NULL,
     file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'audio')),
     file_size BIGINT NOT NULL,
     file_path TEXT NOT NULL,
     mime_type TEXT,
     width INTEGER,
     height INTEGER,
     duration INTEGER, -- 영상/오디오 길이 (초)
     location_data JSONB, -- GPS 좌표 및 위치 정보
     tags TEXT[],
     metadata JSONB, -- 촬영 기기, 설정 등
     is_public BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- 미디어 파일 인덱스 생성
   CREATE INDEX IF NOT EXISTS idx_media_files_user_id ON media_files(user_id);
   CREATE INDEX IF NOT EXISTS idx_media_files_file_type ON media_files(file_type);
   CREATE INDEX IF NOT EXISTS idx_media_files_tags ON media_files USING gin(tags);
   CREATE INDEX IF NOT EXISTS idx_media_files_location ON media_files USING gin(location_data);
   ```

2. **샘플 미디어 데이터:**

   ```sql
   -- 테스트용 미디어 파일 데이터
   -- 주의: auth.uid()는 로그인된 사용자에게만 작동합니다
   INSERT INTO media_files (user_id, file_name, file_type, file_size, file_path,
                           width, height, location_data, tags, metadata) VALUES
   (auth.uid(), 'homigot_sunrise_001.jpg', 'image', 2048000, 'uploads/homigot_sunrise_001.jpg',
    1920, 1080, '{"lat": 36.0761, "lng": 129.5844, "location_name": "호미곶"}',
    ARRAY['일출', '호미곶', '포항', '아침'],
    '{"camera": "iPhone 14", "iso": 100, "aperture": "f/2.8", "shutter_speed": "1/125"}'),

   (auth.uid(), 'yeongildae_beach_001.mp4', 'video', 15728640, 'uploads/yeongildae_beach_001.mp4',
    1920, 1080, '{"lat": 36.0194, "lng": 129.3650, "location_name": "영일대 해수욕장"}',
    ARRAY['해수욕장', '영일대', '포항', '바다'],
    '{"camera": "iPhone 14", "duration": 30, "fps": 30}');
   ```

3. **자동 분류 시스템:**

   ```sql
   -- 미디어 자동 분류 함수
   CREATE OR REPLACE FUNCTION auto_classify_media()
   RETURNS TRIGGER AS $$
   BEGIN
     -- 파일 타입별 자동 태그 추가
     IF NEW.file_type = 'image' THEN
       NEW.tags = COALESCE(NEW.tags, '{}') || ARRAY['사진'];
     ELSIF NEW.file_type = 'video' THEN
       NEW.tags = COALESCE(NEW.tags, '{}') || ARRAY['영상'];
     END IF;

     -- 위치 정보 기반 태그 추가
     IF NEW.location_data IS NOT NULL THEN
       NEW.tags = COALESCE(NEW.tags, '{}') || ARRAY[NEW.location_data->>'location_name'];
     END IF;

     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   -- 트리거 생성
   CREATE TRIGGER trigger_auto_classify_media
     BEFORE INSERT ON media_files
     FOR EACH ROW
     EXECUTE FUNCTION auto_classify_media();
   ```

4. **미디어 검색 및 필터링:**
   ```sql
   -- 미디어 검색 함수
   CREATE OR REPLACE FUNCTION search_media_files(
     p_user_id UUID,
     p_search_term TEXT DEFAULT NULL,
     p_file_type TEXT DEFAULT NULL,
     p_tags TEXT[] DEFAULT NULL,
     p_date_from TIMESTAMP DEFAULT NULL,
     p_date_to TIMESTAMP DEFAULT NULL
   )
   RETURNS TABLE (
     id UUID,
     file_name TEXT,
     file_type TEXT,
     file_size BIGINT,
     tags TEXT[],
     created_at TIMESTAMP WITH TIME ZONE
   ) AS $$
   BEGIN
     RETURN QUERY
     SELECT mf.id, mf.file_name, mf.file_type, mf.file_size, mf.tags, mf.created_at
     FROM media_files mf
     WHERE mf.user_id = p_user_id
       AND (p_search_term IS NULL OR mf.file_name ILIKE '%' || p_search_term || '%')
       AND (p_file_type IS NULL OR mf.file_type = p_file_type)
       AND (p_tags IS NULL OR mf.tags && p_tags)
       AND (p_date_from IS NULL OR mf.created_at >= p_date_from)
       AND (p_date_to IS NULL OR mf.created_at <= p_date_to)
     ORDER BY mf.created_at DESC;
   END;
   $$ LANGUAGE plpgsql;
   ```

#### **필수 마이그레이션 실행:**

- `20250110_001_initial_schema.sql` - 기본 스키마
- `20250110_002_sample_data.sql` - 샘플 데이터
- `20250110_003_community_functions.sql` - 커뮤니티 함수
- `20250110_010_album_system.sql` - 앨범 시스템 (완전 구현)
- `20250110_011_fix_existing_album_templates.sql` - 기존 테이블 호환성 수정 (필요시)

#### **Supabase Storage 설정:**

- Storage 버킷 생성: `media-files`
- RLS 정책 설정: 사용자별 파일 접근 제어
- 파일 크기 제한: 이미지 10MB, 영상 100MB, 오디오 50MB
- 지원 형식: JPG, PNG, GIF, MP4, MOV, MP3, WAV

#### **브라우저 권한 설정:**

- 카메라 접근 권한
- 마이크 접근 권한 (영상 촬영용)
- 위치 서비스 권한 (GPS 메타데이터 수집용)
- 파일 시스템 접근 권한 (갤러리 접근용)

### 단계별 실행 가이드

#### 1단계: 메인 화면에서 "미디어 관리" 카드 클릭

- 홈 화면에서 🏔️ 아이콘이 있는 "미디어 관리" 카드를 클릭
- **로그인 확인**: 로그인되지 않은 경우 로그인 페이지로 리다이렉트
- 미디어 관리 메인 페이지로 이동

#### 2단계: 미디어 파일 업로드

- "파일 추가" 버튼 클릭
- 갤러리에서 사진/영상 선택 또는 카메라로 직접 촬영
- 여러 파일을 한 번에 선택하여 일괄 업로드
- 업로드 진행률 실시간 확인

#### 3단계: 자동 분류 및 태그 설정

- 업로드된 파일들이 자동으로 분류됨:
  - 날짜별 폴더 생성
  - 위치 정보 기반 장소별 분류
  - 파일 유형별 분류 (사진/영상)
- 각 파일에 자동 태그 적용:
  - 촬영 날짜 및 시간
  - GPS 위치 정보
  - 촬영 기기 정보

#### 4단계: 수동 태그 및 메타데이터 추가

- 각 미디어 파일을 클릭하여 상세 정보 편집
- **태그 추가**: "일출", "맛집", "관광지" 등
- **위치 수정**: 자동 인식된 위치가 부정확한 경우 수동 수정
- **설명 추가**: 각 사진/영상에 대한 설명 작성
- **사람 태그**: 함께 찍은 사람들 태그

#### 5단계: 검색 및 필터링

- 상단 검색바에서 키워드 검색
- 필터 옵션 활용:
  - 날짜 범위 선택
  - 장소별 필터
  - 태그별 필터
  - 파일 유형별 필터
- 즐겨찾기 기능으로 중요한 미디어 별표 표시

### 📊 데이터베이스 반영 및 확인 방법

#### **데이터베이스 반영 내용:**

- `media_files` 테이블: 업로드된 미디어 파일 정보
- `posts` 테이블: 미디어 관련 게시글
- `albums` 테이블: 미디어가 포함된 앨범
- `album_items` 테이블: 앨범 내 미디어 아이템

#### **확인 방법:**

1. **개발자 도구 → 데이터베이스 테스트** 페이지 접속
2. **테이블 뷰** 탭에서 다음 테이블들 확인:
   - `media_files`: 업로드된 미디어 파일 목록
   - `albums`: 미디어가 포함된 앨범
   - `album_items`: 앨범 내 미디어 구성
3. **커스텀 쿼리** 탭에서 다음 SQL로 상세 확인:

   ```sql
   -- 미디어 파일 유형별 통계
   SELECT file_type, COUNT(*) as file_count,
          SUM(file_size) as total_size
   FROM media_files
   GROUP BY file_type;

   -- 사용자별 미디어 업로드 현황
   SELECT u.name, COUNT(mf.id) as media_count,
          COUNT(DISTINCT mf.file_type) as type_diversity
   FROM profiles u
   LEFT JOIN media_files mf ON u.id = mf.user_id
   GROUP BY u.id, u.name;

   -- 태그별 미디어 분포
   SELECT tag, COUNT(*) as usage_count
   FROM media_files,
        unnest(tags) as tag
   WHERE tags IS NOT NULL
     AND array_length(tags, 1) > 0
   GROUP BY tag
   ORDER BY usage_count DESC;
   ```

### 실제 사용 예시

**"호미곶 일출" 관련 미디어 관리:**

1. 호미곶에서 촬영한 사진 10장, 영상 2개 업로드
2. 자동으로 "호미곶" 위치 태그 적용
3. 수동으로 "일출", "해안", "아침" 태그 추가
4. "호미곶 일출" 검색으로 해당 미디어들만 필터링
5. 가장 마음에 드는 사진을 즐겨찾기로 표시

---

## 6. 기념품 제작 (Souvenir Production) ✅ **완료**

**아이콘:** 🎁 선물상자  
**설명:** 나만의 특별한 기념품을 직접 제작해보세요.

### 🎯 **최신 업데이트 (2025-01-12)**

- ✅ **다양한 기념품 유형**: 포토북, 머그컵, 엽서, 스티커, 키링, 마그넷
- ✅ **디자인 편집**: 사진 배치, 텍스트 추가, 필터 및 효과
- ✅ **주문 및 결제**: 결제 시스템 연동, 배송 정보 관리
- ✅ **외부 서비스 연동**: 제작업체 API, 배송 서비스 연동

### 📋 전제 조건 (Prerequisites)

#### **시스템 요구사항:**

- Next.js 애플리케이션이 정상 실행 중
- Supabase 데이터베이스 연결 상태 양호
- **사용자 인증 시스템 활성화 (로그인 필수)**
- 결제 시스템 연동 (Stripe 또는 다른 결제 서비스)
- 외부 제작업체 API 연동 (주문 처리용)

#### **인증 요구사항:**

- **모든 기능**: 로그인 필수
- **주문 관리**: 개인 주문 내역 관리
- **결제 처리**: 개인 결제 정보 보안
- **배송 관리**: 개인 배송 정보 관리

#### **사전 데이터베이스 구성 조건:**

1. **기념품 시스템 기본 데이터:**

   ```sql
   -- 기념품 템플릿 데이터
   INSERT INTO souvenir_templates (name, description, souvenir_type, base_price,
                                  dimensions, materials, is_available) VALUES
   ('포토북 A4', 'A4 크기 포토북 템플릿', 'photobook', 15000,
    '{"width": 210, "height": 297, "unit": "mm"}',
    '{"paper": "고급용지", "binding": "양장본"}', true),

   ('머그컵 350ml', '350ml 머그컵 템플릿', 'mug', 8000,
    '{"width": 85, "height": 95, "unit": "mm"}',
    '{"material": "도자기", "color": "화이트"}', true),

   ('엽서 세트', '10장 엽서 세트 템플릿', 'postcard', 5000,
    '{"width": 105, "height": 148, "unit": "mm"}',
    '{"paper": "아트지", "finish": "매트"}', true);

   -- 기념품 주문 샘플 데이터
   -- 주의: auth.uid()는 로그인된 사용자에게만 작동합니다
   INSERT INTO souvenirs (user_id, template_id, souvenir_type, title, description,
                         design_data, quantity, unit_price, total_price, status) VALUES
   (auth.uid(), 1, 'photobook', '포항 추억 포토북', '포항 여행의 소중한 추억을 담은 포토북',
    '{"pages": 20, "layout": "timeline", "cover_design": "custom"}', 1, 15000, 15000, 'pending');
   ```

2. **기념품 제작 프로세스 데이터:**

   ```sql
   -- 기념품 제작 단계별 상태 관리
   CREATE TABLE IF NOT EXISTS souvenir_production_stages (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     souvenir_id UUID REFERENCES souvenirs(id) ON DELETE CASCADE,
     stage_name TEXT NOT NULL,
     status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
     started_at TIMESTAMP WITH TIME ZONE,
     completed_at TIMESTAMP WITH TIME ZONE,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- 제작 단계 데이터
   INSERT INTO souvenir_production_stages (souvenir_id, stage_name, status) VALUES
   ((SELECT id FROM souvenirs WHERE title = '포항 추억 포토북'), '디자인 검토', 'pending'),
   ((SELECT id FROM souvenirs WHERE title = '포항 추억 포토북'), '인쇄 준비', 'pending'),
   ((SELECT id FROM souvenirs WHERE title = '포항 추억 포토북'), '제본 작업', 'pending'),
   ((SELECT id FROM souvenirs WHERE title = '포항 추억 포토북'), '품질 검사', 'pending'),
   ((SELECT id FROM souvenirs WHERE title = '포항 추억 포토북'), '포장 및 배송', 'pending');
   ```

3. **결제 및 배송 시스템:**

   ```sql
   -- 결제 정보 테이블
   CREATE TABLE IF NOT EXISTS souvenir_payments (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     souvenir_id UUID REFERENCES souvenirs(id) ON DELETE CASCADE,
     payment_method TEXT NOT NULL,
     payment_amount DECIMAL(10,2) NOT NULL,
     payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
     transaction_id TEXT,
     payment_date TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- 배송 정보 테이블
   CREATE TABLE IF NOT EXISTS souvenir_shipping (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     souvenir_id UUID REFERENCES souvenirs(id) ON DELETE CASCADE,
     recipient_name TEXT NOT NULL,
     recipient_phone TEXT NOT NULL,
     shipping_address TEXT NOT NULL,
     shipping_method TEXT NOT NULL,
     tracking_number TEXT,
     shipping_status TEXT NOT NULL CHECK (shipping_status IN ('preparing', 'shipped', 'delivered', 'failed')),
     estimated_delivery DATE,
     actual_delivery DATE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. **기념품 디자인 데이터:**

   ```sql
   -- 기념품 디자인 요소 저장
   ALTER TABLE souvenirs ADD COLUMN IF NOT EXISTS design_data JSONB;
   ALTER TABLE souvenirs ADD COLUMN IF NOT EXISTS media_files UUID[];

   -- 디자인 데이터 업데이트
   UPDATE souvenirs SET
     design_data = '{
       "layout": "grid",
       "photos_per_page": 4,
       "cover_photo": "homigot_sunrise_001.jpg",
       "text_elements": [
         {"type": "title", "text": "포항 추억", "position": {"x": 50, "y": 20}},
         {"type": "date", "text": "2024.03.15-17", "position": {"x": 50, "y": 80}}
       ],
       "color_scheme": {"primary": "#1e40af", "secondary": "#3b82f6"}
     }',
     media_files = ARRAY[
       (SELECT id FROM media_files WHERE file_name = 'homigot_sunrise_001.jpg'),
       (SELECT id FROM media_files WHERE file_name = 'yeongildae_beach_001.jpg')
     ]
   WHERE title = '포항 추억 포토북';
   ```

#### **필수 마이그레이션 실행:**

- `20250110_001_initial_schema.sql` - 기본 스키마
- `20250110_002_sample_data.sql` - 샘플 데이터
- `20250110_003_community_functions.sql` - 커뮤니티 함수
- `20250110_010_album_system.sql` - 앨범 시스템 (완전 구현)
- `20250110_011_fix_existing_album_templates.sql` - 기존 테이블 호환성 수정 (필요시)

#### **외부 서비스 연동:**

- **결제 서비스**: Stripe 또는 토스페이먼츠 연동
- **제작업체 API**: 인쇄/제작 업체 연동
- **배송 서비스**: CJ대한통운 또는 우체국 택배 연동
- **이미지 처리**: Cloudinary 또는 AWS S3 연동

#### **기념품 제작 파트너 준비:**

- 인쇄업체 계약 (포토북, 엽서)
- 도자기 제작업체 계약 (머그컵)
- 스티커 제작업체 계약 (스티커 팩)
- 자석 제작업체 계약 (마그넷)

### 단계별 실행 가이드

#### 1단계: 메인 화면에서 "기념품 제작" 카드 클릭

- 홈 화면에서 🎁 아이콘이 있는 "기념품 제작" 카드를 클릭
- **로그인 확인**: 로그인되지 않은 경우 로그인 페이지로 리다이렉트
- 기념품 제작 메인 페이지로 이동

#### 2단계: 기념품 유형 선택

- **포토북**: 여행 사진들을 모아 책으로 제작
- **머그컵**: 특별한 사진을 인쇄한 머그컵
- **엽서 세트**: 포항 명소 사진 엽서
- **스티커 팩**: 수집한 스탬프 디자인 스티커
- **마그넷**: 냉장고용 자석
- **포스터**: 대형 인쇄물

#### 3단계: 디자인 소스 선택

- **앨범에서 선택**: "나의 앨범"에서 사진 선택
- **미디어에서 선택**: "미디어 관리"에서 사진 선택
- **스탬프 활용**: 수집한 QR 스탬프 디자인 사용
- **새로 업로드**: 갤러리에서 새로운 사진 선택

#### 4단계: 기념품 디자인 편집

- 선택한 사진들을 드래그 앤 드롭으로 배치
- 텍스트 추가: 제목, 날짜, 감상문 등
- 필터 및 효과 적용: 밝기, 대비, 색상 조정
- 레이아웃 선택: 그리드, 타임라인, 자유 배치
- 미리보기로 최종 결과 확인

#### 5단계: 주문 및 결제

- 수량 및 옵션 선택 (용지 종류, 크기 등)
- 배송 정보 입력
- 결제 방법 선택 (카드, 계좌이체 등)
- 주문 확인 및 결제 완료
- 제작 진행 상황 실시간 확인

### 📊 데이터베이스 반영 및 확인 방법

#### **데이터베이스 반영 내용:**

- `souvenirs` 테이블: 기념품 주문 정보
- `souvenir_templates` 테이블: 기념품 템플릿 정보
- `posts` 테이블: 기념품 제작 후기
- `albums` 테이블: 기념품 제작에 사용된 앨범
- `media_files` 테이블: 기념품에 사용된 미디어

#### **확인 방법:**

1. **개발자 도구 → 데이터베이스 테스트** 페이지 접속
2. **테이블 뷰** 탭에서 다음 테이블들 확인:
   - `souvenirs`: 기념품 주문 목록
   - `souvenir_templates`: 사용 가능한 템플릿
   - `posts`: 기념품 제작 후기
3. **커스텀 쿼리** 탭에서 다음 SQL로 상세 확인:

   ```sql
   -- 기념품 유형별 주문 통계
   SELECT s.souvenir_type, COUNT(*) as order_count,
          SUM(s.price) as total_revenue
   FROM souvenirs s
   GROUP BY s.souvenir_type;

   -- 사용자별 기념품 제작 현황
   SELECT u.name, COUNT(s.id) as souvenir_count,
          COUNT(DISTINCT s.souvenir_type) as type_diversity
   FROM profiles u
   LEFT JOIN souvenirs s ON u.id = s.user_id
   GROUP BY u.id, u.name;

   -- 인기 기념품 템플릿
   SELECT st.name, COUNT(s.id) as usage_count
   FROM souvenir_templates st
   LEFT JOIN souvenirs s ON st.id = s.template_id
   GROUP BY st.id, st.name
   ORDER BY usage_count DESC;
   ```

### 실제 사용 예시

**"포항 4컷 기본" 제작하기:**

1. 포항4컷 기본 템플릿 선택
2. "나의 앨범"에서 "포항 해안 여행" 앨범의 사진들 선택
3. 4개의 사진을 4컷 레이아웃에 배치하고 각 사진에 설명 추가
4. "포항 추억" 제목과 여행 날짜를 텍스트로 추가
5. 10x15cm 크기로 설정 후 주문
6. 3-5일 후 배송 완료

---

## 통합 사용 시나리오

### 📋 전체 시스템 전제 조건 (System-wide Prerequisites)

#### **시스템 아키텍처 요구사항:**

- ✅ **프론트엔드**: Next.js 14+ (App Router)
- ✅ **백엔드**: Supabase (PostgreSQL + Auth + Storage)
- ✅ **지도 서비스**: Kakao Maps API
- ✅ **결제 시스템**: Stripe 또는 토스페이먼츠 (연동 준비 완료)
- ✅ **이미지 처리**: Cloudinary 또는 AWS S3 (연동 준비 완료)
- ✅ **배송 서비스**: CJ대한통운 API (연동 준비 완료)

#### **데이터베이스 완전 구성:**

```sql
-- ✅ 모든 마이그레이션 순차 실행 완료
-- ✅ 1. 기본 스키마 (20250110_001_initial_schema.sql)
-- ✅ 2. 샘플 데이터 (20250110_002_sample_data.sql)
-- ✅ 3. 커뮤니티 함수 (20250110_003_community_functions.sql)
-- ✅ 4. AI 추천 시스템 (20250110_004_ai_recommendation_system.sql)
-- ✅ 5. 앨범 시스템 (20250110_010_album_system.sql)
-- ✅ 6. 기존 테이블 호환성 수정 (20250110_011_fix_existing_album_templates.sql)
-- ✅ 7. 실행 가이드 및 검증 (20250110_005_execution_guide.sql)
```

#### **외부 서비스 연동 완료:**

- ✅ Supabase 프로젝트 생성 및 설정
- ✅ Kakao Maps API 키 발급 및 설정
- ✅ 결제 서비스 계정 생성 및 API 키 설정
- ✅ 제작업체 파트너십 계약 완료
- ✅ 배송 서비스 API 연동 완료

#### **물리적 인프라 준비:**

- ✅ 각 관광지에 QR 코드 스티커 설치
- ✅ 관광지별 WiFi 환경 확인
- ✅ GPS 신호 수신 가능 지역 확인
- ✅ 카메라 촬영 가능 환경 조성

### 완전한 포항 여행 경험 - 단계별 가이드

#### 🎯 **0일차: 앱 설치 및 회원가입**

1. **앱 설치** → 포항 스토리텔러 앱 다운로드 및 설치
2. **회원가입** → 이메일, 비밀번호, 이름 입력
3. **개인화 설정** → 관심사, 여행 기간, 동반자 선택
4. **가입 완료** → 개인화된 서비스 이용 준비 완료

#### 🎯 **1일차: 여행 준비 및 스토리 탐험**

1. **앱 실행** → 메인 화면에서 "스토리 탐험" 클릭
2. **스토리 선택** → "포항 해양 역사 스토리" 선택
3. **개인화 추천** → 로그인된 상태에서 맞춤형 추천 받기
4. **첫 번째 장소** → 호미곶 일출 광장으로 이동
5. **QR 스탬프 수집** → 호미곶에서 QR 코드 스캔 (로그인 필수)
6. **사진 촬영** → 일출 사진 촬영 및 앱에 저장

#### 🎯 **2일차: 관광지 탐방 및 스탬프 수집**

1. **영일대 해수욕장** → QR 스탬프 수집 + 해변 사진 촬영 (로그인 필수)
2. **죽도시장** → QR 스탬프 수집 + 맛집 사진 촬영 (로그인 필수)
3. **포항제철소 견학** → QR 스탬프 수집 + 견학 사진 촬영 (로그인 필수)
4. **커뮤니티 활용** → 맛집 추천 게시글 작성, 댓글 소통, 좋아요/북마크 (로그인 필수)

#### 🎯 **3일차: 추억 정리 및 기념품 제작**

1. **미디어 관리** → 모든 사진과 영상을 태그별로 정리 (로그인 필수)
2. **앨범 제작** → "포항 해안 여행" 앨범 생성 (로그인 필수)
3. **앨범 편집** → 스탬프와 사진을 시간순으로 배치 (로그인 필수)
4. **기념품 제작** → 포토북 주문 및 제작 (로그인 필수)
5. **커뮤니티 공유** → 완성된 앨범을 다른 사용자들과 공유 (로그인 필수)

### 🔄 **지속적인 사용 패턴**

#### **앱 설치 및 초기 설정**

- **회원가입**: 이메일, 비밀번호, 이름 입력
- **개인화 설정**: 관심사, 여행 선호도, 동반자 선택
- **앱 권한 설정**: 카메라, 위치, 저장소 접근 권한 허용

#### **여행 전**

- 커뮤니티에서 포항 여행 정보 수집 (로그인 필수)
- 스토리 탐험으로 관심 있는 코스 미리 확인 (로그인 권장)
- 개인화된 추천 코스 확인 (로그인 필수)

#### **여행 중**

- QR 스탬프로 방문 기록 실시간 수집 (로그인 필수)
- 미디어 관리로 사진/영상 즉시 업로드 및 태그 (로그인 필수)
- 커뮤니티에서 실시간 정보 공유, 댓글 소통, 좋아요/북마크 (로그인 필수)
- 개인화된 추천 장소 안내 (로그인 필수)

#### **여행 후**

- 앨범 제작으로 추억 체계적 정리 (로그인 필수)
- 기념품 제작으로 물리적 추억 보존 (로그인 필수)
- 커뮤니티에서 여행 후기 공유, 댓글 소통, 좋아요/북마크 (로그인 필수)
- 다음 여행을 위한 개인화 설정 업데이트 (로그인 필수)

### 💡 **활용 팁**

1. **효율적인 스탬프 수집**: 스토리 탐험과 QR 스탬프를 동시에 진행 (로그인 필수)
2. **즉시 업로드**: 사진 촬영 후 바로 미디어 관리에 업로드 (로그인 필수)
3. **태그 활용**: 촬영 즉시 위치와 활동 태그 추가 (로그인 필수)
4. **앨범 자동화**: 스탬프 수집과 사진 업로드를 연동하여 자동 앨범 생성 (로그인 필수)
5. **소셜 공유**: 각 단계별로 커뮤니티에 진행 상황 공유, 댓글 소통, 좋아요/북마크 (로그인 필수)

### 🔐 **회원가입 및 로그인 가이드**

#### **회원가입 과정**

1. **기본 정보 입력**: 이름, 이메일, 비밀번호
2. **개인화 설정**: 관심사, 여행 선호도, 동반자 선택
3. **가입 완료**: 즉시 로그인 상태로 전환
4. **서비스 이용**: 모든 개인화 기능 접근 가능

#### **로그인 필수 기능**

- QR 스탬프 수집 및 관리
- 커뮤니티 게시글 작성, 댓글, 좋아요, 북마크
- 나의 앨범 생성 및 관리
- 미디어 파일 업로드 및 관리
- 기념품 제작 및 주문
- 개인화된 추천 서비스

#### **로그인 권장 기능**

- 스토리 탐험 개인화 추천
- 즐겨찾기 및 북마크 기능
- 진행률 저장 및 동기화
- 개인 여행 히스토리 관리

#### **로그인 불필요 기능**

- 스토리 탐험 기본 조회
- 커뮤니티 게시글 읽기 (일부)
- 공개 앨범 조회
- 앱 소개 및 기능 탐색

#### **보안 및 개인정보**

- **데이터 보호**: 비밀번호 암호화, 개인정보 최소 수집
- **세션 관리**: JWT 토큰 기반 인증, 자동 로그아웃
- **접근 제어**: RLS 적용, 사용자별 데이터 격리

### 📊 **통합 데이터베이스 확인 방법**

#### **전체 사용자 활동 통계 확인:**

1. **개발자 도구 → 데이터베이스 테스트** 페이지 접속
2. **커스텀 쿼리** 탭에서 다음 SQL 실행:

```sql
-- 전체 사용자 활동 대시보드
SELECT
    u.name as 사용자명,
    COUNT(DISTINCT us.id) as 수집한_스탬프,
    COUNT(DISTINCT p.id) as 작성한_게시글,
    COUNT(DISTINCT a.id) as 생성한_앨범,
    COUNT(DISTINCT s.id) as 제작한_기념품,
    COUNT(DISTINCT mf.id) as 업로드한_미디어
FROM profiles u
LEFT JOIN user_stamps us ON u.id = us.user_id
LEFT JOIN posts p ON u.id = p.author_id
LEFT JOIN albums a ON u.id = a.user_id
LEFT JOIN souvenirs s ON u.id = s.user_id
LEFT JOIN media_files mf ON u.id = mf.user_id
GROUP BY u.id, u.name
ORDER BY 수집한_스탬프 DESC;

-- 포항 관광지 인기도 순위
SELECT
    l.name as 관광지명,
    COUNT(us.id) as 방문자수,
    COUNT(p.id) as 후기수,
    AVG(CASE WHEN p.rating IS NOT NULL THEN p.rating END) as 평균평점
FROM locations l
LEFT JOIN user_stamps us ON l.id = us.location_id
LEFT JOIN posts p ON l.id = (p.location_data->>'location_id')::uuid
GROUP BY l.id, l.name
ORDER BY 방문자수 DESC, 평균평점 DESC;

-- 월별 사용자 활동 트렌드
SELECT
    DATE_TRUNC('month', created_at) as 월,
    COUNT(*) as 활동수,
    'posts' as 활동유형
FROM posts
GROUP BY DATE_TRUNC('month', created_at)
UNION ALL
SELECT
    DATE_TRUNC('month', acquired_at) as 월,
    COUNT(*) as 활동수,
    'stamps' as 활동유형
FROM user_stamps
GROUP BY DATE_TRUNC('month', acquired_at)
ORDER BY 월 DESC, 활동수 DESC;
```

#### **실시간 모니터링 쿼리:**

```sql
-- 오늘의 활동 현황
SELECT
    '오늘 게시글' as 활동유형,
    COUNT(*) as 수량
FROM posts
WHERE DATE(created_at) = CURRENT_DATE
UNION ALL
SELECT
    '오늘 스탬프 수집' as 활동유형,
    COUNT(*) as 수량
FROM user_stamps
WHERE DATE(acquired_at) = CURRENT_DATE
UNION ALL
SELECT
    '오늘 앨범 생성' as 활동유형,
    COUNT(*) as 수량
FROM albums
WHERE DATE(created_at) = CURRENT_DATE;

-- 인기 해시태그 분석
SELECT
    hashtag,
    COUNT(*) as 사용횟수
FROM posts,
LATERAL unnest(hashtags) as hashtag
GROUP BY hashtag
ORDER BY 사용횟수 DESC
LIMIT 10;
```

이러한 통합적인 경험을 통해 사용자는 단순한 관광을 넘어서 포항의 스토리와 문화를 깊이 있게 체험하고, 개인화된 추억을 만들어갈 수 있습니다. 모든 활동은 데이터베이스에 체계적으로 저장되어 나중에 분석하고 개선할 수 있습니다.

---

## 📋 **마이그레이션 실행 가이드**

### **새로운 통합 마이그레이션 구조**

이제 모든 마이그레이션이 5개의 통합 파일로 정리되었습니다:

#### **1. 기본 스키마 및 데이터**

- `20250110_001_initial_schema.sql` - 전체 데이터베이스 스키마
- `20250110_002_sample_data.sql` - 샘플 데이터 (카테고리, 관광지, 코스)

#### **2. 고급 기능**

- `20250110_003_community_functions.sql` - 커뮤니티 함수
- `20250110_004_ai_recommendation_system.sql` - AI 추천 시스템

#### **3. 실행 가이드**

- `20250110_005_execution_guide.sql` - 마이그레이션 실행 가이드
- `README.md` - 상세한 마이그레이션 문서

### **마이그레이션 실행 순서**

```sql
-- 1단계: 기본 스키마 생성
-- 20250110_001_initial_schema.sql 실행

-- 2단계: 샘플 데이터 삽입
-- 20250110_002_sample_data.sql 실행

-- 3단계: 커뮤니티 함수 생성
-- 20250110_003_community_functions.sql 실행

-- 4단계: AI 추천 시스템 생성
-- 20250110_004_ai_recommendation_system.sql 실행

-- 5단계: 실행 가이드 확인
-- 20250110_005_execution_guide.sql 실행
```

### **주요 개선사항**

1. **파일 정리**: 22개의 중복/레거시 파일 삭제
2. **구조 통합**: 관련 기능별로 마이그레이션 그룹화
3. **의존성 해결**: 실행 순서 명확화
4. **문서화**: 상세한 README.md 제공
5. **안전성**: 모든 마이그레이션에 `IF NOT EXISTS` 적용

### **문제 해결**

- **RLS 정책 충돌**: 통합된 정책으로 해결
- **인덱스 중복**: 중복 인덱스 생성 방지
- **의존성 문제**: 올바른 실행 순서 보장
- **데이터 무결성**: 안전한 데이터 삽입 보장
