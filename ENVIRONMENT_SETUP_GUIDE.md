# 환경 변수 설정 가이드

## 🚨 근본적인 해결책

### 1. 로컬 개발 환경 설정

#### `.env.local` 파일 생성

```bash
# 프로젝트 루트에 .env.local 파일 생성
touch .env.local
```

#### 필수 환경 변수 설정

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://dfnqxobgwxmxywlpwvov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_supabase_service_role_key

# Kakao Map API
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key

# Next-Auth 설정
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# 개발 환경 설정
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
```

### 2. Vercel 배포 환경 설정

#### Vercel CLI를 통한 환경 변수 설정

```bash
# Vercel CLI 설치 (전역)
npm i -g vercel@latest

# 프로젝트 연결
vercel link

# 환경 변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_KAKAO_MAP_API_KEY
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

#### Vercel 대시보드를 통한 설정

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. Settings → Environment Variables
4. 다음 변수들 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_KAKAO_MAP_API_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

### 3. Supabase 설정

#### Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속
2. 새 프로젝트 생성
3. Settings → API에서 키 복사

#### 데이터베이스 마이그레이션

```bash
# Supabase CLI 설치
npm install -g supabase

# 프로젝트 초기화
supabase init

# 마이그레이션 실행
supabase db push
```

### 4. 개발 서버 실행

#### 로컬 개발 서버

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

#### 빌드 테스트

```bash
# 프로덕션 빌드 테스트
npm run build

# 프로덕션 서버 실행
npm start
```

### 5. 문제 해결 체크리스트

#### ✅ 환경 변수 확인

- [ ] `.env.local` 파일 존재
- [ ] 모든 필수 환경 변수 설정
- [ ] 환경 변수 값이 올바름

#### ✅ Supabase 연결 확인

- [ ] Supabase 프로젝트 생성
- [ ] API 키 복사 완료
- [ ] 데이터베이스 마이그레이션 완료

#### ✅ Vercel 배포 확인

- [ ] Vercel 프로젝트 연결
- [ ] 환경 변수 설정 완료
- [ ] 배포 성공

### 6. 긴급 해결책 (개발용)

#### 임시 환경 변수 설정

```bash
# 터미널에서 직접 설정
export NEXT_PUBLIC_SUPABASE_URL="https://dfnqxobgwxmxywlpwvov.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your_key_here"
export NEXTAUTH_SECRET="your_secret_here"
export NEXTAUTH_URL="http://localhost:3000"

# 개발 서버 실행
npm run dev
```

#### package.json 스크립트 수정

```json
{
  "scripts": {
    "dev": "NEXT_PUBLIC_SUPABASE_URL=https://dfnqxobgwxmxywlpwvov.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key npm run dev:next",
    "dev:next": "next dev"
  }
}
```

### 7. 최종 확인

#### 환경 변수 로드 확인

```typescript
// src/lib/config.ts
export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  nextAuthUrl: process.env.NEXTAUTH_URL,
};

// 환경 변수 확인
console.log('Supabase URL:', config.supabaseUrl);
console.log('NextAuth URL:', config.nextAuthUrl);
```

이 가이드를 따라하면 환경 변수 문제가 근본적으로 해결됩니다.
