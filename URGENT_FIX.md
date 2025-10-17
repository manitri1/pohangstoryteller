# 🚨 긴급 해결책 - Next.js 서버 오류

## 현재 상황

- `GET http://localhost:3000/env/env-test 500 (Internal Server Error)` 오류 발생
- Next.js 개발 서버가 시작되지 않거나 불안정한 상태
- Windows 파일 시스템 권한 문제로 추정

## 🎯 즉시 해결 방법

### 1. 관리자 권한으로 PowerShell 실행

```bash
# 1. PowerShell을 관리자 권한으로 실행
# 2. 프로젝트 디렉토리로 이동
cd "E:\work\Projects\Pohang StoryTeller\pohangstoryteller"

# 3. 모든 Node.js 프로세스 종료
taskkill /f /im node.exe

# 4. 캐시 완전 정리
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
npm cache clean --force

# 5. 환경 변수 설정
$env:NODE_ENV="development"
$env:NEXT_TELEMETRY_DISABLED="1"
$env:NODE_OPTIONS="--max-old-space-size=4096"

# 6. 개발 서버 시작
npm run dev
```

### 2. 다른 포트 사용

```bash
npm run dev -- --port 3001
# 또는
npm run dev -- --port 8080
```

### 3. Vercel 로컬 개발 사용

```bash
# Vercel CLI로 로컬 개발
vercel dev
```

## 🔧 추가 해결책

### 1. 프로젝트 경로 변경

```bash
# 더 짧은 경로로 프로젝트 이동
# C:\dev\pohangstoryteller
```

### 2. Node.js 버전 확인

```bash
node --version
npm --version
# Node.js 18.x 이상 권장
```

### 3. 권한 설정

```bash
# 프로젝트 폴더에 대한 전체 권한 부여
icacls "E:\work\Projects\Pohang StoryTeller\pohangstoryteller" /grant Everyone:F /T
```

## 🎯 권장 실행 순서

1. **관리자 권한으로 PowerShell 실행**
2. **프로젝트 디렉토리로 이동**
3. **모든 Node.js 프로세스 종료**
4. **캐시 완전 정리**
5. **환경 변수 설정**
6. **개발 서버 시작**
7. **브라우저에서 `http://localhost:3000` 접속**

## 📋 체크리스트

- [ ] 관리자 권한으로 PowerShell 실행
- [ ] 프로젝트 디렉토리 확인
- [ ] 모든 Node.js 프로세스 종료
- [ ] .next 폴더 삭제
- [ ] npm 캐시 정리
- [ ] 환경 변수 설정
- [ ] 개발 서버 시작
- [ ] 브라우저 접속 테스트

## 🚀 성공 후 확인사항

1. **환경 변수 테스트**: `http://localhost:3000/api/env-test`
2. **4컷 레이아웃 템플릿**: 기념품 제작 페이지에서 테스트
3. **Supabase 연결**: 데이터베이스 연결 확인
4. **인증 시스템**: 로그인/회원가입 테스트

