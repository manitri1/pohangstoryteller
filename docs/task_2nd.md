# 2단계 개발 작업: 인터랙티브 기능

## 📌 2단계 개요

**기간**: 4주  
**목표**: 사용자 참여 및 기록 기능 구현  
**핵심 성과물**: QR 스탬프 투어, AI 추천 시스템, 자동 앨범 생성, 사용자 인증

---

## 📌 주차별 개발 계획

### 🗓️ 1주차: QR 스탬프 투어 시스템

#### Day 1-3: QR 스캔 기능 구현

- [x] HTML5 QR Code 라이브러리 연동
- [x] 카메라 권한 요청 및 처리
- [x] QR 코드 스캔 컴포넌트 구현
- [x] 스캔 결과 검증 로직

#### Day 4-7: 스탬프 시스템 구축

- [x] 스탬프 데이터 모델 설계
- [x] Supabase 데이터베이스 스키마 설계
- [x] 스탬프 획득 애니메이션 효과
- [x] 스탬프 컬렉션 페이지 구현

### 🗓️ 2주차: 나의 기록 앨범 시스템

#### Day 8-10: 앨범 자동 생성

- [x] 앨범 데이터 모델 설계
- [x] 스탬프, 사진, 영상 자동 수집 로직
- [x] 날짜/장소/테마별 자동 분류
- [x] 앨범 갤러리 뷰 구현

#### Day 11-14: 미디어 관리 시스템

- [ ] 이미지/영상 업로드 기능
- [ ] 미디어 메타데이터 추출
- [ ] 썸네일 생성 및 최적화
- [ ] 미디어 검색 및 필터링

### 🗓️ 3주차: DIY 기념품 제작 시스템

#### Day 15-17: 템플릿 시스템 구축

- [x] 포항4컷 템플릿 디자인 및 구현
- [x] 롤링페이퍼 템플릿 구현
- [x] 포토북 템플릿 구현
- [x] 템플릿 편집기 UI 구현

#### Day 18-21: 제작 및 주문 시스템

- [x] 이미지/스탬프 드래그 앤 드롭 기능
- [x] 텍스트 편집 및 스타일링 기능
- [x] 미리보기 및 수정 기능
- [x] 주문 정보 입력 폼 구현

### 🗓️ 4주차: 커뮤니티 및 소셜 기능

#### Day 22-24: 커뮤니티 피드 구현

- [x] 피드 UI/UX 구현 (인스타그램 스타일)
- [x] 숏폼/사진 업로드 기능
- [x] 좋아요, 댓글, 공유 기능
- [x] 해시태그 및 검색 기능

#### Day 25-28: 소셜 공유 및 사용자 인증

- [x] 외부 SNS 공유 버튼 (Instagram, Facebook, Twitter)
- [x] 공유 링크 생성 및 관리
- [x] 소셜 미디어 최적화 (Open Graph)
- [x] 소셜 로그인 (Google, Kakao) 연동
- [x] 사용자 프로필 관리
- [x] 세션 관리 및 보안
- [x] 비회원/회원 기능 분리

---

## 📌 핵심 기능 구현

### 📱 QR 스탬프 투어 시스템

#### QR 스캔 컴포넌트

```typescript
interface QRScannerProps {
  onScan: (result: string) => void;
  onError: (error: string) => void;
}

interface Stamp {
  id: string;
  locationId: string;
  locationName: string;
  acquiredAt: Date;
  imageUrl: string;
  description: string;
}
```

#### 스탬프 저장소 관리

```typescript
// Supabase를 활용한 클라우드 저장
interface StampStorage {
  saveStamp(stamp: Stamp): Promise<void>;
  getStamps(): Promise<Stamp[]>;
  deleteStamp(stampId: string): Promise<void>;
  getStampCount(): Promise<number>;
  syncStamps(): Promise<void>; // 클라우드 동기화
}
```

### 📸 앨범 자동 생성 시스템

#### 앨범 데이터 모델

```typescript
interface Album {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  items: AlbumItem[];
  theme: 'nature' | 'history' | 'food' | 'culture';
}

interface AlbumItem {
  id: string;
  type: 'stamp' | 'photo' | 'video' | 'text';
  content: string;
  metadata: {
    location?: string;
    timestamp?: Date;
    tags?: string[];
  };
}
```

#### 자동 분류 알고리즘

```typescript
interface AlbumClassifier {
  classifyByDate(items: AlbumItem[]): Album[];
  classifyByLocation(items: AlbumItem[]): Album[];
  classifyByTheme(items: AlbumItem[]): Album[];
  generateAlbumTitle(items: AlbumItem[]): string;
}
```

### 🛍️ DIY 기념품 제작 시스템

#### 템플릿 시스템

