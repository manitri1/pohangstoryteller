# 포항 스토리텔러 Vercel 배포 가이드

## 📋 개요

포항 스토리텔러 프로젝트를 Vercel에 배포하기 위한 완전한 가이드입니다. 이 프로젝트는 Next.js 15, Supabase, Next-Auth, 카카오맵 API를 사용하는 풀스택 웹 애플리케이션입니다.

## 🚀 배포 전 준비사항

### 1. 필수 계정 및 서비스

- [Vercel 계정](https://vercel.com) (GitHub 계정으로 가입 권장)
- [Supabase 프로젝트](https://supabase.com)
- [카카오 개발자 계정](https://developers.kakao.com)
- [Google Cloud Console](https://console.cloud.google.com) (Google Maps API용)

### 2. 프로젝트 구조 확인

```
pohangstoryteller/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React 컴포넌트
│   ├── lib/                 # 유틸리티 및 설정
│   └── types/               # TypeScript 타입 정의
├── supabase/               # Supabase 마이그레이션
├── package.json
├── next.config.ts
└── tailwind.config.ts
```

## 🔧 환경 변수 설정

### 1. 로컬 환경 변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정합니다:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next-Auth 설정
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# 카카오맵 API
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key

# Google Maps API (선택사항)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# OpenAI API (AI 기능용)
OPENAI_API_KEY=your_openai_api_key
```

### 2. 환경 변수 값 생성 방법

#### NEXTAUTH_SECRET 생성

```bash
# 터미널에서 실행
openssl rand -base64 32
```

#### Supabase 설정

1. [Supabase 대시보드](https://supabase.com/dashboard)에서 프로젝트 생성
2. Settings > API에서 URL과 anon key 복사
3. Service Role Key는 주의해서 관리 (서버 사이드에서만 사용)

#### 카카오맵 API 키 발급

1. [카카오 개발자 콘솔](https://developers.kakao.com) 접속
2. 애플리케이션 생성
3. 플랫폼 설정에서 Web 플랫폼 추가
4. JavaScript 키 복사

## 🚀 Vercel 배포 단계

### 1. GitHub 저장소 준비

```bash
# Git 저장소 초기화 (아직 안 했다면)
# Git 저장소 초기화
git init

# 모든 파일을 스테이징
git add .

# 첫 커밋 생성
git commit -m "Initial commit"

# GitHub에 저장소 생성 후 원격 저장소 연결
git remote add origin https://github.com/yourusername/pohangstoryteller.git

# main 브랜치로 푸시 (최초 업로드)
git push -u origin main

### 2. Vercel 프로젝트 생성

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./pohangstoryteller` (프로젝트가 하위 폴더에 있는 경우)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (기본값)

### 3. 환경 변수 설정 (Vercel)

Vercel 대시보드에서 프로젝트 설정 > Environment Variables에서 다음 변수들을 추가:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next-Auth
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://your-domain.vercel.app

# API Keys
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 4. 빌드 설정 확인

`vercel.json` 파일을 프로젝트 루트에 생성 (선택사항):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## 🗄️ Supabase 데이터베이스 설정

### 1. 마이그레이션 실행

```bash
# Supabase CLI 설치 (로컬에서)
npm install -g supabase

# Supabase 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

### 2. 필수 테이블 생성

Supabase 대시보드에서 SQL Editor를 사용하여 다음 테이블들을 생성:

```sql
-- 사용자 프로필 테이블
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 코스 테이블
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER, -- 분 단위
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 코스 포인트 테이블
CREATE TABLE course_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_points ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "Public courses are viewable by everyone" ON courses FOR SELECT USING (true);
CREATE POLICY "Public course points are viewable by everyone" ON course_points FOR SELECT USING (true);
```

## 🔐 인증 설정

### 1. Next-Auth 설정 확인

`src/lib/auth.ts` 파일에서 인증 프로바이더 설정:

```typescript
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // ... 기존 설정
};
```

### 2. Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI에 추가:
   - `http://localhost:3000/api/auth/callback/google` (개발용)
   - `https://your-domain.vercel.app/api/auth/callback/google` (프로덕션용)

## 🗺️ 지도 API 설정

### 1. 카카오맵 API 설정

1. [카카오 개발자 콘솔](https://developers.kakao.com)에서 애플리케이션 설정
2. 플랫폼 > Web에서 도메인 추가:
   - `https://your-domain.vercel.app`
   - `https://your-domain.vercel.app/*`

### 2. Google Maps API 설정 (선택사항)

1. [Google Cloud Console](https://console.cloud.google.com)에서 API 활성화
2. Maps JavaScript API 활성화
3. API 키 생성 및 도메인 제한 설정

## 🚀 배포 실행

### 1. 자동 배포

GitHub에 코드를 푸시하면 Vercel이 자동으로 배포합니다:

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### 2. 수동 배포

Vercel CLI를 사용한 수동 배포:

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 디렉토리에서 배포
cd pohangstoryteller
vercel

# 프로덕션 배포
vercel --prod
```

## 🔍 배포 후 확인사항

### 1. 기본 기능 테스트

- [ ] 홈페이지 로딩 확인
- [ ] 지도 표시 확인
- [ ] 인증 로그인/로그아웃 테스트
- [ ] API 엔드포인트 동작 확인

### 2. 환경 변수 확인

Vercel 대시보드에서 모든 환경 변수가 올바르게 설정되었는지 확인

### 3. 도메인 설정

- Vercel에서 제공하는 기본 도메인 확인
- 커스텀 도메인 연결 (선택사항)

## 🛠️ 문제 해결

### 1. 빌드 오류

```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 문제 해결
rm -rf node_modules package-lock.json
npm install
```

### 2. 환경 변수 오류

- Vercel 대시보드에서 환경 변수 재확인
- 변수명 대소문자 확인
- 따옴표 없이 값만 입력

### 3. API 오류

- CORS 설정 확인
- API 키 유효성 확인
- 도메인 화이트리스트 확인

### 4. 지도 로딩 오류

- 카카오맵 API 키 확인
- 도메인 설정 확인
- Content Security Policy 설정 확인

## 📊 모니터링 및 최적화

### 1. Vercel Analytics

Vercel 대시보드에서 성능 메트릭 확인

### 2. 에러 모니터링

```bash
# Sentry 설정 (선택사항)
npm install @sentry/nextjs
```

### 3. 성능 최적화

- 이미지 최적화 확인
- 번들 크기 분석
- Core Web Vitals 모니터링

## 🔄 지속적 배포

### 1. 브랜치별 배포

- `main` 브랜치: 프로덕션 배포
- `develop` 브랜치: 스테이징 배포
- `feature/*` 브랜치: 프리뷰 배포

### 2. 환경별 설정

- 개발: `localhost:3000`
- 스테이징: `staging.your-domain.vercel.app`
- 프로덕션: `your-domain.vercel.app`

## 📝 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 배포 가이드](https://supabase.com/docs/guides/getting-started)
- [카카오맵 API 문서](https://apis.map.kakao.com/web/guide/)

---

## 🎉 배포 완료!

배포가 성공적으로 완료되면 다음과 같은 URL에서 애플리케이션에 접근할 수 있습니다:

- **프로덕션**: `https://your-project-name.vercel.app`
- **스테이징**: `https://your-project-name-git-develop.vercel.app`

문제가 발생하면 Vercel 대시보드의 Functions 탭에서 로그를 확인하거나, 이 가이드의 문제 해결 섹션을 참고하세요.
