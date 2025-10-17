# Vercel 환경 변수 설정 가이드

## 현재 Vercel에 설정된 환경 변수

✅ `NEXTAUTH_URL` - Production, Preview, Development  
✅ `NEXTAUTH_SECRET` - Production, Preview, Development  
✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Production, Preview, Development  
✅ `NEXT_PUBLIC_SUPABASE_URL` - Production, Preview, Development

## 추가로 설정해야 할 환경 변수

### 1. Vercel 대시보드에서 설정

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. `pohangstoryteller` 프로젝트 선택
3. Settings → Environment Variables 이동
4. 다음 변수들을 추가:

### 2. 추가할 환경 변수들

#### Supabase 설정

```
SUPABASE_SERVICE_ROLE_KEY
값: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbnF4b2Jnd3hteHl3bHB3dm92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY3MDgwOSwiZXhwIjoyMDc1MjQ2ODA5fQ.OZN0ymnFKtwX7kL0BNUf3UTDM319esJHKtNZISmUH5c
환경: Production, Preview, Development
```

#### API 키 설정

```
NEXT_PUBLIC_KAKAO_MAP_API_KEY
값: 81bc629292619cb2ede368c8b02a7f25
환경: Production, Preview, Development
```

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
값: AIzaSyAcvVAi0JxHsT4b8LKFRrOgdHmvv_mF0io
환경: Production, Preview, Development
```

#### NEXTAUTH_URL 업데이트

```
NEXTAUTH_URL
값: https://your-app-name.vercel.app (실제 배포된 URL로 변경)
환경: Production, Preview, Development
```

### 3. Vercel CLI로 설정하는 방법

```bash
# 1. SUPABASE_SERVICE_ROLE_KEY 추가
vercel env add SUPABASE_SERVICE_ROLE_KEY
# 값 입력: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbnF4b2Jnd3hteHl3bHB3dm92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY3MDgwOSwiZXhwIjoyMDc1MjQ2ODA5fQ.OZN0ymnFKtwX7kL0BNUf3UTDM319esJHKtNZISmUH5c

# 2. 카카오맵 API 키 추가
vercel env add NEXT_PUBLIC_KAKAO_MAP_API_KEY
# 값 입력: 81bc629292619cb2ede368c8b02a7f25

# 3. 구글맵 API 키 추가
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# 값 입력: AIzaSyAcvVAi0JxHsT4b8LKFRrOgdHmvv_mF0io

# 4. NEXTAUTH_URL 업데이트 (배포 후 실제 URL로 변경)
vercel env rm NEXTAUTH_URL
vercel env add NEXTAUTH_URL
# 값 입력: https://your-app-name.vercel.app
```

### 4. 환경 변수 확인

```bash
# 현재 설정된 환경 변수 확인
vercel env ls

# 환경 변수 다운로드 (로컬 테스트용)
vercel env pull .env.local
```

### 5. 배포 후 확인사항

1. **환경 변수 로드 확인**: `/api/env-test` 엔드포인트로 확인
2. **Supabase 연결 확인**: 데이터베이스 연결 테스트
3. **인증 시스템 확인**: Next-Auth 로그인 테스트
4. **지도 API 확인**: 카카오맵/구글맵 로드 테스트

## 중요 사항

- 🔒 **보안**: Service Role Key는 절대 클라이언트에 노출되지 않도록 주의
- 🌍 **환경별 설정**: Production, Preview, Development 환경별로 적절한 값 설정
- 🔄 **배포 후 재시작**: 환경 변수 변경 후 자동 재배포 또는 수동 재시작 필요
