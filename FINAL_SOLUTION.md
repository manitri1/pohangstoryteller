# 🚨 Next.js 서버 오류 최종 해결책

## 현재 문제 상황

- Next.js 개발 서버가 시작되지만 `.next` 폴더의 파일에 접근할 수 없는 오류 발생
- Windows 파일 시스템 권한 또는 경로 문제로 추정
- `UNKNOWN: unknown error, open 'E:\work\Projects\Pohang StoryTeller\pohangstoryteller\.next\static\chunks\app\layout.js'`

## 🎯 최종 해결 방법

### 방법 1: 관리자 권한으로 실행 (가장 효과적)

```bash
# 1. PowerShell을 관리자 권한으로 실행
# 2. 프로젝트 디렉토리로 이동
cd "E:\work\Projects\Pohang StoryTeller\pohangstoryteller"

# 3. 캐시 완전 정리
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
npm cache clean --force

# 4. 개발 서버 시작
npm run dev
```

### 방법 2: 다른 포트 사용

```bash
npm run dev -- --port 3001
# 또는
npm run dev -- --port 8080
```

### 방법 3: 환경 변수 설정

```bash
# PowerShell에서 환경 변수 설정
$env:NODE_ENV="development"
$env:NEXT_TELEMETRY_DISABLED="1"
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

### 방법 4: WSL 사용 (Windows Subsystem for Linux)

```bash
# WSL에서 실행
wsl
cd /mnt/e/work/Projects/Pohang\ StoryTeller/pohangstoryteller
npm run dev
```

### 방법 5: Vercel 로컬 개발

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
3. **캐시 완전 정리**
4. **환경 변수 설정**
5. **개발 서버 시작**
6. **브라우저에서 `http://localhost:3000` 접속**

## 📋 체크리스트

- [ ] 관리자 권한으로 PowerShell 실행
- [ ] 프로젝트 디렉토리 확인
- [ ] .next 폴더 삭제
- [ ] npm 캐시 정리
- [ ] 환경 변수 설정
- [ ] 개발 서버 시작
- [ ] 브라우저 접속 테스트
- [ ] 4컷 레이아웃 템플릿 테스트

## 🚀 성공 후 확인사항

1. **환경 변수 테스트**: `http://localhost:3000/api/env-test`
2. **4컷 레이아웃 템플릿**: 기념품 제작 페이지에서 테스트
3. **Supabase 연결**: 데이터베이스 연결 확인
4. **인증 시스템**: 로그인/회원가입 테스트
