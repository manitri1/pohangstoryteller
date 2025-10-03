알겠습니다. 주어진 요구사항을 반영하여 **종합적인 UI/UX 디자인 가이드**를 작성했습니다.
색상 팔레트는 **보색 관계**를 기반으로 TailwindCSS에 맞게 제안했으며, 각 페이지별 핵심 목적, 구성 요소, 반응형 레이아웃, 상호작용 패턴까지 체계적으로 정리했습니다.

---

# 🎨 UI/UX Design Guide

## 1. Design System Overview

- **스타일 방향**: Modern (현대적), 따뜻하면서도 서정적이고 참여감을 주는 디자인
- **디자인 목표**:

  - 감성적인 참여 유도 (서정적 + 따뜻함)
  - 현대적이고 직관적인 사용성 (현대적 + 생동감)
  - 소셜/커뮤니티형 서비스의 상호작용 강화 (참여형)

- **레이아웃 원칙**:

  - **Grid system** 기반 (12-column)
  - 충분한 화이트 스페이스 확보
  - 사용자 시선 흐름을 고려한 시각적 계층 구조 (Typography scale, Color hierarchy)

---

## 2. Color Palette for TailwindCSS

| Category      | Role/Usage                       | Color Code | Tailwind Class Example |
| ------------- | -------------------------------- | ---------- | ---------------------- |
| Primary 500   | 브랜드 메인 컬러, 버튼, 주요 CTA | `#3B82F6`  | `bg-primary-500`       |
| Primary 700   | Hover, 강조 상태                 | `#1E40AF`  | `hover:bg-primary-700` |
| Secondary 500 | 보색 포인트 컬러 (따뜻함 강조)   | `#F59E0B`  | `text-secondary-500`   |
| Accent 500    | 하이라이트, 알림, 라벨           | `#10B981`  | `bg-accent-500`        |
| Neutral 50    | 배경, 섹션 구분                  | `#F9FAFB`  | `bg-neutral-50`        |
| Neutral 700   | 본문 텍스트                      | `#374151`  | `text-neutral-700`     |
| Neutral 900   | 제목, 헤드라인                   | `#111827`  | `text-neutral-900`     |

**보색 조합 근거**

- Primary Blue (`#3B82F6`) ↔ Secondary Warm Orange (`#F59E0B`): 시각적 대비로 생동감과 서정성을 동시에 제공
- Accent Green (`#10B981`): 자연스럽고 따뜻한 분위기 보완

---

## 3. Page Implementations

### 3.1 Root Route (`/`)

- **Core Purpose**: 서비스 첫인상 제공, 주요 기능/콘텐츠로의 게이트웨이
- **Key Components**:

  - 헤더(로고, 네비게이션, 로그인/회원가입 버튼)
  - Hero 섹션 (이미지 + 핵심 문구) → CTA 버튼
  - 주요 기능 소개 카드 (Grid layout, 3열)
  - 최신 콘텐츠 프리뷰
  - 푸터(회사 정보, 링크, SNS)

- **Layout Structure**:

  - Hero: 1열 (이미지 + 텍스트 2열 분할)
  - 기능 소개: 12-column grid, desktop은 3열, tablet은 2열, mobile은 1열

이미지 예시:

- Hero 섹션: [https://picsum.photos/1440/600](https://picsum.photos/1440/600)
- 기능 카드: [https://picsum.photos/400/300](https://picsum.photos/400/300)

---

### 3.2 Dashboard (`/dashboard`)

- **Core Purpose**: 사용자 맞춤형 콘텐츠 및 활동 현황 제공
- **Key Components**:

  - 사이드 네비게이션
  - 사용자 프로필 카드
  - 활동 피드 (리스트 or 카드 뷰)
  - 알림 위젯

- **Layout Structure**:

  - Desktop: 좌측 3열 Sidebar + 9열 Content
  - Tablet: 상단 네비게이션 + 하단 콘텐츠
  - Mobile: 햄버거 메뉴 + 단일 열

이미지 예시:

- 대시보드 피드: [https://picsum.photos/800/500](https://picsum.photos/800/500)

---

### 3.3 Profile (`/profile`)

- **Core Purpose**: 사용자 자기소개, 활동, 설정 관리
- **Key Components**:

  - 프로필 이미지 + 기본 정보
  - 활동 탭 (게시물, 댓글, 저장한 글 등)
  - 설정 버튼

- **Layout Structure**:

  - 상단 프로필 섹션 → 하단 탭 기반 콘텐츠
  - Grid: desktop은 2열, mobile은 단일 열

이미지 예시:

- 프로필 헤더: [https://picsum.photos/1200/400](https://picsum.photos/1200/400)

---

## 4. Layout Components

| Component | Routes 적용       | Core 구성 요소        | Responsive Behavior |
| --------- | ----------------- | --------------------- | ------------------- |
| Header    | `/`, `/dashboard` | 로고, 네비게이션, CTA | Mobile: 햄버거 메뉴 |
| Sidebar   | `/dashboard`      | 메뉴 리스트, 프로필   | Mobile: Drawer      |
| Card Grid | `/`, `/dashboard` | 콘텐츠 카드           | 3열 → 2열 → 1열     |
| Footer    | 모든 경로         | 회사정보, SNS 링크    | 항상 1열 유지       |

---

## 5. Interaction Patterns

- **버튼 Hover**: 색상 강조 (Primary 500 → Primary 700)
- **Form Input**: 포커스 시 Accent 500 Border
- **Card Hover**: 그림자 강조 (`shadow-lg`) + scale 1.02
- **모바일 햄버거 메뉴**: 슬라이드 인/아웃 트랜지션

---

## 6. Breakpoints

```scss
$breakpoints: (
  "mobile": 320px,
  "tablet": 768px,
  "desktop": 1024px,
  "wide": 1440px,
);
```

- **Mobile (320px 이상)**: 단일 열 레이아웃, 최소한의 UI
- **Tablet (768px 이상)**: 2열 배치, 네비게이션 가시성 향상
- **Desktop (1024px 이상)**: Sidebar + Content 구분
- **Wide (1440px 이상)**: Grid 최대 확장, 이미지/텍스트 비율 최적화

---

👉 여기까지 종합 UI/UX 디자인 가이드입니다.

원하시면 제가 이 내용을 **Figma 와이어프레임 구조**로도 정리해서 제공할 수 있습니다.
혹은 지금 단계에서 **스타일가이드 → 컴포넌트 라이브러리 변환**을 먼저 원하시나요?