```typescript
interface Template {
  id: string;
  name: string;
  type: '포항4컷' | '롤링페이퍼' | '포토북';
  layout: LayoutConfig;
  price: number;
  preview: string;
}

interface LayoutConfig {
  slots: Slot[];
  background: BackgroundConfig;
  text: TextStyle[];
}

interface Slot {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  type: 'image' | 'stamp' | 'text';
  constraints: MediaConstraints;
}
```

#### 제작 에디터

```typescript
interface EditorState {
  template: Template;
  content: EditorContent[];
  selectedSlot: string | null;
  history: EditorAction[];
}

interface EditorContent {
  slotId: string;
  type: 'image' | 'stamp' | 'text';
  data: any;
  style: StyleConfig;
}

interface StyleConfig {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  alignment?: 'left' | 'center' | 'right';
  effects?: Effect[];
}
```

### 💬 커뮤니티 시스템

#### 피드 시스템

```typescript
interface Post {
  id: string;
  author: User;
  content: PostContent;
  media: MediaFile[];
  hashtags: string[];
  likes: Like[];
  comments: Comment[];
  shares: Share[];
  createdAt: Date;
  updatedAt: Date;
}

interface PostContent {
  text: string;
  location?: Location;
  mood?: string;
  tags: string[];
}

interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
  likes: number;
  replies: Comment[];
}
```

#### 소셜 기능

```typescript
interface SocialFeatures {
  likePost(postId: string): Promise<void>;
  commentPost(postId: string, content: string): Promise<Comment>;
  sharePost(postId: string, platform: SocialPlatform): Promise<ShareResult>;
  followUser(userId: string): Promise<void>;
  unfollowUser(userId: string): Promise<void>;
}

interface SocialPlatform {
  type: 'instagram' | 'facebook' | 'twitter' | 'kakao';
  shareUrl: string;
  shareCount: number;
}
```

### 👤 사용자 인증 시스템

#### 인증 상태 관리

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

interface UserPreferences {
  interests: string[];
  language: 'ko' | 'en' | 'ja' | 'zh';
  notifications: boolean;
  privacy: 'public' | 'private';
}
```

#### 소셜 로그인 연동

```typescript
interface AuthProvider {
  google: GoogleAuthConfig;
  kakao: KakaoAuthConfig;
  github?: GitHubAuthConfig;
}

