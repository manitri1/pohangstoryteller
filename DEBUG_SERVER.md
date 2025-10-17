# Next.js 서버 디버깅 가이드

## 🚨 현재 문제

- Next.js 개발 서버가 시작되지만 `.next` 폴더의 파일에 접근할 수 없는 오류 발생
- Windows 파일 시스템 권한 또는 경로 문제로 추정

## 🔧 해결 방법들

### 1. 관리자 권한으로 실행

```bash
# PowerShell을 관리자 권한으로 실행 후
cd "E:\work\Projects\Pohang StoryTeller\pohangstoryteller"
npm run dev
```

### 2. 다른 포트 사용

```bash
npm run dev -- --port 3001
# 또는
npm run dev -- --port 8080
```

### 3. 환경 변수 설정

```bash
# Windows에서 환경 변수 설정
set NODE_ENV=development
set NEXT_TELEMETRY_DISABLED=1
npm run dev
```

### 4. 캐시 완전 정리

```bash
# 모든 캐시 삭제
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
npm cache clean --force
npm install
```

### 5. Next.js 설정 최적화

```javascript
// next.config.js에서 Windows 최적화
module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'eval-source-map';
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    return config;
  },
  experimental: {
    optimizeCss: false,
};
```

## 🎯 권장 해결 순서

1. **관리자 권한으로 PowerShell 실행**
2. **프로젝트 디렉토리로 이동**
3. **캐시 완전 정리**
4. **개발 서버 시작**
5. **브라우저에서 `http://localhost:3000` 접속**

## 🔍 문제 지속 시 대안

### 대안 1: WSL 사용

```bash
# Windows Subsystem for Linux에서 실행
wsl
cd /mnt/e/work/Projects/Pohang\ StoryTeller/pohangstoryteller
npm run dev
```

### 대안 2: Docker 사용

```dockerfile
# Dockerfile 생성
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### 대안 3: Vercel 로컬 개발

```bash
# Vercel CLI로 로컬 개발
vercel dev
```

## 📋 체크리스트

- [ ] 관리자 권한으로 실행
- [ ] 포트 3000 사용 가능 확인
- [ ] .next 폴더 삭제 후 재시작
- [ ] npm 캐시 정리
- [ ] 환경 변수 설정 확인
- [ ] 브라우저에서 접속 테스트
