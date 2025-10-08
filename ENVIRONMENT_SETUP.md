# 🔧 환경 변수 설정 가이드

## 📋 문제 상황

```
API 오류: TypeError: Cannot read properties of undefined (reading 'getUser')
```

이 오류는 Supabase 환경 변수가 설정되지 않아서 발생합니다.

## 🛠️ 해결 방법

### 1. 환경 변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Kakao Map API
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key

# Next-Auth 설정
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# 개발 환경 설정
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
```

### 2. Supabase 프로젝트 설정

1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. Settings > API에서 다음 값들을 복사:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Kakao Map API 키 설정

1. [Kakao Developers](https://developers.kakao.com/)에 로그인
2. 애플리케이션 생성
3. 플랫폼 설정에서 Web 플랫폼 추가
4. JavaScript 키를 `NEXT_PUBLIC_KAKAO_MAP_API_KEY`에 설정

### 4. Next-Auth Secret 생성

```bash
# 터미널에서 실행
openssl rand -base64 32
```

생성된 값을 `NEXTAUTH_SECRET`에 설정

## ✅ 확인 방법

환경 변수 설정 후 개발 서버를 재시작하세요:

```bash
npm run dev
```

## 🚨 주의사항

- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- 실제 프로덕션 환경에서는 Vercel, Netlify 등의 환경 변수 설정을 사용하세요
- API 키는 절대 공개하지 마세요

## 📞 추가 도움

환경 변수 설정에 문제가 있으면 다음을 확인하세요:

1. 파일명이 정확한지 (`.env.local`)
2. 프로젝트 루트에 위치하는지
3. 서버 재시작 후에도 오류가 발생하는지