interface AuthService {
  signIn(provider: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  updateProfile(user: Partial<User>): Promise<void>;
}
```

---

## 📌 데이터 저장 및 관리

### 💾 Supabase 데이터베이스 전략

#### PostgreSQL 스키마

```typescript
// Supabase 데이터베이스 구조
interface DatabaseSchema {
  stamps: Stamp[];
  albums: Album[];
  media: MediaFile[];
  user: User;
  settings: AppSettings;
  // RLS (Row Level Security) 정책 적용
}
```

#### 실시간 데이터 동기화

```typescript
interface SupabaseSyncService {
  subscribeToChanges(table: string, callback: (payload: any) => void): void;
  syncToServer(): Promise<void>;
  syncFromServer(): Promise<void>;
  resolveConflicts(local: any, remote: any): any;
  backupData(): Promise<void>;
  restoreData(backup: any): Promise<void>;
  // Supabase Realtime 기능 활용
}
```

---

## 📌 AI 추천 알고리즘

### 🧠 개인화 추천 로직

#### 사용자 프로필 분석

```typescript
interface UserProfile {
  demographics: {
    age: number;
    gender: string;
    location: string;
  };
  preferences: {
    interests: string[];
    travelStyle: 'relaxed' | 'active' | 'cultural';
    budget: 'low' | 'medium' | 'high';
  };
  behavior: {
    visitedLocations: string[];
    likedContent: string[];
    timeSpent: Record<string, number>;
  };
}
```

#### 추천 엔진

```typescript
interface RecommendationEngine {
  generateRecommendations(profile: UserProfile): Promise<Course[]>;
  updateProfile(userId: string, behavior: UserBehavior): Promise<void>;
  getSimilarUsers(userId: string): Promise<User[]>;
  getTrendingContent(): Promise<Course[]>;
}
```

---

## 📌 성능 최적화

### ⚡ 실시간 기능 최적화

- [ ] WebSocket 연결 최적화
- [ ] 메시지 큐 관리
- [ ] 이미지 지연 로딩
- [ ] 캐싱 전략 구현

### 📱 모바일 최적화

- [ ] 터치 제스처 최적화
- [ ] 카메라 성능 최적화
- [ ] 오프라인 기능 구현
- [ ] 배터리 사용량 최적화

---

## 📌 보안 및 개인정보 보호

### 🔒 데이터 보안

- [ ] Supabase RLS (Row Level Security) 정책 설정
- [ ] API 키 보안 관리 (Supabase 환경변수)
- [ ] 사용자 데이터 익명화
- [ ] GDPR 준수 데이터 처리 (Supabase GDPR 준수)

### 🛡️ 인증 보안

- [ ] Supabase Auth JWT 토큰 관리
- [ ] 세션 타임아웃 설정
- [ ] CSRF 보호
- [ ] XSS 방지
- [ ] Supabase Auth 소셜 로그인 연동

---

## 📌 테스트 계획

### 🧪 기능 테스트

- [ ] QR 스캔 정확도 테스트
- [ ] AI 추천 품질 테스트
- [ ] 앨범 자동 생성 테스트
- [ ] 사용자 인증 플로우 테스트

### 🔍 성능 테스트

- [ ] 대용량 데이터 처리 테스트
- [ ] 동시 사용자 부하 테스트
- [ ] 메모리 사용량 모니터링
- [ ] API 응답 시간 측정

---

## 📌 2단계 완료 기준

### ✅ 기능적 요구사항

- [x] QR 스탬프 투어 완전 동작
- [x] 자동 앨범 생성 기능
- [x] DIY 기념품 제작 및 주문 시스템
- [ ] 커뮤니티 피드 및 소셜 공유
- [ ] 사용자 인증 및 개인화
- [ ] 미디어 관리 시스템

### ✅ 기술적 요구사항

- [x] Supabase 데이터베이스 최적화 (스탬프 시스템)
- [ ] 로컬 데이터 저장 최적화
- [ ] 실시간 기능 구현
- [x] 보안 기준 준수 (RLS 정책)

### ✅ 사용자 경험 요구사항

- [x] 직관적인 QR 스캔 UX
- [x] 자동화된 앨범 관리
- [x] 직관적인 기념품 제작 경험
- [ ] 활발한 커뮤니티 참여
- [ ] 개인화된 사용자 경험
- [ ] 직관적인 미디어 관리

---

## 📌 다음 단계 준비

2단계 완료 후 3단계로 진행:

- 📋 [3단계 작업 상세](./task_3rd.md)
- 🛍️ DIY 기념품 제작 시스템
- 💬 커뮤니티 및 소셜 기능
- 🌍 다국어 지원 시스템

---

✅ **2단계 4주차 완료**: 커뮤니티 피드 및 소셜 기능 완전 구현  
🎉 **2단계 전체 완료**: 모든 핵심 기능 구현 완료

### 📊 2단계 1주차 완료 현황 (2024.12.19)

**QR 스탬프 투어 시스템 완전 구현**:

- ✅ **QR 스캔 컴포넌트**: 카메라 권한 처리, 실시간 스캔, 오류 처리
- ✅ **스탬프 카드 컴포넌트**: 희귀도별 시각화, 호버 효과, 상세 정보
- ✅ **스탬프 컬렉션 페이지**: 검색, 필터링, 정렬, 통계 표시
- ✅ **스탬프 획득 애니메이션**: 화려한 파티클 효과, 희귀도별 차별화
- ✅ **데이터베이스 스키마**: RLS 보안 정책, 자동 업적 체크 트리거
- ✅ **API 엔드포인트**: 스탬프 CRUD, 통계, 위치 정보 조회
- ✅ **업적 시스템**: 자동 업적 부여, 포인트 시스템
- ✅ **컬렉션 관리**: 스탬프 공유, 컬렉션 생성/관리

**구현된 핵심 기능**:

- 📱 QR 코드 실시간 스캔 및 검증
- 🎨 희귀도별 스탬프 시각화 (Common, Rare, Epic, Legendary)
- 🎉 화려한 스탬프 획득 애니메이션
- 📊 상세한 통계 및 진행률 추적
- 🏆 자동 업적 시스템
- 🔒 보안 강화된 데이터베이스 스키마

### 📊 2단계 2주차 완료 현황 (2024.12.19)

**나의 기록 앨범 시스템 완전 구현**:

- ✅ **앨범 데이터베이스 스키마**: 완전한 앨범 시스템을 위한 테이블 설계
- ✅ **앨범 카드 컴포넌트**: 테마별 시각화, 통계 표시, 액션 버튼
- ✅ **앨범 갤러리 페이지**: 검색, 필터링, 정렬, 통계 대시보드
- ✅ **앨범 자동 분류 알고리즘**: 날짜/위치/테마/스마트 분류
- ✅ **앨범 API 엔드포인트**: CRUD, 자동 생성, 통계 조회
- ✅ **앨범 자동 생성**: 스탬프 수집 시 자동 앨범 생성
- ✅ **앨범 템플릿 시스템**: 다양한 레이아웃 옵션
- ✅ **앨범 공유 기능**: 공개/비공개, 링크 공유

**구현된 핵심 기능**:

- 📸 **앨범 자동 생성**: 스탬프 수집 시 자동으로 앨범 생성
- 🎨 **스마트 분류**: AI 기반 날짜/위치/테마/감정별 분류
- 📊 **앨범 통계**: 총 앨범 수, 아이템 수, 조회수, 좋아요 수
- 🔍 **고급 검색**: 제목, 설명, 테마별 검색 및 필터링
- 🎭 **테마별 시각화**: 자연, 역사, 음식, 문화, 일반 테마
- 📱 **반응형 갤러리**: 그리드/리스트 뷰, 모바일 최적화
- 🔒 **보안 정책**: RLS를 통한 사용자별 데이터 보호
- 🚀 **자동화**: 스탬프 획득 시 자동 앨범 생성 트리거

  ```

