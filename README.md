# 🏛️ 포항 스토리 텔러 (Pohang StoryTeller)

포항의 역사와 문화를 체험할 수 있는 인터랙티브 스토리텔링 플랫폼입니다.

## ✨ 주요 기능

- 🗺️ **인터랙티브 지도**: 카카오맵 기반 포항 관광지 탐색
- 📖 **스토리 코스**: 포항의 역사와 문화를 담은 체험 코스
- 🎫 **스탬프 시스템**: QR 코드를 통한 스탬프 수집
- 📸 **앨범 생성**: AI 기반 자동 앨범 분류 및 생성
- 🎨 **DIY 기념품**: 포토 에디터를 통한 개인화된 기념품 제작
- 👥 **커뮤니티**: 여행 경험 공유 및 소통
- 📱 **QR 스캔**: 관광지 정보 및 스탬프 수집

## 🚀 Getting Started

### 개발 환경 설정

1. **저장소 클론**

```bash
git clone https://github.com/manitri1/pohangstoryteller.git
cd pohangstoryteller
```

2. **의존성 설치**

```bash
npm install
```

3. **환경 변수 설정**

```bash
cp env.example .env.local
```

`.env.local` 파일에 다음 환경 변수들을 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Kakao Map API
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key

# Next-Auth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. **개발 서버 실행**

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인할 수 있습니다.

## 🛠️ 기술 스택

### Frontend

- [Next.js 14](https://nextjs.org) - React 프레임워크
- [React 18](https://react.dev) - UI 라이브러리
- [TypeScript](https://www.typescriptlang.org) - 타입 안전성
- [Tailwind CSS](https://tailwindcss.com) - 스타일링
- [Shadcn UI](https://ui.shadcn.com) - UI 컴포넌트
- [Lucide React](https://lucide.dev) - 아이콘

### Backend & Database

- [Supabase](https://supabase.com) - 백엔드 서비스
- [Next-Auth](https://next-auth.js.org) - 인증
- [PostgreSQL](https://postgresql.org) - 데이터베이스

### 지도 & 위치 서비스

- [Kakao Map API](https://developers.kakao.com) - 지도 서비스
- [PostGIS](https://postgis.net) - 지리 정보 시스템

### 상태 관리 & 데이터 페칭

- [TanStack Query](https://tanstack.com/query) - 서버 상태 관리
- [Zustand](https://zustand-demo.pmnd.rs) - 클라이언트 상태 관리
- [React Hook Form](https://react-hook-form.com) - 폼 관리

### 유틸리티

- [date-fns](https://date-fns.org) - 날짜 처리
- [Zod](https://zod.dev) - 스키마 검증
- [es-toolkit](https://github.com/toss/es-toolkit) - 유틸리티 함수
- [react-use](https://github.com/streamich/react-use) - React 훅
- [ts-pattern](https://github.com/gvergnaud/ts-pattern) - 패턴 매칭

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── albums/            # 앨범 페이지
│   ├── community/         # 커뮤니티 페이지
│   ├── media/             # 미디어 페이지
│   ├── souvenirs/         # 기념품 페이지
│   ├── stamps/            # 스탬프 페이지
│   └── stories/           # 스토리 페이지
├── components/            # React 컴포넌트
│   ├── albums/            # 앨범 관련 컴포넌트
│   ├── auth/              # 인증 컴포넌트
│   ├── community/         # 커뮤니티 컴포넌트
│   ├── map/               # 지도 관련 컴포넌트
│   ├── souvenirs/         # 기념품 컴포넌트
│   ├── stamps/            # 스탬프 컴포넌트
│   ├── stories/           # 스토리 컴포넌트
│   └── ui/                # 공통 UI 컴포넌트
├── lib/                   # 유틸리티 함수
├── hooks/                 # 커스텀 훅
├── types/                 # TypeScript 타입 정의
└── data/                  # 정적 데이터
```

## 🚀 배포

### Vercel 배포

1. **Vercel 프로젝트 연결**

```bash
vercel --prod
```

2. **환경 변수 설정**
   Vercel 대시보드에서 다음 환경 변수들을 설정하세요:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_KAKAO_MAP_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### Supabase 설정

1. **Supabase 프로젝트 생성**
2. **마이그레이션 실행**

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 마이그레이션 실행
supabase db push
```

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 리포트
npm run test:report
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**포항 스토리 텔러** - 포항의 역사와 문화를 체험하는 새로운 방법 🏛️✨
