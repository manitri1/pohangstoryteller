# 누락된 Vercel 환경 변수 추가 가이드

## 🚨 긴급 수정 필요사항

### 1. NEXTAUTH_URL 수정 (중요!)

현재: `http://pohangstoryteller.vercel.app`  
수정: `https://pohangstoryteller.vercel.app`

```bash
vercel env rm NEXTAUTH_URL
vercel env add NEXTAUTH_URL
# 값: https://pohangstoryteller.vercel.app
```

### 2. 누락된 환경 변수 추가

#### SUPABASE_SERVICE_ROLE_KEY (필수)

```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY
# 값: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbnF4b2Jnd3hteHl3bHB3dm92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY3MDgwOSwiZXhwIjoyMDc1MjQ2ODA5fQ.OZN0ymnFKtwX7kL0BNUf3UTDM319esJHKtNZISmUH5c
```

#### NEXT_PUBLIC_KAKAO_MAP_API_KEY

```bash
vercel env add NEXT_PUBLIC_KAKAO_MAP_API_KEY
# 값: 81bc629292619cb2ede368c8b02a7f25
```

#### NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

```bash
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# 값: AIzaSyAcvVAi0JxHsT4b8LKFRrOgdHmvv_mF0io
```

## 📋 단계별 실행 가이드

### Step 1: NEXTAUTH_URL 수정

```bash
# 1. 기존 NEXTAUTH_URL 제거
vercel env rm NEXTAUTH_URL

# 2. HTTPS URL로 다시 추가
vercel env add NEXTAUTH_URL
# 입력값: https://pohangstoryteller.vercel.app
# 환경: Production, Preview, Development 모두 선택
```

### Step 2: SUPABASE_SERVICE_ROLE_KEY 추가

```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY
# 입력값: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbnF4b2Jnd3hteHl3bHB3dm92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY3MDgwOSwiZXhwIjoyMDc1MjQ2ODA5fQ.OZN0ymnFKtwX7kL0BNUf3UTDM319esJHKtNZISmUH5c
# 환경: Production, Preview, Development 모두 선택
```

### Step 3: API 키들 추가

```bash
# 카카오맵 API 키
vercel env add NEXT_PUBLIC_KAKAO_MAP_API_KEY
# 입력값: 81bc629292619cb2ede368c8b02a7f25

# 구글맵 API 키
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# 입력값: AIzaSyAcvVAi0JxHsT4b8LKFRrOgdHmvv_mF0io
```

### Step 4: 설정 확인

```bash
# 환경 변수 목록 확인
vercel env ls

# 최신 환경 변수 다운로드
vercel env pull .env.vercel
```

## 🔍 배포 후 확인사항

1. **환경 변수 로드 테스트**: `https://pohangstoryteller.vercel.app/api/env-test`
2. **Supabase 연결 테스트**: 데이터베이스 쿼리 테스트
3. **인증 시스템 테스트**: 로그인/회원가입 테스트
4. **지도 API 테스트**: 카카오맵/구글맵 로드 테스트

## ⚠️ 주의사항

- 모든 환경 변수는 **Production, Preview, Development** 환경에 모두 설정
- **SUPABASE_SERVICE_ROLE_KEY**는 서버사이드에서만 사용
- **NEXTAUTH_URL**은 반드시 HTTPS로 설정
- 환경 변수 변경 후 자동 재배포 또는 수동 재시작 필요