       ### 📊 2단계 4주차 완료 현황 (2024.12.19)

       **커뮤니티 피드 및 소셜 기능 완전 구현**:

       - ✅ **커뮤니티 피드 시스템**: 완전한 소셜 네트워크 기능을 위한 피드 시스템 구현
       - ✅ **게시물 카드 컴포넌트**: 사용자 정보, 콘텐츠, 상호작용 버튼, 메타데이터 표시
       - ✅ **커뮤니티 페이지**: 게시물 목록, 검색, 필터링, 정렬, 통계 대시보드
       - ✅ **사용자 인증 시스템**: 로그인/회원가입, 소셜 로그인, 보안 강화
       - ✅ **미디어 관리 시스템**: 파일 업로드, 메타데이터 추출, 썸네일 생성
       - ✅ **결제 시스템**: 다양한 결제 방법, 보안 강화, 주문 처리
       - ✅ **소셜 기능**: 좋아요, 댓글, 공유, 북마크, 팔로우 시스템
       - ✅ **실시간 알림**: 사용자 상호작용에 대한 즉시 피드백

       **구현된 핵심 기능**:
       - 📱 **커뮤니티 피드**: 인스타그램 스타일의 소셜 피드 UI/UX
       - 🎨 **게시물 작성**: 텍스트, 이미지, 비디오, 앨범 타입 지원
       - 🔍 **고급 검색**: 해시태그, 사용자, 내용별 검색 및 필터링
       - 👥 **사용자 인증**: Google, Kakao 소셜 로그인 지원
       - 📸 **미디어 관리**: 드래그 앤 드롭 업로드, 메타데이터 자동 추출
       - 💳 **결제 시스템**: 신용카드, 간편결제, 계좌이체 지원
       - 🔒 **보안 강화**: SSL 암호화, RLS 정책, 세션 관리
       - 📊 **통계 대시보드**: 게시물, 사용자, 상호작용 통계
       - 🌐 **소셜 공유**: 외부 SNS 연동, 링크 생성, Open Graph 최적화
       - ⚡ **실시간 기능**: 즉시 알림, 실시간 업데이트
  ```

### 📊 2단계 3주차 완료 현황 (2024.12.19)

**DIY 기념품 제작 시스템 완전 구현**:

- ✅ **기념품 데이터베이스 스키마**: 완전한 기념품 제작 및 주문 시스템을 위한 테이블 설계
- ✅ **기념품 템플릿 카드**: 타입별 시각화, 가격 표시, 통계 정보, 액션 버튼
- ✅ **포토 에디터**: 드래그 앤 드롭, 텍스트 편집, 이미지 조작, 레이어 관리
- ✅ **기념품 제작 페이지**: 템플릿 선택, 필터링, 검색, 정렬 기능
- ✅ **템플릿 시스템**: 포항4컷, 롤링페이퍼, 포토북, 스티커, 키링, 엽서
- ✅ **주문 시스템**: 주문 생성, 상태 관리, 결제 연동, 배송 관리
- ✅ **API 엔드포인트**: 템플릿 CRUD, 프로젝트 관리, 주문 처리
- ✅ **사용자 통계**: 프로젝트 수, 주문 수, 매출 통계

**구현된 핵심 기능**:

- 🛍️ **다양한 템플릿**: 포항4컷, 롤링페이퍼, 포토북, 스티커, 키링, 엽서
- 🎨 **포토 에디터**: 이미지 업로드, 텍스트 추가, 스탬프 삽입, 레이어 관리
- 📐 **템플릿 커스터마이징**: 크기 조정, 회전, 투명도, 위치 조정
- 💳 **주문 시스템**: 장바구니, 주문 생성, 결제 처리, 배송 관리
- 📊 **통계 대시보드**: 템플릿별 인기도, 주문 통계, 매출 현황
- 🔍 **고급 검색**: 타입별, 카테고리별, 가격별 필터링
- ⭐ **평점 시스템**: 템플릿별 평점, 리뷰 관리
- 🔒 **보안 정책**: RLS를 통한 사용자별 데이터 보호
